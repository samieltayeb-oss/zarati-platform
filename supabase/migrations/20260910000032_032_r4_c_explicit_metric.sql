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
    nmv.id as normalized_id,
    mpo.id as source_observation_id,
    mpo.observed_at as source_observation_date,
    c.code as commodity_code,
    cr.name_en as crop_name_en,
    m.name_en as market_name_en,
    mpo.raw_price_text,
    mpo.raw_currency_text,
    mpo.raw_unit_text,
    nmv.normalized_sdg_per_kg,
    nmv.normalized_sdg_per_mt,
    nmv.normalized_usd_per_kg,
    nmv.normalized_usd_per_mt,
    fx.rate_class as fx_rate_class,
    fx.rate as applied_fx_rate,
    ucr.source_unit_alias as customary_rule_applied,
    nmv.calculated_at,
    nmv.calculation_version,
    nmv.unit_resolution_method,
    nmv.source_explicit_quantity,
    nmv.source_canonical_unit
FROM public.normalized_market_values nmv
JOIN public.market_price_observations mpo ON nmv.raw_observation_id = mpo.id
JOIN public.canonical_commodities c ON mpo.commodity_id = c.id
JOIN public.crops cr ON c.crop_id = cr.id
JOIN public.markets m ON mpo.market_id = m.id
LEFT JOIN public.unit_conversion_rules ucr ON nmv.unit_rule_id = ucr.id
LEFT JOIN public.fx_rate_observations fx ON nmv.fx_rate_id = fx.id
WHERE mpo.publication_status = 'PUBLISHED'
AND nmv.is_latest = true;

GRANT SELECT ON public.v_public_normalized_market_prices TO anon, authenticated;
