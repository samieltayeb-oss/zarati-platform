# R4-B.2 remediation evidence

Branch: phase/r4-b-automated-feeds. Local changes remain uncommitted.
Migration 027 corrected directly; migrations 001?026 unchanged; no 028; no R4-C.

## Executed final gates

- Local reset: PASS, supabase db reset --local --no-seed, applying 001?016 and 018?027.
- Generated database types from supabase gen types typescript --local: PASS.
- npm run lint: PASS, zero errors/warnings.
- npx tsc --noEmit: PASS.
- npm test: PASS, 9 files / 78 tests. Database tests use real local PostgreSQL/Supabase.
- npm run build: PASS, Next.js 16.2.9, 50 generated pages. Supabase URLs/credentials
  were overridden to the local demo instance; both feeds forced off. Existing Google
  Fonts fetching required network permission. No deployment command was run.
- Client bundle scan: zero matches for CRON_SECRET, SUPABASE_SERVICE_ROLE_KEY,
  either R4-B enablement flag, or the local build-only secret marker.
- Git diff: only 027 changed under supabase/migrations. No backup or scratch dump changes.
  The malformed .gitignore NUL entries are removed; deprecated .eslintignore migrated.

## Database-backed outcomes

- Actual WFP source: 23,225 rows; 5,663 mapped; 5,663 distinct V2 identities.
  Complete identity set equals the tracked R4-A repair artifact.
- First local database stage: 5,663 inserted. Same-database replay: 0 inserted,
  5,663 existing. Publication remains INGESTED; anonymous safe view exposes none.
- Incremental record: 1 inserted; previous rows preserved.
- Changed price/currency and commodity label: durable private correction evidence;
  immutable previous observation retained. Removed rows produce version/removal evidence.
- All mapped records corrected: QUARANTINED, never SUCCEEDED.
- Truncated export: rejected and archived privately as a failed artifact.
- Same-feed simultaneous acquisition: exactly 1 winner, tested for both feeds.
  Different feeds acquire independently. Expired takeover fences the old token.
- Cooldown enforced. Lock errors deny execution. Terminal update failure returns 503
  and leaves the expiring lease recoverable; it never returns a success response.
- Weather current/model and actual hourly forecast rows stage into PostgreSQL.
  Identical replay inserts 0; revised values create immutable revisions.
  Lost acknowledgement after real committed writes retries without duplicate counters.
  Returning to an earlier revision reuses the row while updating the latest public selection.
- Historical provider timestamps remain stale after fresh retrieval. Public weather
  includes no raw payload/record. Ordinary update/delete of weather truth is rejected.
- Authenticated buyer self-accept, unrelated contact reveal, listing self-moderation,
  ownership changes and seller-profile verification/role escalation are denied.
- Additional direct INSERT checks reproduced inherited accepted-RFQ and self-approved
  listing creation gaps. Narrow 027 insert guards now deny both; 026 is not edited.
- Production rate limiting without configuration fails closed. Actual PNG input is
  re-encoded as JPEG with matching extension, storage MIME, and database media type.

## Real public-source reads (no database involved)

The inherited WFP URL returned 404. Public HDX package_show metadata verified dataset
369e003b-f0af-4e48-99d7-34fc85b44635 and resource 8fea18b2-615f-4af5-9bd5-85cc31a25ffd,
with CC BY-IGO attribution. The adapter now permits its bounded, explicitly allowlisted
HDX S3 redirect. The live file returned 2,924,466 bytes and SHA-256
3c00925b7c04192e7170dc5bce13cfaca898b0c1499e9f939540fec19f6cbee4,
exactly matching the pinned fixture and 23,225/5,663 counts.

The live full Open-Meteo request parsed 49 records: 1 CURRENT_MODEL_ESTIMATE,
43 FORECAST, 5 HISTORICAL. Returned grid: 14.024605,35.419357; requested Gedaref
location: 14.04,35.38, verified from WFP market 2580. UTC interpretation and actual
Celsius, mm, percent and km/h units were verified. No live-source data was written
into a production database.

## Production boundary

Read-only Vercel team API verified the linked team is Hobby. Weather is daily at
04:00 UTC; WFP is weekly Monday at 03:00 UTC. Both fit Hobby frequency limits.
Both server-side feed enablement variables default OFF, even with correct cron auth.
Daily scheduling does not extend the one-hour current-weather freshness window.

No production database changes, migration application, deployment, cron activation,
automated production WFP, production weather writes, FAO scraping, or R4-C work.
Production authorization still requires the final independent red-team recheck.

See ops/R4B_LOCAL_VERIFICATION.md for contracts, limits, semantics and reproduction.
