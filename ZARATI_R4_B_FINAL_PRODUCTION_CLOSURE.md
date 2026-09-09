# ZARATI R4-B.11 — partial production activation

2026-09-09 UTC. **WFP recurring ON and verified. Weather recurring OFF, awaiting provider-use eligibility confirmation. R4-B is not fully closed.** No R4-C or Gedaref pilot activation.

## Canonical repository and production

Production ledger: **001–016, 018–029**; 017 absent; 029 exactly once. Initial production and remote main SHA: `01400a8517982953725e67172f261bf18dcc5b7b`.

Activation main SHA: **`51aed334f7ee10474c994d9b24169d977d9033f1`**. Deployment **`dpl_2CEMnhpLeT4MZhKR8CyeyCz3jQmM`**, READY, production/main, URL `https://zarati-platform-qjwh442uj-samieltayeb-oss-projects.vercel.app`, owns `https://zarati-platform.vercel.app` at activation verification. A subsequent evidence-only commit containing this report and the operator query retains the exact application and cron configuration; its SHA is recorded by Git and the final deployment verification.

Before activation, the R4-B production release, WFP canary/forensic, Open-Meteo canary evidence and B.10 one-use replay-admission SQL were reconciled into canonical main. Seven intended files only, including the schedule change and activation plan; normal branch push, clean isolated-main fast-forward, normal main push. No force push or unrelated work included. All production-applied migrations through 029, its repair tests and completed repair evidence are tracked. Migration 029 SHA-256 remains `97f19a64df35fca90c8e0696e66e404367ed13434d41057f9d8fadcf19f70596`; fresh production schema/ledger comparison passes. No production migration or repair was run in B.11.

## Local tooling restored

Docker Desktop was started from its verified installed path `C:/Users/mcreg/AppData/Local/Programs/DockerDesktop/Docker Desktop.exe`. Existing Zarati services recovered; database and Supabase HTTP were verified reachable on 127.0.0.1:54342 and :54341. Early startup reported the database was still starting; later health and connectivity passed.

- `npm run lint`: PASS.
- `npx tsc --noEmit`: PASS.
- `npm test`: **156 PASS in 11 files**, 77.90 seconds, no skipped tests.
- Direct local migration ledger: 001–016, 018–029, matching production sequence. No fresh reset was needed after the complete real-database suite passed; this is a ledger/test verification, not a new reset claim.

The full suite covers real local listing/RFQ authorization, immutable WFP repair/replay, weather temporal/unit/idempotency behavior, cron authentication/locking/failure behavior, rate-limit fail-closed and media MIME contracts. Tests were restricted by the repository local-target guard; none ran against production.

## Schedules and source characteristics

| Feed | Cron | UTC window on current Hobby plan | Final gate |
|---|---|---|---|
| WFP | `0 3 * * *` | Daily 03:00–03:59 | ON |
| Open-Meteo | `0 5 * * *` | Daily 05:00–05:59, configured but gate blocked | OFF |

