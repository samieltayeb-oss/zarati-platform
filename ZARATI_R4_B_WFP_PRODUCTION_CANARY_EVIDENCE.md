# R4-B.7 — repository convergence and one-shot WFP production canary

Date: 2026-09-09 UTC. Supabase project: `nelsijiczufflyqosvzi`.
Result: **CANARY GATE FAILED — PARTIAL execution with three quarantined historical commodity/provenance conflicts. Automation remains OFF.**

## Repository convergence

Production-applied 028 file: `supabase/migrations/20260909000028_028_reconcile_listing_policy_drift.sql`.
SHA-256: `90f1eaf16b17ea7280b956b2a02864bbe8d0023668864841bd332ee582ee359d`.

Proof: local bytes match the hash pinned before the production application; all 15 SQL statements recorded in the production migration ledger exactly match the locally applied migration statements. Staged Git blob bytes also match the original file exactly. No edit, rename, reformat, regeneration, or reapplication of 028 occurred.

Commit: `fa0790a307f2adb946489da4ae99abc56f9b07ec` — `fix(security): reconcile production listing policies`.
Exactly three files, 309 insertions:
- Migration 028: approved production-applied reconciliation artifact.
- `__tests__/listing-policy-db.test.ts`: directly required 60-test PostgreSQL authorization matrix.
- `ZARATI_LISTING_POLICY_028_RECONCILIATION_EVIDENCE.md`: completed reconciliation evidence. Its uncommitted note records the prior gate; this commit closes that historical gap.

Normal push to phase/r4-b-automated-feeds, then exact fast-forward of main from `8c1bb6c9f057bcacd5e6e14779561ffd4f60d4b7`, followed by normal main push. No conflicts, force push, or unrelated commits. Final remote main is `fa0790a307f2adb946489da4ae99abc56f9b07ec`.
Generated types and support/application code were unchanged and not added.

Excluded working-tree inventory:
- `implementation_plan.md`: pre-existing unrelated modified implementation plan.
- `.mcp.json`: unrelated local connector configuration, potentially credential-bearing; excluded and not printed.
- `ZARATI_21ST_COMPONENT_DISCOVERY.md`: unrelated design/discovery document.
- `ZARATI_MASTER_COMPLETION_ROADMAP.md`: unrelated program governance.
- `ZARATI_MASTER_PROGRAM_TRUTH_AUDIT.md`: unrelated program audit.
- `ZARATI_MINISTER_AND_PILOT_READINESS_PLAN.md`: unrelated pilot/governance plan.
- `ZARATI_PRE_R4B_PRODUCTION_REMEDIATION_RELEASE.md`: earlier release governance.
- `ZARATI_PRE_R4B_REMEDIATION_EVIDENCE.md`: earlier remediation governance.
- `ZARATI_R4_A_11_RECONCILIATION_EVIDENCE.md`: historical R4-A evidence.
- `ZARATI_R4_A_HISTORICAL_BACKFILL_EVIDENCE.md`: historical R4-A evidence.
- `ZARATI_R4_A_M024_PRODUCTION_EVIDENCE.md`: historical R4-A evidence.
- `ZARATI_R4_A_M025_FORWARD_FIX_EVIDENCE.md`: historical R4-A evidence.
- `ZARATI_R4_A_PRODUCTION_RELEASE_PLAN.md`: historical R4-A plan.
- `ZARATI_R4_A_REAL_DATA_CANARY_EVIDENCE.md`: historical R4-A evidence.
- `ZARATI_R4_A_ROADMAP_RECONCILIATION.md`: historical R4-A governance.
- `ZARATI_R4_A_WFP_IDENTITY_V2_REPAIR_EVIDENCE.md`: historical R4-A evidence.
- `ZARATI_R4_A_WFP_REPAIR_POSTMORTEM.md`: historical R4-A postmortem.
- `ZARATI_R4_B_PRODUCTION_RELEASE_EVIDENCE.md`: prior release evidence outside the authorized 028 commit.

