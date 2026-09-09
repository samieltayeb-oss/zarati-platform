import { ExternalFeedAdapter, FeedExecutionResult } from '../ExternalFeedAdapter';
import { createAdminClient } from '@/lib/supabase/server';
import crypto from 'crypto';

interface WFPRecord {
  date: string;
  market: string;
  market_id: string;
  commodity: string;
  commodity_id: string;
  unit: string;
  pricetype: string;
  price: number;
  currency: string;
  rawRow: string;
  cropCode: string;
  dbMarket: string;
}

const commodityMap: Record<string, string> = {
  'Sorghum (white)': 'sorghum',
  'Sorghum': 'sorghum',
  'Sorghum (food aid)': 'sorghum',
  'Millet': 'millet',
  'Wheat': 'wheat',
  'Sesame': 'sesame',
  'Groundnuts (shelled)': 'groundnuts'
};

const marketMap: Record<string, string> = {
  'Damazin': 'Ad-Damazin Crops Market',
  'El Gedarif': 'Gedaref Crops Market',
  'Khartoum': 'Khartoum Central Market',
  'El Obeid': 'El Obeid Crops Exchange',
  'Nyala': 'Nyala Crops Market',
  'Sennar': 'Sennar Agricultural Market',
  'Kassala': 'Kassala Central Market',
  'Wad Madani': 'Wad Madani Wholesale Market',
  'Kosti': 'Kosti Crops Market',
  'Port Sudan': 'Port Sudan Terminal Market'
};

export class WFPAdapter extends ExternalFeedAdapter<WFPRecord> {
  
  protected async fetch(): Promise<unknown> {
    const url = 'https://data.humdata.org/dataset/cb496eb6-bd27-4623-ac4e-0a5dc47c7c1a/resource/11a511c9-6cbf-4ba8-af82-5ceb7e641ca0/download/wfp_food_prices_sdn.csv';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch WFP data: ${response.statusText}`);
    }
    return await response.text();
  }

  protected deriveSourceVersion(rawData: any): string {
    return crypto.createHash('sha256').update(rawData as string).digest('hex');
  }

  private parseCSVRow(row: string) {
    const result = [];
    let inQuotes = false;
    let currentVal = "";
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(currentVal);
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
    result.push(currentVal);
    return result;
  }

  protected async parse(rawData: any): Promise<WFPRecord[]> {
    const lines = rawData.split('\n');
    const records: WFPRecord[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = this.parseCSVRow(line);
      const date = parts[0];
      const market = parts[3];
      const market_id = parts[4];
      const commodity = parts[8];
      const commodity_id = parts[9];
      const unit = parts[10];
      const pricetype = parts[12];
      const currency = parts[13];
      const price = parseFloat(parts[14]);

      if (!price || isNaN(price)) continue;
      
      const cropCode = commodityMap[commodity];
      const dbMarket = marketMap[market];
      
      if (!cropCode || !dbMarket) continue;

      records.push({
        date, market, market_id, commodity, commodity_id, unit, pricetype, price, currency, rawRow: line, cropCode, dbMarket
      });
    }
    return records;
  }

  protected async validate(record: WFPRecord): Promise<boolean> {
    return !!(record.date && record.market_id && record.commodity_id && record.pricetype && record.unit && record.price);
  }

  protected deriveSourceIdentity(record: WFPRecord): string {
    return `WFP_SDN_V2_${record.date}_${record.market_id}_${record.commodity_id}_${record.pricetype}_${record.unit}`;
  }

  protected async stage(record: WFPRecord, identity: string): Promise<{ isDuplicate: boolean; isQuarantined: boolean }> {
    const supabase = createAdminClient();

    // Reconcile snapshot, source, dataset, market, commodity IDs
    const { data: source } = await supabase.from('canonical_sources').select('id').eq('code', 'SRC_WFP_VAM').single();
    const { data: dataset } = await supabase.from('canonical_datasets').select('id').eq('dataset_identifier', 'DS_WFP_SUDAN_FOOD_PRICES').single();
    const { data: marketData } = await supabase.from('markets').select('id').eq('name_en', record.dbMarket).single();
    const { data: cropData } = await supabase.from('crops').select('id, code').eq('code', record.cropCode).single();
    
    if (!source || !dataset || !marketData || !cropData) {
      return { isDuplicate: false, isQuarantined: true };
    }

    const { data: ccData } = await supabase.from('canonical_commodities')
        .select('id')
        .eq('crop_id', cropData.id)
        .eq('code', `${record.cropCode}_standard`).single();
        
    if (!ccData) {
        return { isDuplicate: false, isQuarantined: true };
    }

    // Since we need snapshot id (assume we just take latest for this dataset)
    const { data: snapshot } = await supabase.from('raw_ingestion_snapshots')
        .select('id')
        .eq('dataset_id', dataset.id)
        .order('ingested_at', { ascending: false })
        .limit(1)
        .single();
        
    const snapshotId = snapshot ? snapshot.id : null;

    const observationDate = new Date(record.date);
    const staleDate = new Date(observationDate);
    staleDate.setDate(staleDate.getDate() + 30); // Stale after 30 days

    // check if exists
    const { data: existing } = await supabase.from('market_price_observations')
        .select('id, parsed_price_numeric')
        .eq('source_id', source.id)
        .eq('source_record_key', identity)
        .single();

    if (existing) {
        // if existing has different price, we quarantine/flag
        if (Number(existing.parsed_price_numeric) !== record.price) {
            return { isDuplicate: false, isQuarantined: true };
        }
        return { isDuplicate: true, isQuarantined: false };
    }

    const { error } = await supabase.from('market_price_observations').insert({
        raw_snapshot_id: snapshotId,
        source_id: source.id,
        dataset_id: dataset.id,
        commodity_id: ccData.id,
        market_id: marketData.id,
        source_provenance: 'market_reported',
        source_record_key: identity,
        raw_price_text: record.price.toString(),
        parsed_price_numeric: record.price,
        raw_currency_text: record.currency,
        canonical_currency_code: 'SDG',
        raw_unit_text: record.unit,
        price_type: record.pricetype.toLowerCase() as any,
        observed_at: record.date,
        temporal_precision: 'CALENDAR_DAY',
        verification_state: 'unassessed',
        publication_status: 'INGESTED',
        stale_after_at: staleDate.toISOString(),
        source_record_raw: { row: record.rawRow } as any,
        ingestion_method: 'batch_import',
        temporal_class: 'historical_archive',
        derivation_class: 'reported_survey'
    });

    if (error) {
        console.error('WFP stage error:', error);
        return { isDuplicate: false, isQuarantined: true };
    }

    return { isDuplicate: false, isQuarantined: false };
  }
}
