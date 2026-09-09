# ZARATI R4-B.10 — Open-Meteo production canary

Date: 2026-09-09 UTC. Production Supabase project: `nelsijiczufflyqosvzi`.

**PASS. Exactly one canary and one authorized replay succeeded. 49 immutable weather observations; replay inserted zero. WFP unchanged. Both feed gates OFF. No recurring activation and no R4-C.**

## Governance preflight

Canonical remote main was verified using `git ls-remote`: `01400a8517982953725e67172f261bf18dcc5b7b`. The initial production deployment `dpl_5WcbVPTKgY8B2nnppRKq7FXbDTBk` was READY at that exact main commit. Migration 029, `__tests__/feeds/wfp-historical-repair.test.ts`, repair SQL, and `ZARATI_R4_B_WFP_3_ROW_REPAIR_EVIDENCE.md` are already tracked in main. No repository reconciliation or migration application was necessary.

Migration `20260909000029_029_wfp_auditable_supersession.sql` local SHA-256 is `97f19a64df35fca90c8e0696e66e404367ed13434d41057f9d8fadcf19f70596`, exactly the production-applied evidence hash. Fresh production ledger statements match the previously tested local 029 ledger statements; production functions, triggers, constraints, indexes, RLS and effective grants match the tested 029 schema. Migration 029 occurs exactly once.

Main contains all 28 production migrations: **001–016, 018–029**. Test-only 017 is absent. Main migration contents match the local files after CRLF/LF comparison; an initial byte comparison detected only a working-tree line-ending difference in an older migration. No migration file was edited. Migration 029 itself matches the exact pinned byte checksum.

No implementation, parser, migration, application configuration file, or cron schedule was changed in this gate. This report and the bounded replay-admission SQL are new local deliverables; they have not been committed or pushed. Existing unrelated working-tree changes were left untouched.

## Approved location and request

One location only: **El Gedarif / Gedaref Crops Market**, requested latitude **14.04**, longitude **35.38**. Both are valid geographic coordinates.

Coordinate evidence: the retained public WFP/HDX Sudan source artifact with SHA-256 `3c00925b7c04192e7170dc5bce13cfaca898b0c1499e9f939540fec19f6cbee4`. Its checksum was independently recomputed. All 882 source records for market 2580 share `El Gedarif`, latitude 14.04, longitude 35.38, source admin1 `Gedaref`, source admin2 `Al Gedaref Rural`. This was an offline artifact inspection, not a WFP feed execution.

The existing adapter pins `MKT-GD-01 / WFP market 2580`. Fresh production reference lookup confirms canonical market `MKT-GD-01`, name `Gedaref Crops Market`, city `Gedaref`, linked to state `SD-GD`, `Gedaref`. Migration 016 seeds that canonical relationship; the source artifact supplies the coordinates. Weather does not fabricate an administrative foreign key or treat source admin2 text as new canonical geography.

Exact production resource, also retained on both artifacts:

```text
https://api.open-meteo.com/v1/forecast?latitude=14.04&longitude=35.38&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&forecast_days=2&timezone=UTC&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm&models=best_match
```

Temperature Celsius, relative humidity percent, precipitation millimetres, and wind km/h are validated against returned unit metadata. Current and hourly channels request the same four variables. Weather code is neither requested nor stored. ISO-8601 is the provider default, checked through unit metadata. UTC is explicit; returned offset must be zero and timezone GMT or UTC, normalized to UTC in stored rows.

