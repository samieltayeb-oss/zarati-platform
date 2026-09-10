import { createAdminClient } from '@/lib/supabase/server';

export type UnitResolution = 
  | { type: 'CUSTOMARY_RULE'; id: string; conversion_factor_kg: number }
  | { type: 'EXPLICIT_METRIC'; conversion_factor_kg: number; canonical_unit: string };

export function parseExplicitMetric(sourceText: string): number | null {
  const normalized = sourceText.trim();
  // Match exact patterns like "90 KG", "3.5 kg", "3 kilograms"
  // Reject things like "-1 kg", "3 kg sack", "0 kg"
  const metricRegex = /^([+]?(?:[1-9]\d*|0)?(?:\.\d+)?)\s*(kg|kilogram|kilograms)$/i;
  
  const match = normalized.match(metricRegex);
  if (!match) return null;
  
  const quantity = parseFloat(match[1]);
  if (isNaN(quantity) || quantity <= 0) return null;
  
  return quantity;
}

export async function getUnitConversionRule(
  sourceUnitAlias: string,
  commodityId: string,
  observationDate: string
): Promise<UnitResolution | null> {
  const supabase = createAdminClient();
  const normalizedAlias = sourceUnitAlias.toLowerCase().trim();
  
  // 1. Try Explicit Metric parsing first
  const metricFactor = parseExplicitMetric(sourceUnitAlias);
  if (metricFactor !== null) {
    return {
      type: 'EXPLICIT_METRIC',
      conversion_factor_kg: metricFactor,
      canonical_unit: 'KG'
    };
  }

  // 2. Ambiguous cases blocked
  if (['bag', 'sack'].includes(normalizedAlias)) {
    return null;
  }

  // 3. Exact rule lookup (commodity specific)
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
    return { type: 'CUSTOMARY_RULE', id: specificRules[0].id, conversion_factor_kg: specificRules[0].conversion_factor_kg };
  }
  if (specificRules && specificRules.length > 1) {
    throw new Error('UNIT_RULE_CONFLICT');
  }

  // 4. Generic rule fallback
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
    return { type: 'CUSTOMARY_RULE', id: genericRules[0].id, conversion_factor_kg: genericRules[0].conversion_factor_kg };
  }
  if (genericRules && genericRules.length > 1) {
    throw new Error('UNIT_RULE_CONFLICT');
  }

  return null;
}
