# R4-B production release evidence — R4-B.6B

Date: 2026-09-09 UTC.
Final gate: FAILED — pre-existing Migration 026 policy drift discovered during post-deployment security verification. Feeds remain blocked/OFF.

## Actual release state

The earlier R4-B.6 attempt stopped because CRON_SECRET was absent. R4-B.6A subsequently provisioned the production-only sensitive secret. This resumed release verified its metadata without printing or reading back its value.

Reviewed SHA, final main SHA, and deployed SHA: `8c1bb6c9f057bcacd5e6e14779561ffd4f60d4b7`.
Main advanced normally by fast-forward from `8e19d188d91db36baa4f6790c60ac2559fbd8a9a`, using the isolated `scratch/r4b-release-main` worktree. No conflicts, reviewed-code edits, force push, or unrelated files included. Final origin/main verification matches the reviewed SHA.
The original workspace remains on phase/r4-b-automated-feeds. Pre-existing implementation_plan.md changes and unrelated untracked documents/configuration were excluded.

Existing Vercel project: zarati-platform / prj_vuMmp6KFrvqP93c3C7I77sLMkD77.
GitHub production workflow: main push.
Production deployment: `dpl_9VFWEV6DUe2omCaMYvr3dnSnsWCD`, READY, target production, exact reviewed Git SHA.
Production alias: https://zarati-platform.vercel.app/
Unique deployment: https://zarati-platform-q9hzbvkxx-samieltayeb-oss-projects.vercel.app

## Fresh preflight and backup

Supabase linked project: nelsijiczufflyqosvzi.
Pre-migration ledger: 001–016, 018–026; 017 absent, 027 absent.
Preflight WFP: 5663 observations, 102 published, 102 public, 5663 V2 keys, zero duplicate identity groups.
CRON_SECRET and both Upstash variables present as sensitive production variables. Upstash verification is configuration presence and fail-closed reviewed code; no Redis outage test or real-user auth mutation was performed.
Both R4B_WFP_FEED_ENABLED and R4B_WEATHER_FEED_ENABLED absent; reviewed/deployed code enables only exact string 'true', so both default OFF. No environment variables or cron enable switches changed in this release.

Fresh pre-027 linked-project backups completed successfully, nonzero, and git-ignored:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| scratch/r4b-pre027-20260909-schema.sql | 102651 | 3f08b12f8c6f0382b3dfbf464da358058ef1c440aff3e7f312706ddb42b94620 |
| scratch/r4b-pre027-20260909-data.sql | 3733485 | b9ba6ba226d088c0df913b3a4c933c0ce1ba0715e6899b30cbfa25d0cd18e20a |
| scratch/r4b-pre027-20260909-roles.sql | 370 | 168a95a9c745af5ed4679751f90419ac9dc434240a213b03e32a06d5664c2308 |

Backup contents were not printed or committed. A restore drill was not performed.

## Migration and infrastructure verification

Exact reviewed 20260909000027_027_r4_b_infrastructure.sql applied once after dry-run listed only 027. No SQL edits, 028, or 017 dependency introduced.
Post-migration ledger: 001–016, 018–027. Count of 027: 1.
CLI emitted a nonfatal pg-delta catalog-cache certificate-path warning after applying the migration. Direct production SQL verified the ledger and installed objects; migration was not retried.

Nine operational tables have RLS enabled, no anon read access, and no anon/authenticated INSERT/UPDATE/DELETE/TRUNCATE privileges. Service role reads exist; ordinary direct table writes are denied. Authorized writes are through the reviewed RPC boundaries.
Feed RPC definitions, core constraints/indexes, immutable triggers, and minimal weather view match the locally tested schema. Immutable triggers enabled. Raw artifacts/weather and execution errors are not public.
Anonymous SELECT from v_public_weather succeeds and returns zero rows. No live lease acquisition or ingestion was used for infrastructure smoke; RPC privileges and installed definitions were inspected read-only.

