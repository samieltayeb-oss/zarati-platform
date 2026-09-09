-- R4-B.9: retain misidentified history while restoring one current representation.
-- No data repair is performed by this migration. The separately reviewed repair
-- artifact is required. Existing source fields and migrations 001-028 stay intact.
ALTER TABLE public.market_price_observations ADD COLUMN superseded_by uuid
 REFERENCES public.market_price_observations(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE public.market_price_observations ADD CONSTRAINT mpo_superseded_retracted
 CHECK (superseded_by IS NULL OR (superseded_by<>id AND publication_status='RETRACTED'));
ALTER TABLE public.market_price_observations DROP CONSTRAINT uq_mpo_source_record_key;
CREATE UNIQUE INDEX uq_mpo_current_source_record_key
 ON public.market_price_observations(source_id,source_record_key) WHERE superseded_by IS NULL;

CREATE TABLE public.observation_supersessions (
 old_observation_id uuid PRIMARY KEY REFERENCES public.market_price_observations(id),
 replacement_observation_id uuid NOT NULL UNIQUE REFERENCES public.market_price_observations(id) DEFERRABLE INITIALLY DEFERRED,
 provenance_observation_id uuid NOT NULL REFERENCES public.market_price_observations(id),
 conflict_id uuid NOT NULL UNIQUE REFERENCES public.feed_source_changes(id),
 artifact_id uuid NOT NULL REFERENCES public.feed_artifacts(id),
 old_truth jsonb NOT NULL CHECK (jsonb_typeof(old_truth)='object'),
 provenance_truth jsonb NOT NULL CHECK (jsonb_typeof(provenance_truth)='object'),
 reason text NOT NULL CHECK (length(reason)>=30),
 repair_version text NOT NULL CHECK (length(repair_version)>=10),
 repaired_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 repaired_by name NOT NULL DEFAULT current_user,
 CHECK(old_observation_id<>replacement_observation_id AND old_observation_id<>provenance_observation_id AND replacement_observation_id<>provenance_observation_id)
);
ALTER TABLE public.observation_supersessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.observation_supersessions FROM PUBLIC,anon,authenticated,service_role;
GRANT SELECT ON public.observation_supersessions TO service_role;
CREATE TRIGGER immutable_supersession BEFORE UPDATE OR DELETE ON public.observation_supersessions
 FOR EACH ROW EXECUTE FUNCTION public.reject_feed_truth_mutation();

CREATE FUNCTION public.guard_observation_supersession() RETURNS trigger
 LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF TG_OP='INSERT' THEN
  IF NEW.superseded_by IS NOT NULL THEN RAISE EXCEPTION 'SUPERSESSION_REQUIRES_EXISTING_HISTORY'; END IF;
 ELSE
  IF OLD.superseded_by IS NOT NULL AND NEW IS DISTINCT FROM OLD THEN
   RAISE EXCEPTION 'SUPERSEDED_HISTORY_IMMUTABLE';
  END IF;
  IF NEW.superseded_by IS DISTINCT FROM OLD.superseded_by AND NOT EXISTS (
   SELECT 1 FROM public.observation_supersessions s WHERE s.old_observation_id=OLD.id
    AND s.replacement_observation_id=NEW.superseded_by
    AND s.old_truth->>'source_record_key'=OLD.source_record_key
  ) THEN RAISE EXCEPTION 'SUPERSESSION_AUDIT_REQUIRED'; END IF;
  IF EXISTS(SELECT 1 FROM public.observation_supersessions s WHERE s.replacement_observation_id=OLD.id)
   AND (NEW.source_record_raw IS DISTINCT FROM OLD.source_record_raw
    OR NEW.raw_snapshot_id IS DISTINCT FROM OLD.raw_snapshot_id
    OR NEW.parsed_price_numeric IS DISTINCT FROM OLD.parsed_price_numeric
    OR NEW.price_type IS DISTINCT FROM OLD.price_type) THEN
   RAISE EXCEPTION 'REPLACEMENT_SOURCE_IMMUTABLE';
  END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER guard_observation_supersession BEFORE INSERT OR UPDATE ON public.market_price_observations
 FOR EACH ROW EXECUTE FUNCTION public.guard_observation_supersession();

-- Deferred proof allows atomic audit -> retraction -> replacement, with no gap at COMMIT.
CREATE FUNCTION public.verify_observation_supersession() RETURNS trigger
 LANGUAGE plpgsql SET search_path='' AS $$
DECLARE oldrow public.market_price_observations; replacement public.market_price_observations;
 companion public.market_price_observations; conflict public.feed_source_changes; artifact public.feed_artifacts;
BEGIN
 SELECT * INTO STRICT oldrow FROM public.market_price_observations WHERE id=NEW.old_observation_id;
 SELECT * INTO STRICT replacement FROM public.market_price_observations WHERE id=NEW.replacement_observation_id;
 SELECT * INTO STRICT companion FROM public.market_price_observations WHERE id=NEW.provenance_observation_id;
 SELECT * INTO STRICT conflict FROM public.feed_source_changes WHERE id=NEW.conflict_id;
 SELECT * INTO STRICT artifact FROM public.feed_artifacts WHERE id=NEW.artifact_id;
 IF oldrow.superseded_by IS DISTINCT FROM replacement.id OR oldrow.publication_status<>'RETRACTED'
  OR replacement.superseded_by IS NOT NULL OR replacement.publication_status<>'INGESTED'
  OR replacement.verification_state<>'unassessed'
  OR replacement.source_id<>oldrow.source_id OR replacement.dataset_id IS DISTINCT FROM oldrow.dataset_id
  OR replacement.source_record_key<>oldrow.source_record_key
  OR replacement.raw_snapshot_id IS DISTINCT FROM artifact.snapshot_id
  OR conflict.artifact_id<>artifact.id OR conflict.kind<>'CORRECTION'
  OR conflict.source_record_key<>oldrow.source_record_key
  OR (conflict.previous_truth-'superseded_by') IS DISTINCT FROM (NEW.old_truth-'superseded_by')
  OR (to_jsonb(oldrow)-ARRAY['superseded_by','publication_status','retraction_rationale']) IS DISTINCT FROM
     (NEW.old_truth-ARRAY['superseded_by','publication_status','retraction_rationale'])
  OR to_jsonb(companion) IS DISTINCT FROM NEW.provenance_truth
  OR companion.superseded_by IS NOT NULL OR companion.source_id<>oldrow.source_id
  OR companion.source_record_raw::jsonb IS DISTINCT FROM oldrow.source_record_raw::jsonb
  OR (replacement.source_record_raw::jsonb->>'row') IS DISTINCT FROM
     ((conflict.incoming_truth->>'source_record_raw')::jsonb->>'row')
  OR NOT EXISTS(SELECT 1 FROM public.feed_validation_manifests m WHERE m.artifact_id=artifact.id
    AND m.status='VALIDATED' AND m.record_keys ? replacement.source_record_key)
 THEN RAISE EXCEPTION 'SUPERSESSION_LINEAGE_MISMATCH'; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER verify_observation_supersession AFTER INSERT ON public.observation_supersessions
 DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION public.verify_observation_supersession();
REVOKE ALL ON FUNCTION public.guard_observation_supersession(),public.verify_observation_supersession()
 FROM PUBLIC,anon,authenticated,service_role;

-- stage_feed_batch below is migration 027 verbatim except the current-row predicate.
CREATE OR REPLACE FUNCTION public.stage_feed_batch(p_id uuid,p_token uuid,p_rows jsonb,p_batch integer) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
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
   SELECT * INTO oldrow FROM public.market_price_observations WHERE source_id=(r->>'source_id')::uuid AND source_record_key=r->>'source_record_key' AND superseded_by IS NULL;
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
