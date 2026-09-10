# ZARATI R4-C PRODUCTION CANARY EVIDENCE

**Phase:** R4-C (Derived Value Layer)
**Mode:** Controlled Production Data Canary

## 1. Canary Candidates
Selected exactly 4 existing WFP observations from production data:
1. **Sorghum / Ardeb** (Public) - Expected 190kg rule
2. **Sesame / Qintar** (Public) - Expected 45kg rule
3. **90kg sack** (Non-Public) - Expected 90kg rule
4. **Ambiguous 'Sack'** (Public) - Expected UNAVAILABLE rule

## 2. Execution Results
- **Backup**: Created pre-canary backup successfully.
- **Unit Normalization**: 
  - Sorghum successfully mapped to 190kg
  - Sesame successfully mapped to 45kg
  - 90kg sack successfully mapped to 90kg
  - Ambiguous Sack correctly rejected (NULL)
- **FX Normalization**:
  - Sorghum exact date mapped to VERIFIED PARALLEL_MARKET FX rate.
  - Sesame date had no VERIFIED PARALLEL_MARKET FX within 7 days -> USD NULL.
  - 90kg sack mapped to VERIFIED PARALLEL_MARKET FX rate.
  - No crossover with OFFICIAL rates occurred.
- **Publication Isolation**:
  - Sorghum (Public, FX available) -> Displayed in `v_public_normalized_market_prices` with both SDG and USD.
  - Sesame (Public, FX missing) -> Displayed in `v_public_normalized_market_prices` with SDG only, USD is NULL.
  - 90kg sack (Non-public) -> Excluded from public view despite successful normalization.
  - Ambiguous Sack -> Excluded from public view (no successful unit normalization).
- **Public Rows**: 0 before -> 2 after.

## 3. Financial Formula Proof
Manual independent verification:
- Sorghum (Price: 380,000 SDG / 190kg) = 2000 SDG/kg. FX Rate (1 USD = 2000 SDG) -> 1 USD/kg. Delta: 0.

## 4. Idempotency & Immutability
- Replayed the exact same 4 observation IDs.
- 0 new duplicate rows created in `normalized_market_values` (is_latest constraints maintained).
- Raw WFP observations confirmed completely unmodified (price, unit, market, currency unchanged).

## 5. Security Regression
- RLS verified: anon cannot write to `normalized_market_values`.
- WFP Automation remains ON (5663 valid identities).
- MET Norway automation remains ON.
- M026, M028, M029, M030 verified unchanged and healthy.
