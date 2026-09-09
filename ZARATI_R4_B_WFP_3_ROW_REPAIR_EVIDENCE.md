# R4-B.9 — three-row historical WFP provenance repair

## Scope and approved method

Target: Supabase `nelsijiczufflyqosvzi`. Baseline main: `fa0790a307f2adb946489da4ae99abc56f9b07ec`. Ledger before repair: 001–016, 018–028. Both feed gates OFF; weather observations 0; WFP executions 1. This is an internal historical V2 repair defect, not a price change, upstream correction, current parser defect or identity-contract change.

Migration 029 adds explicit immutable supersession audit and current-key uniqueness. The old records follow existing INGESTED → QUARANTINED → RETRACTED transitions and retain their IDs, keys, raw provenance, snapshot, verification evidence and source fields. Three new immutable, unassessed INGESTED records faithfully represent commodity 65. The already-correct commodity-249 rows are untouched. Physical count becomes 5666; current source identities remain 5663. Superseded records cannot be modified, revived or deleted. Neither replication role nor trigger disabling is used.

Each private audit entry links the old row, full before-image, existing 249 row/full before-image, new 65 replacement, original canary conflict, accepted artifact, reason, repair version, actor and timestamp. Deferred database validation rejects contradictory replacements and incomplete lineage. The only staging change selects `superseded_by IS NULL`; parsing, raw-row comparison, quarantine, artifact completeness, locking and publication rules remain unchanged. All migrations 001–028 remain untouched.

## Exact identities

All six historical records are INGESTED/unassessed and non-public. Currency SDG, price type Retail, unit 3 KG. The three defective keys claim commodity 65 while retained raw rows say `Sorghum (food aid),249`; their legitimate counterparts have `_249_Retail_3 KG` keys.

| Date / market / price | Defective old ID | Preserved commodity-249 ID | New commodity-65 replacement ID |
|---|---|---|---|
| 2023-12-15 / 1031 Kassala / 1200 | 5ac20cfc-4ced-4a27-8edf-0733c1b89e4c | 98e94afb-d006-4fa1-9164-64e59635100d | c0c98927-7776-4f16-8665-faf72efb40ca |
| 2024-07-15 / 1029 El Obeid / 5000 | e61a4f16-0ee5-4888-8d0d-f5ed91ea8dca | 68abe4de-73c9-4890-8dd1-25da5b6b0df5 | 5e049da6-924d-44ab-8bce-548d5e620bf3 |
| 2024-10-15 / 1029 El Obeid / 9000 | 6a21aef2-c247-4c83-b425-5a8e6682e214 | dee3fefe-f22b-4d45-939e-17d43cbf06f8 | 18b09b5e-aabc-4592-9e61-b8629fc15515 |

Exact old keys: `WFP_SDN_V2_2023-12-15_1031_65_Retail_3 KG`, `WFP_SDN_V2_2024-07-15_1029_65_Retail_3 KG`, `WFP_SDN_V2_2024-10-15_1029_65_Retail_3 KG`.

Historical raw snapshot: `230e36ca-d31e-44c9-b000-ed63943ea375`. Its old `payload_sha256` value is the HDX resource UUID with hyphens removed, not an actual checksum; it is retained as historical evidence. Replacement snapshot: `a2389a1f-6f33-445f-a638-e0738f3d146b`, linked to verified full artifact `a815abed-7e8b-4087-a138-4d32cd054439`. Dataset `DS_WFP_SUDAN_FOOD_PRICES`, source `SRC_WFP_VAM`.

Source SHA-256: `3c00925b7c04192e7170dc5bce13cfaca898b0c1499e9f939540fec19f6cbee4`; bytes 2924466; source rows 23225; mapped/V2 identities 5663. The B.8 downloaded bytes, archived historical artifact and checksum-pinned public fixture are identical. The B.9 preflight again found exactly three rows equal to the immutable canary conflict before-images, three correct counterparts, 5663 observations, 102 published/public, one execution and zero weather rows.

## Exact release artifacts

| Artifact | SHA-256 |
|---|---|
| `supabase/migrations/20260909000029_029_wfp_auditable_supersession.sql` | `97f19a64df35fca90c8e0696e66e404367ed13434d41057f9d8fadcf19f70596` |
| `ops/data-repairs/R4-B9-wfp-three-row-supersession.sql` | `1bf231995f5804436e9e6ccfff9968d3527c004bd52865997020302c194b56d1` |
| `ops/data-repairs/R4-B9-wfp-canary-admission.sql` | `666541dae070bed82dcd45f22e1edeab687389e710d19cb79c3b047157f483d6` |

LF line endings are pinned only for these new SQL artifacts. The repair is SERIALIZABLE, locks the relevant tables, requires idle leases, exact IDs/keys/values/provenance/conflicts/artifact and initial counts, and refuses reapplication. It verifies all unrelated observation before/after values and the whole public projection are unchanged. No production record is touched during local testing.

