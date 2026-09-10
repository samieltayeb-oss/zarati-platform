/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createAdminClient } from '@/lib/supabase/server';
import { normalizeObservation } from '@/lib/normalization/engine';
import { getFXRate } from '@/lib/normalization/fx';
import { getUnitConversionRule } from '@/lib/normalization/units';
import { v4 as uuidv4 } from 'uuid';

describe('R4-C Normalization Engine', () => {
  const supabase = createAdminClient();
  let sourceId: string;
  let commodityId: string;
  
  beforeAll(async () => {
    // 1. Create canonical source
    sourceId = uuidv4();
    await supabase.from('canonical_fx_sources').insert({
      id: sourceId,
      code: 'TEST_SRC_' + sourceId,
      name: 'Test FX',
      automation_mode: 'manual_batch'
    });

    // 2. Setup commodities for tests
    const { data: crops } = await supabase.from('crops').select('id').limit(1);
    const cropId = crops?.[0]?.id;
    commodityId = uuidv4();
    await supabase.from('canonical_commodities').insert({
      id: commodityId,
      code: 'TEST_COMM_' + commodityId,
      crop_id: cropId,
      grade_en: 'Test',
      grade_ar: 'Test'
    });

    // 3. Create Unit rules
    await supabase.from('unit_conversion_rules').insert([
      {
        source_unit_alias: 'ardeb',
        commodity_id: commodityId,
        valid_from_date: '2020-01-01',
        conversion_factor_kg: 190,
        confidence_status: 'VERIFIED'
      },
      {
        source_unit_alias: 'qintar',
        commodity_id: commodityId,
        valid_from_date: '2020-01-01',
        conversion_factor_kg: 45,
        confidence_status: 'VERIFIED'
      },
      {
        source_unit_alias: '90 kg sack',
        valid_from_date: '2020-01-01',
        conversion_factor_kg: 90,
        confidence_status: 'VERIFIED' // generic
      },
      {
        source_unit_alias: 'sack',
        valid_from_date: '2020-01-01',
        conversion_factor_kg: 90,
        confidence_status: 'BLOCKED' // ambiguous
      }
    ]);
  });

  describe('FX Engine', () => {
    it('exact-day rate -> PASS', async () => {
      await supabase.from('fx_rate_observations').insert({
        source_id: sourceId,
        rate_class: 'PARALLEL_MARKET', verification_status: 'VERIFIED',
        base_currency: 'USD',
        quote_currency: 'SDG',
        rate: 2000,
        observed_date: '2024-01-10'
      });
      const fx = await getFXRate('USD', 'SDG', '2024-01-10', 'PARALLEL_MARKET');
      expect(fx).not.toBeNull();
      expect(fx?.rate).toBe(2000);
    });

    it('previous-day verified within 7 days -> PASS', async () => {
      await supabase.from('fx_rate_observations').insert({
        source_id: sourceId,
        rate_class: 'PARALLEL_MARKET', verification_status: 'VERIFIED',
        base_currency: 'USD',
        quote_currency: 'SDG',
        rate: 2100,
        observed_date: '2024-01-05' // 5 days before 01-10
      });
      const fx = await getFXRate('USD', 'SDG', '2024-01-09', 'PARALLEL_MARKET');
      expect(fx).not.toBeNull();
      expect(fx?.rate).toBe(2100);
    });

    it('8-day gap -> NULL', async () => {
      await supabase.from('fx_rate_observations').insert({
        source_id: sourceId,
        rate_class: 'PARALLEL_MARKET', verification_status: 'VERIFIED',
        base_currency: 'USD',
        quote_currency: 'SDG',
        rate: 2200,
        observed_date: '2024-02-01'
      });
      const fx = await getFXRate('USD', 'SDG', '2024-02-10', 'PARALLEL_MARKET');
      expect(fx).toBeNull();
    });

    it('future rate only -> NULL', async () => {
      await supabase.from('fx_rate_observations').insert({
        source_id: sourceId,
        rate_class: 'PARALLEL_MARKET', verification_status: 'VERIFIED',
        base_currency: 'USD',
        quote_currency: 'SDG',
        rate: 2300,
        observed_date: '2024-03-15'
      });
      const fx = await getFXRate('USD', 'SDG', '2024-03-10', 'PARALLEL_MARKET');
      expect(fx).toBeNull();
    });

    it('rate-class crossover -> DENIED', async () => {
      await supabase.from('fx_rate_observations').insert({
        source_id: sourceId,
        rate_class: 'OFFICIAL',
        base_currency: 'USD',
        quote_currency: 'SDG',
        rate: 600,
        observed_date: '2024-04-10'
      });
      const fx = await getFXRate('USD', 'SDG', '2024-04-10', 'PARALLEL_MARKET');
      expect(fx).toBeNull();
    });
  });

  describe('Unit Engine', () => {
    it('sorghum Ardeb -> 190kg', async () => {
      const u = await getUnitConversionRule('ardeb', commodityId, '2024-01-01');
      expect(u?.conversion_factor_kg).toBe(190);
    });

    it('sesame Qintar -> 45kg', async () => {
      const u = await getUnitConversionRule('qintar', commodityId, '2024-01-01');
      expect(u?.conversion_factor_kg).toBe(45);
    });

    it('explicit 90 kg sack -> 90kg', async () => {
      const u = await getUnitConversionRule('90 kg sack', commodityId, '2024-01-01');
      expect(u?.conversion_factor_kg).toBe(90);
    });

    it('ambiguous Sack -> NULL', async () => {
      const u = await getUnitConversionRule('sack', commodityId, '2024-01-01');
      expect(u).toBeNull();
    });
  });

  describe('Normalization Engine', () => {
    it('SDG/kg and USD/kg calculated deterministically', async () => {
      // Need an observation
      const obsId = uuidv4();
      const datasetId = uuidv4();
      const sourceObjId = uuidv4();
      const marketId = uuidv4();
      
      await supabase.from('canonical_datasets').insert({ id: datasetId, source_id: sourceObjId, name: 'T' });
      await supabase.from('markets').insert({ id: marketId, name_en: 'T', name_ar: 'T' });

      await supabase.from('market_price_observations').insert({
        id: obsId,
        dataset_id: datasetId,
        commodity_id: commodityId,
        market_id: marketId,
        raw_price_text: '380000', // 380,000 for 1 Ardeb
        raw_currency_text: 'SDG',
        raw_unit_text: 'ardeb',
        parsed_price_numeric: 380000,
        observed_at: '2024-05-10',
        publication_status: 'PUBLISHED'
      } as any);

      // Insert matching FX for 2024-05-10
      await supabase.from('fx_rate_observations').insert({
        source_id: sourceId,
        rate_class: 'PARALLEL_MARKET', verification_status: 'VERIFIED',
        base_currency: 'USD',
        quote_currency: 'SDG',
        rate: 2000,
        observed_date: '2024-05-10'
      });

      const res = await normalizeObservation(obsId, 'PARALLEL_MARKET');
      expect(res.success).toBe(true);
      expect(res.normalized_sdg_per_kg).toBe(2000); // 380k / 190
      expect(res.normalized_sdg_per_mt).toBe(2000000);
      expect(res.normalized_usd_per_kg).toBe(1); // 2000 SDG / 2000 FX
      expect(res.normalized_usd_per_mt).toBe(1000);
      expect(res.fx_fallback_days).toBe(0);
    });

    it('missing FX returns USD=NULL', async () => {
      const obsId = uuidv4();
      const datasetId = (await supabase.from('canonical_datasets').select('id').limit(1)).data![0].id;
      const marketId = (await supabase.from('markets').select('id').limit(1)).data![0].id;

      await supabase.from('market_price_observations').insert({
        id: obsId,
        dataset_id: datasetId,
        commodity_id: commodityId,
        market_id: marketId,
        raw_price_text: '380000',
        raw_currency_text: 'SDG',
        raw_unit_text: 'ardeb',
        parsed_price_numeric: 380000,
        observed_at: '2022-01-01', // no FX for this date
        publication_status: 'PUBLISHED'
      } as any);

      const res = await normalizeObservation(obsId, 'PARALLEL_MARKET');
      expect(res.success).toBe(true); // sdg success
      expect(res.normalized_sdg_per_kg).toBe(2000);
      expect(res.normalized_usd_per_kg).toBeNull();
      expect(res.normalized_usd_per_mt).toBeNull();
    });

    it('missing unit returns NULL', async () => {
      const obsId = uuidv4();
      const datasetId = (await supabase.from('canonical_datasets').select('id').limit(1)).data![0].id;
      const marketId = (await supabase.from('markets').select('id').limit(1)).data![0].id;

      await supabase.from('market_price_observations').insert({
        id: obsId,
        dataset_id: datasetId,
        commodity_id: commodityId,
        market_id: marketId,
        raw_price_text: '380000',
        raw_currency_text: 'SDG',
        raw_unit_text: 'sack', // blocked
        parsed_price_numeric: 380000,
        observed_at: '2024-05-10',
        publication_status: 'PUBLISHED'
      } as any);

      const res = await normalizeObservation(obsId, 'PARALLEL_MARKET');
      expect(res.success).toBe(false);
      expect(res.normalized_sdg_per_kg).toBeNull();
      expect(res.normalized_usd_per_kg).toBeNull();
    });
  });
});

