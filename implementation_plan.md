# R4-B MASTER IMPLEMENTATION GATE

This document establishes the architecture and execution plan for the R4-B Master Implementation Gate (Basic Weather + Automated External Feeds).

## Branch Strategy
- The verified production baseline has been successfully reconciled into `main`.
- R4-B implementation will occur exclusively on `phase/r4-b-automated-feeds`.

## Cron Design
- **Standard Vercel Cron** via `vercel.json` and standard Next.js API Route Handlers.
- Protected by `CRON_SECRET` validation.
- Endpoints will feature execution locking, concurrency prevention, timeout handling, and failure isolation.
- Cron will **NOT** be activated in production during this local implementation gate.

## Source Revalidation

- **WFP Market Monitor**: YES. Public HDX CSV download. No API key required for public dataset access. V2 identity contract (`WFP_SDN_V2_{date}_{market_id}_{commodity_id}_{pricetype}_{unit}`) will be strictly enforced using the raw source IDs, not derived cropCodes.
- **Open-Meteo**: YES. Free public API without API key. Confirmed JSON response for temperature, humidity, precipitation, wind.
- **FAO FPMA**: NO. Lacks public developer API. Blocked/Deferred. We will NOT scrape undocumented endpoints or claim fake partnerships.

## Proposed Changes

### Database Migration (027_r4_b_infrastructure.sql)

#### [NEW] supabase/migrations/20260908000027_027_r4_b_infrastructure.sql
This migration will introduce:
- `external_feed_executions` table: To track feed state (`scheduled`, `running`, `succeeded`, `partial`, `failed`, `quarantined`). Tracks `records_fetched`, `records_valid`, `records_inserted`, `records_existing`, `records_rejected`, `records_quarantined`.
- `weather_observations` table: For basic weather telemetry (temperature, precipitation, humidity, wind) linked to geographic coordinates/markets.
- Enums for feed status and feed types (`WFP`, `OPEN_METEO`).
- Immutability and RLS policies for telemetry.

### Source Adapter Architecture

#### [NEW] lib/feeds/ExternalFeedAdapter.ts
Abstract base class defining the contract:
- `fetch()`
- `validate()`
- `parse()`
- `deriveSourceIdentity()`
- `stage()`
- `verify()`

#### [NEW] lib/feeds/wfp/wfp-adapter.ts
Implementation of WFP CSV ingestion using strict V2 deterministic identity logic.

#### [NEW] lib/feeds/weather/open-meteo-adapter.ts
Implementation of Open-Meteo API fetching.

### Automation & Security

#### [NEW] app/api/cron/wfp/route.ts
#### [NEW] app/api/cron/weather/route.ts
Vercel cron job endpoints protected by Authorization header checks (e.g. `CRON_SECRET`). Will handle execution locking to prevent concurrent runs.

## Verification Plan

### Automated Tests
I will create a testing suite (e.g. `tests/feeds/wfp-replay.test.ts`) that verifies:
- WFP Historical Replay maps exactly 5663 identities with 0 semantic collisions.
- Duplicate replay creates 0 duplicates.
- Feed failure isolation correctly traps errors without crashing the system.
- Scheduler endpoint returns 401 Unauthorized without the correct secret.

### Manual Verification
- Output the required final response matrix upon successful local implementation.
- DO NOT perform production ingestion, nor deploy to Vercel, nor enable cron in production.
