# ZARATI_R4_A_M025_FORWARD_FIX_EVIDENCE

## Root Cause
The public safe views (`v_approved_market_prices` and `v_legacy_crop_prices_bridge`) in Migration 024 were declared with `WITH (security_invoker = true)`. This caused PostgreSQL to evaluate the `SELECT` query against the underlying `market_price_observations` table using the invoking user's privileges (`anon` or `authenticated`). Because these roles correctly lack `GRANT SELECT` on the internal base table to enforce the strict data minimization law, PostgreSQL raised a `permission denied for table market_price_observations` error before any Row-Level Security could be evaluated.

## Failing Role/Path
* **Role:** `anon` and `authenticated`
* **Path:** `SELECT * FROM public.v_approved_market_prices`
* **Error Code:** `42501` (Insufficient Privilege)

## Security Analysis & Selected Remediation
* **Rejected Alternative (RLS on Base Table):** Granting `SELECT` to `anon` on the base table with an RLS policy would allow direct querying of internal/raw columns (e.g. UUIDs, `raw_price_text`, internal notes) for published rows, violating the strict column-level data minimization requirement.
* **Selected Pattern (Definer-rights Views with Security Barrier):** The minimal and secure forward fix is to remove `security_invoker = true`, making the views execute with the privileges of their owner (`postgres`) who has access to the underlying table. The view retains `security_barrier = true` to prevent side-channel leakage of unpublished rows via optimizer pushdown. Because the view definition itself strictly shapes the output (`WHERE mpo.publication_status = 'PUBLISHED'` and maps only safe columns), it guarantees that only fully verified and sanitized projections are accessible.

## Migration 025 Validation
* **Checksum:** (Git SHA generated upon commit)
* **Local 001-025 Reset:** PASS
* **Local Adversarial Results:**
  * **Anon Safe View:** PASS (0 errors, properly returns only published projection)
  * **Auth Safe View:** PASS (0 errors, properly returns only published projection)
  * **Internal Table Denial:** PASS (Direct SELECT on `market_price_observations` explicitly denied)
  * **Unpublished Isolation:** PASS (Ingested/Quarantined/Review/Retracted states remain fully hidden)
* **Production Application Result:** Vercel routes load correctly. API calls to `v_approved_market_prices` return HTTP 200 with `[]` instead of 401/403/500.

## Production Evidence
* **Production Project:** `nelsijiczufflyqosvzi`
* **Production Ledger:** `001-025`
* **Regressions:** Upstash, Media/Storage, R1 Auth, R2 Security, R3 Marketplace all verified operational.
* **Real Data State:** NO real data imported yet. Product truth correctly represents no real-time data until ingestion begins.
