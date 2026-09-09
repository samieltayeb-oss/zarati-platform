# Listing policy drift reconciliation — Migration 028

Date: 2026-09-09. Target: Supabase `nelsijiczufflyqosvzi`.
Scope: listing authorization only. Migrations 001–027 remain unchanged. Both R4-B feeds remain OFF.

## Forensic classification

Production initially had eight listing policies: the four clean-reset policies plus four legacy policies. The complete policy expressions were captured read-only before repair and compared again before release. The pre-027 and fresh pre-028 backups also preserve them. PostgreSQL does not provide a policy creation timestamp; repository history establishes the original definitions, not who later retained/reintroduced them in production.

| Extra policy | Command / role | USING / WITH CHECK | Classification | Removal effect |
|---|---|---|---|---|
| Farmers can read own listings | SELECT / authenticated | USING `user_id = auth.uid()` | LEGACY_REDUNDANT | Canonical SELECT already includes own rows; no owner read loss. Origin: 021. |
| listings_insert_owner | INSERT / public | CHECK `user_id = auth.uid() AND is_active_user()` | LEGACY_REDUNDANT | Equivalent authenticated owner insertion already exists; anon has no table insert privilege. Origin: 019 replacing 015. |
| listings_update_owner | UPDATE / public | USING and CHECK `(user_id = auth.uid() AND is_active_user()) OR is_admin()` | LEGACY_UNSAFE | Owner arm is redundant. Admin arm restores legitimate access lost in clean 026, but also admits inactive admins because is_admin checks role without status. Preserve active-admin access explicitly. Origin: 019. |
| listings_delete_owner | DELETE / public | USING `(user_id = auth.uid() AND is_active_user()) OR is_admin()` | LEGACY_UNSAFE | Allows owner deletion of active/protected rows, and inactive-admin deletion. Replace with explicit lifecycle owner / active admin rule. Origin: 019. |

Unsafe legacy policies: **2**. The update policy's legitimate admin component was missing from clean 026; dropping it without replacement would break that access.

Permissive PostgreSQL policies combine with OR, so the narrow policy cannot constrain a broader permissive policy. Reference: https://www.postgresql.org/docs/17/ddl-rowsecurity.html

## Canonical authorization

028 produces exactly four permissive policies, one per command:
- Existing `listings_select_public` preserved: active rows, own rows, or admin. Existing anon raw-table SELECT denial and approved public projection remain unchanged.
- `listings_insert_active_owner`: authenticated, active, inserting own row.
- `listings_update_active_owner_or_admin`: authenticated, active, owner or admin; same USING and CHECK.
- `listings_delete_lifecycle_owner_or_admin`: authenticated, active; admin or owner of draft/archived row.

| Actor | Read | Insert | Update | Delete |
|---|---|---|---|---|
| Anonymous | Approved active public view; raw table denied | Denied | Denied | Denied |
| Active owner, farmer or trader | Own rows and active rows | Own legitimate listing | Owner fields and allowed lifecycle only | Own draft/archived only |
| Active non-owner farmer/trader | Active rows; other private drafts denied | Own only | Other-owner rows denied | Other-owner rows denied |
| Active admin | All rows | Own under RLS; trusted server remains privileged | Legitimate moderation/publication allowed | Includes active rows |
| Suspended/banned owner | Own/active read preserved | Denied | Denied | Denied |
| Inactive admin | Existing admin read retained | Denied | Denied | Denied |

There is no listing `is_verified` column: verification lives on profiles. Existing profile self-verification protection is unchanged and tested.

The listing trigger now also enforces existing application lifecycle transitions from `lib/actions/listings.ts`: draft→pending_review/archived; active→paused/sold/archived; paused→archived or approved active. An unapproved paused row cannot become active. Owners cannot alter ownership, identity, moderation, featured, counters, or created_at. Initial featured/counter escalation is denied. Existing 027 initial moderation/status checks remain unchanged. Active admins and the trusted service role retain privileged listing operations.

Authenticated TRUNCATE on listings was an additional existing RLS-independent deletion path; 028 revokes it from PUBLIC/anon/authenticated. No privileges on unrelated tables are changed.

## Local executable proof

Target guard restricts PostgreSQL to loopback port 54342 and Supabase HTTP to loopback port 54341; production URLs cause tests to refuse execution. Local reset used `supabase db reset --local --no-seed`, applying 001–016, 018–028; test-only 017 excluded.

`__tests__/listing-policy-db.test.ts`: **60 real PostgreSQL tests**, using transaction-scoped authenticated/anon roles and JWT claims against isolated synthetic users/listings. All synthetic rows and policy reproduction are rolled back. Tests reconstruct the eight-policy production drift, demonstrate active-owner deletion and inactive-admin editing, apply the actual 028 SQL locally, and prove the repaired boundary.

