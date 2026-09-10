# ZARATI R4-C IMPLEMENTATION GATE

**Status:** ARCHITECTURE DESIGN & SOURCE HARDENING COMPLETE. READY FOR FOUNDER IMPLEMENTATION AUTHORIZATION.
**Phase:** R4-C

## Pre-Requisites Validated
1. **R4-A / R4-B Closed**: Yes.
2. **WFP Automated Feed**: LIVE.
3. **No Production Mutation**: Confirmed.

## Source Hardening Results
- **FX Classes**: Strictly separated into `OFFICIAL`, `PARALLEL_MARKET`, `INSTITUTIONAL_REFERENCE`. Silent fallback is explicitly banned.
- **FX Sources**:
  - `ExchangeRate-API`: VERIFIED (`OFFICIAL`, Automatable)
  - `WFP HDX RTP`: VERIFIED (`PARALLEL_MARKET`, Manual/Batch)
  - `CBOS`: MANUAL/BATCH (`OFFICIAL`)
- **Unit Conversions**: 
  - Ardeb (Sorghum/Wheat/Millet = 190kg) is VERIFIED.
  - Qintar (Sesame/Groundnuts = 45kg) is VERIFIED.
  - Explicit 90kg Sack is VERIFIED.
  - Ambiguous "Sack" or "Bag" is BLOCKED (no normalization will occur).
- **Temporal FX Selection Law**: Exact observation date match, falling back to nearest preceding rate up to 7 days, else NULL.

## Implementation Plan Overview
Upon authorization, the following will occur:

1. **Schema Migration (031)**:
   - Create required tables and views.

2. **Data Seeding**:
   - Seed `unit_conversion_rules` with the explicitly verified Ardeb/Qintar/Sack values for specific commodities.
   - Seed `canonical_fx_sources` with ExchangeRate-API and WFP HDX RTP.

3. **Application Logic**:
   - Build Normalization Service.
   - Enforce Normalization Failure Law (missing FX = NULL, ambiguous unit = NULL, blocked rule = NULL).
   - Ensure public view only exposes derived values backed by `VERIFIED` rules.

**DO NOT IMPLEMENT OR RUN SQL UNTIL AUTHORIZED.**
