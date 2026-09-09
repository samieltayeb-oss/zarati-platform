# R4-B.13 — MET Norway production canary

2026-09-09 UTC. **PASS: one production canary and one controlled replay. Weather returned OFF. WFP remains ON.** This is not recurring-weather activation or R4-C closure.

## Reviewed release and governance

MET Norway implementation commit and application main SHA: **`62af73e5aa111ed4b52ca57425dd345189d48a12`**, `feat(r4-b): add MET Norway weather provider`.

Exactly 15 reviewed files were committed: migration 030; adapter/parser/contract; weather route and provider selection; generated database types; tests and fixtures; example default-off configuration; operator query; and local implementation evidence. Unrelated modified plans, untracked documents, credentials, backups, and scratch output were excluded. Review of the complete migration, staged diff, and diff whitespace checks passed. No prior migration changed. The existing 180-test local verification, lint, typecheck, build, and reset results apply to this exact implementation; no application code changed during the production gate.

The release branch was pushed normally; a clean isolated main worktree fast-forwarded without conflict. Main was pushed after the verified migration application because this repository automatically deploys production on a main push. No force push was used. The subsequent evidence-only commit adds this report and the executed one-use replay-admission SQL; Git records its SHA. It does not change application, migrations, environment defaults, or cron configuration.

## Production preflight and backup

Linked Supabase project was verified as **nelsijiczufflyqosvzi**. Baseline ledger: **001–016, 018–029**; 030 absent. WFP: 5666 physical / 5663 current valid identities / 102 public; four existing WFP executions. Open-Meteo: 49 rows and two previous successful executions. MET Norway: zero rows and zero executions. No RUNNING execution or active lease. WFP gate true; weather gate false.

Fresh backups completed successfully before migration, with non-zero files verified as Git-ignored:

| Backup | Bytes |
| --- | ---: |
| Schema | 145333 |
| Data | 9817223 |
| Roles | 370 |

Files are private under `scratch/r4b13-pre030-*.sql`; the production ledger and original weather rows were captured separately in ignored evidence. The data dump warned about the existing self-referencing market-price foreign key. Restoration would require handling that dependency with the accompanying schema; no production restore was attempted.

## Migration 030

Exact file: `supabase/migrations/20260909000030_030_met_norway_weather.sql`.

SHA-256: **`199d171eaa6e52dd94a3f11183acf198587ac2ae4ed4ee9c6973929c8252f8a8`**.

The dry run listed only 030. One migration push applied it successfully. A subsequent read-only query verified **001–016, 018–030**, 29 ledger entries, **030 count 1**. The file was not edited after application. The CLI emitted a post-application pg-delta catalog-cache certificate warning; this did not invalidate the independently verified production ledger/schema result.

All 49 Open-Meteo rows were compared field-for-field before/after migration, canary, and replay: unchanged. Provider enum includes MET_NORWAY; the weather provider constraint retains OPEN_METEO. The artifact/provider guard and FORECAST provenance guard are installed. The private cache has RLS enabled, no anon/authenticated privileges, and service SELECT/INSERT/UPDATE only, with DELETE denied. The safe view contains attribution and interval metadata without raw or operational fields. No destructive weather migration, WFP mutation, or R4-C schema change occurred.

## Deployments and controlled gate

Production alias: **https://zarati-platform.vercel.app**.

| Purpose | Deployment | Application SHA |
| --- | --- | --- |
| Initial release, weather OFF | `dpl_6fSHXDJW4FiaDxdRD8QbXCBgdCVV` | `62af73e5aa111ed4b52ca57425dd345189d48a12` |
| Temporary canary gate ON | `dpl_3QW5TrRvHF7yYfjbMFW2ztgVrw2y` | same |
| Weather returned OFF | `dpl_Hp6dELmEkWP5txHDoWxoxLFvvwAp` | same |

All three became READY. The OFF deployment owned the production alias at final behavioral verification. Its URL was `https://zarati-platform-q1tyswyjj-samieltayeb-oss-projects.vercel.app`.

