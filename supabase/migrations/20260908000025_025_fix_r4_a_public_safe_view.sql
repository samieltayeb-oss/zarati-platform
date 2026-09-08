-- ==============================================================================
-- ZARATI | زرعتي — MIGRATION 025
-- R4-A Public Safe View Forward Fix
-- ==============================================================================

-- 1. Fix v_approved_market_prices
-- Removing security_invoker = true so the view executes as the definer (postgres).
-- This resolves the 'permission denied for table market_price_observations' error
-- for anon/authenticated users while maintaining security_barrier to prevent
-- leakage of unpublished observations.

CREATE OR REPLACE VIEW public.v_approved_market_prices
WITH (security_barrier = true) AS
SELECT 
  mpo.id AS observation_id,
  c.code AS crop_code,
  c.name_en AS crop_name_en,
  c.name_ar AS crop_name_ar,
  cc.variety_en,
  cc.variety_ar,
  cc.grade_en,
  cc.grade_ar,
  m.code AS market_code,
  m.name_en AS market_name_en,
  m.name_ar AS market_name_ar,
  s.name_en AS state_name_en,
  s.name_ar AS state_name_ar,
  mpo.price_type,
  mpo.raw_price_text,
  mpo.parsed_price_numeric,
  mpo.raw_currency_text AS currency,
  mpo.raw_unit_text AS unit,
  mpo.normalized_price_per_mt,
  mpo.normalized_price_per_kg,
  mpo.observed_at,
  mpo.temporal_precision,
  mpo.valid_from,
  mpo.valid_to,
  mpo.published_at,
  mpo.trust_score,
  mpo.source_provenance,
  mpo.derivation_class,
  mpo.verification_state,
  src.code AS source_code,
  src.name_en AS source_name_en,
  src.attribution_text_en,
  src.attribution_text_ar,
  (NOW() > mpo.stale_after_at) AS is_stale
FROM public.market_price_observations mpo
JOIN public.canonical_commodities cc ON mpo.commodity_id = cc.id
JOIN public.crops c ON cc.crop_id = c.id
JOIN public.markets m ON mpo.market_id = m.id
JOIN public.states s ON m.state_id = s.id
JOIN public.canonical_sources src ON mpo.source_id = src.id
WHERE mpo.publication_status = 'PUBLISHED';

-- 2. Fix v_legacy_crop_prices_bridge
-- Removing security_invoker = true for the same reason.

CREATE OR REPLACE VIEW public.v_legacy_crop_prices_bridge
WITH (security_barrier = true) AS
SELECT DISTINCT ON (c.id, mpo.market_id)
  mpo.id,
  c.id AS crop_id,
  mpo.market_id,
  COALESCE(mpo.normalized_price_per_mt, mpo.parsed_price_numeric, 0) AS price_sdg,
  mpo.normalized_price_usd_per_mt AS price_usd,
  mpo.raw_currency_text AS currency,
  COALESCE(mpo.raw_unit_text, 'ton') AS unit,
  mpo.observed_at::DATE AS price_date,
  -- Truthful mapping to R1 source CHECK constraint
  CASE 
    WHEN mpo.source_provenance IN ('sovereign_statutory', 'commercial_exchange') THEN 'market_authority'
    WHEN mpo.source_provenance IN ('field_survey', 'market_reported') THEN 'trader_survey'
    WHEN src.code = 'SRC_FAO_AMIS' THEN 'fao_amis'
    WHEN src.code = 'SRC_EBUS_SUDAN' THEN 'ebus_sudan'
  END AS source,
  -- Truthful is_official flag: only true if source is statutory or verified exchange
  (mpo.source_provenance IN ('sovereign_statutory', 'commercial_exchange') AND mpo.verification_state = 'verified') AS is_official,
  -- Truthful notes: actual source code and verification state
  (src.code || ' [' || mpo.verification_state::TEXT || ']')::TEXT AS notes,
  NULL::UUID AS created_by,
  mpo.ingested_at AS created_at
FROM public.market_price_observations mpo
JOIN public.canonical_commodities cc ON mpo.commodity_id = cc.id
JOIN public.crops c ON cc.crop_id = c.id
JOIN public.canonical_sources src ON mpo.source_id = src.id
WHERE mpo.publication_status = 'PUBLISHED'
  AND (
    mpo.source_provenance IN ('sovereign_statutory', 'commercial_exchange', 'field_survey', 'market_reported')
    OR src.code IN ('SRC_FAO_AMIS', 'SRC_EBUS_SUDAN')
  )
ORDER BY c.id, mpo.market_id, mpo.observed_at DESC;

-- Ensure grants are preserved (although ALTER VIEW usually preserves them, CREATE OR REPLACE might preserve them too, but it's safe to restate)
GRANT SELECT ON public.v_approved_market_prices TO anon, authenticated;
GRANT SELECT ON public.v_legacy_crop_prices_bridge TO anon, authenticated;
