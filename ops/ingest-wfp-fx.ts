/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdminClient } from '@/lib/supabase/server';
import { parse } from 'csv-parse/sync';
import fs from 'fs';

export interface IngestionOptions {
  dryRun?: boolean;
  csvPath: string;
  sourceId: string;
}

export interface IngestionSummary {
  processed: number;
  inserted: number;
  duplicates: number;
  conflicts: number;
  errors: number;
  errorLog: any[];
}

export async function ingestWfpFxBatch(options: IngestionOptions): Promise<IngestionSummary> {
  const supabase = createAdminClient();
  const summary: IngestionSummary = { processed: 0, inserted: 0, duplicates: 0, conflicts: 0, errors: 0, errorLog: [] };
  
  if (!fs.existsSync(options.csvPath)) {
    throw new Error('CSV not found');
  }

  const { data: source } = await supabase.from('canonical_fx_sources').select('*').eq('id', options.sourceId).single();
  if (!source) throw new Error('Invalid sourceId');
  if (source.automation_mode !== 'manual_batch') {
    throw new Error('Source must be manual_batch');
  }

  const content = fs.readFileSync(options.csvPath, 'utf8');
  const records = parse(content, { columns: true, skip_empty_lines: true });

  for (const rawRow of records) {
    const row = rawRow as any;
    summary.processed++;
    try {
      const baseCurrency = row.base_currency;
      const quoteCurrency = row.quote_currency;
      const rateClass = row.rate_class;
      const rawRate = parseFloat(row.rate);
      const obsDate = row.observed_date;
      const provenance = row.provenance;

      if (!baseCurrency || !quoteCurrency || !rateClass || isNaN(rawRate) || !obsDate || !provenance) {
        throw new Error('Missing required fields');
      }
      
      if (rawRate <= 0) {
        throw new Error('Rate must be positive');
      }

      // 11. Rate Class Spoofing DENIED
      if (rateClass !== 'PARALLEL_MARKET') {
        throw new Error('WFP batch ingestion only supports PARALLEL_MARKET');
      }

      const matchDate = obsDate.match(/^\d{4}-\d{2}-\d{2}$/);
      if (!matchDate) throw new Error('Invalid observation_date format YYYY-MM-DD');

      // Check for duplicate or conflict
      const { data: existing } = await supabase.from('fx_rate_observations')
        .select('*')
        .eq('source_id', options.sourceId)
        .eq('base_currency', baseCurrency)
        .eq('quote_currency', quoteCurrency)
        .eq('rate_class', 'PARALLEL_MARKET')
        .eq('observed_date', obsDate);

      if (existing && existing.length > 0) {
        const exactMatch = existing.find((e: any) => parseFloat(e.rate) === rawRate);
        if (exactMatch) {
          summary.duplicates++;
          continue; // Idempotent
        } else {
          // Conflict: Same source, same date, different rate!
          summary.conflicts++;
          summary.errorLog.push({ row, error: 'CONFLICT_EXISTING_RATE_DIFFERS' });
          continue;
        }
      }

      if (!options.dryRun) {
        const { error: insErr } = await supabase.from('fx_rate_observations').insert({
          source_id: options.sourceId,
          rate_class: 'PARALLEL_MARKET',
          base_currency: baseCurrency,
          quote_currency: quoteCurrency,
          rate: rawRate,
          observed_date: obsDate,
          source_reference: provenance,
          verification_status: 'PROVISIONAL' // SAFER DEFAULT
        } as any);

        if (insErr) throw insErr;
      }
      summary.inserted++;
      
    } catch (err: any) {
      summary.errors++;
      summary.errorLog.push({ row, error: err.message });
    }
  }

  return summary;
}

