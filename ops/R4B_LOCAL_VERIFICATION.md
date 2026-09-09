# R4-B.2 local verification and activation boundary

Migration 027 is corrected in place. Migrations 001?026 are unchanged. No 028 exists.

## Local-only verification

The verified project is Supabase project_id zarati, API http://127.0.0.1:54341,
PostgreSQL postgresql://postgres:postgres@127.0.0.1:54342/postgres.
The intended Vitest configuration and RPC test guard reject non-loopback URLs and
wrong ports before tests execute. Database tests use fixed loopback URLs and demo-only
JWT credentials, and mutate only the local database. Do not substitute cloud URLs.

1. Verify the Docker context is local and the zarati API/database ports match above.
2. Run supabase db reset --local --no-seed. This applies 001?016 and 018?027. 017 stays test-only.
3. Run supabase gen types typescript --local to regenerate types/database.types.ts.
4. Run npm run lint, npx tsc --noEmit, npm test, npm run build.

npm test is finite (vitest run). Tests intentionally seed local canonical reference
records and use the checksum-pinned, compressed public WFP fixture in __tests__/fixtures.
They do not use scratch files or live upstream responses. HTTP failure tests mock only
upstream transport. Staging, concurrency, recovery, revision and ledger tests use the
real PostgreSQL/Supabase implementation. Lost acknowledgements are simulated after a
real committed stage RPC to verify receipt idempotency.

For build verification, override both Supabase URLs and keys with the local demo
configuration, both R4-B enablement variables with false, and Upstash with a loopback
placeholder. A build does not authorize starting cron or deploying. Google Fonts
network access is required by the existing application font setup.

## Default-off production boundary

R4B_WFP_FEED_ENABLED=false
R4B_WEATHER_FEED_ENABLED=false

These are server-only settings. Only the exact string true enables a feed. Missing or
empty CRON_SECRET always denies authorization. Correct authorization does not bypass
the enablement gate. No production configuration was changed in this remediation.

Read-only Vercel verification found project zarati-platform belongs to
team_F08GAb9Fc81V3oeSy6zHebRL, on Hobby. WFP remains weekly (Monday 03:00 UTC), weather
is daily (04:00 UTC). Both schedules satisfy Hobby's once-daily maximum frequency.
Source: https://vercel.com/docs/cron-jobs/usage-and-pricing .
A daily weather run does not imply continuous fresh current weather: current estimates
expire after one hour; forecasts expire at valid time. Founder activation remains separate.

## Frozen feed contracts

- WFP V2 key: date, raw market ID, raw commodity ID, source price type, raw unit.
  Verified raw-ID mappings come from the pinned R4-A artifact. Unexpected labels for
  known IDs are durably quarantined, including new dated rows. Unmapped source rows
  stay in the archived payload; no new mapping or normalization is inferred.
- Raw artifact SHA-256 is computed by PostgreSQL from the captured UTF-8 payload.
  Each execution records its retrieval time and exact artifact ID. WFP observations
  reference that artifact's raw snapshot, never the latest unrelated snapshot.
- Existing raw observation truth is never overwritten. Corrections preserve incoming
  and prior truth in private feed_source_changes; removals reference the previous
  completed artifact. Rejected parsable-size bodies are retained privately with a
  failed execution. Oversized or invalid transport responses are rejected before storage.
- Raw feed_artifacts are immutable by resource and content SHA-256. Each execution
  has its own immutable feed_validation_manifests row: keys, fetched count, canonical
  manifest hash, validation status and error category. A rejected attempt never poisons
  a later validation of identical bytes. Contradictory previously validated manifests
  create a durable MANIFEST_CONFLICT rejection.
- Initial WFP completeness is established by the pinned artifact attestation in 027.
  Later artifacts may grow while retaining all previously trusted keys and source count.
  Any source-count decrease or missing mapped key is SUSPICIOUS_SOURCE_REDUCTION:
  rejected before staging, with no removal inference. A new initial artifact or legitimate
  reduction requires an explicit owner-reviewed feed_completeness_approvals row bound
  to exact content SHA-256, source count and manifest hash. Runtime service credentials
  cannot create or alter approvals. Evidence must identify the reviewed HDX resource/version
  and why completeness is trusted; ETag or Last-Modified alone is not proof.
  Manifest SHA-256 hashes sorted ASCII identity keys joined by LF, without a trailing LF.
  Approvals and validation attempts are immutable and private. Failed raw snapshots may
  retain record_count=0 (unknown at initial failure); validated counts live in manifests.
