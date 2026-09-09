# R4-B.4 local remediation evidence

Scope: exactly the three R4-B.3 blockers. Migration 027 corrected directly; 001-026 untouched.
No migration 028, production action, deployment, activation or R4-C.

## Contracts

- Immutable raw artifact identity is separated from immutable per-execution validation manifests.
  Failed attempts remain auditable; identical bytes can validate and stage on a later execution.
  A contradictory manifest after successful validation is explicitly rejected and recorded.
- Pinned completeness attestation bootstraps WFP. Growth retaining prior keys/count is accepted.
  Reductions require explicit owner-reviewed hash/count/manifest evidence. Untrusted reductions
  never stage or infer removals. Private immutable approval records are unavailable to runtime writes.
- Work budget 240 seconds; independent cleanup 30 seconds within route maxDuration 300.
  Deadline exhaustion promptly writes FAILED / DEADLINE_EXCEEDED and releases the lease.
  Cleanup failure is bounded and leaves fenced expiry recovery available.

## Local verification

Docker supabase_db_zarati port 54342 verified before reset. Supabase API localhost:54341.
Full reset applied 001-016, 018-027; 017 remains test-only. Types regenerated from local DB.
Production URLs are rejected by test guards. No production credentials used by feed tests.

Database-backed tests reproduce failed first reference validation, preserved raw payload,
second-execution 5663-key recovery, replay zero, retained rejected manifest, contradictory
manifest rejection, 21000-row prefix rejection, missing-175 rejection with zero removals,
then owner-attested reduction acceptance with 175 audited removals. Handler tests verify
independent deadline cleanup, transient terminal retry, bounded cleanup failure and recovery.
Existing WFP, weather, lease/auth, publication/privacy and marketplace security tests remain.

Final executed outcomes:
- npm run lint: PASS, zero errors/warnings.
- npx tsc --noEmit (Windows npx.cmd shim): PASS.
- npm test (Windows npm.cmd shim): PASS, 9 files / 84 tests.
- npm run build: PASS, Next.js 16.2.9, 50 static pages. Local demo Supabase settings
  and both feed flags false were injected only into the build process. Google Fonts
  required network permission; no deployment command was run.
- Full local reset and generated types: PASS.
- WFP 23225 source / 5663 mapped / 5663 identities / zero semantic collisions: PASS.
- Actual DB first stage/revalidation: 5663; replay: zero new observations.
- Same-feed acquisition: exactly one winner for WFP and weather; expired fencing: PASS.
- All corrected rows: QUARANTINED. Cron auth, Bearer undefined denial, default-off: PASS.
- Weather temporal/forecast/freshness/revisions/public minimization: PASS.
- Migration 026 authenticated security and R4-A identity/publication regressions: PASS.
- git diff --cached --check: PASS. Only 027 changed among migrations.
- 32 intended R4-B files staged; unrelated implementation_plan.md, .mcp.json and
  governance files remain excluded. No backups, scratch artifacts or credentials added.

Cleanup-outage limitation: if the database cannot be reached within the independent
cleanup budget, the handler returns 503 and the lease remains fenced until expiry/takeover.
Ordinary work deadline exhaustion was verified to finalize FAILED promptly and release it.

## Release scope

Include intended feed/runtime/schema/types/tests/config/package/fixture files and R4-B evidence.
Exclude implementation_plan.md, .mcp.json, scratch, backups, credentials and unrelated governance.
No commit or deployment authorized. Founder activation remains separate; both feeds default OFF.
