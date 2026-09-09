-- R4-B.9 ONLY: manually admit the two Founder-authorized executions before the
-- ordinary six-hour cooldown. This never acquires/releases a live lease, invokes
-- ingestion, enables a gate, or changes the normal acquire/finish functions.
-- Run once before the canary and once before replay. Any third execution blocks it.
-- Save the returned old/new admission timestamps in the repair evidence.
BEGIN ISOLATION LEVEL SERIALIZABLE;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='15s';
CREATE TEMP TABLE r4b9_admission_result(previous_next_allowed_at timestamptz, admitted_at timestamptz, ordinal integer) ON COMMIT DROP;
DO $$
DECLARE lease public.feed_leases; latest public.external_feed_executions; n integer; stamp timestamptz;
BEGIN
 SELECT * INTO STRICT lease FROM public.feed_leases WHERE feed_type='WFP' FOR UPDATE;
 SELECT count(*) INTO n FROM public.external_feed_executions WHERE feed_type='WFP';
 SELECT * INTO STRICT latest FROM public.external_feed_executions WHERE feed_type='WFP' ORDER BY started_at DESC,id DESC LIMIT 1;
 IF n NOT IN (1,2) OR lease.owner_token IS NOT NULL OR lease.execution_id IS NOT NULL
  OR EXISTS(SELECT 1 FROM public.external_feed_executions WHERE status='running' OR feed_type='OPEN_METEO')
  OR (SELECT count(*) FROM public.observation_supersessions WHERE repair_version='R4-B.9-WFP-three-row-v1')<>3
  OR (SELECT count(*) FROM public.feed_source_changes)<>3
  OR (SELECT count(*) FROM public.weather_observations)<>0
  OR (SELECT count(*) FROM public.v_approved_market_prices WHERE source_code='SRC_WFP_VAM')<>102
  OR NOT EXISTS(SELECT 1 FROM public.external_feed_executions WHERE id='0936b53a-29aa-496d-a7df-5179acdfc59f' AND status='partial' AND records_quarantined=3)
  OR (n=1 AND latest.id<>'0936b53a-29aa-496d-a7df-5179acdfc59f'::uuid)
  OR (n=2 AND (latest.status<>'succeeded' OR latest.records_inserted<>0 OR latest.records_quarantined<>0 OR latest.records_existing<>5663 OR latest.records_fetched<>23225))
 THEN RAISE EXCEPTION 'R4B9_CONTROLLED_ADMISSION_PRECONDITION_FAILED'; END IF;
 stamp:=clock_timestamp();
 UPDATE public.feed_leases SET next_allowed_at=stamp WHERE feed_type='WFP';
 INSERT INTO r4b9_admission_result VALUES(lease.next_allowed_at,stamp,n);
END $$;
SELECT * FROM r4b9_admission_result;
COMMIT;
