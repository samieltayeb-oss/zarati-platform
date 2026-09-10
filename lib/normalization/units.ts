import { createAdminClient } from '@/lib/supabase/server';

export async function getUnitConversionRule(
  sourceUnitAlias: string,
  commodityId: string,
  observationDate: string
): Promise<{ id: string; conversion_factor_kg: number } | null> {
  const supabase = createAdminClient();
  
  // Ambiguous cases blocked explicitly in DB by not seeding them as 'VERIFIED'
  // Or handled here:
  const normalizedAlias = sourceUnitAlias.toLowerCase().trim();
  if (['bag', 'sack'].includes(normalizedAlias)) {
    return null; // Ambiguous bag/sack is explicitly blocked
  }

  // Exact rule lookup (commodity specific)
  const { data: specificRules, error: specificErr } = await supabase
    .from('unit_conversion_rules')
    .select('id, conversion_factor_kg, confidence_status')
    .eq('source_unit_alias', normalizedAlias)
    .eq('commodity_id', commodityId)
    .lte('valid_from_date', observationDate)
    .or(`valid_to_date.is.null,valid_to_date.gte.${observationDate}`)
    .eq('confidence_status', 'VERIFIED');

  if (specificErr) throw new Error(specificErr.message);

  if (specificRules && specificRules.length === 1) {
    return specificRules[0];
  }
  if (specificRules && specificRules.length > 1) {
    throw new Error('UNIT_RULE_CONFLICT');
  }

  // Generic rule fallback (no commodity specified)
  const { data: genericRules, error: genericErr } = await supabase
    .from('unit_conversion_rules')
    .select('id, conversion_factor_kg, confidence_status')
    .eq('source_unit_alias', normalizedAlias)
    .is('commodity_id', null)
    .lte('valid_from_date', observationDate)
    .or(`valid_to_date.is.null,valid_to_date.gte.${observationDate}`)
    .eq('confidence_status', 'VERIFIED');

  if (genericErr) throw new Error(genericErr.message);
  
  if (genericRules && genericRules.length === 1) {
    return genericRules[0];
  }
  if (genericRules && genericRules.length > 1) {
    throw new Error('UNIT_RULE_CONFLICT');
  }

  return null;
}
