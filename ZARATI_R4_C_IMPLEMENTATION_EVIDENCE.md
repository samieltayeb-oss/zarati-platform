# ZARATI R4-C IMPLEMENTATION EVIDENCE (REMEDIATED)

**Phase:** R4-C (Derived Value Layer)
**Mode:** Local Implementation + Adversarial Verification

## 1. Schema & Migration 031
Migration 031 (`20260910000031_031_r4_c_normalization.sql`) verified and untouched during remediation. 
- Forward-only, RLS strictly implemented. 
- `normalized_market_values` enforce append-only immutability.

## 2. FX Remediation & Conflict Semantics
- **UTC Date Law**: Handled using explicit `Date.UTC()` math avoiding host machine timezone shifts. `2024-05-10` always boundaries to EXACT UTC midnight.
- **Verified-Only Enforcement**: FX extraction enforces `verification_status = 'VERIFIED'`. `PROVISIONAL`, `BLOCKED`, and `UNASSESSED` are structurally ignored.
- **Conflict Handling**: Removed arbitrary `.single()` fallback behavior. When `>1` verified rate applies to an exact date, an explicit `FX_RATE_CONFLICT` is thrown, halting derivation and ensuring the record is quarantined without guessing. Same applies to `>1` rates on the preceding date.

## 3. Unit Rules & Overlap Conflict
- **Unit Overlap Protection**: `.limit(1)` removed. When multiple active and verified unit rules apply to a given combination, the engine strictly detects it and throws `UNIT_RULE_CONFLICT`.
- **NULL Safety**: Tested mapping of missing units and conflicting rules to explicitly prevent public USD generation.

## 4. Publication Isolation Proof
- Because `getFXRate()` ensures only `VERIFIED` rates are parsed, a public source observation attempting to map to a `PROVISIONAL` or `BLOCKED` rate evaluates to an unavailable FX.
- USD calculation short-circuits.
- Public views successfully minimize output without leaking unverified FX rates.

## 5. Manual Parallel FX Importer
- **ops/ingest-wfp-fx.ts** implemented and tested.
- Validates data structurally.
- Explicitly blocks spoofed `OFFICIAL` rates.
- Ensures all batch records ingest safely as `PROVISIONAL`.
- Supports exact idempotency and flags identical-date varying-rate records as `CONFLICT_EXISTING_RATE_DIFFERS`.
- Dry run fully supported with strict CSV iteration limits.

## 6. Test Evidence Levels
- **REAL LOCAL DB**: All adversarial queries enforce exact Postgres resolution including RLS mapping and `is_latest` trigger evaluation.
- **INTEGRATION**: `engine.test.ts` validates end-to-end normalization outcomes including schema triggers and DB rule resolution.
- **UNIT**: Boundary math explicitly tested inside `adversarial.test.ts`.
