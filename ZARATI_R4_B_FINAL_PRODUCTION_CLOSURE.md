# R4-B — final production closure

**CLOSED on 2026-09-10 UTC. Automated WFP and free MET Norway forecast feeds are live and production verified.** The MET Norway proof is a genuine unattended Vercel schedule event; no manual weather execution was triggered during activation, observation, or this closure verification. R4-C and the Gedaref pilot are not activated.

## Canonical release and migration truth

Scheduled-run and production main SHA at closure verification: **24b33637025e91d154aac49eb1a53295be8df7bc**. Vercel deployment **dpl_Ft9bbsvRjyoqrS6notNs34u9Nd36**, production/main, READY, owned **https://zarati-platform.vercel.app**. Its immutable URL is https://zarati-platform-aeb2rdqwc-samieltayeb-oss-projects.vercel.app.

The final governance-only commit containing this report and its sanitized evidence summary is identified by this file's Git revision. It changes no application, migration, schedule, or feed gate. The final response records that converged main SHA after the normal main push and resulting deployment verification.

Supabase project: **nelsijiczufflyqosvzi**. Fresh production ledger: **001–016, 018–030**, 29 entries; **030 exactly once**. Migration 030, the provider implementation, tests, attribution, and completed canary/replay evidence are tracked in canonical main. No production/Git drift or migration edit was found. Migration 030 SHA-256 remains **199d171eaa6e52dd94a3f11183acf198587ac2ae4ed4ee9c6973929c8252f8a8**.

Implementation commit: **62af73e5aa111ed4b52ca57425dd345189d48a12**. The unchanged application passed local lint, typecheck, build, reset through 030, and **180 tests in 12 files** during B.12. B.13 verified production canary and clean replay. B.14 changed only the authorized production weather gate and governance evidence; no new application code or destructive production test was introduced.

## Active schedules and activation

| Feed | Schedule | UTC semantics on current Hobby plan | Final state |
| --- | --- | --- | --- |
| WFP | `0 3 * * *` | Daily 03:00–03:59 | ON |
| MET Norway | `0 5 * * *` | Daily 05:00–05:59 | ON |
| Open-Meteo | No independently executable provider route | Historical canary evidence only | OFF |

