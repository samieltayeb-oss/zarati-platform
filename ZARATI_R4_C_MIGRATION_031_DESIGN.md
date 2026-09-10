# MIGRATION 031 DESIGN: R4-C DERIVED VALUES

This document outlines the proposed schema changes for Migration 031. **No SQL execution is permitted at this gate.**

## Proposed Tables

### 1. `canonical_fx_sources`
Defines the trusted providers for exchange rates.
- `id` (UUID, PK)
- `code` (String, UNIQUE) - e.g., 'WFP_VAM_PARALLEL', 'CBOS_OFFICIAL'
- `name` (String)
- `url` (String)
- `is_active` (Boolean)

### 2. `fx_rate_observations`
Stores daily exchange rates (primarily USD to SDG).
- `id` (UUID, PK)
- `source_id` (FK to `canonical_fx_sources`)
- `base_currency` (String) - e.g., 'USD'
- `target_currency` (String) - e.g., 'SDG'
- `rate` (Numeric)
- `rate_type` (Enum: 'official', 'parallel')
- `observed_date` (Date)
- `UNIQUE(source_id, base_currency, target_currency, observed_date, rate_type)`

### 3. `unit_conversion_rules`
Maps customary Sudanese volume/packaging units to metric mass (kg).
- `id` (UUID, PK)
- `source_unit` (String) - e.g., 'ardeb', 'qintar', 'sack_90kg'
- `commodity_id` (FK to `canonical_commodities`, Nullable for generic rules)
- `region_id` (FK to `states` or `canonical_localities`, Nullable)
- `valid_from_date` (Date)
- `valid_to_date` (Date, Nullable)
- `conversion_factor_kg` (Numeric) - multiplier to convert source unit to 1 kg.
- `confidence_score` (Numeric)
- `authority_reference` (String)

### 4. `normalized_market_values`
The derived values table. Never overrides raw data.
- `id` (UUID, PK)
- `raw_observation_id` (FK to `market_price_observations`)
- `fx_rate_id` (FK to `fx_rate_observations`, Nullable)
- `unit_rule_id` (FK to `unit_conversion_rules`, Nullable)
- `calculation_version` (String) - e.g., 'v1.0.0'
- `normalized_usd_per_kg` (Numeric, Nullable)
- `normalized_usd_per_mt` (Numeric, Nullable)
- `normalized_sdg_per_kg` (Numeric, Nullable)
- `is_latest` (Boolean) - true for the most recently calculated derived value for a given raw observation.
- `calculated_at` (Timestamp)

### 5. `normalization_runs`
Audit ledger for batch normalization jobs.
- `id` (UUID, PK)
- `started_at` (Timestamp)
- `completed_at` (Timestamp)
- `records_processed` (Integer)
- `records_normalized` (Integer)
- `records_failed` (Integer)
- `algorithm_version` (String)

## Safe Public Views

### `v_public_normalized_market_prices`
Exposes the intersection of approved `market_price_observations` and their `is_latest` true `normalized_market_values`.
- Masks internal IDs (uses standard UUIDs).
- Exposes: `commodity`, `market`, `observed_date`, `raw_price`, `raw_currency`, `raw_unit`, `usd_per_kg`, `usd_per_mt`, `fx_provenance`.

## Immutability & RLS
- RLS will restrict write access to `normalized_market_values` and `fx_rate_observations` to the `service_role`.
- Public read access will only be granted to `v_public_normalized_market_prices`.
- `normalized_market_values` will have an append-only trigger pattern similar to `market_price_observations`.
