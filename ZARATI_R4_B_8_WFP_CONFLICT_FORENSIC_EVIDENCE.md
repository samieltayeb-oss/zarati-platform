# R4-B.8 — three WFP conflicts: read-only forensic result

Date: 2026-09-09 UTC. Production: nelsijiczufflyqosvzi. Main: fa0790a307f2adb946489da4ae99abc56f9b07ec.
**Remediation class C: historical data repair required.** All three conflicts independently classify as **B — HISTORICAL BACKFILL MAPPING/PROVENANCE DEFECT**. No production write, replay, migration, deployment, or feed activation was performed.

## Exact conflict inventory

All three: price type raw `Retail` / stored enum `retail`; unit `3 KG`; currency `SDG`; current source commodity `65 / Sorghum` (plain variant). Existing V2 key also claims 65, but existing stored raw commodity is `249 / Sorghum (food aid)` (food-aid variant). Each price is identical between the two legitimate source variants, making a price-only repair match ambiguous.

| # | V2 identity | Date | Raw market ID/text | Current source / existing price | Existing observation ID |
|---|---|---|---|---|---|
| 1 | WFP_SDN_V2_2023-12-15_1031_65_Retail_3 KG | 2023-12-15 | 1031 / Kassala | 1200 / 1200 SDG | 5ac20cfc-4ced-4a27-8edf-0733c1b89e4c |
| 2 | WFP_SDN_V2_2024-07-15_1029_65_Retail_3 KG | 2024-07-15 | 1029 / El Obeid | 5000 / 5000 SDG | e61a4f16-0ee5-4888-8d0d-f5ed91ea8dca |
| 3 | WFP_SDN_V2_2024-10-15_1029_65_Retail_3 KG | 2024-10-15 | 1029 / El Obeid | 9000 / 9000 SDG | 6a21aef2-c247-4c83-b425-5a8e6682e214 |

Each existing observation is INGESTED, verification_state unassessed, trust_score null, reviewed_at/reviewed_by/verified_at/published_at null. Canonical commodity is sorghum_standard (`e22c99f5-196e-46f4-9161-9893185f8503`, variety Sorghum). All carry ingestion_method batch_import, source_provenance market_reported, temporal_class historical_archive, derivation_class reported_survey; ingested_at is 2026-09-08T01:37:14.840289Z.

Shared source: SRC_WFP_VAM / `50bbdce4-24e3-40ed-9882-21342ec3dc91`.
Shared dataset: DS_WFP_SUDAN_FOOD_PRICES / `9e4ff87c-7d52-4842-8565-f329dc7623e3`.
Existing snapshot: `230e36ca-d31e-44c9-b000-ed63943ea375`.
Conflict category for each: CORRECTION, produced by unequal raw-row text; mapping_review=false and currency unchanged. The precise cause is INTERNAL_V2_REPAIR_VARIANT_MISASSIGNMENT, not a change in price or source metadata.

## Source bytes and version truth

A single read-only public download completed at 2026-09-09T07:37:33.885Z. It was not passed into production ingestion.

- Resource: 8fea18b2-615f-4af5-9bd5-85cc31a25ffd / wfp_food_prices_sdn.csv, dataset 369e003b-f0af-4e48-99d7-34fc85b44635.
- Download followed the HDX redirect to the public S3 resource.
- Length: 2,924,466 bytes.
- SHA-256: **3c00925b7c04192e7170dc5bce13cfaca898b0c1499e9f939540fec19f6cbee4**.
- Direct Buffer byte equality with preserved historical `scratch/wfp_food_prices_sdn.csv`: **true**.
- Direct byte equality with decompressed checksum-pinned repository fixture: **true**.
- Accepted production completeness approval has that same SHA, 23,225 rows and manifest SHA 9e1db34581a8f954cf72643509fa0c0f0c411246b1227883db771b0d6e18b70d.
- Canary artifact a815abed-7e8b-4087-a138-4d32cd054439 has the same SHA and length; production recomputation of SHA from stored payload matches. Its verified snapshot is a2389a1f-6f33-445f-a638-e0738f3d146b.
- Current Last-Modified: Sun, 06 Sep 2026 17:36:35 GMT.
- Current ETag: b807f7de99b5060b75e7793a37e4f5e3 (supporting metadata, not treated as SHA-256).
- Current S3 version ID: tUJ.UcMo2NIy48fPeF_vyj4f7Gb6p24I. Historical S3 version metadata was not recorded, so equality of that metadata is not claimed.

