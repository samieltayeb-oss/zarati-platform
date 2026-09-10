# ZARATI R4-C: DERIVED VALUE LAYER ARCHITECTURE FREEZE (HARDENED)

## 1. Core Principles & Absolute Data Law
R4-C will act as the Derived Value Layer for Zarati, converting raw prices in customary units and volatile local currency (SDG) into standardized metrics (USD/kg, USD/MT) to facilitate international trade.

**Absolute Data Law**: Raw source values are immutable. We will never overwrite the raw price, currency, unit, commodity, market, or observation date. R4-C will strictly append *derived* values. Every derived value maintains an explicit transformation lineage back to the raw source ID, conversion rule, FX source, calculation version, and timestamp.

## 2. Separate FX Rate Classes
The architecture explicitly separates FX into strict classes:
- `OFFICIAL`
- `PARALLEL_MARKET`
- `INSTITUTIONAL_REFERENCE`
- `OTHER_APPROVED_REFERENCE`

These classes will **never** be collapsed. If a `PARALLEL_MARKET` rate is missing, the system will output `PARALLEL RATE UNAVAILABLE` and will **never** silently fall back to `OFFICIAL`.

### Verified FX Sources
- **ExchangeRate-API**: VERIFIED. Supports SDG officially. Commercial use allowed. Current/Historical available. Class: `OFFICIAL`.
- **Frankfurter**: UNSUPPORTED. (Gives 403 / does not track SDG).
- **CBOS (Central Bank of Sudan)**: MANUAL/BATCH. No machine-readable API exists. Class: `OFFICIAL`.
- **WFP HDX RTP (World Bank/WFP)**: VERIFIED. Tracks historical unofficial rates. Available as CSV dataset. Class: `PARALLEL_MARKET`. Automation: MANUAL/BATCH.

## 3. Observation-Date FX Law
For historical normalization, the system will **never** use today's rate.
- **Law**: Exact observation-date match.
- **Fallback**: Nearest preceding rate up to a strict 7-day staleness limit.
- **Otherwise**: NULL.
This selection rule is explicit, source-aware, rate-class-aware, versioned, and auditable.

## 4. Unit Normalization (Sudanese Customary Units)
Sudanese units are custom-based. We do not assume universal definitions.
- **Ardeb**: 
  - Sorghum: 190 kg (VERIFIED via WFP/FAO market reports)
  - Wheat: 190 kg (VERIFIED via FAO)
  - Millet: 190 kg (VERIFIED via FAO)
- **Qintar**:
  - Sesame: 45 kg (VERIFIED local commercial standard)
  - Groundnuts: 45 kg (VERIFIED local commercial standard)
- **Sacks**:
  - `90 KG Sack`: Deterministic, READY.
  - `Sack` / `Bag` (Ambiguous): BLOCKED. (Will not auto-resolve to 90kg).

## 5. Unit Alias Safety
The `raw_unit_text` remains immutable. Aliases ("KG", "kg") map safely, but ambiguous customary terms ("Sack") **must not** auto-resolve without context.

## 6. Confidence / Authority
Each conversion rule has an explicit status: `VERIFIED`, `PROVISIONAL`, or `BLOCKED`.
**Law**: Only `VERIFIED` rules may generate public normalized values.

## 7. Normalization Failure Law
- Missing FX -> NULL derived FX value.
- Missing unit rule -> NULL normalized unit value.
- Ambiguous unit -> NULL.
- Blocked rule -> NULL.
- Conflicting rule -> Quarantine/review.
The system will **never** output 0, an estimated placeholder, a silent fallback, today's FX, or a generic Ardeb assumption.

## 8. Public Safe Views
The Safe Public Normalized View exposes only the approved source observation ID, derived normalized value, source date, raw currency, raw unit, confidence/provenance badges, and attribution. No internal metadata is exposed.
