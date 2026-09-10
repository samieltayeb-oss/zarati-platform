# ZARATI | زرعتي — R4-A PRODUCTION RELEASE PLAN
**Document Class:** Deployment Runbook & Verification Gate  
**Target Migration:** `024_r4_a_data_foundation.sql`  
**Execution Status:** BLOCKED (Awaiting Local Adversarial Sign-off & Upstash Provisioning)

## PRE-FLIGHT VERIFICATION
1. Verify production Supabase identity: `nelsijiczufflyqosvzi`.
2. Verify production migration history matches exactly `001` through `023`.
3. Obtain fresh pre-migration backup of the production database.
4. Verify backup artifact exists locally and is secured.
5. Add backup artifact to `.gitignore` to prevent accidental commits.
6. Inspect the structural diff of Migration 024 one final time.

## EXECUTION SEQUENCE
7. Run `supabase db push` to apply Migration 024 to production exactly once.
8. Query `supabase_migrations.schema_migrations` to verify the `20260907000024` version is permanently recorded.
9. Verify all 15 new canonical and observation tables are instantiated.
10. Query `pg_policies` to verify RLS is active on `market_price_observations`.
11. Query `v_approved_market_prices` anonymously to ensure it returns 0 rows without crashing (since no data is published).
12. Verify zero existing R1-R3 regression: execute a full login sequence and user registration flow.
13. Verify marketplace catalog still renders existing crops without runtime errors.
14. Verify authentication cookies and SSR middleware continue to operate.
15. Verify trader RFQ and contact reveal RPC functions from earlier phases remain operational.
16. Verify the live Vercel application connects to the migrated database correctly.
17. Run a sweeping validation to ensure absolutely NO mock data, test vectors, or simulated WFP CSVs were accidentally promoted to production.

## POST-FLIGHT EVIDENCE
18. Produce the Production Evidence Report mapping the successful deployment of the R4-A Sovereign Data Foundation.

**NOTE:** Do not seed WFP data yet. Do not start R4-B. The deployment stops here to allow independent verification.