Current values represent weather-model estimates, not physical station observations. Hourly precipitation represents the preceding-hour sum; stored hourly interval is 3600 seconds. Current interval was 900 seconds. These meanings and optional-key behavior were checked against [Open-Meteo's official documentation](https://open-meteo.com/en/docs). The public endpoint used for this canary requires no API key or client secret; paid customer endpoints have separate key requirements. No provider credential was supplied. This canary does not establish a commercial subscription or authorize recurring use.

## Baseline

Weather baseline captured at 2026-09-09 14:43:56.887740 UTC; WFP/migration baseline captured before activation.

| Metric | Before | Final |
|---|---:|---:|
| Weather observations | 0 | 49 |
| Safe public weather rows | 0 | 49 |
| Weather executions | 0 | 2 |
| Weather artifacts | 0 | 2 |
| Weather manifests | 0 | 2 |
| Active weather leases | 0 | 0 |
| WFP physical observations | 5666 | 5666 |
| WFP current valid identities | 5663 | 5663 |
| Public WFP | 102 | 102 |
| WFP executions | 3 | 3 |

## Controlled activation and shutdown

Initial saved production WFP flag was false; weather was absent/default OFF. Only `R4B_WEATHER_FEED_ENABLED=true` was temporarily saved. WFP was verified false by the bounded environment tool before the change. `CRON_SECRET` presence was verified without emitting its value.

The minimal redeployment reused canonical main `01400a8`: temporary deployment `dpl_6pvjApHdFyXB2m3wDHktcZeRBE1u`, URL `https://zarati-platform-exyprggt7-samieltayeb-oss-projects.vercel.app`. It became READY and owned the production alias. Saved weather configuration was restored to false after deployment creation, before the first managed trigger; the built deployment retained its enabled configuration, proven by successful passage through the feed gate. WFP configuration remained false throughout. Deployment-detail API responses did not expose resolved flag values; deployment identity, captured configuration sequence and successful weather gate execution provide the evidence, rather than a claim that resolved environment values were returned.

Vercel's managed weather Run control was clicked exactly twice: once for the canary, once after successful validation for the authorized replay. WFP Run and expire Run were never clicked. The platform supplied cron authentication; no secret was displayed or copied.

Existing schedules remained unchanged: weather `0 4 * * *`, WFP `0 3 * * 1`, expire `0 2 * * *`. Vercel's pre-existing global cron feature remained enabled for the existing project. No global switch or schedule was activated or changed. The weather gate was bounded outside its 04:00–05:00 UTC Hobby window. Feed-level recurring automation is OFF in the final deployment.

Final deployment: **`dpl_F7Lpez7DtgPdRAFqrxPPjGQt9Xrf`**, READY, exact same main commit; URL `https://zarati-platform-9tadyc71z-samieltayeb-oss-projects.vercel.app`. It owns `https://zarati-platform.vercel.app` and the project/main aliases. Both saved flags were false before this deployment was created and verified false afterward. The temporary enabled deployment was removed successfully using exact-ID `vercel remove --safe --yes` after the OFF deployment owned production. No third execution was triggered to test shutdown.

## Execution ledger and lifecycle

| Field | Canary | Single replay |
|---|---|---|
| Execution ID | `fd408f25-81cd-4fc4-b547-dbb05d9dd8d0` | `d76268ca-7b06-43c3-92d8-23c63dbb663f` |
| Started UTC | 14:50:20.479049 | 14:53:01.182863 |
| Retrieved UTC | 14:50:20.963 | 14:53:01.620 |
| Completed UTC | 14:50:21.658386 | 14:53:02.164845 |
| Ledger duration seconds | 1.179337 | 0.981982 |
| HTTP / status | 200 / succeeded | 200 / succeeded |
| Fetched / valid | 49 / 49 | 49 / 49 |
| Inserted / existing | 49 / 0 | 0 / 49 |
| Rejected / quarantined / unmapped | 0 / 0 / 0 | 0 / 0 / 0 |
| Error category | NULL | NULL |
| Manifest status | VALIDATED | VALIDATED |

Vercel logs show exactly the two weather requests, at 14:50:19.731 and 14:53:00.736 UTC, both HTTP 200. Canary request ID: `br7fs-1788965419731-725af03ac31e`, user agent `vercel-cron/1.0`, production/main, correct temporary deployment. Full request duration was approximately 2.05 seconds, distinct from the database ledger duration.

Canary external-call trace: `acquire_feed` → GET `api.open-meteo.com/v1/forecast` → `prepare_feed_artifact` → manifest read → `stage_feed_batch` → `finish_feed`. The unchanged handler authenticates before the enable gate and acquires a lease before provider work. The persisted artifact, VALIDATED manifest, all-row comparison and final ledger establish successful response validation, parsing, temporal classification, staging, insertion and finalization. No provider retry was visible in the first request trace.

Canary lease acquired at 14:50:20.487156 UTC; replay lease at 14:53:01.189516 UTC. Final weather owner token and execution ID are NULL. Normal finalization restored the one-hour cooldown to **15:53:02.165420 UTC**. No RUNNING residue exists in either feed.

## Exact artifact, value and temporal truth

| Artifact | ID | SHA-256 | Bytes |
|---|---|---|---:|
| Canary | `64bd66e4-16d2-4602-af5a-f71dba667b79` | `1f46dcc6cb38ea3b49e84482181917cfaf02c4a6845259946a92093157ce2942` | 2452 |
| Replay | `3fced2e5-00a5-4fae-ad06-4cd29d8f2aa1` | `6b0a226e3a12369224dd9f4dec8adaa60614b7572d8f06d1bed6d6398e4aa0b8` | 2452 |

Both payload hashes were recomputed from retained exact payloads. Both manifests contain 49 keys and hash `444b879e67dbbe9da468664eb8c7455ab51ed2394858f37c8812f4ce30c864c2`; the sorted-key hash was independently recomputed.

Every one of the 49 stored observations was checked against the exact artifact, including temperature, humidity, precipitation, wind, valid time, retrieval time, timezone, intervals, horizon, requested coordinates, grid coordinates, raw normalized truth, and immutable revision hash. Zero unexplained value mutation. Both provider payloads have identical current/hourly data and coordinates; their only difference is provider diagnostic `generationtime_ms` (0.9000301361083984 versus 2.2829771041870117). Thus they are distinct raw artifacts but the same 49 observation revisions. Replay inserted zero, recognized 49 existing, and produced zero duplicate observations or new weather-value revisions.

The classification at ingestion is **1 CURRENT_MODEL_ESTIMATE, 33 FORECAST, 15 HISTORICAL**. Current valid time is 2026-09-09 14:45 UTC, separate from 14:50:20.963 retrieval. Hourly valid times span 2026-09-09 00:00 through 2026-09-10 23:00 UTC: past hourly slots are historical model values, and future-valid slots are forecasts. No model estimate is represented as a physical station measurement. Current/model estimate remains fresh only through valid time plus one hour; hourly records expire at their provider valid time. Historical records are always stale. Forecast horizons equal nonnegative whole seconds from retrieval to provider valid time; retrieval is never substituted for valid time.

Requested coordinates remain **14.04, 35.38**. Provider-selected grid coordinates are **14.024605, 35.419357**, stored in latitude/longitude, separately from requested_latitude/requested_longitude. Both match the corresponding request/response exactly. The public latitude/longitude are grid coordinates; geographic_reference identifies the requested canonical market relationship.

## Dynamic public freshness and minimization

A real production SQL transaction executed `SET LOCAL ROLE anon` and queried `v_public_weather`; all 49 rows were accessible. The timestamped query at **15:21:06.626149 UTC** found 15 historical rows stale, one current model estimate fresh, 32 forecasts fresh/future-valid, and one forecast stale after its 15:00 valid time passed. The forecast retains its immutable forecast classification and becomes stale dynamically. This proves elapsed time changes freshness without rewriting weather truth.

An initial comparison used the earlier private capture timestamp and failed because a forecast valid-time boundary had passed. The verification capture was corrected to include the anon transaction timestamp; comparison at the actual query time passed for every row. No application code or stored row was altered to make the check pass.

Exact public fields: `id`, `geographic_reference`, `latitude`, `longitude`, `valid_time`, `temperature_celsius`, `precipitation_mm`, `relative_humidity_percent`, `wind_speed_kmh`, `temporal_class`, `model_provenance`, `interval_seconds`, `is_stale`. The public ID is an observation ID, not an artifact ID. No raw payload, source_record_raw, artifact ID, execution error, lease, validation metadata, or secret is exposed. Anon SELECT privileges on weather_observations, feed_artifacts, external_feed_executions, feed_leases and feed_validation_manifests are all false. The approved view uses dynamic database time and a succeeded-execution filter; it has no fixed `isStale=false` behavior.

## Replay admission

`ops/data-repairs/R4-B10-weather-replay-admission.sql` performed only the authorized one-use idle cooldown admission. It required the exact successful canary ID/artifact/counters, exactly one weather execution, three WFP executions, 49 weather/public rows, unchanged WFP counts, no running execution, an idle weather lease, the exact original next_allowed_at and a short fixed UTC window. Reapplication fails because the original timestamp no longer matches, and a completed second execution also fails the count guard.

Admission at **14:52:47.845226 UTC** advanced weather next_allowed_at from **15:50:21.658859 UTC**. It did not acquire or release a lease, call a provider, alter weather data, enable recurrence, modify WFP, or change runtime acquire/finish functions. The replay then used the normal authenticated production route and normal lease lifecycle. No further replay was attempted.

## Security, isolation and verification limits

Migration 026 and 028 security: PASS by fresh production comparison with the prior verified security snapshot: listing policies, relevant listing/inquiry/profile trigger/helper functions, triggers, effective grants, RLS, public listing view and listing count are unchanged. Migration 029 repair: PASS by fresh schema/ledger equivalence and unchanged audit links, old source truth, legitimate counterparts, replacement truth and preserved conflicts. WFP physical/current/public counts remain 5666/5663/102; all three pre-existing WFP execution objects match exactly. WFP executions during this gate: **0**. WFP corrections remain 3, removals 0. R4-A publication isolation remains intact.

R4-B production weather: PASS by live authenticated executions, exact all-row artifact comparison, verified immutable replay, safe anon projection, dynamic freshness, complete final ledgers and cleanup. No raw weather public. No R4-C work.

A fresh local run of weather, cron and listing-policy tests was attempted, but all 93 tests were skipped because PostgreSQL at 127.0.0.1:54342 was unavailable. Starting the local stack confirmed Docker Desktop's Linux engine was stopped. This is **not** a fresh local test PASS. The prior tracked R4-B.9 evidence records 156 passing tests on this unchanged implementation/schema; this gate combines that existing mutation proof with fresh read-only production equivalence and actual weather execution proof. No local test was redirected to production. No implementation changes required lint/build revalidation; both real Vercel deployments built successfully from the same canonical main.

Supporting ignored captures and verification tools: `scratch/r4b10-preflight.json`, `scratch/r4b10-weather-before.json`, `scratch/r4b10-weather-canary.json`, `scratch/r4b10-weather-replay.json`, `scratch/r4b10-anon-after.json`, `scratch/r4b10-final-wfp.json`, `scratch/r4b10-security.json`, `scratch/r4b10-replay-admission.json`, `scratch/r4b10-source.cjs`, `scratch/r4b10-verify.cjs`, `scratch/r4b10-final-compare.cjs`. Raw provider artifacts and manifests also remain durably recorded in private production tables. No credentials are included in this report.

**Final: WFP OFF. WEATHER OFF. R4-C NOT STARTED. Recurring activation is not authorized.**
