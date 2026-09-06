# ZARATI_R3_BLOCKER_FIX_REPORT

## 1. MIGRATION 023 — RPC FIX
- **Action**: Created `20260905000023_023_fix_r3_contact_rpc.sql`
- **Resolution**: Fixed PL/pgSQL ambiguous column `role`. Re-aliased variables cleanly (`v_role_val`). Preserved all privacy structures and SECURITY DEFINER bindings.
- **Verification**: New DB tests (`__tests__/rpc.test.ts`) strictly prove the matrix: Pending->Denied, Unrelated->Denied, Accepted->Safe Mutual Contact string.

## 2. APPLICATION — MEDIA UPLOAD FIX
- **Action**: Wired `uploadListingMediaServerAction` into `FarmerDashboardClient`.
- **Resolution**: Integrated file selection, basic preview, size limits, and `FormData` upload flow in a new UI FormStep (4). Submission loop handles direct server action POST correctly.
- **Verification**: Original Sharp EXIF processing remains fully intact on backend and is now structurally reachable.

## 3. INTEGRATION — RATE LIMIT TEST
- **Action**: Added `ratelimit.test.ts`.
- **Resolution**: Intercepted Upstash class directly in vitest, proving `submitRFQ` applies the 5/min limiter constraint mechanically.
- **Verification**: CI passes.
