-- R4-B.9 / v1. Execute once, only after migration 029 and a verified fresh backup.
-- Transactional, fail-closed repair of precisely three historical identity defects.
-- No replication-role override, trigger disabling, deletes or publication approval.
BEGIN ISOLATION LEVEL SERIALIZABLE;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='60s';
LOCK TABLE public.feed_leases,public.market_price_observations IN SHARE ROW EXCLUSIVE MODE;
DO $$
DECLARE t record; o public.market_price_observations; companion public.market_price_observations;
 c public.feed_source_changes; a public.feed_artifacts; r jsonb; source uuid;
 unaffected_before text; public_before text; repaired integer:=0;
 targets uuid[]:=ARRAY['5ac20cfc-4ced-4a27-8edf-0733c1b89e4c','e61a4f16-0ee5-4888-8d0d-f5ed91ea8dca','6a21aef2-c247-4c83-b425-5a8e6682e214']::uuid[];
 replacements uuid[]:=ARRAY['c0c98927-7776-4f16-8665-faf72efb40ca','5e049da6-924d-44ab-8bce-548d5e620bf3','18b09b5e-aabc-4592-9e61-b8629fc15515']::uuid[];
 reason constant text:='R4-B.9: historical V2 repair assigned commodity-65 identity to retained commodity-249 provenance. Retracted duplicate retained; faithful commodity-65 replacement and existing commodity-249 linked in immutable audit.';
