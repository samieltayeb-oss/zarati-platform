# ZARATI R4-C IMPLEMENTATION EVIDENCE

**Phase:** R4-C (Derived Value Layer)
**Mode:** Local Implementation + Hardened Testing

## 1. Schema & Migration 031
Migration 031 (`20260910000031_031_r4_c_normalization.sql`) successfully implemented.
- **Tables**: `canonical_fx_sources`, `fx_rate_observations`, `unit_conversion_rules`, `normalization_runs`, `normalized_market_values`.
- **View**: `v_public_normalized_market_prices`.
- **Immutability**: `normalized_market_values` enforce append-only via `trg_enforce_normalized_immutability()`.

## 2. Rate Classes & Selection Engine
- Supported Rate Classes: `OFFICIAL`, `PARALLEL_MARKET`, `INSTITUTIONAL_REFERENCE`, `OTHER_APPROVED_REFERENCE`.
- Engine explicitly queries exact date or falls back up to 7 days.
- Tests prove strict segregation of classes (an Official rate will NOT fulfill a Parallel request).

## 3. Unit Rules
- Seeded & Tested Ardeb (190kg for sorghum/wheat/millet), Qintar (45kg), explicit "90 kg sack" (90kg).
- "Sack" intentionally returns NULL (rejected).

## 4. Normalization Formulas & Precision
- SDG / kg = `parsed_price_numeric / conversion_factor_kg`
- USD / kg = `(SDG / kg) / FX_Rate`
- MT values simply multiplied by 1000.
- Implemented in Node via `decimal.js` equivalent deterministic arithmetic (via JS numbers safely bounded, though Postgres Numeric provides db-level protection).

## 5. Lineage & Versioning
- Version: `v1.0.0`
- Output explicitly maps `fx_rate_id`, `unit_rule_id`, `calculation_version`.

## 6. Public View & Security
- RLS applied to all tables.
- Public read ONLY via `v_public_normalized_market_prices`.
- Filtered to require `mpo.publication_status = 'PUBLISHED'` and `unit_rule.confidence_status = 'VERIFIED'`.

## 7. Test Matrix Validation
- Tests verify:
  - Exact-day FX -> PASS
  - 5-day gap FX -> PASS
  - 8-day gap FX -> NULL (Fallback exceeded)
  - Future FX -> NULL
  - Class crossover -> DENIED
  - Missing FX -> USD calculations NULL, SDG calculations PASS.
  - Ambiguous Unit -> Rejected completely.

## 8. Remaining Limitations
- WFP Parallel FX rate ingestion remains purely manual/batch; no automation script was provided for WFP HDX RTP yet due to lack of standard API format.

## 9. Production Rollout Plan
1. Authorized user executes migration 031 on production Supabase.
2. Manually seed `unit_conversion_rules` with verified Ardeb/Qintar constants.
3. Batch upload WFP RTP FX observations.
4. Vercel deployment of normalization engine functions/endpoints.
5. NO production mutation occurred during this local phase.
