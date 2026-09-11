import { createAdminClient } from '@/lib/supabase/server';
import { normalizeObservation } from './engine';

export async function canonicalNormalizeObservation(observationId: string): Promise<{ success: boolean; error?: string; duplicates: number }> {
  const supabase = createAdminClient();
  
  // 1. Read source observation (normalizeObservation does this)
  // 2-4. Parse, select FX, calculate
  const res = await normalizeObservation(observationId, 'PARALLEL_MARKET');
  
  if (!res.success) {
    return { success: false, error: 'Normalization failed (missing rule or FX)', duplicates: 0 };
  }
  
  // 5. Persist lineage & enforce idempotency
  // Check if we already have an identical active revision to ensure idempotency
  const { data: existing } = await supabase
    .from('normalized_market_values')
    .select('id, calculation_version')
    .eq('raw_observation_id', observationId)
    .eq('is_latest', true);
    
  let duplicates = 0;
  
  if (existing && existing.length > 0) {
    // We have existing active revisions. For true idempotency, we deprecate old ones and insert the new one
    // or if the calculation logic hasn't changed, we could skip. But let's follow the standard:
    // Update old to is_latest = false
    await supabase.from('normalized_market_values')
      .update({ is_latest: false })
      .eq('raw_observation_id', observationId)
      .eq('is_latest', true);
      
    duplicates = existing.length; // Number of previous active rows retired
  }
  
  // Insert the new normalized value
  const { error: insertError } = await supabase.from('normalized_market_values').insert({
    raw_observation_id: observationId,
    normalized_usd_per_kg: res.normalized_usd_per_kg,
    normalized_usd_per_mt: res.normalized_usd_per_mt,
    normalized_sdg_per_kg: res.normalized_sdg_per_kg,
    normalized_sdg_per_mt: res.normalized_sdg_per_mt,
    fx_rate_id: res.fx_rate_id,
    unit_rule_id: res.unit_rule_id,
    fx_fallback_days: res.fx_fallback_days,
    unit_resolution_method: res.unit_resolution_method,
    source_explicit_quantity: res.source_explicit_quantity,
    source_canonical_unit: res.source_canonical_unit,
    calculation_version: 'v1.0.0',
    is_latest: true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  
  if (insertError) {
    return { success: false, error: insertError.message, duplicates: 0 };
  }
  
  // 6. Publication rules are inherently enforced by RLS and the v_public_normalized_market_prices view,
  // which filters by mpo.publication_status = 'PUBLISHED' and nmv.is_latest = true.
  // The source row remains immutable.
  
  return { success: true, duplicates };
}
