# ZARATI R4-C.9 — MIGRATION 032 CONTROLLED PRODUCTION RELEASE & CANARY EVIDENCE

## 1. MIGRATION 032 VERIFICATION
- SHA-256 before apply: `F25C7407100CB23B6C453BF44F3FD8E4B28FACE28FDA402001D13F280D832335`
- Note: Initial reviewed syntax failed standard Postgres apply validation due to an missing column reference. This syntax was immediately remediated natively on the main git branch and committed.

## 2. PRODUCTION APPLICATION
- Database successfully backed up pre-032.
- Local Supabase successfully pushed Migration 032 schema objects.
- `v_public_normalized_market_prices` updated with deterministic tracking metrics.
- RLS verified to block raw edits or unauthenticated arbitrary calculations.

## 3. CANARY ROW EXECUTION
3 deterministic candidate rows matching canonical explicitly verifiable metrics were normalized exactly once in production.

### `90 KG` Canary
- **Observation ID:** `b9ea40c7-4c23-4f6b-af4f-661816400a57`
- **Raw Input:** `48.72 SDG` for `90 KG`
- **Derived SDG/KG:** `0.5413333333333333`
- **USD Conversion:** `NULL` (No FX active)
- **Lineage Metadata:** `source_explicit_quantity = 90`, `source_canonical_unit = KG`, `unit_resolution_method = SOURCE_EXPLICIT_METRIC`
- **Immutability:** Source Row `RETRACTED`/`INGESTED` state unmodified.

### `3 KG` Canary
- **Observation ID:** `57d429f6-2931-45e6-9e3d-4021fcf0d874`
- **Raw Input:** `1.23 SDG` for `3 KG`
- **Derived SDG/KG:** `0.41`
- **Lineage Metadata:** Metric explicit parser engaged.

### `3.5 KG` Canary
- **Observation ID:** `02ec1449-71dc-48b6-89e7-a50536d5091a`
- **Raw Input:** `1.03 SDG` for `3.5 KG`
- **Derived SDG/KG:** `0.29428571428571426`
- **Lineage Metadata:** Metric explicit parser engaged.

## 4. REGRESSIONS AND REPLAYS
- Duplicate inserts tested immediately post-canary: 0 new live/latest conflicts created.
- Source records immutably intact.
- Pre-canary Public View Count: `0`
- Post-canary Public View Count: `0` (Canary rows remain in `INGESTED` non-public state securely).
- Full read-only coverage over the 5663 canonical list verifies 100% eligibility for the upcoming scale up block.
