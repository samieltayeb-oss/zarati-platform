# MIGRATION 031 DESIGN: R4-C DERIVED VALUES

This document outlines the proposed schema changes for Migration 031. **No SQL execution is permitted at this gate.**

## Proposed Tables

### 1. `canonical_fx_sources`
Defines the trusted providers for exchange rates.
- `id` (UUID, PK)
- `code` (String, UNIQUE)
- `name` (String)
- `url` (String)
- `automation_status` (Enum: 'automatable', 'manual_batch', 'blocked')
- `is_active` (Boolean)

### 2. `fx_rate_observations`
Stores historical and current exchange rates.
- `id` (UUID, PK)
- `source_id` (FK to `canonical_fx_sources`)
- `base_currency` (String)
- `target_currency` (String)
- `rate` (Numeric)
- `rate_class` (Enum: 'OFFICIAL', 'PARALLEL_MARKET', 'INSTITUTIONAL_REFERENCE', 'OTHER_APPROVED_REFERENCE')
- `observed_date` (Date)
- `UNIQUE(source_id, base_currency, target_currency, observed_date, rate_class)`

### 3. `unit_conversion_rules`
Maps customary Sudanese volume/packaging units to metric mass (kg).
- `id` (UUID, PK)
- `source_unit_alias` (String)
- `commodity_id` (FK to `canonical_commodities`, Nullable)
- `region_id` (FK to `states`, Nullable)
- `valid_from_date` (Date)
- `valid_to_date` (Date, Nullable)
- `conversion_factor_kg` (Numeric)
- `confidence_status` (Enum: 'VERIFIED', 'PROVISIONAL', 'BLOCKED')
- `authority_reference` (String) - Evidentiary URL or doc.

### 4. `normalized_market_values`
The derived values table.
- `id` (UUID, PK)
- `raw_observation_id` (FK to `market_price_observations`)
- `fx_rate_id` (FK to `fx_rate_observations`, Nullable)
- `unit_rule_id` (FK to `unit_conversion_rules`, Nullable)
- `calculation_version` (String)
- `normalized_usd_per_kg` (Numeric, Nullable)
- `normalized_usd_per_mt` (Numeric, Nullable)
- `normalized_sdg_per_kg` (Numeric, Nullable)
- `fx_fallback_days` (Integer) - tracks temporal fallback staleness.
- `is_latest` (Boolean)
- `calculated_at` (Timestamp)

### 5. `normalization_runs`
Audit ledger for batch normalization jobs.
- `id` (UUID, PK)
- `started_at` (Timestamp)
- `completed_at` (Timestamp)
- `records_processed` (Integer)
- `records_normalized` (Integer)
- `records_failed` (Integer)
- `records_quarantined` (Integer)
- `algorithm_version` (String)

## Safe Public Views

### `v_public_normalized_market_prices`
Exposes the intersection of approved `market_price_observations` and their `is_latest` true `normalized_market_values`. Exposes only `VERIFIED` rules.
- Exposes: `commodity`, `market`, `observed_date`, `raw_price`, `raw_currency`, `raw_unit`, `usd_per_kg`, `usd_per_mt`, `fx_provenance`, `unit_provenance`.

## Immutability & RLS
- Write access restricted to `service_role`.
- Public read access via `v_public_normalized_market_prices` only.
- Append-only triggers to protect historical lineage.