Existing expire remains `0 2 * * *`. Vercel UI confirmed both daily feed definitions and the pre-existing enabled global cron feature. Separate windows avoid unnecessary collisions. [Vercel Hobby limits](https://vercel.com/docs/cron-jobs/usage-and-pricing) allow daily jobs with one-hour timing uncertainty; hourly expressions are not supported on this plan. No plan upgrade was performed.

Fresh [HDX metadata](https://data.humdata.org/api/3/action/package_show?id=369e003b-f0af-4e48-99d7-34fc85b44635) reports `data_update_frequency: 30`, resource last_modified `2026-09-06T17:36:34.579114`, and dataset coverage `2001-01-15` through `2026-08-15`. Daily polling conservatively discovers institutional source releases without aggressive hourly requests. An unchanged response reuses the approved artifact and existing identities; changed artifacts still face the existing completeness/correction model. No completeness override was added.

Daily weather is the forecast-oriented frequency available on Hobby. The two-calendar-day response provides forecast coverage across a daily refresh. Current/model estimates expire at valid time + one hour and therefore will be stale for most of a day. Forecasts expire at their provider valid time. Historical rows always remain stale. A daily job must not be described as continuously fresh current conditions. One location only remains configured: El Gedarif / Gedaref Crops Market, requested 14.04,35.38.

**Weather blocker:** [Open-Meteo pricing](https://open-meteo.com/en/pricing) permits its free/open-access endpoint only for non-commercial use. The existing implementation uses that endpoint without a key. Whether this deployment is a non-commercial evaluation or has suitable commercial access has not been established. A clarification was requested and remained unanswered at this evidence capture. No weather activation, subscription purchase, credential change, or endpoint change was performed. A commercial subscription would require its appropriate endpoint/key configuration and validation; it is not assumed to authorize the unchanged free endpoint.

## First WFP execution after activation

WFP alone was enabled (`R4B_WFP_FEED_ENABLED=true`) while weather stayed false. Canonical-main deployment became READY before the trigger. Exactly one click on Vercel's WFP Run control invoked the intended managed production cron route; the platform supplied authentication without exposing the secret.

This is an **operator-triggered managed cron verification**, explicitly allowed by the activation brief. It is not evidence of an unattended 03:00 clock event. The next unattended window is 2026-09-10 03:00–03:59 UTC.

| Field | Actual result |
|---|---|
| Execution ID | `42011e62-901b-4659-9f5e-50ff5455cd29` |
| Started UTC | 2026-09-09 15:38:05.489261 |
| Retrieved UTC | 2026-09-09 15:38:06.354 |
| Completed UTC | 2026-09-09 15:38:13.165612 |
| Ledger duration | 7.676351 seconds |
| HTTP / ledger status | 200 / succeeded |
| Fetched | 23225 |
| Valid / existing | 5663 / 5663 |
| Inserted / rejected / quarantined | 0 / 0 / 0 |
| Unmapped (existing limited coverage) | 17562 |
| Error category | NULL |
| New conflicts / removals | 0 / 0 |
| Automatic publication | 0 |
| Public WFP | 102 |
| Batch / record receipts | 23 / 5663 |

Vercel logs show one GET `/api/cron/wfp`, HTTP 200, at 15:38:04.784 UTC on the correct activation deployment. Production ledger count increased from three to four WFP executions only. Weather executions remained two (the prior B.10 canary and replay).

Artifact `a815abed-7e8b-4087-a138-4d32cd054439`, 2,924,466 bytes, SHA-256 `3c00925b7c04192e7170dc5bce13cfaca898b0c1499e9f939540fec19f6cbee4`. A fresh database recomputation confirms the retained exact payload checksum. Manifest VALIDATED, 23,225 fetched, hash `9e1db34581a8f954cf72643509fa0c0f0c411246b1227883db771b0d6e18b70d`; existing approved full-source completeness remains intact.

Final WFP lease owner token and execution ID are NULL. next_allowed_at is **2026-09-09 21:38:13.166040 UTC**, normal six-hour cooldown, before the next scheduled window. No bypass or replay admission was used. No duplicate run, active lease, RUNNING residue, extra operator retry, or publication occurred.

## Weather remains unactivated

New weather executions in B.11: **0**. New weather observations: **0**. Existing observations/public rows: **49/49**. Existing duplicate revisions: **0**. Prior B.10 last success remains `d76268ca-7b06-43c3-92d8-23c63dbb663f`, completed 14:53:02.164845 UTC. No first recurring-weather run can be claimed.

Fresh read-only verification reconfirmed all existing weather values/units/valid times/revision hashes against retained provider artifacts; requested coordinates are distinct from provider grid coordinates 14.024605,35.419357. Taxonomy remains 1 current model estimate, 33 forecasts, 15 historical model rows. The anon projection was queried at its own captured database timestamp and its dynamic freshness matched for every row. This is ongoing data-integrity/freshness-policy verification, not evidence of automatic refresh while the gate is OFF.

Anon fields remain exactly: id, geographic_reference, latitude, longitude, valid_time, temperature_celsius, precipitation_mm, relative_humidity_percent, wind_speed_kmh, temporal_class, model_provenance, interval_seconds, is_stale. No raw payload, source_record_raw, artifact ID, execution errors, leases, internal validation metadata or secrets. Direct anon SELECT grants on private weather/artifact/ledger/lease/manifest tables remain false.

## Isolation, observability and security

Feed locks are separate rows keyed by feed_type; running uniqueness is per feed, execution IDs/tokens are separate, and finish targets the exact execution and owner token. Passing local tests include same-feed concurrent contention, independent other-feed acquisition, token fencing, cooldown, and failure finalization. Production WFP activation left weather data and execution history unchanged. Feed isolation: PASS.

`ops/r4b-feed-status.sql` is a verified, read-only **private operator** query exposing last execution, last success, source version/artifact, counters, error status, running count and safe lease status without owner tokens or raw payloads. Weather output includes evaluated_at, latest valid time, fresh current/forecast counts and stale rows. It was executed successfully against production. Vercel logs provide HTTP request diagnostics. Failed/partial history is retained, including the original resolved WFP partial run, rather than hidden. No new public operational endpoint was added. Alert delivery/24-hour attended monitoring was not implemented or tested.

| Regression | Result and basis |
|---|---|
| Migration 026 | PASS — fresh production definition equivalence and local security suite |
| Migration 028 | PASS — unchanged listing policies/functions/triggers/grants/RLS/view and real local authorization tests |
| Migration 029 | PASS — exact ledger/schema evidence, immutable lineage and local repair tests |
| R4-A | PASS — physical 5666/current 5663/public 102, no publication or lineage change |
| RFQ privacy | PASS — current local RPC tests plus unchanged production helper/trigger definitions |
| Listing moderation | PASS — real local matrix plus production policy equivalence |
| Rate limiting | PASS — current local tests, unchanged deployed implementation; no live outage test |
| Media | PASS — current local MIME contract tests and unchanged deployed implementation |
| R4-B technical foundation/WFP | PASS |
| R4-B full activation/closure | NOT CLOSED — recurring weather eligibility and first run unresolved |

No production destructive security tests were run. All three repaired WFP audit links, original source truth, preserved counterpart rows and conflict evidence match the preflight. WFP corrections remain three historical records, removals zero, current duplicate keys zero.

## Product truth and remaining work

WFP may be described as **automatically synchronized historical/public-source market observations**, with actual observation/source dates. Do not call it real-time prices, today's market prices, government prices or a WFP partnership. No marketing-copy claims were changed.

Weather is still prior canary data and must not yet be described as automatically refreshed production weather. No government meteorological partnership, station observations or satellite intelligence is implied. Once eligibility is resolved, activate weather second, respect its normal cooldown, and verify a separate managed run before declaring full closure. Daily current-estimate freshness limitations remain even after activation.

FAO FPMA: **DEFERRED/BLOCKED** pending a suitable approved official automated source. R4-C: NOT STARTED. Gedaref pilot: NOT ACTIVATED.

Supporting ignored captures: `scratch/r4b11-preflight.json`, `scratch/r4b11-source-metadata.json`, `scratch/r4b11-wfp-run.json`, `scratch/r4b11-wfp-detail.json`, `scratch/r4b11-security.json`, `scratch/r4b11-weather.json`, `scratch/r4b11-anon.json`, `scratch/r4b11-operator-status.json`. Durable production artifact/manifest/execution records remain private. No secrets appear in this report.

**Final activation state: WFP ON. Weather OFF. Partial activation; do not declare R4-B closed.**
