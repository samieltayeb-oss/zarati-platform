# ZARATI R2 AUTH SECURITY REPORT

## Authorization & Role Protection
- **Ground Truth**: Supabase Auth and `public.profiles` serve as the absolute identity ground truth. 
- **Privilege Separation**: We reject arbitrary `role` modification from client requests. The `on_auth_user_created` trigger acts as the security guard for profile creation.
- **Role Fencing**: Suspended users and incorrect roles are firmly rejected by the middleware `proxy.ts`, which validates the SSR session natively. The middleware forces unauthenticated or misaligned users to `/login`.
- **Database Boundaries**: RLS protects the integrity of `public.profiles` and `public.farms`. Mass assignment payloads fail because PostgreSQL triggers (`protect_privileged_profile_fields`) raise exceptions if non-service roles attempt to modify `role` or `is_verified`.

## Rate Limiting
- Added `@upstash/ratelimit` protecting authentication boundaries.
- **Limits applied**:
  - Sign in / Sign up: 5 requests / 15 minutes.
  - Password Reset: 3 requests / 1 hour.
- This mitigates brute-force credential stuffing and bot registration, utilizing Redis KV logic in production serverless environments.

## Session Lifecycle
- Secure `HttpOnly` cookies are implemented via `@supabase/ssr` to ensure Next.js App Router renders pages safely and without client-side race conditions.

All adversarial tests have proven that malicious insertions (`role=admin`) fail and that rate limiting effectively drops excessive connections.
