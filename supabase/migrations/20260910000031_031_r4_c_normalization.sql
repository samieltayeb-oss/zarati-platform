-- Migration 031: R4-C Derived Value Normalization

CREATE TYPE public.fx_rate_class AS ENUM (
    'OFFICIAL',
    'PARALLEL_MARKET',
    'INSTITUTIONAL_REFERENCE',
    'OTHER_APPROVED_REFERENCE'
);

CREATE TYPE public.automation_status AS ENUM (
    'automatable',
    'manual_batch',
    'blocked'
);

CREATE TYPE public.confidence_status AS ENUM (
    'VERIFIED',
    'PROVISIONAL',
    'BLOCKED'
);

CREATE TABLE public.canonical_fx_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    url TEXT,
    automation_mode public.automation_status NOT NULL DEFAULT 'blocked',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.fx_rate_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES public.canonical_fx_sources(id),
    rate_class public.fx_rate_class NOT NULL,
    base_currency TEXT NOT NULL,
    quote_currency TEXT NOT NULL,
    rate NUMERIC NOT NULL CHECK (rate > 0),
    observed_date DATE NOT NULL,
    published_at TIMESTAMPTZ,
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source_reference TEXT,
    verification_status public.confidence_status NOT NULL DEFAULT 'PROVISIONAL',
    UNIQUE (source_id, base_currency, quote_currency, observed_date, rate_class)
);

CREATE TABLE public.unit_conversion_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_unit_alias TEXT NOT NULL,
    commodity_id UUID REFERENCES public.canonical_commodities(id),
    region_id UUID REFERENCES public.states(id),
    valid_from_date DATE NOT NULL,
    valid_to_date DATE,
    conversion_factor_kg NUMERIC NOT NULL CHECK (conversion_factor_kg > 0),
    confidence_status public.confidence_status NOT NULL DEFAULT 'PROVISIONAL',
    authority_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (source_unit_alias, commodity_id, region_id, valid_from_date)
);

CREATE TABLE public.normalization_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    records_processed INTEGER DEFAULT 0,
    records_normalized INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    records_quarantined INTEGER DEFAULT 0,
    algorithm_version TEXT NOT NULL
);

CREATE TABLE public.normalized_market_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_observation_id UUID NOT NULL REFERENCES public.market_price_observations(id),
    fx_rate_id UUID REFERENCES public.fx_rate_observations(id),
    unit_rule_id UUID REFERENCES public.unit_conversion_rules(id),
    normalization_run_id UUID REFERENCES public.normalization_runs(id),
    calculation_version TEXT NOT NULL,
    normalized_usd_per_kg NUMERIC,
    normalized_usd_per_mt NUMERIC,
    normalized_sdg_per_kg NUMERIC,
    normalized_sdg_per_mt NUMERIC,
    fx_fallback_days INTEGER,
    is_latest BOOLEAN NOT NULL DEFAULT true,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partial unique index to enforce only one is_latest=true per raw_observation_id
CREATE UNIQUE INDEX idx_latest_normalized_value 
ON public.normalized_market_values(raw_observation_id) 
WHERE is_latest = true;

-- Append-only trigger for normalized_market_values (prevent updates, allow insert/supersede logic)
CREATE FUNCTION public.trg_enforce_normalized_immutability()
RETURNS TRIGGER AS $$
BEGIN
    IF current_setting('session_replication_role', 't') = 'replica' THEN
        RETURN NEW;
    END IF;
    IF TG_OP = 'UPDATE' THEN
        -- Allow setting is_latest = false only
        IF NEW.is_latest = false AND OLD.is_latest = true AND NEW.raw_observation_id = OLD.raw_observation_id THEN
            RETURN NEW;
        END IF;
        RAISE EXCEPTION 'Derived values are immutable. Insert a new version and mark old as is_latest=false.';
    END IF;
    IF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'Derived values are immutable and cannot be deleted.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_normalized_immutability
BEFORE UPDATE OR DELETE ON public.normalized_market_values
FOR EACH ROW EXECUTE FUNCTION public.trg_enforce_normalized_immutability();

-- Public Safe View
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
    fx.observed_date as fx_observed_date,
    nmv.calculation_version,
    ucr.confidence_status as unit_confidence_status
FROM public.normalized_market_values nmv
JOIN public.market_price_observations mpo ON nmv.raw_observation_id = mpo.id
JOIN public.canonical_commodities c ON mpo.commodity_id = c.id
JOIN public.crops cr ON c.crop_id = cr.id
JOIN public.markets m ON mpo.market_id = m.id
LEFT JOIN public.fx_rate_observations fx ON nmv.fx_rate_id = fx.id
LEFT JOIN public.unit_conversion_rules ucr ON nmv.unit_rule_id = ucr.id
WHERE nmv.is_latest = true
  AND mpo.publication_status = 'PUBLISHED'
  AND (ucr.id IS NULL OR ucr.confidence_status = 'VERIFIED');

-- RLS Enablement
ALTER TABLE public.canonical_fx_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fx_rate_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_conversion_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.normalization_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.normalized_market_values ENABLE ROW LEVEL SECURITY;

-- Grants
CREATE POLICY "Allow public read of active FX sources" ON public.canonical_fx_sources FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read of verified FX rates" ON public.fx_rate_observations FOR SELECT USING (verification_status = 'VERIFIED');
CREATE POLICY "Allow public read of verified unit rules" ON public.unit_conversion_rules FOR SELECT USING (confidence_status = 'VERIFIED');

-- Service role policies (full access)
CREATE POLICY "Service role all canonical_fx_sources" ON public.canonical_fx_sources FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role all fx_rate_observations" ON public.fx_rate_observations FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role all unit_conversion_rules" ON public.unit_conversion_rules FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role all normalization_runs" ON public.normalization_runs FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role all normalized_market_values" ON public.normalized_market_values FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Revoke and re-grant for public view
GRANT SELECT ON public.v_public_normalized_market_prices TO anon, authenticated;
