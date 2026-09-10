-- Migration 032: R4-C Explicit Metric Unit Support

-- Add fields to normalized_market_values to capture explicit metric parsing lineage
ALTER TABLE public.normalized_market_values
ADD COLUMN unit_resolution_method TEXT DEFAULT 'CUSTOMARY_RULE',
ADD COLUMN source_explicit_quantity NUMERIC,
ADD COLUMN source_canonical_unit TEXT;

-- Update the public view to include these fields for transparency (optional, but good for lineage)
DROP VIEW IF EXISTS public.v_public_normalized_market_prices;
CREATE VIEW public.v_public_normalized_market_prices AS
SELECT 
    mpo.id AS raw_observation_id,
    mpo.market_id,
    mpo.commodity_id,
    mpo.observed_at,
    mpo.raw_price,
    mpo.raw_unit_text,
    mpo.raw_currency_text,
    nmv.id AS normalized_value_id,
    nmv.normalized_usd_per_kg,
    nmv.normalized_usd_per_mt,
    nmv.normalized_sdg_per_kg,
    nmv.normalized_sdg_per_mt,
    nmv.calculated_at,
    nmv.calculation_version,
    nmv.unit_resolution_method,
    nmv.source_explicit_quantity,
    nmv.source_canonical_unit,
    ucr.source_unit_alias AS customary_rule_applied,
    fx.rate AS applied_fx_rate,
    fx.rate_class AS applied_fx_class,
    nmv.fx_fallback_days
FROM public.normalized_market_values nmv
JOIN public.market_price_observations mpo ON nmv.raw_observation_id = mpo.id
LEFT JOIN public.unit_conversion_rules ucr ON nmv.unit_rule_id = ucr.id
LEFT JOIN public.fx_rate_observations fx ON nmv.fx_rate_id = fx.id
WHERE mpo.publication_status = 'PUBLISHED'
AND nmv.is_latest = true;

GRANT SELECT ON public.v_public_normalized_market_prices TO anon, authenticated;
