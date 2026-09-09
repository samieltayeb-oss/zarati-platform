-- R4-B.2: correct the unapplied migration in place. No normalization.
CREATE TYPE public.feed_status AS ENUM ('running','succeeded','partial','failed','quarantined');
CREATE TYPE public.feed_type AS ENUM ('WFP','OPEN_METEO');
CREATE TABLE public.external_feed_executions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), feed_type public.feed_type NOT NULL,
 status public.feed_status NOT NULL DEFAULT 'running', started_at timestamptz NOT NULL DEFAULT now(),
 completed_at timestamptz, records_fetched integer NOT NULL DEFAULT 0,
 records_valid integer NOT NULL DEFAULT 0, records_inserted integer NOT NULL DEFAULT 0,
 records_existing integer NOT NULL DEFAULT 0, records_rejected integer NOT NULL DEFAULT 0,
 records_quarantined integer NOT NULL DEFAULT 0, records_unmapped integer NOT NULL DEFAULT 0,
 source_version text, artifact_id uuid, retrieved_at timestamptz, error_category text,
 CHECK (least(records_fetched,records_valid,records_inserted,records_existing,records_rejected,records_quarantined,records_unmapped)>=0),
 CHECK(records_valid+records_rejected+records_unmapped=records_fetched),
 CHECK(records_inserted+records_existing+records_quarantined<=records_valid),
 CHECK((status='running' AND completed_at IS NULL) OR (status<>'running' AND completed_at>=started_at AND completed_at IS NOT NULL)),
 CHECK(status NOT IN ('succeeded','partial','quarantined') OR records_inserted+records_existing+records_quarantined=records_valid),
 CHECK(status<>'succeeded' OR (records_valid>0 AND records_rejected=0 AND records_quarantined=0 AND error_category IS NULL)),
 CHECK(status<>'quarantined' OR (records_valid>0 AND records_quarantined=records_valid)),
 CHECK(status<>'failed' OR error_category IS NOT NULL)
);
CREATE UNIQUE INDEX feed_one_running ON public.external_feed_executions(feed_type) WHERE status='running';
CREATE INDEX feed_last_success ON public.external_feed_executions(feed_type,completed_at DESC,id DESC) WHERE status='succeeded';
CREATE TABLE public.feed_leases (
 feed_type public.feed_type PRIMARY KEY, execution_id uuid REFERENCES public.external_feed_executions,
 owner_token uuid, acquired_at timestamptz, expires_at timestamptz, next_allowed_at timestamptz NOT NULL DEFAULT '-infinity',
 CHECK ((owner_token IS NULL AND execution_id IS NULL) OR
 (owner_token IS NOT NULL AND execution_id IS NOT NULL AND acquired_at IS NOT NULL AND expires_at IS NOT NULL AND expires_at>acquired_at AND expires_at<=acquired_at+interval '10 minutes'))
);
CREATE TABLE public.feed_artifacts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), feed_type public.feed_type NOT NULL,
 resource_identity text NOT NULL, retrieved_at timestamptz NOT NULL,
 content_sha256 text NOT NULL CHECK(content_sha256 ~ '^[0-9a-f]{64}$'),
 payload text NOT NULL CHECK(octet_length(payload)<=8388608),
 snapshot_id uuid REFERENCES public.raw_ingestion_snapshots,
 UNIQUE(feed_type,resource_identity,content_sha256)
);
CREATE TABLE public.feed_validation_manifests (
 execution_id uuid PRIMARY KEY REFERENCES public.external_feed_executions,
 artifact_id uuid NOT NULL REFERENCES public.feed_artifacts,
 record_keys jsonb NOT NULL CHECK(jsonb_typeof(record_keys)='array' AND jsonb_array_length(record_keys)<=50000),
 records_fetched integer NOT NULL CHECK(records_fetched BETWEEN 0 AND 50000),
 manifest_sha256 text NOT NULL,
 status text NOT NULL CHECK(status IN ('VALIDATED','REJECTED')),
 error_category text,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 CHECK((status='VALIDATED' AND error_category IS NULL AND jsonb_array_length(record_keys)>0) OR (status='REJECTED' AND error_category IS NOT NULL))
);
-- Explicit owner-reviewed completeness attestations. No service/anon/auth write path.
CREATE TABLE public.feed_completeness_approvals (
 content_sha256 text PRIMARY KEY CHECK(content_sha256 ~ '^[0-9a-f]{64}$'),
 records_fetched integer NOT NULL CHECK(records_fetched BETWEEN 1 AND 50000),
 manifest_sha256 text NOT NULL CHECK(manifest_sha256 ~ '^[0-9a-f]{64}$'),
 evidence text NOT NULL CHECK(length(evidence)>20),
 created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
INSERT INTO public.feed_completeness_approvals VALUES
 ('3c00925b7c04192e7170dc5bce13cfaca898b0c1499e9f939540fec19f6cbee4',23225,'9e1db34581a8f954cf72643509fa0c0f0c411246b1227883db771b0d6e18b70d','Pinned public HDX resource 8fea18b2-615f-4af5-9bd5-85cc31a25ffd; complete R4-A 23225 source / 5663 identity reference.',clock_timestamp());
ALTER TABLE public.external_feed_executions ADD FOREIGN KEY(artifact_id) REFERENCES public.feed_artifacts;
CREATE TABLE public.feed_source_changes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), artifact_id uuid NOT NULL REFERENCES public.feed_artifacts,
 source_record_key text NOT NULL, kind text NOT NULL CHECK(kind IN ('CORRECTION','REMOVAL')),
 previous_truth jsonb NOT NULL, incoming_truth jsonb, created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(artifact_id,source_record_key,kind)
);
CREATE TABLE public.weather_observations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), provider text NOT NULL CHECK(provider='OPEN_METEO'),
 artifact_id uuid NOT NULL REFERENCES public.feed_artifacts,
 provider_observation_time timestamptz NOT NULL, retrieved_at timestamptz NOT NULL,
 latitude numeric NOT NULL CHECK(latitude BETWEEN -90 AND 90), longitude numeric NOT NULL CHECK(longitude BETWEEN -180 AND 180),
 requested_latitude numeric NOT NULL CHECK(requested_latitude BETWEEN -90 AND 90), requested_longitude numeric NOT NULL CHECK(requested_longitude BETWEEN -180 AND 180),
 geographic_reference text NOT NULL, model_provenance text NOT NULL, timezone text NOT NULL CHECK(timezone='UTC'),
 interval_seconds integer NOT NULL CHECK(interval_seconds BETWEEN 1 AND 86400),
 forecast_horizon_seconds integer NOT NULL CHECK(forecast_horizon_seconds BETWEEN 0 AND 604800),
 temperature_celsius numeric NOT NULL CHECK(temperature_celsius BETWEEN -100 AND 70),
 precipitation_mm numeric NOT NULL CHECK(precipitation_mm BETWEEN 0 AND 3000),
 relative_humidity_percent numeric NOT NULL CHECK(relative_humidity_percent BETWEEN 0 AND 100),
 wind_speed_kmh numeric NOT NULL CHECK(wind_speed_kmh BETWEEN 0 AND 500),
 temporal_class text NOT NULL CHECK(temporal_class IN ('CURRENT_MODEL_ESTIMATE','FORECAST','HISTORICAL')),
 stale_after_at timestamptz NOT NULL CHECK(stale_after_at>=provider_observation_time),
 source_record_key text NOT NULL, revision_hash text NOT NULL CHECK(revision_hash ~ '^[0-9a-f]{64}$'),
 source_record_raw jsonb NOT NULL, UNIQUE(provider,source_record_key,revision_hash)
);
CREATE INDEX weather_latest ON public.weather_observations(source_record_key,retrieved_at DESC,id DESC);
CREATE FUNCTION public.reject_feed_truth_mutation() RETURNS trigger LANGUAGE plpgsql SET search_path='' AS $$
BEGIN RAISE EXCEPTION 'IMMUTABLE_FEED_TRUTH'; END $$;
CREATE TRIGGER immutable_manifest BEFORE UPDATE OR DELETE ON public.feed_validation_manifests FOR EACH ROW EXECUTE FUNCTION public.reject_feed_truth_mutation();
CREATE TRIGGER immutable_approval BEFORE UPDATE OR DELETE ON public.feed_completeness_approvals FOR EACH ROW EXECUTE FUNCTION public.reject_feed_truth_mutation();
CREATE TRIGGER immutable_weather BEFORE UPDATE OR DELETE ON public.weather_observations FOR EACH ROW EXECUTE FUNCTION public.reject_feed_truth_mutation();
CREATE TRIGGER immutable_artifact BEFORE UPDATE OR DELETE ON public.feed_artifacts FOR EACH ROW EXECUTE FUNCTION public.reject_feed_truth_mutation();
CREATE TRIGGER immutable_change BEFORE UPDATE OR DELETE ON public.feed_source_changes FOR EACH ROW EXECUTE FUNCTION public.reject_feed_truth_mutation();
CREATE FUNCTION public.guard_feed_snapshot() RETURNS trigger LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM public.feed_artifacts WHERE snapshot_id=OLD.id) THEN RAISE EXCEPTION 'IMMUTABLE_FEED_SNAPSHOT'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF; RETURN NEW;
END $$;
CREATE TRIGGER immutable_feed_snapshot BEFORE UPDATE OR DELETE ON public.raw_ingestion_snapshots FOR EACH ROW EXECUTE FUNCTION public.guard_feed_snapshot();
CREATE TABLE public.feed_record_receipts (execution_id uuid NOT NULL REFERENCES public.external_feed_executions, source_record_key text NOT NULL, revision_hash text, PRIMARY KEY(execution_id,source_record_key));
-- Definer safe projection follows migration 025. No raw or operational fields.
CREATE VIEW public.v_public_weather WITH(security_barrier=true) AS
SELECT DISTINCT ON (w.source_record_key) w.id,w.geographic_reference,w.latitude,w.longitude,
 w.provider_observation_time AS valid_time,w.temperature_celsius,w.precipitation_mm,w.relative_humidity_percent,w.wind_speed_kmh,
 w.temporal_class,w.model_provenance,w.interval_seconds,
 (w.temporal_class='HISTORICAL' OR now()>w.stale_after_at OR
 (w.temporal_class='CURRENT_MODEL_ESTIMATE' AND w.provider_observation_time>now()+interval '15 minutes')) AS is_stale