The separate manual admission SQL permits only the two Founder-authorized WFP runs before the ordinary six-hour cooldown. It only advances `next_allowed_at` on an idle WFP lease and returns old/new timestamps. It requires the original partial execution, exactly three resolved audit links, no weather execution/data, unchanged public count and (for replay) a successful clean first canary. A third execution blocks admission. It never changes acquire/finish logic, releases a live lease, fetches upstream data, enables weather or activates recurrence.

## Local verification

Target proven: PostgreSQL connection `127.0.0.1:54342`, database `postgres`, Docker internal address `172.22.0.10/32`; HTTP Supabase `127.0.0.1:54341`. Tests use the repository local-target guard and refuse remote targets.

Full local reset: PASS, migrations 001–016 and 018–029, without test-only 017. Real DB tests construct all 5663 observations from the full fixture, recreate the exact three ID/key/raw defects and six historical IDs, and reproduce 5660 existing / 3 quarantined before repair. The exact versioned SQL is then executed locally with all triggers active.

- Physical 5666 / current 5663 after repair; both raw variants represented exactly once as current truth.
- Two full local replays: SUCCEEDED, fetched 23225, mapped 5663, existing 5663, inserted 0, quarantined 0; no new correction/removal evidence.
- Three old conflict records and all 102 public records unchanged; all three 249 counterparts byte-for-byte unchanged.
- Wrong third target rolls back earlier changes. Contradictory replacement fails deferred lineage validation. Reapplication, duplicate current keys, mutable superseded history, mutable replacement raw provenance and mutable/deletable audit evidence are denied.
- Anon/authenticated/service-role cannot create supersession authority; raw audit is private; safe public view still works.
- Full suite: **156 tests PASS across 11 files**, including real listing/RFQ DB tests for migrations 026/028, R4-A safe view, R4-B feeds, cron auth/default-off, WFP identity/replay, weather, rate-limit fail-closed and media MIME contract.
- `npm run lint`: PASS. `npx tsc --noEmit`: PASS. `npm run build`: PASS (50 routes/pages generated). No application behavior code or current WFP parser changed.

## Fresh pre-repair backup

Created only after local PASS from the verified linked production project. Each command completed successfully; files nonzero and protected by Git ignore. Contents were not printed or committed. This verifies export completion, not a restore drill.

| Ignored backup | Bytes | SHA-256 |
|---|---:|---|
| `scratch/r4b9-pre-repair-schema.sql` | 137187 | `89ec24df484b8044450cf9ad4463a670e61b0dff8d6fd1d0e922f378e369051b` |
| `scratch/r4b9-pre-repair-data.sql` | 7465385 | `aab07cf034f5f4c6f9aa5d44ac0b67e66cb50eeb859a5294d8478662c7b06d01` |
| `scratch/r4b9-pre-repair-roles.sql` | 370 | `168a95a9c745af5ed4679751f90419ac9dc434240a213b03e32a06d5664c2308` |

Production dry run listed only Migration 029. Canonical listing policies matched the reconciled four-policy set; migrations 026/028 remained intact. The initial evidence revision was committed before production mutation; execution results follow.

## Production execution and lineage

Implementation/artifact commit: `f2976145bcc1b36cbab3c3978e9580686d82ab62`. Pushed normally to the R4-B branch and fast-forwarded into canonical main before the repair. Seven intentional files only; backups, credentials, scratch, unrelated plans and governance documents were excluded.

Migration 029 was applied once. The CLI reported its known nonfatal pg-delta catalog-cache certificate-path warning; direct production inspection then proved the migration ledger and SQL statements match local. No migration was retried. Final ledger: **001–016, 018–029**, 017 absent, 029 count **1**. Production function definitions, enabled triggers, constraints, indexes, RLS and effective audit grants match the local tested database. Audit SELECT/INSERT/UPDATE/DELETE are denied to anon/authenticated; service role has only SELECT on the new audit table.

The exact repair transaction committed on 2026-09-09 at approximately 08:46:50 UTC. Actor: postgres, through the approved tracked SQL, with all immutable triggers active. It changed exactly the three old records' lifecycle/supersession fields, created the three explicitly listed commodity-65 replacement records, and appended three audit links. Source fields on all three old records are unchanged. All other observations, including all three commodity-249 counterparts and all published observations, are unchanged. No source truth was physically deleted.

| Old observation | Preserved original conflict | Audit timestamp UTC |
|---|---|---|
| 5ac20cfc-4ced-4a27-8edf-0733c1b89e4c | 0bf15a6e-fd31-4caf-bd27-f8935a0007a7 | 08:46:49.906302 |
| e61a4f16-0ee5-4888-8d0d-f5ed91ea8dca | 9293715a-a92f-4a78-9e2a-c8dd1f2c1b58 | 08:46:50.037672 |
| 6a21aef2-c247-4c83-b425-5a8e6682e214 | 1fb46e3c-ce07-44dc-a919-383cee328371 | 08:46:50.131250 |

