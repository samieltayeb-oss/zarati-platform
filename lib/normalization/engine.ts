/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFXRate, RateClass } from './fx';
import { getUnitConversionRule } from './units';
import { createAdminClient } from '@/lib/supabase/server';
import Decimal from 'decimal.js';

export const NORMALIZATION_ALGORITHM_VERSION = 'v1.0.0';

export interface NormalizationResult {
  normalized_usd_per_kg: number | null;
  normalized_usd_per_mt: number | null;
  normalized_sdg_per_kg: number | null;
  normalized_sdg_per_mt: number | null;
  fx_rate_id: string | null;
  unit_rule_id: string | null;
  fx_fallback_days: number | null;
  success: boolean;
}

export async function normalizeObservation(
  observationId: string,
  rateClass: RateClass = 'PARALLEL_MARKET'
): Promise<NormalizationResult> {
  const supabase = createAdminClient();
  
  const { data: raw } = await supabase
    .from('market_price_observations')
    .select('id, commodity_id, raw_unit_text, raw_currency_text, parsed_price_numeric, observed_at')
    .eq('id', observationId)
    .single();
    
  if (!raw) throw new Error('Observation not found');

  let unitRule = null;
  try {
    unitRule = await getUnitConversionRule(raw.raw_unit_text, raw.commodity_id, raw.observed_at);
  } catch (err: any) {
    if (err.message !== 'UNIT_RULE_CONFLICT') throw err;
    // On conflict, quarantine/reject
  }
  
  let unitRuleId = null;
  let sdgPerKg = null;
  let sdgPerMt = null;

  // Assuming raw_currency_text is 'SDG'. Future-proofing would check raw.canonical_currency_code.
  if (unitRule) {
    unitRuleId = unitRule.id;
    // raw_price is price per raw_unit.
    // So SDG per kg = raw_price / conversion_factor_kg
    const price = new Decimal(raw.parsed_price_numeric as number);
    const factor = new Decimal(unitRule.conversion_factor_kg);
    
    const perKg = price.div(factor);
    sdgPerKg = perKg.toNumber();
    sdgPerMt = perKg.mul(1000).toNumber();
  }

  let fxRateId = null;
  let usdPerKg = null;
  let usdPerMt = null;
  let fallbackDays = null;

  if (sdgPerKg !== null) {
    // Need SDG to USD conversion
    let fx = null;
    try {
      fx = await getFXRate('USD', 'SDG', raw.observed_at, rateClass);
    } catch (err: any) {
      if (err.message !== 'FX_RATE_CONFLICT') throw err;
      // On conflict, quarantine/reject USD conversion
    }
    
    if (fx) {
      fxRateId = fx.id;
      const obsDate = new Date(raw.observed_at);
      const fxDate = new Date(fx.observed_date);
      fallbackDays = Math.floor((obsDate.getTime() - fxDate.getTime()) / (1000 * 3600 * 24));

      const rate = new Decimal(fx.rate); // e.g. 1 USD = 2000 SDG
      usdPerKg = new Decimal(sdgPerKg).div(rate).toNumber();
      usdPerMt = new Decimal(sdgPerMt as number).div(rate).toNumber();
    }
  }

  return {
    normalized_usd_per_kg: usdPerKg,
    normalized_usd_per_mt: usdPerMt,
    normalized_sdg_per_kg: sdgPerKg,
    normalized_sdg_per_mt: sdgPerMt,
    fx_rate_id: fxRateId,
    unit_rule_id: unitRuleId,
    fx_fallback_days: fallbackDays,
    success: sdgPerKg !== null
  };
}