Ignored scratch output, backups, .env files, and debug files were not staged. This new canary report remains local/uncommitted, separate from the approved 028 convergence commit.

## Preflight and bounded activation

Production ledger: 001–016, 018–028; 017 remains test-only. Canonical listing policies/functions/grants matched the tested local baseline, and unsafe legacy policies were absent.
WFP before: 5663 observations, 102 published, 102 public. Feed executions/artifacts/weather before: zero.
CRON_SECRET and Upstash configuration present; no secret values retrieved, printed, or stored in this report. Both feed flags initially absent and default OFF.

Converged-main OFF deployment: `dpl_CqdJdsAiNVHzyTXJwrEmnJ3BmC7w`, READY.
Only `R4B_WFP_FEED_ENABLED` was temporarily set to string `true`, production scope. Weather was never enabled.
Temporary canary deployment: `dpl_Rv3DSpdwspmo2RU2f8E971G7MAhR`, exact main SHA above, READY.

The existing WFP schedule is `0 3 * * 1` (Monday 03:00 UTC; Hobby scheduling has a one-hour window). This bounded canary occurred Wednesday around 07:18 UTC, well outside that window. No schedule or global cron toggle was changed. Existing expire cron was not invoked. Weather was not invoked.

After the canary deployment was built, project WFP configuration was reset to `false` BEFORE the trigger; the already-built canary deployment retained its temporary true value. Thus subsequent deployments were configured OFF. Vercel environment changes apply to subsequent deployments: https://vercel.com/docs/environment-variables

Exactly ONE WFP Run click was issued through the existing Vercel project Cron Jobs UI. Vercel supplied the server-only secret through its managed invocation; no secret was exposed. Managed cron authentication: https://vercel.com/docs/cron-jobs/manage-cron-jobs

## Exact execution evidence

Execution UUID: `0936b53a-29aa-496d-a7df-5179acdfc59f`.
Vercel request ID: `2hln5-1788938303127-33a33919c14c`.
Request: GET /api/cron/wfp, user agent vercel-cron/1.0, 2026-09-09T07:18:23.127Z.
HTTP result: **502**, matching the reviewed handler's non-success response for a truthful PARTIAL ledger result. No console error was required to manufacture success.

| Ledger field | Actual value |
|---|---|
| status | partial |
| started_at | 2026-09-09T07:18:23.767294Z |
| completed_at | 2026-09-09T07:18:30.245004Z |
| duration | 6.477710 seconds |
| records_fetched | 23225 |
| records_valid / mapped | 5663 |
| records_inserted | 0 |
| records_existing | 5660 |
| records_rejected | 0 |
| records_quarantined | 3 |
| error_category | null; record-level CORRECTION evidence accounts for PARTIAL |
| batch receipts | 23 |
| correction evidence | 3 |
| removal evidence | 0 |

Logs show acquire_feed, one HDX download followed by its permitted S3 redirect, reference reads, prepare_feed_artifact, batch staging, and finish_feed. These are calls within one execution, not additional canaries. No replay was run because the first execution was PARTIAL.

Artifact classification: **SAME accepted pinned public artifact**, not an upstream version change.
Content SHA/source version: `3c00925b7c04192e7170dc5bce13cfaca898b0c1499e9f939540fec19f6cbee4`.
Raw artifact UUID: `a815abed-7e8b-4087-a138-4d32cd054439`.
Raw snapshot UUID: `a2389a1f-6f33-445f-a638-e0738f3d146b`.
Retrieved: 2026-09-09T07:18:24.439Z. Payload: 2,924,466 bytes.
Resource: HDX 8fea18b2-615f-4af5-9bd5-85cc31a25ffd / wfp_food_prices_sdn.csv.
Manifest status: VALIDATED; 23,225 source rows / 5,663 keys.
Manifest SHA: `9e1db34581a8f954cf72643509fa0c0f0c411246b1227883db771b0d6e18b70d`.
Completeness: PASS against the existing exact-content approval. Stored payload SHA was independently recomputed in production SQL and matched.

