# ZARATI R4-C COVERAGE ANALYSIS

**Phase:** R4-C
**Mode:** Read-Only Production Coverage Analysis

## 1. Global Coverage Summary
- **WFP Current Valid Observations:** 5663
- **Unit Normalization Eligible:** 0 (0%)
- **Unit Blocked:** 5663 (100%)
- **Public Observations:** 102
- **Public Unit Eligible:** 0

## 2. Unit Coverage Breakdown
Analysis of WFP raw units reveals that WFP reports explicitly in metric strings (e.g. `90 kg`, `3.5 kg`, `3 kg`), rather than customary aliases (`ardeb`, `qintar`, `sack`). 
Because R4-C currently contains NO verified rules for these explicit metric strings, 100% of observations are blocked by `UNIT_RULE_MISSING`.

- **90 kg**: ~46% of dataset
- **3 kg**: ~35% of dataset
- **3.5 kg**: ~19% of dataset
- **Ardeb/Qintar/Sack**: 0 found in the sampled dataset.

## 3. FX Coverage
Because unit normalization fails for 100% of the dataset, 0 observations proceed to FX normalization.
However, if unit rules were present, a review of production FX data reveals significant historical gaps in `PARALLEL_MARKET` verified rates, meaning many historical observations would still fail to produce USD values.

## 4. Derived Output Coverage
- SDG/kg Eligible: 0
- SDG/MT Eligible: 0
- USD/Official Eligible: 0
- USD/Parallel Eligible: 0

## 5. Rule Expansion Priority (HIGH)
To unlock normalization, we must explicitly map WFP metric strings to unit conversion factors:
1. `90 kg` -> Factor 90
2. `3 kg` -> Factor 3
3. `3.5 kg` -> Factor 3.5

These rules do not require commodity-specific or regional specificity as they are explicit metric weights. Seeding these 3 rules will immediately unlock ~100% of unit normalizations.

## 6. FX Data Gap Priority (HIGH)
- **Historical Gaps:** The database lacks daily PARALLEL_MARKET observations for the entirety of the WFP historical series.
- **Action:** Manual batch ingestion of the WFP HDX RTP dataset via the newly created `ops/ingest-wfp-fx.ts` tool, followed by verification.

## 7. Bulk Normalization Risk
**Recommended Strategy:** C. EXPAND RULE/FX COVERAGE FIRST.
Bulk normalization is currently safe because it is idempotent and fails safely, but running it now would produce 0 derived rows. It is pointless to run until rules and FX are seeded.

## 8. Automatic Normalization Model
**Recommended Model:** EVENT_DRIVEN (with a Hybrid manual fallback).
WFP ingestion should trigger an event. If the observation becomes published and has verified rules/FX available, the derivation should calculate immediately to ensure the public view remains fresh.

## 9. R4-C Closure Criteria
R4-C is NOT READY to close. Closure requires:
1. Seeding of metric unit rules (`90 kg`, `3 kg`, etc.).
2. Ingestion and verification of the historical PARALLEL_MARKET FX dataset.
3. A successful dry-run showing >80% coverage.
4. Execution of the bulk normalization strategy.
