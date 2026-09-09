-- R4-B.13: founder-authorized single replay after the successful MET Norway canary.
-- No weather/WFP truth changes, provider requests, or recurring schedule activation.
BEGIN ISOLATION LEVEL SERIALIZABLE;
DO $$
DECLARE e public.external_feed_executions; l public.feed_leases;
BEGIN
 IF clock_timestamp() NOT BETWEEN '2026-09-09T18:00:01Z' AND '2026-09-09T18:40:00Z' THEN RAISE EXCEPTION 'R4B13_WINDOW'; END IF;
 SELECT * INTO STRICT e FROM public.external_feed_executions WHERE id='c92d556f-21a3-4c5b-91e4-149b0e0bc2a0';
 IF e.feed_type::text<>'MET_NORWAY' OR e.status<>'succeeded' OR e.records_fetched<>48 OR e.records_valid<>48 OR e.records_inserted<>48 OR e.records_existing<>0 OR e.records_rejected<>0 OR e.records_quarantined<>0 OR e.error_category IS NOT NULL OR e.artifact_id<>'5e744233-65cd-43a4-bf9d-f8192a37e55d' THEN RAISE EXCEPTION 'R4B13_CANARY'; END IF;
 IF (SELECT count(*) FROM public.external_feed_executions WHERE feed_type::text='MET_NORWAY')<>1 OR (SELECT count(*) FROM public.external_feed_executions WHERE feed_type='WFP')<>4 OR EXISTS(SELECT 1 FROM public.external_feed_executions WHERE status='running') THEN RAISE EXCEPTION 'R4B13_EXECUTIONS'; END IF;
 IF (SELECT count(*) FROM public.weather_observations WHERE provider='MET_NORWAY')<>48 OR (SELECT count(*) FROM public.weather_observations WHERE provider='OPEN_METEO')<>49 THEN RAISE EXCEPTION 'R4B13_WEATHER'; END IF;
 IF (SELECT count(*) FROM public.market_price_observations WHERE source_id=(SELECT id FROM public.canonical_sources WHERE code='SRC_WFP_VAM'))<>5666 OR (SELECT count(*) FROM public.market_price_observations WHERE source_id=(SELECT id FROM public.canonical_sources WHERE code='SRC_WFP_VAM') AND superseded_by IS NULL)<>5663 OR (SELECT count(*) FROM public.v_approved_market_prices WHERE source_code='SRC_WFP_VAM')<>102 THEN RAISE EXCEPTION 'R4B13_WFP'; END IF;
 SELECT * INTO STRICT l FROM public.feed_leases WHERE feed_type::text='MET_NORWAY' FOR UPDATE;
 IF l.owner_token IS NOT NULL OR l.execution_id IS NOT NULL OR l.next_allowed_at<>'2026-09-09T19:00:01.651667Z'::timestamptz THEN RAISE EXCEPTION 'R4B13_LEASE_OR_REAPPLICATION'; END IF;
END $$;
WITH prior AS (SELECT next_allowed_at FROM public.feed_leases WHERE feed_type::text='MET_NORWAY'),
changed AS (UPDATE public.feed_leases SET next_allowed_at=clock_timestamp() WHERE feed_type::text='MET_NORWAY' RETURNING next_allowed_at)
SELECT prior.next_allowed_at AS previous_next_allowed_at,changed.next_allowed_at AS replay_admitted_at FROM prior,changed;
COMMIT;