Only `R4B_WEATHER_FEED_ENABLED` was temporarily changed, true at 17:57:34 UTC and false again at 18:10:02 UTC. WFP remained true throughout. The pre-existing dormant weather definition `0 5 * * *` was not changed; its Hobby 05:00–05:59 UTC window was well outside the entire canary interval. No recurring-weather schedule was activated for a clock event. The final OFF gate blocks future weather executions. WFP remains on its previously approved `0 3 * * *` schedule.

An initial CLI probe stopped during credential loading before sending any application request. Vercel browser sign-in was renewed by the operator. The actual canary and replay each used exactly one click of Vercel's weather-specific Run control; platform-managed authentication was supplied without exposing the secret. No WFP Run control was used.

## Source, identification, attribution, and location

Source: MET Norway Locationforecast 2.0 public compact endpoint, `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=14.04&lon=35.38`.

The reviewed deployed transport supplies **`ZARATI/0.1 (https://github.com/samieltayeb-oss/zarati-platform)`** on each outbound request. The exact deployed SHA, request-header tests, and successful production provider trace establish identification behavior. Vercel's available trace does not expose the provider-received header bytes; this is not a packet-capture claim. The incoming managed cron User-Agent is separately `vercel-cron/1.0`.

The [official API](https://api.met.no/) supports global forecasts, including Sudan. Its [license](https://api.met.no/doc/License) and [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) support commercial reuse with credit. The public projection supplies **Data from MET Norway**, the endpoint, the license link, and an explicit note about forecast selection, wind conversion, and precipitation intervals. No subscription or API key was introduced. Applicable [identification/cache terms](https://api.met.no/doc/TermsOfService) remain required; this is not an unlimited-capacity or SLA claim.

Location: **El Gedarif / Gedaref Crops Market, latitude 14.04, longitude 35.38**. Both values are valid and match the approved earlier canary location. The production canonical relationship is `MKT-GD-01`, Gedaref Crops Market, city Gedaref, state Gedaref / `SD-GD`; the stored reference retains WFP market 2580. MET returned the requested point rather than the different grid coordinates of the old Open-Meteo response. No extra location or fabricated administrative relationship was added.

## Canary and replay ledger

| Field | Canary | Replay |
| --- | --- | --- |
| Execution | `c92d556f-21a3-4c5b-91e4-149b0e0bc2a0` | `16ac405a-9177-4ba4-a78d-905612091321` |
| Started UTC | 17:59:51.232381 | 18:08:16.878306 |
| Completed UTC | 18:00:01.651260 | 18:08:17.754418 |
| Ledger duration | 10.418879 seconds | 0.876112 seconds |
| HTTP / status | 200 / succeeded | 200 / succeeded |
| Fetched / valid | 48 / 48 | 48 / 48 |
| Inserted / existing | 48 / 0 | 0 / 48 |
| Rejected / quarantined / unmapped | 0 / 0 / 0 | 0 / 0 / 0 |
| Error category | NULL | NULL |

Both use artifact **`5e744233-65cd-43a4-bf9d-f8192a37e55d`**, 39056 bytes, SHA-256/source version **`576d0b7c57bc5ea7b8e8f82b3dc58f067e291789c043dc15d10818b52bb73898`**. Exact payload hashes were recomputed, and both VALIDATED manifests matched their artifact, record keys, and manifest hashes.

Provider issuance: **2026-09-09T17:27:37Z**. Original retrieval: **2026-09-09T18:00:00.914Z**. Last-Modified: **Wed, 09 Sep 2026 18:00:00 GMT**. Cache Expires: **2026-09-09T18:30:38Z**. The replay used the still-fresh durable cache and the same immutable artifact, preserving original retrieved_at. No second provider fetch or legitimate forecast revision was needed. Duplicate inserts: **0**.

The explicit replay authorization was implemented using `ops/data-repairs/R4-B13-met-norway-replay-admission.sql`. It pins the canary execution/artifact/counters, both providers' row counts, WFP baseline, a short UTC window, and the exact idle lease timestamp. It changed only MET's next_allowed_at from 19:00:01.651667 to 18:08:05.311048. After replay, normal cooldown returned to **19:08:17.754795 UTC**. The SQL cannot be applied again against the resulting state. No generic cooldown policy was changed.

Vercel canary log `2npvf-1788976790634-4db6899e3a68` shows the managed request at 17:59:50.634 UTC, HTTP 200, on the canary deployment. Its outgoing trace includes lease acquisition, cache read, one MET compact GET, cache write, artifact preparation, manifest read, staging, and finalization. Replay appears at 18:08:15.333 UTC with HTTP 200. Final ledgers contain exactly **two MET executions**, neither RUNNING; all feed owners and execution lease references are NULL.

## Weather truth and public minimization

All 48 inserted MET rows were compared against the exact production artifact. Temperature Celsius, relative humidity %, precipitation mm over the following provider interval, wind m/s converted by 3.6 to km/h, requested/returned coordinates, original wind, UTC, valid time, issuance metadata, interval boundaries, horizon, and stale_after_at all match. Zero unexplained mutation.

Example at 2026-09-09T18:00Z: **23.8 C, 88.8% humidity, 1.1 mm next-hour precipitation, 6.2 m/s = 22.32 km/h wind**. Retained valid times span **2026-09-09T18:00Z through 2026-09-11T17:00Z**. All are **FORECAST**, including slots that expire after ingestion. None claims physical station, live sensor, satellite observation, or government partnership.

Freshness was checked against the database timestamp of each anon capture. A MET forecast becomes stale when its valid time passes; future-valid rows remain labeled FORECAST. Old historical Open-Meteo rows remain historical/stale. Retrieval time does not replace provider valid time. There is no fixed isStale=false behavior.

Anon-role queries of `v_public_weather` returned **97 public rows: 49 OPEN_METEO + 48 MET_NORWAY**. The exact field allowlist was checked: id; geographic reference; point/requested coordinates; valid_time; temperature; precipitation; humidity; wind; temporal class; model provenance; interval; dynamic is_stale; provider; retrieved_at; timezone; horizon; attribution; source/license URLs; processing note; precipitation start/end. No raw payload, source_record_raw, artifact ID, lease, execution error, internal validation metadata, secret, or client credential is public. Private-table grants deny anon/authenticated access.

Provider isolation passes: old OPEN_METEO rows are unchanged, MET rows have their own provider-prefixed identities and artifacts, and no duplicate key/revision pair exists. The safe projection supports product attribution; this gate did not add a new weather UI or claim recurring weather freshness.

## Final OFF behavior, isolation, and regressions

The final managed OFF-gate probe at **18:13:19.749 UTC** returned **503** in 379 ms on `dpl_Hp6dELmEkWP5txHDoWxoxLFvvwAp`. Vercel log **`6mvdh-1788977599749-bdd630cedd53`** explicitly reports **No outgoing requests**. It created no third feed execution, no lease, and no provider request. This denied probe is not a third canary.

Fresh production comparisons confirm WFP 5666 physical / **5663 current valid / 102 public**, no new WFP execution, unchanged repair lineage, preserved original/provenance rows, no new conflict/removal, and unchanged WFP staging/guard definitions. WFP automation remains ON; Open-Meteo remains OFF; MET Norway is OFF. Separate provider leases and execution histories remain intact.

| Regression | Result / evidence |
| --- | --- |
| Migration 026 | PASS — production security function/trigger equivalence and exact-release local tests |
| Migration 028 | PASS — unchanged listing policies, functions, triggers, grants, RLS, safe view |
| Migration 029 | PASS — preserved repair truth and production lineage/schema comparison |
| R4-A | PASS — canonical WFP counts, publication isolation, immutable lineage |
| R4-B | PASS for infrastructure and this MET production canary; recurring MET remains unauthorized |
| RFQ/listing/rate-limit/media | Exact-release local tests pass; no related application changes or destructive production tests |
| Operator observability | Read-only private operator query succeeds for WFP, OPEN_METEO, MET_NORWAY |

The implementation remains the locally verified 180-test release. Retained private captures are `scratch/r4b13-*`; no secrets or raw operational payloads are committed. Remaining limitations: no recurring MET activation, no unattended weather cron verification, no SLA, no provider-side packet capture, no new UI/alerting implementation. FAO remains deferred. R4-C and the Gedaref pilot are not started.

**MET NORWAY PRODUCTION CANARY PASSED — FREE WEATHER PIPELINE VERIFIED.**
