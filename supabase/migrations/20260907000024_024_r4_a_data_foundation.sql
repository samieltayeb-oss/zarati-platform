-- ------------------------------------------------------------------------------
-- 1. Custom Enums for Hardened R4-A Data Foundation
-- ------------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.price_type_enum AS ENUM (
    'farmgate',
    'primary_auction',
    'wholesale',
    'retail',
    'export_fob'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.temporal_precision_enum AS ENUM (
    'EXACT_TIMESTAMP',
    'CALENDAR_DAY',
    'CALENDAR_MONTH',
    'SEASONAL_RANGE'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.source_provenance_enum AS ENUM (
    'sovereign_statutory',        -- Ministry of Ag, Customs, Central Bank
    'institutional_multilateral',  -- UN WFP, FAO, FEWS NET, World Bank
    'commercial_exchange',         -- Formal exchange auction floors
    'market_reported',             -- Registered local market reporters
    'field_survey'                 -- Independent agronomist or trader survey
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.ingestion_method_enum AS ENUM (
    'automated_api',               -- Direct REST / CKAN programmatic pull
    'automated_feed',              -- Automated file drop / webhook
    'manual_bulletin_entry',       -- Human data entry from verified bulletin
    'ocr_extract',                 -- Optical character recognition of print bulletin
    'batch_import'                 -- Historical archive bulk load
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.temporal_class_enum AS ENUM (
    'current_spot',                -- Daily or near-real-time spot trading
    'historical_archive',          -- Verified historical time-series
    'backfill'                     -- Cold-start historical migration data
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.derivation_class_enum AS ENUM (
    'observed_transaction',        -- Direct cash trade or auction clearing
    'reported_survey',             -- Sampled market trader survey
    'calculated_median',           -- Aggregated average or median across lots
    'model_estimated'              -- Spatial interpolation or econometric proxy
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.verification_state_enum AS ENUM (
    'unassessed',                  -- New ingestion, no verification performed
    'partially_verified',          -- Satisfies 1–2 evidence dimensions
    'verified',                    -- Rigorously satisfied core evidence dimensions
    'disputed',                    -- Flagged by conflicting source or audit
    'rejected'                     -- Found to be fraudulent or invalid
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.publication_status_enum AS ENUM (
    'INGESTED',                    -- Parsed into raw staging
    'QUARANTINED',                 -- Failed sanity, outlier check, or unit match
    'UNDER_REVIEW',                -- Held for data governor verification
    'APPROVED',                    -- Verified and cleared for release
    'PUBLISHED',                   -- Available in public safe views
    'RETRACTED'                    -- Withdrawn (remains in immutable audit ledger)
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.source_tier_enum AS ENUM (
    'TIER_A_PRIMARY_EXCHANGE',
    'TIER_B_INSTITUTIONAL',
    'TIER_C_SOVEREIGN_STATUTORY',
    'TIER_D_BENCHMARK_GLOBAL',
    'TIER_E_SURVEY_FIELD'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.verification_dimension_enum AS ENUM (
    'SOURCE_AUTHORITY',
    'INGESTION_INTEGRITY',
    'FIELD_CORROBORATION',
    'STATISTICAL_PLAUSIBILITY'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ------------------------------------------------------------------------------
-- 2. Canonical Currencies Reference (ISO 4217 Metadata — No FX Conversion)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.canonical_currencies (
  code TEXT PRIMARY KEY,                             -- 'SDG', 'USD', 'SAR', 'AED'
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.canonical_currencies (code, name_en, name_ar) VALUES
  ('SDG', 'Sudanese Pound', 'جنيه سوداني'),
  ('USD', 'US Dollar', 'دولار أمريكي'),
  ('SAR', 'Saudi Riyal', 'ريال سعودي'),
  ('AED', 'UAE Dirham', 'درهم إماراتي')
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. Canonical Source Registry
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.canonical_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,                         -- 'SRC_WFP_HDX', 'SRC_GEDAREF_AUCTION'
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  authority TEXT NOT NULL,                           -- 'United Nations World Food Programme'
  publisher TEXT NOT NULL,                           -- 'WFP VAM'
  country TEXT NOT NULL DEFAULT 'SD',
  source_url TEXT NOT NULL,
  license_type TEXT NOT NULL,                        -- 'CC_BY_IGO_3_0', 'PUBLIC_DOMAIN', 'REQUIRES_MOU'
  license_url TEXT,
  attribution_text_en TEXT NOT NULL,
  attribution_text_ar TEXT NOT NULL,
  access_method TEXT NOT NULL,                       -- 'CKAN_REST_API', 'CSV_PULL', 'MANUAL_BULLETIN'
  update_frequency TEXT NOT NULL,                    -- 'daily', 'monthly', 'quarterly'
  expected_latency_days INTEGER NOT NULL DEFAULT 30,
  tier public.source_tier_enum NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_canonical_sources_code ON public.canonical_sources(code);

-- ------------------------------------------------------------------------------
-- 4. Canonical Dataset Registry (Composite Unique for Source Relational Guard)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.canonical_datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.canonical_sources(id) ON DELETE RESTRICT,
  dataset_identifier TEXT NOT NULL UNIQUE,           -- 'wfp-food-prices-for-sudan'
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  download_url TEXT,
  format TEXT NOT NULL,                              -- 'CSV', 'JSON', 'PDF'
  schema_definition JSONB,                           -- Column mapping expectations
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_datasets_id_source UNIQUE (id, source_id)
);

CREATE INDEX IF NOT EXISTS idx_canonical_datasets_source ON public.canonical_datasets(source_id);

-- ------------------------------------------------------------------------------
-- 5. Canonical Localities (Mahaliyas of Sudan)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.canonical_localities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID NOT NULL REFERENCES public.states(id) ON DELETE RESTRICT,
  code TEXT NOT NULL UNIQUE,                         -- 'SD-GD-BALADIYA'
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  pcode TEXT,                                        -- UN OCHA standard P-Code
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_canonical_localities_state ON public.canonical_localities(state_id);

-- ------------------------------------------------------------------------------
-- 6. Canonical Agricultural Schemes
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.canonical_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,                         -- 'SCHEME-GEZIRA'
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  scheme_type TEXT NOT NULL CHECK (scheme_type IN ('irrigated', 'semi_mechanized', 'traditional_rainfed')),
  primary_state_id UUID NOT NULL REFERENCES public.states(id) ON DELETE RESTRICT,
  area_feddans NUMERIC(14,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. Canonical Commodities (Hierarchical Variety & Grade Linkage to Crops)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.canonical_commodities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE RESTRICT,
  code TEXT NOT NULL UNIQUE,                         -- 'sorghum_feterita_grade1'
  variety_en TEXT NOT NULL,                          -- 'Feterita'
  variety_ar TEXT NOT NULL,                          -- 'فتريتة'
  grade_en TEXT NOT NULL DEFAULT 'Commercial',       -- 'Grade 1 Export'
  grade_ar TEXT NOT NULL DEFAULT 'تجاري',            -- 'درجة أولى صادر'
  botanical_name TEXT,
  hs_code TEXT,                                      -- Harmonized System Code ('1007.90')
  standard_unit TEXT NOT NULL DEFAULT 'metric_ton',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_canonical_commodities_crop ON public.canonical_commodities(crop_id);

-- ------------------------------------------------------------------------------
-- 8. Customary Units with Regional Variance & Confidence Architecture
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.canonical_units (
  code TEXT PRIMARY KEY,                             -- 'ardeb_gedaref_sorghum', 'metric_ton'
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  crop_id UUID REFERENCES public.crops(id) ON DELETE RESTRICT,
  state_id UUID REFERENCES public.states(id) ON DELETE RESTRICT,
  market_id UUID REFERENCES public.markets(id) ON DELETE RESTRICT,
  weight_kg_nominal NUMERIC(10,4),                   -- Nominal weight in kg (nullable if variable)
  min_weight_kg NUMERIC(10,4),                       -- Lower bound
  max_weight_kg NUMERIC(10,4),                       -- Upper bound
  conversion_authority TEXT,                         -- Documented standard reference
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('STATUTORY_STANDARD', 'REGIONAL_ESTIMATE', 'VARIABLE_UNVERIFIED')),
  is_verified_standard BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Initial Verified Standards
INSERT INTO public.canonical_units (code, name_en, name_ar, weight_kg_nominal, confidence_level, is_verified_standard) VALUES
  ('metric_ton', 'Metric Ton', 'طن متري', 1000.0000, 'STATUTORY_STANDARD', true),
  ('kg', 'Kilogram', 'كيلوجرام', 1.0000, 'STATUTORY_STANDARD', true),
  ('sack_90kg', '90kg Grain Sack', 'جوال ٩٠ كجم', 90.0000, 'STATUTORY_STANDARD', true),
  ('bag_50kg', '50kg Bag', 'جوال ٥٠ كجم', 50.0000, 'STATUTORY_STANDARD', true),
  ('bag_100kg', '100kg Bag', 'جوال ١٠٠ كجم', 100.0000, 'STATUTORY_STANDARD', true)
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 9. String Aliases for Entity Resolution
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.canonical_commodity_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.canonical_sources(id) ON DELETE RESTRICT,
  source_raw_string TEXT NOT NULL,
  commodity_id UUID NOT NULL REFERENCES public.canonical_commodities(id) ON DELETE RESTRICT,
  default_price_type public.price_type_enum NOT NULL DEFAULT 'wholesale',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_source_raw_commodity UNIQUE (source_id, source_raw_string)
);

CREATE TABLE IF NOT EXISTS public.canonical_market_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.canonical_sources(id) ON DELETE RESTRICT,
  source_raw_market_name TEXT NOT NULL,
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_source_raw_market UNIQUE (source_id, source_raw_market_name)
);


-- ------------------------------------------------------------------------------
-- 10. Raw Ingestion Snapshots (Cryptographic Evidence Archive)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.raw_ingestion_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID NOT NULL REFERENCES public.canonical_datasets(id) ON DELETE RESTRICT,
  payload_sha256 TEXT NOT NULL,
  storage_uri TEXT NOT NULL,
  record_count INTEGER NOT NULL CHECK (record_count >= 0),
  ingested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  CONSTRAINT uq_snapshots_dataset_sha UNIQUE (dataset_id, payload_sha256)
);

CREATE INDEX IF NOT EXISTS idx_raw_snapshots_hash ON public.raw_ingestion_snapshots(payload_sha256);

-- ------------------------------------------------------------------------------
-- 11. Immutable Market Price Observation Ledger
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.market_price_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relational Foreign Key Anchors
  commodity_id UUID NOT NULL REFERENCES public.canonical_commodities(id) ON DELETE RESTRICT,
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE RESTRICT,
  source_id UUID NOT NULL REFERENCES public.canonical_sources(id) ON DELETE RESTRICT,
  dataset_id UUID REFERENCES public.canonical_datasets(id) ON DELETE SET NULL,
  raw_snapshot_id UUID REFERENCES public.raw_ingestion_snapshots(id) ON DELETE SET NULL,
  canonical_currency_code TEXT REFERENCES public.canonical_currencies(code) ON DELETE RESTRICT,
  
  -- Strict Relational Guard: dataset_id MUST belong to source_id
  CONSTRAINT fk_mpo_dataset_source 
    FOREIGN KEY (dataset_id, source_id) 
    REFERENCES public.canonical_datasets(id, source_id) 
    ON DELETE RESTRICT,
  
  -- Deterministic Non-Null Ingestion Deduplication Key
  source_record_key TEXT NOT NULL,
  source_record_id TEXT,                             -- Upstream ID if present
  source_record_raw TEXT,                            -- Verbatim line/record snippet
  
  -- Layer 1 Ground Truth (VERBATIM SOURCE TRUTH)
  raw_price_text TEXT NOT NULL,                      -- Exact original text ('450,000')
  parsed_price_numeric NUMERIC(16,4),                -- Parsed numeric (NULLABLE until parser runs)
  raw_currency_text TEXT NOT NULL,                   -- Exact original currency string ('SDG')
  raw_unit_text TEXT NOT NULL,                       -- Exact original unit string ('Ardeb')
  price_type public.price_type_enum NOT NULL DEFAULT 'wholesale',
  
  -- R4-C Normalization Placeholders (STRICTLY NULLABLE IN R4-A)
  normalized_price_per_mt NUMERIC(16,2),
  normalized_price_per_kg NUMERIC(16,4),
  normalized_price_usd_per_mt NUMERIC(16,2),
  conversion_factor_used NUMERIC(12,6),
  conversion_rule_applied TEXT,
  
  -- Strict Temporal Dimensions & Precision
  observed_at TIMESTAMPTZ NOT NULL,                  -- Nominal observation anchor
  temporal_precision public.temporal_precision_enum NOT NULL DEFAULT 'CALENDAR_DAY',
  valid_from TIMESTAMPTZ,                            -- Authoritative validity start
  valid_to TIMESTAMPTZ,                              -- Authoritative validity end
  reported_at TIMESTAMPTZ,                           -- Field compilation
  published_at TIMESTAMPTZ,                          -- Publisher bulletin date
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),    -- Platform capture
  verified_at TIMESTAMPTZ,                           -- Quality completion
  stale_after_at TIMESTAMPTZ NOT NULL,               -- Deterministic staleness boundary
  
  -- Orthogonal Provenance Dimensions
  source_provenance public.source_provenance_enum NOT NULL,
  ingestion_method public.ingestion_method_enum NOT NULL,
  temporal_class public.temporal_class_enum NOT NULL,
  derivation_class public.derivation_class_enum NOT NULL,
  verification_state public.verification_state_enum NOT NULL DEFAULT 'unassessed',
  
  -- Trust Score (NULL BY DEFAULT — No Synthetic Trust Defaults)
  trust_score CHAR(1) CHECK (trust_score IN ('A', 'B', 'C', 'D', 'E')) DEFAULT NULL,
  
  -- Controlled Publication State
  publication_status public.publication_status_enum NOT NULL DEFAULT 'INGESTED',
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  retraction_rationale TEXT,
  
  -- Deduplication Constraint
  CONSTRAINT uq_mpo_source_record_key UNIQUE (source_id, source_record_key)
);

CREATE INDEX IF NOT EXISTS idx_mpo_commodity_date ON public.market_price_observations(commodity_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_mpo_market_date ON public.market_price_observations(market_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_mpo_pub_status ON public.market_price_observations(publication_status) WHERE publication_status = 'PUBLISHED';
CREATE INDEX IF NOT EXISTS idx_mpo_stale_after ON public.market_price_observations(stale_after_at);


-- ------------------------------------------------------------------------------
-- 12. Observation Verification Evidence Ledger (Multi-Dimensional)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.observation_verification_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_id UUID NOT NULL REFERENCES public.market_price_observations(id) ON DELETE RESTRICT,
  dimension public.verification_dimension_enum NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'SATISFIED', 'FAILED', 'INCONCLUSIVE')),
  evidence_reference TEXT NOT NULL,                  -- Document URI, hash, auction slip ID
  evaluated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_verif_evidence_obs ON public.observation_verification_evidence(observation_id);
CREATE INDEX IF NOT EXISTS idx_verif_evidence_dim ON public.observation_verification_evidence(dimension);

-- ------------------------------------------------------------------------------
-- 13. Observation Transformation Audit Ledger (R4-C Auditable Lineage)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.observation_transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_id UUID NOT NULL REFERENCES public.market_price_observations(id) ON DELETE RESTRICT,
  transformation_type TEXT NOT NULL,                 -- 'PARSE_NUMERIC', 'UNIT_METRIC_TON_CONVERT', 'FX_USD_CONVERT'
  input_value TEXT NOT NULL,
  output_value TEXT NOT NULL,
  rule_code TEXT NOT NULL,
  rule_version TEXT NOT NULL,
  parameters JSONB,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  performed_by TEXT NOT NULL,                        -- Ingestion service worker ID or Admin profile
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_obs_transformations_obs ON public.observation_transformations(observation_id);

-- ------------------------------------------------------------------------------
-- 14. Observation Quality Flags (Quarantine & Outlier Tracking)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.observation_quality_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_id UUID NOT NULL REFERENCES public.market_price_observations(id) ON DELETE RESTRICT,
  flag_code TEXT NOT NULL,                           -- 'EXTREME_OUTLIER', 'TEMPORAL_INVERSION', 'UNMAPPED_UNIT'
  severity TEXT NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'QUARANTINE_ERROR')),
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quality_flags_obs ON public.observation_quality_flags(observation_id);

-- ------------------------------------------------------------------------------
-- 15. Observation Conflict Ledger (Non-Destructive Variance Tracking)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.observation_conflict_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_observation_id UUID NOT NULL REFERENCES public.market_price_observations(id) ON DELETE RESTRICT,
  conflicting_observation_id UUID NOT NULL REFERENCES public.market_price_observations(id) ON DELETE RESTRICT,
  price_divergence_pct NUMERIC(6,2) NOT NULL,
  resolution_status TEXT NOT NULL DEFAULT 'UNRESOLVED' 
    CHECK (resolution_status IN ('UNRESOLVED', 'PRECEDENCE_APPLIED', 'ARBITRATED_DISMISSED')),
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  resolution_rationale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conflict_primary ON public.observation_conflict_ledger(primary_observation_id);


-- ------------------------------------------------------------------------------
-- 16. Immutability Trigger for Raw Source Fields
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_protect_market_price_observations_immutability()
RETURNS TRIGGER AS $$
BEGIN
  -- Strict ban against modifying raw ground truth or provenance dimensions
  IF (OLD.raw_price_text IS DISTINCT FROM NEW.raw_price_text) OR
     (OLD.raw_currency_text IS DISTINCT FROM NEW.raw_currency_text) OR
     (OLD.raw_unit_text IS DISTINCT FROM NEW.raw_unit_text) OR
     (OLD.commodity_id IS DISTINCT FROM NEW.commodity_id) OR
     (OLD.market_id IS DISTINCT FROM NEW.market_id) OR
     (OLD.source_id IS DISTINCT FROM NEW.source_id) OR
     (OLD.dataset_id IS DISTINCT FROM NEW.dataset_id) OR
     (OLD.source_record_key IS DISTINCT FROM NEW.source_record_key) OR
     (OLD.observed_at IS DISTINCT FROM NEW.observed_at) OR
     (OLD.source_provenance IS DISTINCT FROM NEW.source_provenance) OR
     (OLD.ingestion_method IS DISTINCT FROM NEW.ingestion_method) OR
     (OLD.derivation_class IS DISTINCT FROM NEW.derivation_class) THEN
    RAISE EXCEPTION 'CANNOT_MUTATE_GROUND_TRUTH: Historical observation core fields are cryptographically immutable.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_mpo_immutability ON public.market_price_observations;
CREATE TRIGGER trg_protect_mpo_immutability
  BEFORE UPDATE ON public.market_price_observations
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_protect_market_price_observations_immutability();

-- ------------------------------------------------------------------------------
-- 17. Physical Deletion Guard Trigger
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_prevent_market_price_observations_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'CANNOT_DELETE_OBSERVATION: Physical deletion forbidden. Transition publication_status to RETRACTED.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_mpo_delete ON public.market_price_observations;
CREATE TRIGGER trg_prevent_mpo_delete
  BEFORE DELETE ON public.market_price_observations
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_prevent_market_price_observations_delete();

-- ------------------------------------------------------------------------------
-- 18. Publication State Machine Enforcement Trigger
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_enforce_mpo_publication_state()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.publication_status = NEW.publication_status THEN
    RETURN NEW;
  END IF;

  -- Allowed Transitions:
  -- INGESTED      -> UNDER_REVIEW, QUARANTINED
  -- QUARANTINED   -> UNDER_REVIEW, RETRACTED
  -- UNDER_REVIEW  -> APPROVED, QUARANTINED, RETRACTED
  -- APPROVED      -> PUBLISHED, UNDER_REVIEW, RETRACTED
  -- PUBLISHED     -> RETRACTED
  -- RETRACTED     -> UNDER_REVIEW (Requires re-review, cannot jump to PUBLISHED)
  IF (OLD.publication_status = 'INGESTED' AND NEW.publication_status IN ('UNDER_REVIEW', 'QUARANTINED')) OR
     (OLD.publication_status = 'QUARANTINED' AND NEW.publication_status IN ('UNDER_REVIEW', 'RETRACTED')) OR
     (OLD.publication_status = 'UNDER_REVIEW' AND NEW.publication_status IN ('APPROVED', 'QUARANTINED', 'RETRACTED')) OR
     (OLD.publication_status = 'APPROVED' AND NEW.publication_status IN ('PUBLISHED', 'UNDER_REVIEW', 'RETRACTED')) OR
     (OLD.publication_status = 'PUBLISHED' AND NEW.publication_status = 'RETRACTED') OR
     (OLD.publication_status = 'RETRACTED' AND NEW.publication_status = 'UNDER_REVIEW') THEN
    RETURN NEW;
  ELSE
    RAISE EXCEPTION 'INVALID_STATE_TRANSITION: Cannot transition observation from % to %', OLD.publication_status, NEW.publication_status;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_mpo_publication_state ON public.market_price_observations;
CREATE TRIGGER trg_enforce_mpo_publication_state
  BEFORE UPDATE OF publication_status ON public.market_price_observations
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_enforce_mpo_publication_state();


-- ------------------------------------------------------------------------------
-- 19. Row Level Security Activation
-- ------------------------------------------------------------------------------
ALTER TABLE public.canonical_currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_commodity_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_market_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_ingestion_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_price_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observation_verification_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observation_transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observation_quality_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observation_conflict_ledger ENABLE ROW LEVEL SECURITY;

-- Read-Only Reference Policies (Anon & Authenticated)
CREATE POLICY "Public can view canonical currencies"
  ON public.canonical_currencies FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view canonical sources"
  ON public.canonical_sources FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view canonical datasets"
  ON public.canonical_datasets FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view canonical localities"
  ON public.canonical_localities FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view canonical schemes"
  ON public.canonical_schemes FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view canonical commodities"
  ON public.canonical_commodities FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view canonical units"
  ON public.canonical_units FOR SELECT USING (true);

-- STRICT DATA MINIMIZATION: Direct Access to Observations Revoked from Public
-- Anonymous and Authenticated users have NO direct table policy on market_price_observations!
-- Access is strictly mediated via public.v_approved_market_prices.

-- Service Role Access
CREATE POLICY "Service role full access on observations"
  ON public.market_price_observations FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on raw snapshots"
  ON public.raw_ingestion_snapshots FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on transformations"
  ON public.observation_transformations FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on verification evidence"
  ON public.observation_verification_evidence FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- Admin Management Access
CREATE POLICY "Admins can view and manage observations"
  ON public.market_price_observations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin' 
        AND profiles.status = 'active'
    )
  );

-- ------------------------------------------------------------------------------
-- 20. Safe Public Intelligence View (Security Barrier & Deterministic Staleness)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_approved_market_prices
WITH (security_barrier = true, security_invoker = true) AS
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

-- ------------------------------------------------------------------------------
-- 21. Hardened Backward Compatibility Bridge for R1 crop_prices
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_legacy_crop_prices_bridge
WITH (security_barrier = true, security_invoker = true) AS
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

-- ------------------------------------------------------------------------------
-- 22. Access Grants & Revocations
-- ------------------------------------------------------------------------------
-- Revoke direct table access from public
REVOKE ALL ON public.market_price_observations FROM anon, authenticated;
REVOKE ALL ON public.raw_ingestion_snapshots FROM anon, authenticated;
REVOKE ALL ON public.observation_verification_evidence FROM anon, authenticated;
REVOKE ALL ON public.observation_transformations FROM anon, authenticated;
REVOKE ALL ON public.observation_quality_flags FROM anon, authenticated;
REVOKE ALL ON public.observation_conflict_ledger FROM anon, authenticated;

-- Grant safe reference tables & views
GRANT SELECT ON public.canonical_currencies TO anon, authenticated;
GRANT SELECT ON public.canonical_sources TO anon, authenticated;
GRANT SELECT ON public.canonical_datasets TO anon, authenticated;
GRANT SELECT ON public.canonical_localities TO anon, authenticated;
GRANT SELECT ON public.canonical_schemes TO anon, authenticated;
GRANT SELECT ON public.canonical_commodities TO anon, authenticated;
GRANT SELECT ON public.canonical_units TO anon, authenticated;
GRANT SELECT ON public.v_approved_market_prices TO anon, authenticated;
GRANT SELECT ON public.v_legacy_crop_prices_bridge TO anon, authenticated;