Thus SAME correctly means byte identity with the accepted historical full CSV, not a fresh upstream correction.

Important older provenance limitation: snapshot 230e36ca-d31e-44c9-b000-ed63943ea375 stores `payload_sha256=8fea18b2615f4af59bd585cc31a25ffd`, a 32-character resource UUID fragment, not a 64-character SHA-256. It says record_count=20 and storage_uri=hdx://wfp_food_prices_sdn.csv. It cannot cryptographically attest the 23,225-row backfill. The historical-file byte proof above is real, but this older DB pointer itself is not a valid checksum-backed full-artifact record.

## Proven repair mechanism, independently for all three

1. Original bulk ingestion used `WFP_SDN_{date}_{mapped market}_{cropCode}_{price type}`. Sorghum and food-aid Sorghum both mapped to cropCode sorghum; raw commodity ID/variant and unit were absent from the old identity.
2. The pre-026 backup and archived pre-repair DB export show the three IDs under those old collapsed keys. Their raw rows already describe commodity 249, their numeric prices match the table above, and they were INGESTED/unassessed. They were legitimate food-aid source rows behind an ambiguous old key, not the published 20-row canary.
3. `scratch/wfp-prod-repair.js` matched an existing row using old key plus parsed numeric price, without checking its raw commodity ID, raw variant, unit, or full raw row. It consumed the matching DB ID while iterating source rows.
4. For each of these three source pairs, the commodity-65 row appears before commodity 249 and both have the same price. The repair therefore consumed the stored 249 observation as the match for 65.
5. The generated SQL changed ONLY source_record_key on that ID. The old 249 raw provenance remained. It then inserted a separate legitimate 249 record because the original ID had been consumed already.

Versioned executable proof: `ops/data-repairs/R4-A-wfp-identity-v2-repair.sql` lines 5179, 5257, 5297 assign the three incorrect 65 keys. Lines 5684, 5692, 5699 insert the corresponding 249 source rows. The archived production repair SQL SHA-256 is c0177f5a0e7641c88b1a9f6473b5fa67dbff97edaaccf19d451e6200a76b1937, matching the prior postmortem. The tracked artifact is identical after CRLF/LF normalization; neither was executed or edited here.

The generator's read-only classification prefix was reproduced locally with archived source bytes and pre-repair DB export. SQL generation/execution was excluded and filesystem writes disabled inside the historical sandbox. It reproduced all three exact ID→wrong-key assignments and all three subsequent 249 insertions.

The actual current R4-B pure parser was separately evaluated against the freshly downloaded bytes, without calling run/ingest or any DB method. It produced 23,225 source rows, 5,663 mapped rows, and 5,663 unique identities. For the three contested keys it returns commodity 65 / Sorghum and the exact current raw rows (file lines 17442, 18301, 18859). No current automation parser defect was found. Historical mapping/repair logic drift is proven; the numeric values did not drift.

Existing legitimate 249 companions, which must be preserved:
- #1: 98e94afb-d006-4fa1-9164-64e59635100d.
- #2: 68abe4de-73c9-4890-8dd1-25da5b6b0df5.
- #3: dee3fefe-f22b-4d45-939e-17d43cbf06f8.

Each companion has its correct 249 V2 key/raw row, the same price, INGESTED state, and the same older snapshot pointer. The old repair's count/unique-key checks passed while missing these semantic key-to-raw-row inconsistencies.

## Verification, publication and transformation lineage

For each of the three contested IDs, current verification evidence, transformation records, quality flags, and legacy observation_conflict_ledger entries are empty. Current publication-review timestamps are null. The pre-repair backup and current production both show INGESTED/unassessed.

There is no separate publication-event table in the inspected observation lineage schema. Consequently a complete event-by-event historical publication timeline cannot be invented. Available states show these rows unpublished before repair and now; the R4-B canary did not change their full stored records or publish them.

