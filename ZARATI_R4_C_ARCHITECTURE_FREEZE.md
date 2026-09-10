# ZARATI R4-C: DERIVED VALUE LAYER ARCHITECTURE FREEZE

## 1. Core Principles
R4-C will act as the Derived Value Layer for Zarati, converting raw prices in customary units (e.g., Ardeb, Qintar, sack) and volatile local currency (SDG) into standardized metrics (USD per kg, USD per MT) to facilitate international trade.

**Absolute Data Law**: Raw source values are immutable. We will never overwrite the raw price, currency, unit, commodity, market, or observation date. R4-C will strictly append *derived* values. Every derived value will maintain an explicit transformation lineage tracing back to the raw source ID, conversion rule, FX source, calculation version, and timestamp.

## 2. Currency Model & FX Sources
Sudan's currency environment involves highly divergent official and parallel market rates. 
- **Official Rates**: Can be retrieved via free commercial APIs like ExchangeRate-API or Frankfurter.
- **Parallel Market Rates**: Required for realistic agricultural pricing. There is NO free, automated, commercial-use API for Sudan's parallel market.
- **Data Strategy**: We will rely on WFP VAM and HDX Real-Time Prices (RTP) datasets for historical parallel market rates. For current parallel rates, manual or periodic ingestion of local market reports is necessary.
- **Versioning**: The model separates OBSERVATION-DATE FX (the rate on the day of the trade) from CURRENT FX. Historical prices will NOT be distorted retroactively by applying today's FX rate. If FX is missing or unknown, the derived USD value will be stored as unavailable.

## 3. Unit Normalization (Sudanese Customary Units)
Sudanese units are volume- or custom-based, not standardized mass.
- **Ardeb**: Varies by crop (e.g., Sorghum ~190 kg).
- **Qintar**: Generally ~45 kg for sesame/groundnuts.
- **Sack**: Often a 90 kg standard for grains.
**Model**: We will implement a `unit_conversion_rules` entity that maps `(source_unit, commodity_id, region_id, valid_from, valid_to)` -> `conversion_factor_kg`. Normalization will be deterministic and versioned. If a rule is uncertain, no normalization will be fabricated.

## 4. Public Safe Views
A Safe Public Normalized View (`v_public_normalized_market_prices`) will expose only:
- the approved source observation ID
- derived normalized value (e.g., `USD/kg`)
- source date, raw currency, and raw unit
- confidence/provenance badges and source attribution
No internal ledgers or validation metadata will be exposed.

## 5. Adversarial Considerations Addressed
- **Missing/Conflicting FX**: Derived value is `null`, flagged as `unconverted_missing_fx`.
- **Weekend/Holiday FX Gaps**: Will use the most recent preceding valid FX rate up to a configurable staleness threshold (e.g., 3 days).
- **Ambiguous Unit**: Derived value is `null`, flagged as `unconverted_ambiguous_unit`.
- **Future Corrections**: Normalization algorithms are versioned. If a conversion rule changes, we calculate a new derived record rather than overwriting historical derived values.

## 6. Implementation Readiness
The architecture is fully designed. However, automated ingestion of parallel market rates remains blocked due to the lack of a free programmatic API. The implementation can proceed using WFP HDX data as the primary FX source.