- Weather request location 14.04,35.38 is WFP source market 2580 (El Gedarif), mapped to
  MKT-GD-01 by migration 016. The artifact and lookup are repository-verifiable.
  Provider grid coordinates are stored separately; a grid over 0.5 degrees away is rejected.
- Weather taxonomy: CURRENT_MODEL_ESTIMATE, FORECAST, HISTORICAL. Provider UTC valid
  time, interval, units, requested/grid coordinates and model-blend provenance are stored.
  generationtime_ms is never treated as a source version. Revision hashes cover source
  values, valid time, interval, channel and model provenance, excluding retrieval time.
  Identical revisions reuse immutable rows; per-execution receipts identify which
  revision was delivered, including a return to an earlier provider value.
- v_public_weather is a definer, security-barrier safe projection following migration
  025. It exposes no payload, raw record, execution details, token or error. Only
  successfully completed executions contribute; latest is ordered by execution start,
  execution ID and observation ID. is_stale is calculated from database time and valid time.

## Bounds and terminal states

Three upstream attempts; 15-second per-request timeout including body reads; 250/500ms
backoff; 240-second run deadline; 8MiB decoded payload cap; 50,000 rows; 250-row batches.
Work database calls use the bounded operational deadline. Finalization uses a separate
30-second deadline; the 240-second work plus 30-second cleanup budgets fit maxDuration=300.
A deadline race also bounds uncooperative work. finish_feed gets DEADLINE_EXCEEDED,
sets FAILED/completed_at and releases the lease. Cleanup retries at most three times,
checking terminal state for lost acknowledgements. If cleanup itself cannot reach the DB,
503 is returned and the ten-minute lease remains available for fenced takeover. Batch retries are limited to
three attempts and use immutable receipts so lost acknowledgements cannot double-count.
Leases last ten minutes, use database row locking and opaque owner tokens, and fence all
writes. Expired takeover marks the old execution failed. Explicit completion releases
the lease. Admission cooldown after completion is six hours for WFP, one hour for weather.

SUCCEEDED: all mapped records accounted for, no quarantine/rejection/error, nonempty.
PARTIAL: all records accounted for but some require quarantine/review.
QUARANTINED: every mapped record is quarantined.
FAILED: transport, schema, reference, write or verification failure, including incomplete
batches. Counters from already committed batches remain visible. A failed terminal write
returns 503 and leaves an expiring lease for recovery; it never returns success.

Operational last success: filter external_feed_executions by feed_type and succeeded,
order by completed_at DESC, id DESC. This measures execution health only, not source freshness.

## Security regression extension

Real authenticated INSERT tests exposed two inherited creation-state gaps beyond the
old UPDATE-only checks: accepted RFQ insertion and approved listing insertion. Narrow
BEFORE INSERT guards in 027 now require pending RFQs and unapproved initial listings;
001?026 remain unchanged. Existing privileged service/admin workflows are preserved.
Listing seller verification derives from the protected profiles.is_verified field.

## Release hygiene

The public compressed CSV fixture is intentionally included with its SHA-256 and source
attribution. It is not a production database export. No production dumps, secrets, or
scratch outputs were added. Existing tracked backups and prior repair/governance artifacts
are inherited baseline files and were not rewritten or newly committed. Ignore rules
now exclude scratch, test caches and future backup files; existing governance notes stay intact.

No deployment, production migration, production feed activation, R4-C or FAO scraping
is authorized or performed by these instructions.

## Live public transport verification

The inherited WFP GUID URL returned 404. Public HDX package_show metadata verified
the correct dataset 369e003b-f0af-4e48-99d7-34fc85b44635 and resource
8fea18b2-615f-4af5-9bd5-85cc31a25ffd. The corrected URL returns a signed redirect to
the specific HDX S3 filestore path. Transport allows at most two redirects, only to
the original origin or that verified file path; signed query strings are never persisted.
A real bounded fetch returned 2,924,466 bytes with the exact pinned fixture SHA-256,
23,225 source rows and 5,663 mapped records. This check did not use any database.
Provider-supplied SHA-256 checksum headers are verified when present.
