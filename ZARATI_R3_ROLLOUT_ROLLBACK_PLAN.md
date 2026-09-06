# ZARATI R3 ROLLOUT & ROLLBACK PLAN

## Rollout Sequence (Staged Gates)
1.  **LOCAL:** Database schema migration `021`, RLS tests pass.
2.  **STAGING / SAFE VALIDATION ENVIRONMENT:** Deploy to Vercel preview with staging Supabase.
3.  **PRODUCTION CANARY:**
    *   Migration verification.
    *   R2 auth regression check.
    *   RLS & Anonymous privacy verification (public view active).
    *   Zero fake production data.
4.  **PRODUCTION LIVE:** Merged to `main`.
5.  **FOUNDER APPROVAL:** Pilot Go-Live explicitly authorized.
6.  **GEDAREF STAGE 1 ACTIVATION:** Field team begins onboarding.

## Emergency Security Response
Ad-hoc dashboard toggles are not a security strategy.
*   **Data Leak / IDOR:** Execute emergency controlled forward-fix SQL (e.g., `REVOKE SELECT ON public_listings_view FROM anon;`) via CLI.
*   **Code Defect:** Vercel instant rollback to previous commit.
*   Do not destroy data or edit applied migrations.
