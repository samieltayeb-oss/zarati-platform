# ZARATI PHASE R1-B: PRODUCTION DEPLOYMENT GATE & TRANSITION SPECIFICATION

**Document Reference:** `ZARATI-R1B-GATE-001`  
**Execution Date:** September 2026  
**Target Environment:** Production Supabase & Vercel (`https://zarati-platform.vercel.app/`)  
**Founder & Sole Authorization:** Sami Suliman Eltayeb  
**Contact Email:** `sam@nexorayyc.io`  
**Gate Status:** 🛑 **HARD STOP — AWAITING FOUNDER EXPLICIT APPROVAL TO DEPLOY**  

---

## 1. Production Readiness Declaration

Phase R1-B technical objectives have been successfully completed on local and staging infrastructure:
- [x] **Database Schemas & Extensions:** 17 deterministic migrations engineered and tested.
- [x] **Relational Constraints:** 9 / 9 database integrity tests passing.
- [x] **Row Level Security (RLS):** 19 / 19 adversarial authorization scenarios passing.
- [x] **Centralized Type Generation:** `types/database.types.ts` generated from live catalog.
- [x] **Dual-Mode Gateway:** Client services support live DB queries with instant mock fallback.
- [x] **Automated Tests:** 42 / 42 unit tests passing; 0 lint errors; clean Next.js Turbopack build.
- [x] **Production Isolation:** Zero schema changes or migrations have touched production Supabase. Production application remains fully operational on mock fallback (`NEXT_PUBLIC_USE_MOCK_DATA="true"`).

---

## 2. Proposed Production Migration Sequence

When founder approval is granted, the production database migration must execute strictly as follows:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 PROPOSED PRODUCTION EXECUTION MANIFEST                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. 20260904000001_001_core_extensions_and_helpers.sql                      │
│    (Enables uuid-ossp, pg_trgm, updated_at trigger; preserves waitlist)     │
│ 2. 20260904000002_002_create_profiles.sql                                   │
│ 3. 20260904000003_003_create_trader_profiles.sql                            │
│ 4. 20260904000004_004_create_states.sql                                     │
│ 5. 20260904000005_005_create_markets.sql                                    │
│ 6. 20260904000006_006_create_crops.sql                                      │
│ 7. 20260904000007_007_create_farms.sql                                      │
│ 8. 20260904000008_008_create_farm_crops.sql                                 │
│ 9. 20260904000009_009_create_crop_prices.sql                                │
│ 10. 20260904000010_010_create_listings.sql                                  │
│ 11. 20260904000011_011_create_listing_media.sql                             │
│ 12. 20260904000012_012_create_inquiries.sql                                 │
│ 13. 20260904000013_013_create_moderation_events.sql                         │
│ 14. 20260904000014_014_create_views.sql                                     │
│ 15. 20260904000015_015_enable_rls_and_policies.sql                          │
│ 16. 20260904000016_016_seed_reference.sql                                  │
│    (Seeds official 18 states, 10 markets, 8 strategic crops)                │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🛑 EXCLUSION: 20260904000017_017_seed_mock_parity.sql IS NOT TO BE DEPLOYED │
│    TO PRODUCTION. Mock identities, test users, and simulated listings       │
│    belong strictly to Local/Staging environments.                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Preservation of Live Waitlist Data

The existing production `waitlist` table contains live user registrations.
- Migration `001` specifies `CREATE TABLE IF NOT EXISTS public.waitlist (...)`.
- No `DROP TABLE` or destructive column alterations are performed on `waitlist`.
- Waitlist records will remain completely intact and uncorrupted.

---

## 4. Rollback & Contingency Plan

If any unexpected error occurs during production execution:
1. **Immediate Abort:** The migration execution transaction automatically rolls back failing statements.
2. **Gateway Protection:** `NEXT_PUBLIC_USE_MOCK_DATA="true"` ensures the public Vercel website never exhibits a 500 error or broken UI even if the database is temporarily unreachable.
3. **Point-in-Time Recovery (PITR):** A full database snapshot will be taken via Supabase Dashboard prior to executing Migration 001.

---

## 5. Formal Production Gate Hold

> [!CAUTION]
> **GATE LOCK ACTIVE:** In strict compliance with the project governance charter, the agent will **NOT** apply any SQL migrations, create tables, or execute commands against the production Supabase database. Execution is halted. Awaiting explicit founder sign-off.
