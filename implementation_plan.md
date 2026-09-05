# Phase R2 Implementation Plan: Authentication & Real User Foundation

## Goal Description
Transform Zarati from a public prototype into a secure, role-based platform with real user authentication. We will replace the placeholder waitlist flows with robust Registration and Login experiences for Farmers and Traders, protected by Supabase Auth (SSR) and row-level security.

## Corrected Requirements

### 1. Invalid Role Must Fail Closed
- The database trigger provisioning profiles will explicitly check the requested role.
- Allowed roles via public signup: `farmer`, `trader`.
- If any other role (e.g., `admin`, `ngo`, `government`, `null`, random strings) is requested, the trigger will `RAISE EXCEPTION`, failing the transaction closed. No silent fallback to `farmer`.
- Explicit DB tests will prove these malicious insertions fail.

### 2. Database Provisioning & Security
- The `auth.users` trigger will use hardened `SECURITY DEFINER SET search_path = public, pg_temp`.
- Schema-qualify all referenced objects.
- Prevent `role`, `is_verified`, and identity fields from self-modification through strict RLS policies (using `BEFORE UPDATE` triggers if necessary).
- Prove atomic behavior: if profile provisioning fails, the entire signup transaction is aborted (no orphaned `auth.users`).

### 3. Next.js 16 Middleware Convention
- We will verify if `proxy.ts` is currently being used natively by Next.js 16 or imported into a hidden `middleware.ts`. Next.js natively expects `middleware.ts` in the root (or `src/`). We will investigate and preserve the supported architecture without unnecessary churn.

### 4. Production Rate Limiting
- Use Upstash Redis (or `@vercel/kv`) for production rate limiting on `signup`, `login`, `forgot password`, `password recovery`, `waitlist`, and `legacy admin login`.
- Fall back to an in-memory map ONLY in local development environments.

### 5. Progressive Registration UX
- **Farmer**: Account -> Basic Location -> Optional/Immediate Farm Onboarding -> Dashboard. Full farm data (feddans, crops) is NOT a prerequisite.
- **Trader**: Account -> Business details. Traders cannot self-set verification, rating, or privileged flags. Commercial registration is optional.

### 6. Email Verification & Password Recovery
- Implement complete Email Verification with correct callback redirect URLs (for both Arabic and English routes).
- Implement full Password Recovery lifecycle (Forgot -> Recovery Email -> Callback/Token Validation -> Set New Password -> Success -> Login). Handle expired/invalid/used tokens properly.

### 7. Session, Route, and Object-Level Security
- Validate authorization server-side using `@supabase/ssr`. Never trust client state or localStorage.
- Enforce strict route isolation (Farmer -> Farmer Dashboard, Trader -> Trader Dashboard, etc.).
- Account Status: Enforce suspended status. Suspended users will lose access to protected operations.
- Object-Level Authorization: Rigorous RLS to ensure User A cannot read/write User B's private profile or farms. Mass assignment attempts of privileged fields will be tested and proven to fail.

### 8. Waitlist and Admin Migration
- Relocate Waitlist to `/[lang]/waitlist` for NGO/Gov/Investor interest.
- Maintain legacy `ADMIN_PASSWORD` mechanism temporarily. Document the future transition to Supabase Admin.

### 9. Zero-State and Mock Boundaries
- Dashboards will use strictly REAL data. No fabricated KPIs. 
- Explicitly document the Mock/Real classification (Auth, Profiles, Farms = REAL. Prices, Weather = MOCK).

### 10. Verification and Reporting
- Create test identities (Farmer A/B, Trader A/B) on production, run authorization matrix, and strictly CLEANUP afterward.
- Generate `ZARATI_R2_IMPLEMENTATION_REPORT.md`, `ZARATI_R2_AUTH_SECURITY_REPORT.md`, `ZARATI_R2_PRODUCTION_E2E_REPORT.md`, `ZARATI_R2_ROLE_ACCESS_MATRIX.md`.

## Proposed Changes

*(This section will be executed directly as per user authorization)*
- DB Migration `018` for trigger and strict field protection.
- Next.js SSR Auth setup.
- App Router updates (`/login`, `/register`, `/waitlist`, `/dashboard/*`).
- Security E2E scripts.
