-- Migration 027: R4-B Infrastructure (External Feeds & Weather)

CREATE TYPE public.feed_status AS ENUM (
    'scheduled',
    'running',
    'succeeded',
    'partial',
    'failed',
    'quarantined'
);

CREATE TYPE public.feed_type AS ENUM (
    'WFP',
    'OPEN_METEO'
);

CREATE TABLE public.external_feed_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feed_type public.feed_type NOT NULL,
    dataset_identifier TEXT,
    status public.feed_status NOT NULL DEFAULT 'scheduled',
    scheduled_for TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    records_fetched INTEGER DEFAULT 0,
    records_valid INTEGER DEFAULT 0,
    records_inserted INTEGER DEFAULT 0,
    records_existing INTEGER DEFAULT 0,
    records_rejected INTEGER DEFAULT 0,
    records_quarantined INTEGER DEFAULT 0,
    source_version TEXT,
    error_category TEXT,
    error_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.weather_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    provider_observation_time TIMESTAMPTZ NOT NULL,
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    geographic_reference TEXT,
    temperature_celsius NUMERIC,
    precipitation_mm NUMERIC,
    relative_humidity_percent NUMERIC,
    wind_speed_kmh NUMERIC,
    weather_classification TEXT,
    temporal_class TEXT NOT NULL CHECK (temporal_class IN ('CURRENT_OBSERVED', 'FORECAST', 'HISTORICAL')),
    stale_after_at TIMESTAMPTZ,
    source_record_key TEXT NOT NULL,
    source_record_raw JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(provider, source_record_key)
);

ALTER TABLE public.external_feed_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_observations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to weather" ON public.weather_observations FOR SELECT USING (true);
CREATE POLICY "Allow service role full access to weather" ON public.weather_observations FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Allow service role full access to executions" ON public.external_feed_executions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE FUNCTION public.trg_protect_weather_immutability()
RETURNS TRIGGER AS $$
BEGIN
    IF current_setting('session_replication_role', 't') = 'replica' THEN
        RETURN NEW;
    END IF;
    IF auth.jwt() ->> 'role' != 'service_role' THEN
       RAISE EXCEPTION 'Weather observations are immutable.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER protect_weather_immutability
BEFORE UPDATE OR DELETE ON public.weather_observations
FOR EACH ROW EXECUTE FUNCTION public.trg_protect_weather_immutability();