## Three quarantined historical conflicts

All three stored V2 keys identify commodity 65 (Sorghum), while the prior stored raw row names commodity 249 (Sorghum (food aid)). The incoming pinned artifact row names commodity 65. Prices and currencies are identical, mapping_review=false. This is a historical raw-row/key provenance discrepancy; it is not evidence that upstream prices changed.

| Key | Price SDG | Stored raw commodity → incoming raw commodity |
|---|---:|---|
| WFP_SDN_V2_2023-12-15_1031_65_Retail_3 KG | 1200 | Sorghum (food aid), 249 → Sorghum, 65 |
| WFP_SDN_V2_2024-07-15_1029_65_Retail_3 KG | 5000 | Sorghum (food aid), 249 → Sorghum, 65 |
| WFP_SDN_V2_2024-10-15_1029_65_Retail_3 KG | 9000 | Sorghum (food aid), 249 → Sorghum, 65 |

Prior snapshot for all three: `230e36ca-d31e-44c9-b000-ed63943ea375`. All three remain INGESTED, not PUBLISHED. Read-only comparison confirms each complete current observation equals its recorded previous_truth JSON. No historical truth was overwritten or manually repaired. Durable incoming/previous conflict evidence is retained in private feed_source_changes.

These three discrepancies require separate forensic review before considering scheduling. No second run, policy exception, publication, completeness override, or data repair was attempted.

## Publication, lease, regression and final OFF state

- WFP after: **5663** observations; **102** published; **102** public safe-view rows.
- New inserts: **0**; automatic publication: **0**; duplicate WFP keys: **0**.
- Lease acquired 07:18:23.775514Z; after finish execution_id and owner_token are null. next_allowed_at 13:18:30.245706Z. No execution remains running.
- Weather observations: **0**. Weather has never been enabled or called in this task.
- Final production environment: WFP=`false`, weather absent/default OFF, CRON_SECRET present.
- Final OFF production deployment: **`dpl_8oRxsXVhLyYcnNRy6MANhtHnfg2q`**, READY, exact main SHA `fa0790a307f2adb946489da4ae99abc56f9b07ec`.
- Alias: https://zarati-platform.vercel.app/.
- Temporary WFP-enabled deployment was retired using exact-ID removal with `--safe`, after the OFF deployment held the production alias. Its old enabled URL cannot be reused. SQL execution/artifact/conflict evidence and captured request diagnostics remain recorded here.
- Post-canary listing policies, grants, triggers, helper functions, RLS and view match the verified local 028 baseline. RFQ/contact/profile security definitions remain intact. Migrations 026/028 security regression: PASS by local mutation proof plus production read-only equivalence.
- R1/R2/R3 smoke: 18 English/Arabic routes passed, including login/register and protected dashboard redirects; 20 JS/CSS assets passed. No real user actions were performed. Media/rate-limit proof remains the prior verified local tests and unchanged code/configuration, not an invasive production attack.
- R4-A safe view/publication isolation: PASS. This does not clear the three newly surfaced historical provenance discrepancies.
- R4-B infrastructure: PASS — exact artifact, completeness validation, quarantine, ledger finalization and lease cleanup worked. The overall canary/scheduling gate nevertheless FAILS because the execution was PARTIAL.

Primary local evidence: `scratch/r4b7-migration-production.json`, `scratch/r4b7-preflight.json`, `scratch/r4b7-canary-result.json`, `scratch/r4b7-conflicts.json`, `scratch/r4b7-final-proof.json`, `scratch/r4b7-post-security.json`, `scratch/r4b7-production-smoke.json`.

**WFP recurring automation OFF. Weather automation OFF. R4-C not started. Scheduling is not authorized.**
