# R4-B MASTER IMPLEMENTATION GATE

This document establishes the architecture and execution plan for the R4-B Master Implementation Gate (Basic Weather + Automated External Feeds).

## User Review Required

> [!WARNING]
> **Branch Divergence Alert**: 
> The repository working branch `phase/r3-5-sovereign-experience` contains commits absent from `main` (specifically: migrations 025 and 026, R4-A repair artifacts, and the Cairo typography changes). 
> **Are you comfortable with me continuing development on this branch, or do you want to merge it to `main` first before I begin R4-B implementation?**

> [!CAUTION]
> **FAO FPMA Source Revalidation Failed**:
> Our research has confirmed that there is **no publicly documented, open-access API developer portal** for the FAO Food Price Monitoring and Analysis (FPMA) database. While they use internal API services for their own apps, these are not exposed for public developer integration without a formal partnership.
> **Decision**: FAO automated ingestion is **BLOCKED/DEFERRED**. We will not fake it. I will document this in the evidence file.

## Open Questions

1. Should I continue on `phase/r3-5-sovereign-experience`, or create a new branch `phase/r4-b-automated-feeds` diverging from here?
2. Do you have a preferred cron scheduling tool for Vercel (e.g. standard `@vercel/cron` via `vercel.json` and edge functions)? I plan to use standard Vercel Cron.

## Source Revalidation

- **WFP Market Monitor**: YES. Public HDX CSV download. No API key required for public dataset access. V2 identity contract (`WFP_SDN_V2_{date}_{market}_{commodity}_{price_type}_{unit}`) will be strictly enforced.
- **Open-Meteo**: YES. Free public API without API key. Confirmed JSON response for temperature, humidity, precipitation, wind.
- **FAO FPMA**: NO. Lacks public developer API. Blocked.

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