Resolution is associated through immutable `observation_supersessions.conflict_id`; original conflict records are neither deleted nor rewritten. Old snapshot links and all old verification/transformation/publication fields remain traceable through original IDs and full before-images. Replacement rows use the verified full-artifact snapshot and are INGESTED/unassessed, never published.

## Exactly two controlled production executions

The existing server-only WFP gate was temporarily true in deployment `dpl_J83BrmFn4fc7ZfCxHk9rm4EH6cEb` at the exact implementation commit. Weather remained absent/default-OFF throughout. The saved project WFP environment was reset to false before the first trigger, after the temporary deployment had captured its environment. Managed Vercel WFP Run was clicked exactly twice; the platform supplied CRON_SECRET, whose value was never read or printed. The weather Run control and global scheduler switch were not touched.

The canary window was Wednesday 2026-09-09, outside the existing Monday WFP schedule. No recurring schedule was activated or changed.

| Metric | Post-repair canary | Single idempotency replay |
|---|---|---|
| Execution ID | aaff368c-0a72-445e-acc8-6bbc0b6e2918 | 289a9379-cadb-4769-abf5-e305283f5646 |
| Started UTC | 08:49:36.974477 | 08:55:29.521339 |
| Completed UTC | 08:49:44.481001 | 08:55:36.895113 |
| Duration seconds | 7.506524 | 7.373774 |
| HTTP / ledger | 200 / SUCCEEDED | 200 / SUCCEEDED |
| Fetched / mapped | 23225 / 5663 | 23225 / 5663 |
| Existing / inserted | 5663 / 0 | 5663 / 0 |
| Quarantined / rejected | 0 / 0 | 0 / 0 |
| New corrections / removals | 0 / 0 | 0 / 0 |
| Automatic publication | 0 | 0 |
| Public WFP | 102 | 102 |
| Error category | NULL | NULL |

Both executions reused exact SHA-256 `3c00925b7c04192e7170dc5bce13cfaca898b0c1499e9f939540fec19f6cbee4`, artifact `a815abed-7e8b-4087-a138-4d32cd054439`, and VALIDATED 5663-key manifest hash `9e1db34581a8f954cf72643509fa0c0f0c411246b1227883db771b0d6e18b70d`. Current upstream bytes remain the same accepted full source artifact.

Manual cooldown admissions, recorded from the versioned SQL result:

- Canary: previous next-allowed 13:18:30.245706 UTC → admitted 08:48:37.831426 UTC.
- Replay: previous next-allowed 14:49:44.481461 UTC → admitted 08:55:21.801038 UTC.
- Final normal finish restored the six-hour cooldown: next-allowed 14:55:36.895595 UTC. Lease owner token and execution ID are NULL. No execution remains RUNNING. Total WFP executions are three: the original historical PARTIAL plus the two authorized clean runs. The admission script now refuses a third post-repair execution.

## Final OFF state and regression

Final feeds-OFF deployment `dpl_7Nt74fQ9gP2JDmCyD8r5StUt6QU1`, URL `https://zarati-platform-n8pyaxeka-samieltayeb-oss-projects.vercel.app`, became READY and owns `https://zarati-platform.vercel.app/` at implementation commit `f2976145bcc1b36cbab3c3978e9580686d82ab62`. The temporary enabled deployment was safely removed after the OFF deployment owned the alias. Saved production WFP flag is false; weather flag is absent and defaults OFF. CRON_SECRET remains present. A subsequent evidence-only main commit may deploy the same application code with these OFF settings.

Read-only production proof after both runs: physical WFP **5666**, current source identities **5663**, current duplicate keys **0**, superseded history **3**, unchanged commodity-249 counterparts **3**, preserved old conflicts **3**, total corrections **3**, removals **0**, published/public **102**, weather observations **0**. All three new replacements retain INGESTED/unassessed status. Unrelated/published observation modifications: **0**.

Migration 026/028 policy, function, trigger, grant, view and listing-count definitions match the production preflight exactly. Mutation regression proof was confined to the real isolated local database. Production HTTP smoke passed all 18 English/Arabic paths (including legitimate login redirects for private dashboards) and 20 JS/CSS assets; no matching application/database error bodies appeared. This is HTTP/asset smoke, not a claim of exhaustive interactive browser testing.

Supporting ignored captures: `scratch/r4b9-preflight-lineage.json`, `scratch/r4b9-post-migration.json`, `scratch/r4b9-post-repair.json`, `scratch/r4b9-final-proof.json`, `scratch/r4b9-canary-result.json`, `scratch/r4b9-replay-result.json`, `scratch/r4b9-final-security.json`, `scratch/r4b9-production-smoke.json`. These are supplementary captures; runtime and clean-checkout tests require none of them. Durable repair lineage is in the private production audit table and the exact committed SQL artifacts.

**PASS — historical provenance repaired, production replay clean. WFP recurring automation OFF; weather OFF; R4-C not started. No recurring activation is authorized by this evidence.**
