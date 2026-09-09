-- R4-B.12: additive provider support. No historical weather or WFP data mutation.
ALTER TYPE public.feed_type ADD VALUE IF NOT EXISTS 'MET_NORWAY';
ALTER TABLE public.weather_observations DROP CONSTRAINT weather_observations_provider_check;
ALTER TABLE public.weather_observations ADD CONSTRAINT weather_observations_provider_check CHECK(provider IN ('OPEN_METEO','MET_NORWAY'));

-- Mutable transport cache only; immutable artifacts and observations remain the source evidence.
CREATE TABLE public.met_norway_http_cache (
 resource text PRIMARY KEY CHECK(resource='https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=14.04&lon=35.38'),
 payload text CHECK(octet_length(payload)<=8388608),
 fetched_at timestamptz, checked_at timestamptz NOT NULL,
 last_modified text, expires_at timestamptz NOT NULL, next_request_at timestamptz NOT NULL,
 CHECK ((payload IS NULL AND fetched_at IS NULL AND last_modified IS NULL) OR
        (payload IS NOT NULL AND fetched_at IS NOT NULL AND last_modified IS NOT NULL))
);
ALTER TABLE public.met_norway_http_cache ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.met_norway_http_cache FROM PUBLIC,anon,authenticated,service_role;
GRANT SELECT,INSERT,UPDATE ON public.met_norway_http_cache TO service_role;

-- Enforce provider/artifact identity without replacing the existing WFP staging function.
CREATE FUNCTION public.guard_weather_provider() RETURNS trigger LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.feed_artifacts a WHERE a.id=NEW.artifact_id AND a.feed_type::text=NEW.provider) THEN
  RAISE EXCEPTION 'WEATHER_PROVIDER_ARTIFACT_MISMATCH';
 END IF;
 IF NEW.provider='MET_NORWAY' AND (NEW.temporal_class<>'FORECAST' OR (NEW.source_record_raw->>'provider') IS DISTINCT FROM 'MET_NORWAY' OR NEW.source_record_key NOT LIKE 'MET_NORWAY_%') THEN
  RAISE EXCEPTION 'MET_FORECAST_PROVENANCE_REQUIRED';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER weather_provider_boundary BEFORE INSERT ON public.weather_observations FOR EACH ROW EXECUTE FUNCTION public.guard_weather_provider();
REVOKE ALL ON FUNCTION public.guard_weather_provider() FROM PUBLIC,anon,authenticated,service_role;

-- Append safe credit/semantics fields. Existing columns and old observation attribution remain intact.
CREATE OR REPLACE VIEW public.v_public_weather WITH(security_barrier=true) AS
SELECT DISTINCT ON (w.source_record_key) w.id,w.geographic_reference,w.latitude,w.longitude,
 w.provider_observation_time AS valid_time,w.temperature_celsius,w.precipitation_mm,w.relative_humidity_percent,w.wind_speed_kmh,
 w.temporal_class,w.model_provenance,w.interval_seconds,
 (w.temporal_class='HISTORICAL' OR now()>w.stale_after_at OR
 (w.temporal_class='CURRENT_MODEL_ESTIMATE' AND w.provider_observation_time>now()+interval '15 minutes')) AS is_stale,
 w.provider,w.retrieved_at,w.timezone,w.requested_latitude,w.requested_longitude,w.forecast_horizon_seconds,
 CASE WHEN w.provider='MET_NORWAY' THEN 'Data from MET Norway' ELSE 'Data from Open-Meteo' END AS attribution,
 CASE WHEN w.provider='MET_NORWAY' THEN 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=14.04&lon=35.38' ELSE 'https://open-meteo.com/' END AS source_url,
 'https://creativecommons.org/licenses/by/4.0/'::text AS license_url,
 CASE WHEN w.provider='MET_NORWAY' THEN 'Forecast subset; wind converted from m/s to km/h. Precipitation is the sum over the following interval. No station observations.' ELSE 'Open-Meteo model data; original canary units retained.' END AS processing_note,
 CASE WHEN w.provider='MET_NORWAY' THEN w.provider_observation_time ELSE w.provider_observation_time-make_interval(secs=>w.interval_seconds) END AS precipitation_period_start,
 CASE WHEN w.provider='MET_NORWAY' THEN w.provider_observation_time+make_interval(secs=>w.interval_seconds) ELSE w.provider_observation_time END AS precipitation_period_end
FROM public.weather_observations w JOIN public.feed_record_receipts r ON r.source_record_key=w.source_record_key AND r.revision_hash=w.revision_hash
JOIN public.external_feed_executions e ON e.id=r.execution_id
WHERE e.status='succeeded'
ORDER BY w.source_record_key,e.started_at DESC,e.id DESC,w.id DESC;
REVOKE ALL ON public.v_public_weather FROM PUBLIC,anon,authenticated,service_role;
GRANT SELECT ON public.v_public_weather TO anon,authenticated,service_role;