FROM public.weather_observations w JOIN public.feed_record_receipts r ON r.source_record_key=w.source_record_key AND r.revision_hash=w.revision_hash
JOIN public.external_feed_executions e ON e.id=r.execution_id
WHERE e.status='succeeded'
ORDER BY w.source_record_key,e.started_at DESC,e.id DESC,w.id DESC;
CREATE FUNCTION public.acquire_feed(p_feed public.feed_type) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE l public.feed_leases; eid uuid; token uuid:=gen_random_uuid(); stamp timestamptz;
BEGIN
 INSERT INTO public.feed_leases(feed_type) VALUES(p_feed) ON CONFLICT DO NOTHING;
 SELECT * INTO l FROM public.feed_leases WHERE feed_type=p_feed FOR UPDATE;
 IF l.owner_token IS NOT NULL AND l.expires_at>clock_timestamp() THEN RETURN jsonb_build_object('denied','LOCKED'); END IF;
 IF l.next_allowed_at>clock_timestamp() THEN RETURN jsonb_build_object('denied','COOLDOWN'); END IF;
 IF l.execution_id IS NOT NULL THEN UPDATE public.external_feed_executions SET status='failed',completed_at=clock_timestamp(),error_category='LEASE_EXPIRED' WHERE id=l.execution_id AND status='running'; END IF;
 INSERT INTO public.external_feed_executions(feed_type) VALUES(p_feed) RETURNING id INTO eid;
 stamp:=clock_timestamp();
 UPDATE public.feed_leases SET execution_id=eid,owner_token=token,acquired_at=stamp,expires_at=stamp+interval '10 minutes',next_allowed_at=stamp+interval '60 seconds' WHERE feed_type=p_feed;
 RETURN jsonb_build_object('id',eid,'token',token);