## Disabled cron authentication proof

Both deployed routes returned 401 for missing Authorization and intentionally wrong bearer value.
Vercel's managed Run mechanism supplied the sensitive production CRON_SECRET without exposing it:

- WFP: request jh4sk-1788935404800-51bd7a8137e1, 2026-09-09T06:30:04.800Z.
- Weather: request n6l75-1788935416210-0424ddd00776, 2026-09-09T06:30:16.210Z.

Both logs identify the new production deployment, main, vercel-cron/1.0, and status 503. This is the reviewed disabled-gate response, reached after successful authentication and before DB client creation or adapter work. Logs show no external API calls. The managed response bodies were not captured; status, exact deployed code, environment metadata, and unchanged DB counts establish disabled behavior.
Vercel injects the secret for cron requests: https://vercel.com/docs/cron-jobs/manage-cron-jobs
No secret value was printed, saved, or included in this evidence.

Final read-only counts after deployment and managed route checks:
- WFP observations 5663; published 102; public safe view 102; duplicate identity groups 0.
- Feed executions 0; feed artifacts 0; weather observations 0; leases 0.

## Application smoke

18 route checks passed across en/ar: home, marketplace, crops, intelligence, geography, login, register, farmer dashboard, trader dashboard. Protected dashboard requests redirected to login, which returned 200. No authenticated dashboard workflow was exercised.
20 referenced Next.js JavaScript/CSS assets checked successfully. No HTTP 500, rendered missing-environment/database error, or broken checked asset.
English/Arabic browser rendering and intelligence rendering succeeded, with no observed hydration failure. Browser console contained three asynchronous extension message-channel errors on the English homepage; these are recorded rather than treating the console as empty. No application hydration error was observed.
HTTP evidence: scratch/r4b-production-smoke.json.

## Security regression discrepancy — FINAL GATE BLOCKER

Read-only comparison verified RFQ/contact/profile and listing protection function definitions against the tested local schema; two definitions differed only by CRLF/LF. Existing protection triggers are enabled. Media MIME constraint remains image/jpeg, image/png, image/webp. Reviewed auth code fails closed if production Redis configuration is absent. No real user records were attacked or changed.

However, production has four extra listing policies compared with the local reset baseline:
- Farmers can read own listings
- listings_insert_owner
- listings_update_owner
- listings_delete_owner

All four exist in the fresh pre-027 schema backup, proving this drift predates the R4-B migration/deployment. Shared policies otherwise match local definitions.
The release-blocking policy is listings_delete_owner (DELETE, public role):
`(((user_id = auth.uid()) AND is_active_user()) OR is_admin())`.
It lacks the draft/archived status restriction. Permissive policies combine with OR, so the narrower 'Farmers can delete own draft/archived listings' policy does not enforce that restriction while the legacy policy exists.
Migration 026 explicitly drops listings_delete_owner and recreates the restricted owner-delete policy. Consequently the production 026 security regression cannot be marked PASS despite ledger 026 being present and update/ownership/contact protections remaining installed.

This discrepancy was discovered during the post-deployment policy comparison, after 027 and the reviewed application were live. The earlier preflight checked counts, ledger, environment gates, and triggers but did not detect this policy drift. No corrective production policy change or rollback was made under this release task.
Required next step: separately review and authorize reconciliation of the legacy production listing policies, then repeat the security gate. Do not reapply or edit already-applied 027.
Policy/count evidence: scratch/r4b-final-counts-production.json; anonymous projection evidence: scratch/r4b-final-verification-production.json.

## Stop state

027 LIVE; reviewed R4-B application LIVE; final production release gate FAILED on pre-existing 026 policy drift.
WFP automation OFF. Weather automation OFF. Zero ingestion, no canary, no source fetch/write.
No R4-C, Gedaref pilot, product-claim changes, or feed activation.
This report is local/uncommitted and contains no secrets. Backups and scratch verification output remain excluded from Git.