BEGIN
 SELECT id INTO STRICT source FROM public.canonical_sources WHERE code='SRC_WFP_VAM';
 IF EXISTS(SELECT 1 FROM public.external_feed_executions WHERE status='running')
  OR EXISTS(SELECT 1 FROM public.feed_leases WHERE owner_token IS NOT NULL)
  OR EXISTS(SELECT 1 FROM public.observation_supersessions)
  OR (SELECT count(*) FROM public.market_price_observations WHERE source_id=source)<>5663
  OR (SELECT count(*) FROM public.v_approved_market_prices WHERE source_code='SRC_WFP_VAM')<>102
  OR (SELECT count(*) FROM public.feed_source_changes)<>3
  OR EXISTS(SELECT 1 FROM public.market_price_observations WHERE id=ANY(replacements))
 THEN RAISE EXCEPTION 'R4B9_BASELINE_MISMATCH_OR_ALREADY_APPLIED'; END IF;
 SELECT md5(string_agg(to_jsonb(x)::text,'|' ORDER BY id)) INTO unaffected_before
  FROM public.market_price_observations x WHERE NOT id=ANY(targets);
 SELECT md5(string_agg(to_jsonb(x)::text,'|' ORDER BY observation_id)) INTO public_before FROM public.v_approved_market_prices x;
 SELECT * INTO STRICT a FROM public.feed_artifacts WHERE feed_type='WFP'
  AND content_sha256='3c00925b7c04192e7170dc5bce13cfaca898b0c1499e9f939540fec19f6cbee4';
 IF encode(extensions.digest(a.payload,'sha256'),'hex')<>a.content_sha256
  OR NOT EXISTS(SELECT 1 FROM public.feed_validation_manifests WHERE artifact_id=a.id AND status='VALIDATED' AND jsonb_array_length(record_keys)=5663)
 THEN RAISE EXCEPTION 'R4B9_ARTIFACT_NOT_VERIFIED'; END IF;
 FOR t IN SELECT * FROM (VALUES
  (1,'2023-12-15','1031','Kassala','1200','98e94afb-d006-4fa1-9164-64e59635100d'::uuid),
  (2,'2024-07-15','1029','El Obeid','5000','68abe4de-73c9-4890-8dd1-25da5b6b0df5'::uuid),
  (3,'2024-10-15','1029','El Obeid','9000','dee3fefe-f22b-4d45-939e-17d43cbf06f8'::uuid)
 ) AS v(i,day,market_raw,market_name,price,companion_id) LOOP
  SELECT * INTO STRICT o FROM public.market_price_observations WHERE id=targets[t.i];
  SELECT * INTO STRICT companion FROM public.market_price_observations WHERE id=t.companion_id;
  SELECT * INTO STRICT c FROM public.feed_source_changes WHERE artifact_id=a.id AND kind='CORRECTION' AND source_record_key=o.source_record_key;
  r:=c.incoming_truth;
  IF o.source_id<>source OR o.superseded_by IS NOT NULL OR o.publication_status<>'INGESTED'
   OR o.verification_state<>'unassessed' OR o.published_at IS NOT NULL OR o.reviewed_at IS NOT NULL
   OR o.raw_snapshot_id<>'230e36ca-d31e-44c9-b000-ed63943ea375'::uuid
   OR o.source_record_key<>'WFP_SDN_V2_'||t.day||'_'||t.market_raw||'_65_Retail_3 KG'
   OR (to_jsonb(o)-'superseded_by') IS DISTINCT FROM (c.previous_truth-'superseded_by')
   OR o.observed_at<>t.day::date OR o.raw_price_text<>t.price OR o.parsed_price_numeric<>t.price::numeric
   OR o.raw_currency_text<>'SDG' OR o.raw_unit_text<>'3 KG' OR o.price_type<>'retail'
   OR companion.source_id<>source OR companion.dataset_id IS DISTINCT FROM o.dataset_id
   OR companion.source_record_key<>replace(o.source_record_key,'_65_Retail_','_249_Retail_')
   OR companion.source_record_raw::jsonb IS DISTINCT FROM o.source_record_raw::jsonb
   OR companion.superseded_by IS NOT NULL OR companion.publication_status<>'INGESTED'
   OR split_part(o.source_record_raw::jsonb->>'row',',',10)<>'249'
   OR split_part(o.source_record_raw::jsonb->>'row',',',9)<>'Sorghum (food aid)'
   OR split_part(o.source_record_raw::jsonb->>'row',',',4)<>t.market_name
   OR r->>'source_record_key'<>o.source_record_key OR (r->>'source_id')::uuid<>source
   OR (r->>'market_id')::uuid<>o.market_id OR (r->>'commodity_id')::uuid<>o.commodity_id
   OR (r->>'dataset_id')::uuid IS DISTINCT FROM o.dataset_id
   OR r->>'raw_price_text'<>t.price OR r->>'raw_currency_text'<>'SDG' OR r->>'raw_unit_text'<>'3 KG'
   OR (r->>'parsed_price_numeric')::numeric<>t.price::numeric OR r->>'price_type'<>'retail'
   OR (r->>'observed_at')::timestamptz<>o.observed_at OR coalesce((r->>'mapping_review')::boolean,true)
   OR (r->>'source_record_raw')::jsonb->>'row' IS DISTINCT FROM replace(o.source_record_raw::jsonb->>'row',',Sorghum (food aid),249,',',Sorghum,65,')
   OR NOT (regexp_split_to_array(a.payload,E'\r?\n') @> ARRAY[(r->>'source_record_raw')::jsonb->>'row'])
  THEN RAISE EXCEPTION 'R4B9_EXACT_ROW_PRECONDITION_FAILED: %',o.id; END IF;
  INSERT INTO public.observation_supersessions(old_observation_id,replacement_observation_id,provenance_observation_id,conflict_id,artifact_id,old_truth,provenance_truth,reason,repair_version)
   VALUES(o.id,replacements[t.i],companion.id,c.id,a.id,to_jsonb(o),to_jsonb(companion),reason,'R4-B.9-WFP-three-row-v1');
  UPDATE public.market_price_observations SET publication_status='QUARANTINED',retraction_rationale=reason WHERE id=o.id;
  UPDATE public.market_price_observations SET publication_status='RETRACTED',superseded_by=replacements[t.i] WHERE id=o.id;
  INSERT INTO public.market_price_observations(id,source_id,dataset_id,raw_snapshot_id,commodity_id,market_id,source_record_key,source_record_raw,raw_price_text,parsed_price_numeric,raw_currency_text,canonical_currency_code,raw_unit_text,price_type,observed_at,stale_after_at,temporal_precision,verification_state,publication_status,ingestion_method,temporal_class,source_provenance,derivation_class)
   VALUES(replacements[t.i],source,o.dataset_id,a.snapshot_id,o.commodity_id,o.market_id,o.source_record_key,r->>'source_record_raw',t.price,t.price::numeric,'SDG','SDG','3 KG','retail',o.observed_at,(r->>'stale_after_at')::timestamptz,'CALENDAR_DAY','unassessed','INGESTED','batch_import','historical_archive','market_reported','reported_survey');
  repaired:=repaired+1;
 END LOOP;
 IF repaired<>3 OR (SELECT count(*) FROM public.market_price_observations WHERE source_id=source)<>5666
  OR (SELECT count(*) FROM public.market_price_observations WHERE source_id=source AND superseded_by IS NULL)<>5663
  OR (SELECT md5(string_agg(to_jsonb(x)::text,'|' ORDER BY id)) FROM public.market_price_observations x WHERE NOT id=ANY(targets||replacements)) IS DISTINCT FROM unaffected_before
  OR (SELECT md5(string_agg(to_jsonb(x)::text,'|' ORDER BY observation_id)) FROM public.v_approved_market_prices x) IS DISTINCT FROM public_before
 THEN RAISE EXCEPTION 'R4B9_POSTCONDITION_FAILED'; END IF;
END $$;
SET CONSTRAINTS ALL IMMEDIATE;
COMMIT;