Covered: raw/public/own/non-owner reads; owner/trader insertion; other-owner and anonymous insert denial; normal edit; ownership/identity/moderation/verification/featured/counter/time escalation denial; permitted and forbidden lifecycle transitions; draft/archived delete; active/pending/paused delete denial; non-owner mutation; suspended/banned/inactive-admin mutation; active-admin moderation and active deletion; TRUNCATE denial; exact canonical policy inventory.

Final gates: lint PASS; typecheck PASS; **144 tests across 10 files PASS**; build PASS. Previous 84 tests include real local RFQ privacy/self-accept denial and R4-B DB staging/lease/ledger/weather tests. WFP fixture: 23,225 source rows, 5,663 mapped V2 identities, zero semantic collisions, actual DB replay zero new. R4-A publication safe-view and R4-B default-off tests pass. Media test performs real PNG→JPEG conversion with mocked storage/DB; rate-limit failure test mocks dependencies and exercises the fail-closed configuration path. These are not claimed as production mutation tests.

## Production release

Preflight: ledger 001–016, 018–027; exact eight-policy snapshot unchanged; WFP 5663 / published 102 / public 102; executions, weather, artifacts all zero. CRON_SECRET and Upstash configuration present. Both production feed flags absent and default OFF. Application code unchanged at `8c1bb6c9f057bcacd5e6e14779561ffd4f60d4b7`.

### Backup and exact migration

Fresh linked-project backups completed before 028, nonzero and verified with `git check-ignore`; contents were not printed or committed. No restore drill was performed.

| Backup under ignored scratch/ | Bytes | SHA-256 |
|---|---:|---|
| listing028-pre-release-schema.sql | 136822 | e7c71e53a8d78967154ed2ace732e7cb284dba70faff612aa4002cb493fb28e9 |
| listing028-pre-release-data.sql | 3736433 | 0b218159741073a83dce946c8a8090029e0312dbbb19f61317a007f2ad01b09c |
| listing028-pre-release-roles.sql | 370 | 168a95a9c745af5ed4679751f90419ac9dc434240a213b03e32a06d5664c2308 |

Exact migration: `supabase/migrations/20260909000028_028_reconcile_listing_policy_drift.sql`.
SHA-256: `90f1eaf16b17ea7280b956b2a02864bbe8d0023668864841bd332ee582ee359d`.
The checksum was pinned after final local tests/reset and checked again immediately before release. Dry run listed ONLY 028. The final preflight matched all policy, function, trigger, grant, view, and ledger definitions captured before remediation.

`supabase db push --linked --yes` applied 028 once. The CLI emitted the same nonfatal pg-delta catalog-cache certificate-path warning seen during 027. Direct production SQL subsequently proved installation; no migration was retried/reapplied.

### Post-release read-only proof

- Ledger: **001–016, 018–028**, with 028 count **1** and 017 absent.
- Exact four canonical listing policies match local, including commands, roles, permissiveness, USING and CHECK expressions.
- Listing grants, RLS, trigger definitions/enabled state, relevant function definitions/configuration, and public listing view all match local. Comparison normalizes CRLF/LF only for function text.
- `listings_delete_owner` absent; all four legacy names absent. Authenticated TRUNCATE false.
- Inspected RFQ/contact/profile and other security functions unchanged from production preflight.
- WFP **5663** observations; **102** published; **102** public. Feed executions **0**, artifacts **0**, weather **0**. Listing count unchanged at **0**; no production listing/user mutations were used for testing.
- Production environment metadata rechecked: WFP/weather enable flags still absent, hence **OFF**. No source fetch, canary, cron invocation, or activation performed during this task.
- No application deployment or main advancement was necessary for this database-only release. Production application remains at the existing reviewed SHA.

Read-only snapshots and comparison: `scratch/listing028-preflight-production.json`, `scratch/listing028-immediate-preflight-production.json`, `scratch/listing028-post-production.json`, `scratch/listing028-verified-local.json`, `scratch/listing028-post-comparison.json`. Backup/migration hashes: `scratch/listing028-release-manifest.json`.

**Result: PASS — production listing policy drift reconciled. R4-B activation may resume only in a subsequent authorized gate. Feeds are still OFF. R4-C not started.**

Migration, tests, and this evidence document remain local/uncommitted; this task did not request a Git commit/push. Pre-existing implementation_plan.md changes and unrelated untracked files remain untouched. No earlier migration was edited, rolled back, or reapplied.
