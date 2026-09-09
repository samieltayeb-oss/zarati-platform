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

Production dry run lists only Migration 029. Canonical listing policies match the reconciled four-policy set; migrations 026/028 remain intact. Production repair and the two controlled executions are pending at this artifact revision. Both feeds remain OFF.