The backfill generator explicitly reused the latest snapshot from the earlier canary instead of archiving its own full artifact. The V2 repair used the same latest-snapshot selection for newly inserted counterpart rows. This explains the shared 20-row snapshot pointer and invalid historical checksum field; it is an additional shared lineage weakness, not evidence that these three bulk rows were manual/published canary observations.

## Quarantine correctness and replay semantics

Actual production stage_feed_batch compares the stored raw-row text and currency against incoming values. All three raw rows differ in commodity ID/label, so quarantine is correct. Same price does not make different commodity variants interchangeable.

Durable private feed_source_changes retains complete previous_truth and incoming_truth. Production equality checks show all three current observations still exactly equal previous_truth. Public WFP remains 102, total WFP 5663, canary executions 1, weather 0. No changes occurred in this forensic gate.

PARTIAL is correct: existing 5660 + quarantined 3 = valid 5663; inserted/rejected both zero. CORRECTION is a broad generic category, not proof of upstream correction. A human resolution should annotate the historical internal variant misassignment. No parser weakening or price-only conflict suppression is appropriate.

Conflict evidence is already idempotent: raw artifact uniqueness is `(feed_type, resource_identity, content_sha256)`; replay reuses that artifact ID. Conflict uniqueness is `(artifact_id, source_record_key, kind)`, and insertion uses ON CONFLICT DO NOTHING. The same artifact cannot create endless duplicate conflict rows. New execution/validation records would be legitimate per-attempt audit records, not duplicate correction evidence. No additional conflict deduplication fix is required.

An **admitted** same-artifact replay would deterministically quarantine these same three again, leave the correction evidence count at three, and remain PARTIAL. That is acceptable protective containment, not an acceptable clean recurring-operation baseline.

Literal immediate execution is blocked: WFP remains false and its next_allowed_at is 2026-09-09T13:18:30.245706Z (cooldown was active at the read-only check). No replay or cooldown bypass was attempted. Recurring scheduling is not approved despite correct containment/idempotency.

## Proposed repair class — design only, not implemented

Choose **C: HISTORICAL DATA REPAIR REQUIRED**, for all three affected observations. Zero legitimate upstream corrections; three affected internal-ingestion/repair defects. Scalar prices are source-faithful, but each key/raw provenance pair is not.

A separate repair gate should:
1. Freeze the exact three IDs, current full-row hashes, source bytes/SHA, source-row locations, and three existing conflict IDs as preconditions; take a fresh backup and revalidate publication remains INGESTED.
2. Preserve original rows, their old snapshot, and previous/incoming conflict evidence. Do not delete the legitimate 249 companions, change prices/units/currency, or publish anything.
3. Prefer an append-only approved provenance amendment/revision linking each defective record to its authoritative commodity-65 row and verified full-artifact snapshot. Record the historical repair cause, complete before/after interpretation, reviewer, timestamp, and immutable source hashes. Preserve the old interpretation explicitly.
4. Address the current architecture's limitations explicitly: the unconditional `(source_id, source_record_key)` uniqueness and immutable-field trigger do not permit silently inserting another active observation with the same V2 key. An approved amendment/resolution mechanism would require a narrowly reviewed forward change so ingestion can recognize the corrected interpretation without overwriting old truth. Do not reuse the old global replication-role bypass.
5. Prove locally that the approved correction makes each 65 key's effective provenance source-faithful, preserves each 249 counterpart, keeps the public count unchanged, and causes a subsequently authorized replay to recognize all 5663 without new corrections or inserts. Commit the repair/migration and audited resolution evidence before any production application.

This is a historical repair requirement, not permission to implement an amendment table, change parser logic, update rows, or run another canary now. No repair code was created in this gate.

## Evidence files and stop state

Local forensic outputs only: scratch/r4b8-source-proof.json, scratch/r4b8-current.csv, scratch/r4b8-lineage.json, scratch/r4b8-reproduction.json, scratch/r4b8-quarantine.json. Archived backups were read only for the three relevant WFP records; credentials and unrelated user data were not printed.

No tracked application/migration/repair/test file changed. Production modified: NO. WFP recurring OFF; weather OFF; no R4-C. **Historical data repair must be separately authorized before replay/scheduling.**
