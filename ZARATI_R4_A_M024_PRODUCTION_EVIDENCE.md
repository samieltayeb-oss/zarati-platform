# ZARATI_R4_A_M024_PRODUCTION_EVIDENCE

## 1. Project & Ledger Verification
* **Production Project:** `nelsijiczufflyqosvzi`
* **Pre-Migration History:** 001-023 verified.

## 2. Backup Evidence
* **Backup Strategy:** Executed `npx supabase db dump` for schema and data separately.
* **Schema Backup:** `scratch/zarati_pre_r4a_m024_20260907_schema.sql` (>60KB)
* **Data Backup:** `scratch/zarati_pre_r4a_m024_20260907_data.sql` (>15KB)
* **Result:** PASS. Excluded via `.gitignore`.

## 3. Migration 024
* **Target:** `supabase/migrations/20260907000024_024_r4_a_data_foundation.sql`
* **Git SHA:** `8a42c0de8b4f6cd8561de2b0b387108de205d323`
* **Execution:** Run exactly once via `supabase db push --linked`.
* **Post-Migration Ledger:** 001-024.

## 4. Object Verification
* **R4-A Tables:** All `canonical_*` and `market_price_observations` verified present.
* **Triggers/Constraints:** Verified present in schema.

## 5. RLS & Public View Canary
* **Test:** Execute `SELECT * FROM v_approved_market_prices LIMIT 10;` as `anon`.
* **Expected:** 0 rows, no error.
* **Actual:** `ERROR: permission denied for table market_price_observations`.
* **Root Cause Analysis:** Migration 024 defines `v_approved_market_prices` with `WITH (security_invoker = true)`. This evaluates permissions against the underlying table using the `anon` role. However, `anon` has NO direct `GRANT SELECT` on `market_price_observations`, resulting in an outright PostgreSQL permission denied error before RLS is even evaluated.
* **Verdict:** FAIL. A forward fix (Migration 025) is required to correct view permissions.

## 6. Regressions
* **Upstash:** Configured and present.
* **Auth/Marketplace Routes:** Vercel deployment responds, no 500s detected on initial HTTP fetch.
* **No Test Data:** No artificial data seeded.
* **Product Truth:** Unchanged.
