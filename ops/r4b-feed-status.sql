-- Read-only private operator view of R4-B status. Run with an authorized DB role.
BEGIN READ ONLY;
SELECT f.feed_type,
 (SELECT to_jsonb(e) FROM public.external_feed_executions e WHERE e.feed_type=f.feed_type ORDER BY started_at DESC LIMIT 1) AS last_execution,
 (SELECT to_jsonb(e) FROM public.external_feed_executions e WHERE e.feed_type=f.feed_type AND status='succeeded' ORDER BY completed_at DESC LIMIT 1) AS last_success,
 (SELECT jsonb_build_object('active',owner_token IS NOT NULL,'execution_id',execution_id,'expires_at',expires_at,'next_allowed_at',next_allowed_at) FROM public.feed_leases l WHERE l.feed_type=f.feed_type) AS lease,
 (SELECT count(*) FROM public.external_feed_executions e WHERE e.feed_type=f.feed_type AND status IN ('failed','partial','quarantined')) AS unsuccessful_executions,
 (SELECT count(*) FROM public.external_feed_executions e WHERE e.feed_type=f.feed_type AND status='running') AS running_executions,
 CASE WHEN f.feed_type='OPEN_METEO' THEN (SELECT jsonb_build_object('evaluated_at',now(),'latest_valid_time',max(valid_time),'fresh_current',count(*) FILTER(WHERE temporal_class='CURRENT_MODEL_ESTIMATE' AND NOT is_stale),'future_fresh_forecasts',count(*) FILTER(WHERE temporal_class='FORECAST' AND NOT is_stale AND valid_time>=now()),'stale_rows',count(*) FILTER(WHERE is_stale)) FROM public.v_public_weather) END AS weather_freshness
FROM unnest(ARRAY['WFP'::public.feed_type,'OPEN_METEO'::public.feed_type]) f(feed_type);
ROLLBACK;
