# ZARATI R4-C IMPLEMENTATION GATE

**Status:** ARCHITECTURE DESIGN COMPLETE. READY FOR FOUNDER IMPLEMENTATION AUTHORIZATION.
**Phase:** R4-C

## Pre-Requisites Validated
1. **R4-A Closed**: Yes.
2. **R4-B Closed**: Yes.
3. **WFP Current Valid Source Identities**: 5663 verified.
4. **Public WFP**: 102 verified.
5. **No Production Mutation**: Confirmed.

## Implementation Plan Overview
Upon authorization, the following implementation steps will occur:

1. **Schema Migration (031)**:
   - Create tables: `canonical_fx_sources`, `fx_rate_observations`, `unit_conversion_rules`, `normalized_market_values`, `normalization_runs`.
   - Create public view: `v_public_normalized_market_prices`.
   - Apply strict service_role RLS and append-only triggers.

2. **Data Seeding**:
   - Seed `canonical_fx_sources` with WFP HDX and CBOS.
   - Seed `unit_conversion_rules` with researched baseline metrics:
     - Sorghum Ardeb -> 190 kg
     - Wheat/Millet Ardeb -> 150-190 kg (will exact specify per crop)
     - Sesame/Groundnuts Qintar -> 45 kg
     - Standard Sack -> 90 kg or 50 kg (crop dependent)

3. **Application Logic**:
   - Implement `NormalizationEngine` service.
   - Service will resolve observation date, fetch nearest preceding FX rate (up to 3-day staleness).
   - Resolve correct unit conversion rule via commodity/region lookup.
   - Calculate derived metrics safely.
   - Insert immutable record into `normalized_market_values`.

4. **Testing Strategy**:
   - Provide adversarial inputs (missing FX, unknown unit, negative price).
   - Assert normalization engine handles gracefully (inserts null derived metrics, tags appropriate error flags).
   - Verify historical prices are NOT distorted by current FX rates.

**DO NOT IMPLEMENT OR RUN SQL UNTIL AUTHORIZED.**
