-- Founder-authorized R4-B.10: one immediate replay of the successful weather canary.
-- No provider call, lease acquisition, truth mutation, or scheduling change.
BEGIN ISOLATION LEVEL SERIALIZABLE;
DO $$
DECLARE e public.external_feed_executions; l public.feed_leases;
BEGIN
 IF clock_timestamp() NOT BETWEEN '2026-09-09T14:50:21Z' AND '2026-09-09T15:20:00Z' THEN RAISE EXCEPTION 'R4B10_WINDOW'; END IF;
 SELECT * INTO STRICT e FROM public.external_feed_executions WHERE id='fd408f25-81cd-4fc4-b547-dbb05d9dd8d0';
 IF e.feed_type<>'OPEN_METEO' OR e.status<>'succeeded' OR e.records_fetched<>49 OR e.records_valid<>49 OR e.records_inserted<>49 OR e.records_existing<>0 OR e.records_rejected<>0 OR e.records_quarantined<>0 OR e.error_category IS NOT NULL OR e.artifact_id<>'64bd66e4-16d2-4602-af5a-f71dba667b79' THEN RAISE EXCEPTION 'R4B10_CANARY'; END IF;
 IF (SELECT count(*) FROM public.external_feed_executions WHERE feed_type='OPEN_METEO')<>1 OR (SELECT count(*) FROM public.external_feed_executions WHERE feed_type='WFP')<>3 OR EXISTS(SELECT 1 FROM public.external_feed_executions WHERE status='running') THEN RAISE EXCEPTION 'R4B10_EXECUTIONS'; END IF;
 IF (SELECT count(*) FROM public.weather_observations)<>49 OR (SELECT count(*) FROM public.v_public_weather)<>49 THEN RAISE EXCEPTION 'R4B10_WEATHER'; END IF;
 IF (SELECT count(*) FROM public.market_price_observations WHERE source_id=(SELECT id FROM public.canonical_sources WHERE code='SRC_WFP_VAM'))<>5666 OR (SELECT count(*) FROM public.market_price_observations WHERE source_id=(SELECT id FROM public.canonical_sources WHERE code='SRC_WFP_VAM') AND superseded_by IS NULL)<>5663 OR (SELECT count(*) FROM public.v_approved_market_prices WHERE source_code='SRC_WFP_VAM')<>102 THEN RAISE EXCEPTION 'R4B10_WFP'; END IF;
 SELECT * INTO STRICT l FROM public.feed_leases WHERE feed_type='OPEN_METEO' FOR UPDATE;
 IF l.owner_token IS NOT NULL OR l.execution_id IS NOT NULL OR l.next_allowed_at<>'2026-09-09T15:50:21.658859Z'::timestamptz THEN RAISE EXCEPTION 'R4B10_LEASE_OR_REAPPLICATION'; END IF;
END $$;
WITH prior AS (SELECT next_allowed_at FROM public.feed_leases WHERE feed_type='OPEN_METEO'),
changed AS (UPDATE public.feed_leases SET next_allowed_at=clock_timestamp() WHERE feed_type='OPEN_METEO' RETURNING next_allowed_at)
SELECT prior.next_allowed_at AS previous_next_allowed_at,changed.next_allowed_at AS replay_admitted_at FROM prior,changed;
COMMIT;