END $$;
CREATE FUNCTION public.assert_feed_lease(p_id uuid,p_token uuid) RETURNS public.external_feed_executions LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE e public.external_feed_executions;
BEGIN
 PERFORM 1 FROM public.feed_leases WHERE execution_id=p_id AND owner_token=p_token AND expires_at>clock_timestamp() FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'LEASE_LOST'; END IF;
 SELECT * INTO STRICT e FROM public.external_feed_executions WHERE id=p_id AND status='running' FOR UPDATE; RETURN e;
END $$;
CREATE FUNCTION public.prepare_feed_artifact(p_id uuid,p_token uuid,p_resource text,p_payload text,p_retrieved timestamptz,p_keys jsonb,p_fetched integer,p_dataset uuid DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE e public.external_feed_executions; aid uuid; sid uuid; sha text; mh text; reason text; previous public.feed_validation_manifests;
BEGIN
 e:=public.assert_feed_lease(p_id,p_token);
 sha:=encode(extensions.digest(p_payload,'sha256'),'hex');
 IF e.artifact_id IS NOT NULL THEN
  IF EXISTS(SELECT 1 FROM public.feed_artifacts WHERE id=e.artifact_id AND content_sha256=sha AND resource_identity=p_resource) THEN RETURN e.artifact_id; END IF;
  RAISE EXCEPTION 'ARTIFACT_ALREADY_BOUND';
 END IF;
 IF p_fetched<0 OR p_fetched>50000 OR jsonb_array_length(p_keys)>p_fetched THEN RAISE EXCEPTION 'INVALID_ARTIFACT'; END IF;
 IF e.feed_type='WFP' THEN
  IF p_dataset IS NULL THEN RAISE EXCEPTION 'DATASET_REQUIRED'; END IF;
  INSERT INTO public.raw_ingestion_snapshots(dataset_id,payload_sha256,storage_uri,record_count,ingested_at)
  VALUES(p_dataset,sha,'feed-artifact:sha256:'||sha,p_fetched,p_retrieved) ON CONFLICT(dataset_id,payload_sha256) DO NOTHING;
  SELECT id INTO sid FROM public.raw_ingestion_snapshots WHERE dataset_id=p_dataset AND payload_sha256=sha;
 END IF;
 INSERT INTO public.feed_artifacts(feed_type,resource_identity,retrieved_at,content_sha256,payload,snapshot_id)
 VALUES(e.feed_type,p_resource,p_retrieved,sha,p_payload,sid) ON CONFLICT DO NOTHING;
 SELECT id INTO STRICT aid FROM public.feed_artifacts WHERE feed_type=e.feed_type AND resource_identity=p_resource AND content_sha256=sha;
 SELECT encode(extensions.digest(coalesce(string_agg(k,E'\n' ORDER BY k COLLATE "C"),''),'sha256'),'hex') INTO mh FROM jsonb_array_elements_text(p_keys) k;
 IF p_fetched=0 OR jsonb_array_length(p_keys)=0 THEN reason:='VALIDATION_FAILED';
 ELSIF EXISTS(SELECT 1 FROM public.feed_validation_manifests WHERE artifact_id=aid AND status='VALIDATED' AND (manifest_sha256<>mh OR records_fetched<>p_fetched)) THEN reason:='MANIFEST_CONFLICT';
 ELSIF e.feed_type='WFP' AND NOT EXISTS(SELECT 1 FROM public.feed_completeness_approvals WHERE content_sha256=sha AND records_fetched=p_fetched AND manifest_sha256=mh) THEN
  SELECT m.* INTO previous FROM public.feed_validation_manifests m JOIN public.external_feed_executions x ON x.id=m.execution_id
   WHERE x.feed_type='WFP' AND x.status IN ('succeeded','partial','quarantined') AND m.status='VALIDATED' ORDER BY x.completed_at DESC,x.id DESC LIMIT 1;
  IF previous.execution_id IS NULL THEN reason:='UNTRUSTED_INITIAL_ARTIFACT';
  ELSIF p_fetched<previous.records_fetched OR NOT p_keys @> previous.record_keys THEN reason:='SUSPICIOUS_SOURCE_REDUCTION'; END IF;
 END IF;
 INSERT INTO public.feed_validation_manifests(execution_id,artifact_id,record_keys,records_fetched,manifest_sha256,status,error_category)
 VALUES(p_id,aid,p_keys,p_fetched,mh,CASE WHEN reason IS NULL THEN 'VALIDATED' ELSE 'REJECTED' END,reason);
 UPDATE public.external_feed_executions SET artifact_id=aid,source_version=sha,retrieved_at=p_retrieved,records_fetched=p_fetched,records_valid=jsonb_array_length(p_keys),records_unmapped=p_fetched-jsonb_array_length(p_keys) WHERE id=p_id;
 RETURN aid;
END $$;
CREATE TABLE public.feed_batch_receipts (execution_id uuid NOT NULL REFERENCES public.external_feed_executions, batch integer NOT NULL CHECK(batch BETWEEN 0 AND 199), payload_hash text NOT NULL, PRIMARY KEY(execution_id,batch));
CREATE FUNCTION public.stage_feed_batch(p_id uuid,p_token uuid,p_rows jsonb,p_batch integer) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE e public.external_feed_executions; a public.feed_artifacts; manifest public.feed_validation_manifests; r jsonb; oldrow public.market_price_observations; ins integer; existing integer:=0; inserted integer:=0; quarantined integer:=0;
BEGIN
 e:=public.assert_feed_lease(p_id,p_token); SELECT * INTO STRICT a FROM public.feed_artifacts WHERE id=e.artifact_id;
 SELECT * INTO STRICT manifest FROM public.feed_validation_manifests WHERE execution_id=p_id;
 IF manifest.status<>'VALIDATED' THEN RAISE EXCEPTION 'MANIFEST_NOT_VALIDATED'; END IF;
 IF EXISTS(SELECT 1 FROM public.feed_batch_receipts WHERE execution_id=p_id AND batch=p_batch AND payload_hash=encode(extensions.digest(p_rows::text,'sha256'),'hex')) THEN RETURN; END IF;
 INSERT INTO public.feed_batch_receipts VALUES(p_id,p_batch,encode(extensions.digest(p_rows::text,'sha256'),'hex'));
 IF jsonb_array_length(p_rows) NOT BETWEEN 1 AND 250 THEN RAISE EXCEPTION 'BATCH_BOUND'; END IF;
 FOR r IN SELECT value FROM jsonb_array_elements(p_rows) LOOP
  IF NOT manifest.record_keys ? (r->>'source_record_key') THEN RAISE EXCEPTION 'ARTIFACT_KEY_MISMATCH'; END IF;
  INSERT INTO public.feed_record_receipts VALUES(p_id,r->>'source_record_key',r->>'revision_hash');
  IF e.feed_type='WFP' THEN
   IF NOT EXISTS(SELECT 1 FROM public.raw_ingestion_snapshots snap JOIN public.canonical_datasets ds ON ds.id=snap.dataset_id WHERE snap.id=a.snapshot_id AND ds.id=(r->>'dataset_id')::uuid AND ds.source_id=(r->>'source_id')::uuid) THEN RAISE EXCEPTION 'SNAPSHOT_DATASET_MISMATCH'; END IF;
   SELECT * INTO oldrow FROM public.market_price_observations WHERE source_id=(r->>'source_id')::uuid AND source_record_key=r->>'source_record_key';
   IF coalesce((r->>'mapping_review')::boolean,false) THEN
    INSERT INTO public.feed_source_changes(artifact_id,source_record_key,kind,previous_truth,incoming_truth) VALUES(a.id,r->>'source_record_key','CORRECTION',coalesce(to_jsonb(oldrow),'{}'::jsonb),r) ON CONFLICT DO NOTHING;
    quarantined:=quarantined+1;
   ELSIF FOUND THEN
    IF (oldrow.source_record_raw::jsonb->>'row') IS DISTINCT FROM ((r->>'source_record_raw')::jsonb->>'row') OR oldrow.raw_currency_text IS DISTINCT FROM r->>'raw_currency_text' THEN
     INSERT INTO public.feed_source_changes(artifact_id,source_record_key,kind,previous_truth,incoming_truth) VALUES(a.id,r->>'source_record_key','CORRECTION',to_jsonb(oldrow),r) ON CONFLICT DO NOTHING;
     quarantined:=quarantined+1;
    ELSE existing:=existing+1; END IF;
   ELSE
    INSERT INTO public.market_price_observations(source_id,dataset_id,raw_snapshot_id,commodity_id,market_id,source_record_key,source_record_raw,raw_price_text,parsed_price_numeric,raw_currency_text,canonical_currency_code,raw_unit_text,price_type,observed_at,stale_after_at,temporal_precision,verification_state,publication_status,ingestion_method,temporal_class,source_provenance,derivation_class)
    VALUES((r->>'source_id')::uuid,(r->>'dataset_id')::uuid,a.snapshot_id,(r->>'commodity_id')::uuid,(r->>'market_id')::uuid,r->>'source_record_key',r->>'source_record_raw',r->>'raw_price_text',(r->>'parsed_price_numeric')::numeric,r->>'raw_currency_text',r->>'raw_currency_text',r->>'raw_unit_text',(r->>'price_type')::public.price_type_enum,(r->>'observed_at')::timestamptz,(r->>'stale_after_at')::timestamptz,'CALENDAR_DAY','unassessed','INGESTED','automated_feed','historical_archive','market_reported','reported_survey');
    inserted:=inserted+1;
   END IF;
  ELSE
   INSERT INTO public.weather_observations SELECT (jsonb_populate_record(NULL::public.weather_observations,r||jsonb_build_object('id',gen_random_uuid(),'artifact_id',a.id))).* ON CONFLICT(provider,source_record_key,revision_hash) DO NOTHING;
   GET DIAGNOSTICS ins=ROW_COUNT; inserted:=inserted+ins; existing:=existing+1-ins;
  END IF;
 END LOOP;
 UPDATE public.external_feed_executions SET records_inserted=records_inserted+inserted,records_existing=records_existing+existing,records_quarantined=records_quarantined+quarantined WHERE id=p_id;
END $$;
CREATE FUNCTION public.finish_feed(p_id uuid,p_token uuid,p_error text DEFAULT NULL) RETURNS public.external_feed_executions LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE e public.external_feed_executions; a public.feed_validation_manifests; prev public.feed_validation_manifests; state public.feed_status;
BEGIN
 e:=public.assert_feed_lease(p_id,p_token);
 IF p_error IS NOT NULL THEN state:='failed';
 ELSIF NOT EXISTS(SELECT 1 FROM public.feed_validation_manifests WHERE execution_id=p_id AND status='VALIDATED') THEN p_error:='MANIFEST_NOT_VALIDATED';state:='failed';
 ELSIF e.records_valid=0 OR e.records_inserted+e.records_existing+e.records_quarantined<>e.records_valid OR (SELECT count(*) FROM public.feed_record_receipts WHERE execution_id=p_id)<>e.records_valid THEN p_error:='VERIFICATION_FAILED';state:='failed';
 ELSIF e.records_quarantined=e.records_valid THEN state:='quarantined';
 ELSIF e.records_quarantined>0 OR e.records_rejected>0 THEN state:='partial';
 ELSE state:='succeeded'; END IF;
 IF p_error IS NULL AND e.feed_type='WFP' THEN
  SELECT * INTO a FROM public.feed_validation_manifests WHERE execution_id=p_id;
  SELECT fa.* INTO prev FROM public.external_feed_executions x JOIN public.feed_validation_manifests fa ON fa.execution_id=x.id
   WHERE x.feed_type='WFP' AND x.status IN ('succeeded','partial','quarantined') AND fa.status='VALIDATED' AND x.id<>e.id ORDER BY x.completed_at DESC,x.id DESC LIMIT 1;
  IF prev.artifact_id IS NOT NULL AND prev.artifact_id<>a.artifact_id THEN
   INSERT INTO public.feed_source_changes(artifact_id,source_record_key,kind,previous_truth)
    SELECT a.artifact_id,k,'REMOVAL',jsonb_build_object('artifact_id',prev.artifact_id,'validation_execution_id',prev.execution_id) FROM jsonb_array_elements_text(prev.record_keys) k WHERE NOT a.record_keys ? k ON CONFLICT DO NOTHING;
  END IF;
 END IF;
 UPDATE public.external_feed_executions SET status=state,completed_at=clock_timestamp(),error_category=p_error WHERE id=p_id RETURNING * INTO e;
 UPDATE public.feed_leases SET owner_token=NULL,execution_id=NULL,next_allowed_at=clock_timestamp()+CASE WHEN e.feed_type='WFP' THEN interval '6 hours' ELSE interval '1 hour' END WHERE execution_id=p_id AND owner_token=p_token;
 RETURN e;
END $$;
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['feed_validation_manifests','feed_completeness_approvals','external_feed_executions','feed_leases','feed_artifacts','feed_source_changes','weather_observations','feed_batch_receipts','feed_record_receipts'] LOOP
 EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
 EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC,anon,authenticated,service_role',t);
 EXECUTE format('GRANT SELECT ON public.%I TO service_role',t);
 END LOOP;
END $$;
REVOKE ALL ON public.v_public_weather FROM PUBLIC,anon,authenticated,service_role;
GRANT SELECT ON public.v_public_weather TO anon,authenticated,service_role;
REVOKE ALL ON FUNCTION public.acquire_feed(public.feed_type), public.assert_feed_lease(uuid,uuid), public.prepare_feed_artifact(uuid,uuid,text,text,timestamptz,jsonb,integer,uuid), public.stage_feed_batch(uuid,uuid,jsonb,integer), public.finish_feed(uuid,uuid,text), public.reject_feed_truth_mutation(),public.guard_feed_snapshot() FROM PUBLIC,anon,authenticated,service_role;
GRANT EXECUTE ON FUNCTION public.acquire_feed(public.feed_type), public.prepare_feed_artifact(uuid,uuid,text,text,timestamptz,jsonb,integer,uuid), public.stage_feed_batch(uuid,uuid,jsonb,integer), public.finish_feed(uuid,uuid,text) TO service_role;

-- Local adversarial verification found 026 protects UPDATE but not INSERT.
-- Close only those creation-state bypasses; preserve the existing state machine.
CREATE FUNCTION public.guard_initial_marketplace_state() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF auth.jwt()->>'role'='service_role' OR public.is_admin() THEN RETURN NEW; END IF;
 IF TG_TABLE_NAME='listings' THEN
  IF NEW.moderation_status<>'pending' OR NEW.status NOT IN ('draft','pending_review') THEN
   RAISE EXCEPTION 'Initial listing state must await moderation';
  END IF;
 ELSE
  IF NEW.status<>'pending' THEN RAISE EXCEPTION 'Initial inquiry state must be pending'; END IF;
  IF NEW.buyer_id=NEW.seller_id OR NOT EXISTS(SELECT 1 FROM public.listings WHERE id=NEW.listing_id AND user_id=NEW.seller_id) THEN
   RAISE EXCEPTION 'Invalid inquiry parties';
  END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER guard_initial_listing BEFORE INSERT ON public.listings FOR EACH ROW EXECUTE FUNCTION public.guard_initial_marketplace_state();
CREATE TRIGGER guard_initial_inquiry BEFORE INSERT ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.guard_initial_marketplace_state();
REVOKE ALL ON FUNCTION public.guard_initial_marketplace_state() FROM PUBLIC,anon,authenticated,service_role;
