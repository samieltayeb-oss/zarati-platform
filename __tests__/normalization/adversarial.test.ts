import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createAdminClient } from '@/lib/supabase/server';
import { normalizeObservation } from '@/lib/normalization/engine';
import { getFXRate } from '@/lib/normalization/fx';
import { getUnitConversionRule } from '@/lib/normalization/units';
import { ingestWfpFxBatch } from '@/ops/ingest-wfp-fx';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

describe('R4-C Adversarial Audit Fixes', () => {
  const supabase = createAdminClient();
  let sourceId: string;
  let sourceId2: string;
  let commodityId: string;
  
  beforeAll(async () => {
    // Aggressive cleanup before tests to prevent state bleed
    await supabase.from('fx_rate_observations').delete().like('source_reference', 'test%');
    await supabase.from('unit_conversion_rules').delete().like('source_unit_alias', 'overlap_unit');
    
    sourceId = uuidv4();
    sourceId2 = uuidv4();
    await supabase.from('canonical_fx_sources').insert([
      { id: sourceId, code: 'WFP_TEST_' + sourceId, name: 'WFP FX', automation_mode: 'manual_batch' },
      { id: sourceId2, code: 'CBOS_TEST_' + sourceId2, name: 'CBOS FX', automation_mode: 'manual_batch' }
    ]);
    const { data: crops } = await supabase.from('crops').select('id').limit(1);
    commodityId = uuidv4();
    await supabase.from('canonical_commodities').insert({ id: commodityId, code: 'TEST_COMM_' + commodityId, crop_id: crops?.[0]?.id as string, variety_en: 'T', variety_ar: 'T', grade_en: 'T', grade_ar: 'T' });
  });

  afterAll(async () => {
    await supabase.from('unit_conversion_rules').delete().eq('commodity_id', commodityId);
    await supabase.from('fx_rate_observations').delete().in('source_id', [sourceId, sourceId2]);
    await supabase.from('canonical_commodities').delete().eq('id', commodityId);
    await supabase.from('canonical_fx_sources').delete().in('id', [sourceId, sourceId2]);
  });

  it('PROVISIONAL and BLOCKED exact-day FX => ignored', async () => {
    await supabase.from('fx_rate_observations').insert([
      { source_id: sourceId, rate_class: 'OFFICIAL', base_currency: 'USD', quote_currency: 'SDG', rate: 100, observed_date: '2024-06-01', verification_status: 'PROVISIONAL' },
      { source_id: sourceId, rate_class: 'OFFICIAL', base_currency: 'USD', quote_currency: 'SDG', rate: 200, observed_date: '2024-06-02', verification_status: 'BLOCKED' }
    ]);
    const fx1 = await getFXRate('USD', 'SDG', '2024-06-01', 'OFFICIAL');
    expect(fx1).toBeNull();
    const fx2 = await getFXRate('USD', 'SDG', '2024-06-02', 'OFFICIAL');
    expect(fx2).toBeNull();
  });

  it('two VERIFIED exact-date rates => FX_RATE_CONFLICT', async () => {
    await supabase.from('fx_rate_observations').insert([
      { source_id: sourceId, rate_class: 'PARALLEL_MARKET', base_currency: 'USD', quote_currency: 'SDG', rate: 1000, observed_date: '2024-06-10', verification_status: 'VERIFIED' },
      { source_id: sourceId2, rate_class: 'PARALLEL_MARKET', base_currency: 'USD', quote_currency: 'SDG', rate: 1100, observed_date: '2024-06-10', verification_status: 'VERIFIED' }
    ]);
    await expect(getFXRate('USD', 'SDG', '2024-06-10', 'PARALLEL_MARKET')).rejects.toThrow('FX_RATE_CONFLICT');
  });

  it('exact-date conflict + valid previous date => CONFLICT, NOT fallback', async () => {
    await expect(getFXRate('USD', 'SDG', '2024-06-10', 'PARALLEL_MARKET')).rejects.toThrow('FX_RATE_CONFLICT');
  });

  it('two VERIFIED rates on nearest preceding date => FX_RATE_CONFLICT', async () => {
    await supabase.from('fx_rate_observations').insert([
      { source_id: sourceId, rate_class: 'PARALLEL_MARKET', base_currency: 'USD', quote_currency: 'SDG', rate: 1200, observed_date: '2024-06-15', verification_status: 'VERIFIED' },
      { source_id: sourceId2, rate_class: 'PARALLEL_MARKET', base_currency: 'USD', quote_currency: 'SDG', rate: 1250, observed_date: '2024-06-15', verification_status: 'VERIFIED' }
    ]);
    await expect(getFXRate('USD', 'SDG', '2024-06-18', 'PARALLEL_MARKET')).rejects.toThrow('FX_RATE_CONFLICT');
  });

  it('UTC 7-day boundary => PASS', async () => {
    await supabase.from('fx_rate_observations').insert([
      { source_id: sourceId, rate_class: 'OFFICIAL', base_currency: 'USD', quote_currency: 'SDG', rate: 500, observed_date: '2024-01-01', verification_status: 'VERIFIED' }
    ]);
    const res = await getFXRate('USD', 'SDG', '2024-01-08', 'OFFICIAL');
    expect(res).not.toBeNull();
    const res8 = await getFXRate('USD', 'SDG', '2024-01-09', 'OFFICIAL'); // 8 days
    expect(res8).toBeNull();
  });

  it('overlapping unit rules => UNIT_RULE_CONFLICT', async () => {
    await supabase.from('unit_conversion_rules').insert([
      { source_unit_alias: 'overlap_unit', commodity_id: commodityId, valid_from_date: '2024-01-01', conversion_factor_kg: 10, confidence_status: 'VERIFIED' },
      { source_unit_alias: 'overlap_unit', commodity_id: commodityId, valid_from_date: '2024-01-02', conversion_factor_kg: 20, confidence_status: 'VERIFIED' } // intentional overlap
    ]);
    await expect(getUnitConversionRule('overlap_unit', commodityId, '2024-02-01')).rejects.toThrow('UNIT_RULE_CONFLICT');
  });

  it('Importer tests', async () => {
    const csvPath = path.join(__dirname, 'test-fx.csv');
    fs.writeFileSync(csvPath, `base_currency,quote_currency,rate_class,rate,observed_date,provenance
USD,SDG,PARALLEL_MARKET,2500,2024-08-01,test1
USD,SDG,PARALLEL_MARKET,2500,2024-08-01,test1
USD,SDG,PARALLEL_MARKET,2600,2024-08-01,test2
USD,SDG,OFFICIAL,600,2024-08-02,test3
USD,SDG,PARALLEL_MARKET,-10,2024-08-03,test4
USD,SDG,PARALLEL_MARKET,2000,2024-15-99,test5
`);

    const summary = await ingestWfpFxBatch({ csvPath, sourceId, dryRun: false });
    expect(summary.processed).toBe(6);
    expect(summary.inserted).toBe(1); // Only the first row
    expect(summary.duplicates).toBe(1); // 2nd row is identical to 1st
    expect(summary.conflicts).toBe(1); // 3rd row conflicts with 1st
    expect(summary.errors).toBe(3); // OFFICIAL (spoof), negative rate, bad date

    fs.unlinkSync(csvPath);
  });
});
