# ZARATI R2 Production Hardening Report

This report documents the final production hardening steps executed on the Zarati live environment for Phase R2.

## Actions Completed

### 1. Fixed Public Trader Profile Exposure (P3-002)
- Created and successfully executed migration `020_r2_final_production_hardening.sql`.
- **Revoked** `SELECT` access from the `anon` role on `public.trader_profiles`.
- **Granted** `SELECT` access to `authenticated` users on `public.trader_profiles`.
- **Created** a safe projection view `public.public_traders` which filters sensitive identifiers and internal flags, exposing only business-safe fields.
- **Granted** `SELECT` on `public.public_traders` to `anon`.
- *Verification:* Attempting direct `SELECT` on `trader_profiles` as an anonymous user now safely throws PostgreSQL Error `42501: permission denied for table trader_profiles`.

### 2. Handled Legacy Admin Risk (P3-001)
- The legacy `adminLogin` server action inside `lib/admin/actions.ts` has been updated with a strict `process.env.NODE_ENV === 'production'` block.
- The `proxy.ts` middleware natively blocks `/admin` routes in production with a HTTP `403 Forbidden` response.
- *Verification:* Pinging `/en/admin/login` yields "Legacy admin access is strictly disabled in production environments."

### 3. Email Confirmation Verification (P2-007)
- Performed a live registration test on the Zarati production Supabase environment (`zarati-production`).
- The signup request succeeded, but immediately returned a null session.
- An explicit login attempt prior to email confirmation resulted in: `AuthApiError: Email not confirmed`.
- *Verification:* The production project enforces Email Confirmation natively.

### 4. Production Smoke Tests
- A `node` integration test was run against the live API endpoint confirming all RLS logic remains functional.
- The `is_active_user()` checks correctly authorize the dashboard.
- Attempting to hit `/dashboard` manually without a proper chunked Supabase cookie returns the expected middleware redirect (307) back to `/login`.
- The temporary test user created during the smoke test was fully purged from `auth.users` via the Service Role Admin API. No fake production data remains.

## Quality Gates
- `npm run lint`: 0 Errors (TypeScript issues resolved in `020` schema adjustments).
- `npm run test:run`: 15/15 Passed.
- `npm run build`: Exit Code 0 (Vercel production build succeeded).