The existing expiry job remains `0 2 * * *`. A fresh read-only Vercel cron listing confirms these unchanged paths/schedules. [Vercel's documented Hobby limits](https://vercel.com/docs/cron-jobs/usage-and-pricing) permit daily jobs with a one-hour timing window. Frequency was not increased and no plan upgrade occurred.

One daily forecast refresh is appropriate for the current limited R4-B scope and minimizes provider/platform traffic. WFP's institutional historical dataset is polled conservatively. Daily forecasts do not imply continuous current-condition sensing.

Weather activation occurred at **2026-09-09T18:39:58.664Z**, setting R4B_WEATHER_FEED_ENABLED=true. The canonical route selects **MET_NORWAY** and the handler refuses OPEN_METEO. WFP remained enabled. Server-side CRON_SECRET presence was verified without revealing its value. Activation deployment **dpl_BCpsxRYyt7VVHZVZB4tFer4bnC26** was followed by the governance-only main deployment used by the unattended run. Final read-only gate verification on September 10 reconfirmed both approved feeds ON.

## First unattended MET Norway run

Scheduled window: **2026-09-10 05:00–05:59 UTC**. Actual Vercel invocation: **2026-09-10T05:24:41.268Z**.

| Evidence | Result |
| --- | --- |
| Vercel request ID | x7ctk-1789017881268-2f17ca5768ff |
| Deployment | dpl_Ft9bbsvRjyoqrS6notNs34u9Nd36 |
| Incoming User-Agent | vercel-cron/1.0 |
| Route / method / HTTP | /api/cron/weather / GET / 200 |
| Execution ID | 3b9cd584-3948-4a93-854d-51bb809337ce |
| Ledger started_at | 2026-09-10T05:24:42.427630Z |
| Retrieved_at | 2026-09-10T05:24:57.826Z |
| Completed_at | 2026-09-10T05:24:58.512544Z |
| Ledger duration | 16.084914 seconds |
| Status / error | succeeded / NULL |
| Fetched / valid | 49 / 49 |
| Inserted / existing | 49 / 0 |
| Rejected / quarantined / unmapped | 0 / 0 / 0 |
| New forecast identities | 12 |
| Legitimate immutable revisions | 37 |
| Duplicate key/revision pairs | 0 |

The bounded observer captured and validated this run at 05:25:47 UTC, with **manualTriggers=0**, then stopped. Its code performs only read-only database/log collection. Independent fresh ledger and Vercel log queries reproduced the same execution and the single request in the configured hour. The production trace additionally confirms the platform cron User-Agent and the correct deployment. Together, the pre-existing daily configuration, timing, absence of manual triggers, and matching independent platform/database evidence establish the unattended schedule origin.

The Vercel lifecycle trace shows lease acquisition; private MET cache read; **one GET to api.met.no/weatherapi/locationforecast/2.0/compact**; cache write; artifact preparation; manifest read; staging; and finalization. No Open-Meteo request appears. The UI reports 16.77 seconds of function execution. These are runtime and ledger measurements, not a claimed packet capture.

## Provider response, cache, and immutable revisions

Artifact: **4ea378aa-5993-48f8-b770-5467b6d96f8c**. Retained exact response: **39689 bytes**, 89 upstream timeseries points. SHA-256/source version: **a8a21482d68030827b94926d8ff7d51a68103c55c4df0cbdb74eb09f039f7642**. Recomputed payload checksum and VALIDATED manifest record-key/hash checks pass. The ledger's 49 fetched/valid records are the adapter's selected forecast window, not all 89 upstream points.

Provider issuance: **2026-09-10T05:22:59Z**, newer than the canary issuance 2026-09-09T17:27:37Z. The prior cache had expired. The scheduled request retrieved a new response and updated durable cache metadata:
- fetched_at / checked_at: 2026-09-10T05:24:57.826Z;
- Last-Modified: Thu, 10 Sep 2026 05:24:57 GMT;
- Expires: 2026-09-10T05:56:25Z.

The deployed transport uses conditional revalidation for an eligible expired cache. The trace and changed artifact prove a new response was fetched here; no 304/cache-hit result is claimed for this run.

All **37** overlapping identities have both a newer issuance and changes in one or more temperature/humidity/precipitation/wind values, with distinct revision hashes. The other **12** are new valid-time identities. All original rows were preserved field-for-field. This is legitimate forecast evolution, not duplicate corruption. The separate B.13 identical-data replay remains verified with zero inserts.

Physical MET rows are now **97** (48 prior + 49 new). The latest-revision public projection contains **60 MET identities**. All **49 OPEN_METEO** rows and their provider attribution remain unchanged. Total physical weather rows: **146**; total public weather rows: **109**.

## Location, value, temporal, and attribution truth

Provider: **MET Norway Weather API, Locationforecast 2.0**. Endpoint: https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=14.04&lon=35.38.

Location remains **El Gedarif / Gedaref Crops Market**, canonical **MKT-GD-01 / WFP market 2580**, state Gedaref / SD-GD. Requested latitude **14.04**, longitude **35.38** are valid. Provider point geometry is longitude 35.38, latitude 14.04, elevation 608 m. There is no coordinate substitution, additional location, or fabricated administrative relationship.

Every new stored row was checked against the exact retained response: temperature Celsius, relative humidity %, precipitation mm over the following provider interval, wind m/s explicitly converted to km/h, original wind m/s, provider issuance, UTC timestamps, requested/returned coordinates, forecast horizon, interval endpoints, and stale_after_at. **Zero unexplained value mutation.**

The selected valid-time range is **2026-09-10T05:00Z through 2026-09-12T05:00Z**. All MET rows remain **FORECAST**, including expired slots. They are model forecasts, not physical stations, live sensors, or satellite observations. Provider valid_time is distinct from retrieved_at; retrieving an old slot never makes it current.

Server identification remains **ZARATI/0.1 (https://github.com/samieltayeb-oss/zarati-platform)**. The exact deployed source and passing request-header tests establish this outbound header behavior; Vercel does not show provider-received header bytes. The incoming vercel-cron/1.0 header is a separate platform identity.

The [official MET API](https://api.met.no/) and [license](https://api.met.no/doc/License) support the documented free commercial-use path. No subscription or provider credential was introduced. Public attribution is **Data from MET Norway**, with source and [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) references and a note explaining forecast selection, wind conversion, and precipitation intervals. No partnership or government endorsement is implied.

## Freshness and public minimization

Anon-role queries returned **109 safe rows**, including 60 MET identities and 49 preserved Open-Meteo rows. At **2026-09-10T06:07:24.837513Z**, the MET projection contained **47 future-fresh forecasts and 13 stale forecasts**. Every is_stale value was recomputed against the database capture timestamp and approved policy. Forecasts expire as their valid time passes; historical rows remain stale. There is no fixed isStale=false behavior.

The exact public field allowlist passed: observation ID, geographic reference, requested/returned coordinates, valid_time, measurements, temporal/model/interval metadata, dynamic freshness, provider, original retrieval time, timezone, horizon, attribution/source/license/processing note, and precipitation interval bounds. No raw upstream payload, source_record_raw, artifact ID, lease, internal error, validation metadata, or secret is exposed. Private weather/artifact/ledger/lease/receipt grants and private cache RLS/grants remain restrictive.

## WFP isolation and lease cleanup

WFP independently completed its 03:00–03:59 UTC schedule:
- execution **68b32ecc-568f-4d84-8832-1593aa19ecb5**;
- started **2026-09-10T03:10:04.561184Z**, completed **03:10:11.704242Z**;
- succeeded, 23225 fetched, 5663 valid/existing, **0 inserted/rejected/quarantined**;
- unchanged artifact/version **3c00925b7c04192e7170dc5bce13cfaca898b0c1499e9f939540fec19f6cbee4**.

WFP remains **5666 physical / 5663 current valid / 102 public**. Fresh comparisons confirm unchanged repair lineage, counterpart/original truth, published rows, constraints, indexes, functions, triggers, grants, and RLS; no new correction, removal, or duplicate identity. This legitimate separate WFP schedule event was not manually triggered or caused by weather.

All feed leases have NULL owner/execution references and no RUNNING residue. Weather normal cooldown is **2026-09-10T06:24:58.512961Z**; WFP cooldown is **09:10:11.704716Z**. Separate feed locks and execution histories remain intact. No replay admission or policy bypass was used for the unattended run.

## Security regression and operational limits

| Gate | Result and basis |
| --- | --- |
| Migration 026 | PASS — fresh production helper/trigger security equivalence |
| Migration 028 | PASS — unchanged listing policies/functions/triggers/grants/RLS/safe view |
| Migration 029 | PASS — preserved immutable WFP repair truth and canonical counts |
| Migration 030 | PASS — exact tracked migration once in ledger, provider boundary and private cache/public projection verified |
| R4-A | PASS — canonical WFP provenance/publication remains intact |
| R4-B | PASS — production canaries, replay, recurring activation, and unattended MET execution verified |
| RFQ security | PASS — unchanged production helpers/triggers and exact-release real-DB tests |
| Listing security | PASS — fresh production policy equivalence and exact-release authorization tests |
| Rate limiting | PASS — unchanged tested fail-closed implementation |
| Media contract | PASS — unchanged tested MIME/security contract |

Failure safety retains separate provider locks, fenced execution IDs/tokens, truthful failed/partial ledger status, bounded cleanup retries, expired lease recovery, and successful-receipt public projection. Weather failure cannot mark a WFP execution failed. Last successful weather remains queryable with dynamic freshness. These failure paths are covered by the unchanged local suite; production was not intentionally broken.

This proves the first unattended MET run, not long-term uptime or an SLA. Daily forecasts and global model resolution have accuracy/freshness limits. No new alert delivery, physical sensor network, satellite processing, or weather UI was introduced. Provider-received header bytes were not independently captured. The one-window local observer completed and is not a recurring production dependency.

## Evidence and approved product truth

Durable sanitized evidence: **test-evidence/r4b14/scheduled-run.json**. Full private/raw captures remain ignored under scratch/r4b14-scheduled-* and scratch/r4b14-closure-*. Production retains the immutable artifacts, manifests, receipts, and ledgers. No secrets or raw operational payloads are committed. Normal branch push and clean main fast-forward preserve auditability; unrelated work is excluded.

Approved descriptions:
- WFP: **automatically synchronized public-source historical market observations**, with actual observation/source dates.
- Weather: **automatically refreshed forecast data from MET Norway**.

Do not claim real-time Sudan market prices, WFP/MET Norway/government partnership, a physical station network, live sensor measurements, or satellite weather intelligence. Open-Meteo recurring remains **OFF** unless separately licensed and authorized. FAO FPMA remains **DEFERRED**. **R4-C NOT STARTED. Gedaref pilot NOT ACTIVATED.**

**R4-B CLOSED — AUTOMATED WFP & FREE MET NORWAY WEATHER LIVE AND PRODUCTION VERIFIED.**
