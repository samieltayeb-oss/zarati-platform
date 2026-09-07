# ZARATI | زرعتي — R4-A Architecture Freeze: Institutional & Historical Data Foundation (Hardened)
**Phase:** R4-A (Data Foundation & Source Provenance Architecture)  
**Status:** ARCHITECTURE HARDENED / FROZEN  
**Target Release:** R4-A  
**Base Commit:** `08d7e07877bed1e81dc3a82682791a0886f42fba` (Production Verified)  
**Database Target:** Supabase PostgreSQL (`nelsijiczufflyqosvzi`)  
**Scope Classification:** System Architecture, Data Governance, Schema Specification (NO IMPLEMENTATION)

---

## 1. Executive Architecture & Mission Mandate

The primary objective of **Zarati R4-A** is to construct the statutory data foundation required for Zarati to ingest, trace, govern, and publish verified institutional and historical agricultural data.

Zarati R1–R3 deployed the foundational database schema, identity/RBAC, and bilateral B2B marketplace. Phase R3.5 delivered the sovereign user experience. On the live frontend, all crop price indicators currently display an explicit **DEMO / NON-LIVE** disclosure.

### The Fundamental Information Law of Zarati R4-A
Every piece of agricultural intelligence rendered inside Zarati must answer:
1. **What commodity?** (Canonical crop, variety, and commercial quality grade)
2. **Which market and location?** (Canonical physical auction floor, terminal market, locality, state)
3. **What price type?** (Farmgate, wholesale spot, retail, primary auction clearing, export FOB)
4. **What unit and currency?** (Original customary measure text: Ardeb, Qintar, 90kg Sack, Metric Ton; original currency text: SDG, USD, SAR)
5. **Observed when?** (`observed_at` with explicit `temporal_precision`: exact timestamp, calendar day, calendar month, seasonal range)
6. **Published when?** (`published_at` — when the authoritative publisher issued the bulletin)
7. **Reported by whom?** (Authoritative publisher, state market administration, or verified institution)
8. **Ingested when?** (`ingested_at` — system ingestion timestamp with cryptographic payload hash)
9. **How trustworthy is it?** (Multi-dimensional evidence evaluation; zero unearned default trust badges)
10. **Is it stale?** (`stale_after_at` timestamp; dynamically derived `is_stale = (NOW() > stale_after_at)`)
11. **What was the original source value?** (Preserved verbatim in `raw_price_text`, `raw_unit_text`, `raw_currency_text`)
12. **What transformations occurred?** (Auditable mathematical transformations logged in `observation_transformations`; ground truth never mutated)
13. **Can it legally be redistributed?** (Explicit statutory/institutional license verification: CC BY-IGO, Public Domain, Bilateral MOU)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                            ZARATI R4-A HARDENED END-TO-END DATA ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                         │
│  [ AUTHORITATIVE SOURCES ]                                                                              │
│    ├── Tier A: Primary Exchange Floor (Gedaref Ag Market Authority, El Obeid Auction Sheets)            │
│    ├── Tier B: Multilateral Institutional (UN WFP HDX, USAID FEWS NET Data Warehouse)                   │
│    ├── Tier C: Sovereign & Statutory (CBOS Foreign Trade, Ministry of Ag Archive)                       │
│    └── Tier D: Benchmark Global (World Bank Pink Sheet, UN Comtrade)                                    │
│                                           │                                                             │
│                                           ▼                                                             │
│  [ INGESTION SUBSYSTEM (Service Role / Workers) ]                                                       │
│    1. Raw Acquisition ────────► S3 / Supabase Raw Storage (SHA-256 Checksum)                            │
│    2. Snapshot Registration ──► `raw_ingestion_snapshots` (Immutable payload ledger)                    │
│    3. Parsing & Entity Match ─► `canonical_commodity_aliases` & `canonical_market_aliases`           │
│    4. Verbatim Preservation ──► Store `raw_price_text`, `raw_unit_text`, `raw_currency_text`            │
│    5. Deterministic Key ──────► Generate non-null `source_record_key` for idempotent deduplication      │
│    6. Parsing Transformation ─► Attempt numeric parse into `parsed_price_numeric` (log transformation)   │
│    7. Quality Sanity Gate ────► Range sanity, date bounds, negative/zero detection                      │
│    8. Quarantine / Accept ────► Commit to `market_price_observations` with status 'INGESTED'/'QUARANTINED'│
│                                           │                                                             │
│                                           ▼                                                             │
│  [ IMMUTABLE STORAGE & GOVERNANCE LEDGER ]                                                              │
│    ├── `canonical_sources` & `canonical_datasets` (Relational consistency guard)                        │
│    ├── `canonical_commodities`, `varieties`, `grades` (Biological & Trade Taxonomy)                     │
│    ├── `canonical_units` (Regional variance, nominal weights, bounds, confidence level)                 │
│    ├── `canonical_currencies` (ISO 4217 reference metadata — NO FX conversion in R4-A)                  │
│    ├── `market_price_observations` (Core Ledger: Verbatim Raw Truth + Immutability Triggers)            │
│    ├── `observation_verification_evidence` (Multi-Dimensional: Authority, Integrity, Field, Stats)     │
│    ├── `observation_transformations` (Audit trail for numeric parsing & future R4-C normalizations)     │
│    ├── `observation_quality_flags` (Quarantine reasons & outlier tracking)                              │
│    └── `observation_conflict_ledger` (Non-destructive divergence tracking between competing sources)   │
│                                           │                                                             │
│                                           ▼                                                             │
│  [ PUBLICATION GATE & STATE MACHINE ]                                                                   │
│    Workflow: INGESTED ──► UNDER_REVIEW ──► APPROVED ──► PUBLISHED (or QUARANTINED / RETRACTED)          │
│    Enforced by database trigger `trg_enforce_mpo_publication_state`                                     │
│                                           │                                                             │
│                                           ▼                                                             │
│  [ SECURE PUBLIC CONSUMPTION LAYER ]                                                                    │
│    ├── Direct access to internal observation & ledger tables REVOKED from public                        │
│    ├── `v_approved_market_prices` (Security Barrier View: Published rows only, sanitized metrics)       │
│    └── `v_legacy_crop_prices_bridge` (Hardened backward compatibility for R1 consumers)                │
│                                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Verified Source Landscape & Governance Matrix

Every candidate data source for Zarati has been soberly evaluated. In compliance with Source Truth Law, **UNKNOWN remains UNKNOWN**, and access to a public document does not imply statutory redistribution permission.

### 2.1 Authoritative Source Classifications

| Source Key | Publishing Authority | Primary Mechanism | Frequency & Latency | Data Format | Licensing & Rights | Zarati Classification | Role in Zarati |
|:---|:---|:---|:---|:---|:---|:---|:---|
| `SRC_WFP_HDX` | UN World Food Programme (WFP VAM) | `https://data.humdata.org/dataset/wfp-food-prices-for-sudan` | Monthly (3–4 weeks lag) | CSV / CKAN REST API | **CC BY-IGO 3.0** (Open commercial with mandatory attribution) | **SAFE WITH ATTRIBUTION** | **Primary Historical Anchor & Benchmark**. Baseline cereal & pulse time series across 40+ Sudanese markets (2001–2026). |
| `SRC_FEWS_NET` | USAID / FEWS NET Data Warehouse | `https://fdw.fews.net/api/marketpricefacts/?country=SDN` | Monthly (2–3 weeks lag) | REST JSON (Auth Token) / CSV | **US Gov Public Domain** (Open access) | **SAFE WITH ATTRIBUTION** | **Food Security & Terms-of-Trade Validator**. Cereal prices, goat-to-sorghum terms of trade, and wage-to-cereal ratios. |
| `SRC_FAO_FPMA` | UN FAO (GIEWS / FPMA) | `https://www.fao.org/giews/food-prices/tool/public/` | Monthly / Quarterly | CSV / Excel / Web Interface | **CC BY-NC-SA 3.0 IGO** (Non-Commercial Share-Alike) | **RESTRICTED / REQUIRES BILATERAL MOU** | **Reference Cross-Check**. Barred from public commercial redistribution without formal UN bilateral agreement. Internal validation only. |
| `SRC_GEDAREF_AUCTION` | Gedaref State Agricultural Market Authority | Physical Auction Floor / State Bulletin / Radio Broadcast | Daily (Same-day, 14:00 CAT) | Unstructured Arabic Text / Print Bulletin | **Public Official Notice** (Sovereign Open Record) | **REQUIRES INSTITUTIONAL / LEGAL REVIEW** | **Daily Cash Spot Ground Truth**. Primary exchange clearing prices for Sorghum, Sesame, Sunflower. Commercial digital redistribution rights require state agreement. |
| `SRC_ELOBEID_EXCHANGE` | North Kordofan Crops Market Administration | Sheikan Locality Daily Auction Registry / Local Bulletin | Daily to 3x/week (24–48h lag) | Unstructured Arabic Text / Ledger | **Public Official Notice** (Sovereign Open Record) | **REQUIRES INSTITUTIONAL / LEGAL REVIEW** | **Kordofan Cash Ground Truth**. Global clearing benchmark for Gum Arabic, Groundnuts, Hibiscus. Commercial redistribution requires locality/state agreement. |
| `SRC_CBOS_STAT` | Central Bank of Sudan (CBOS) | `https://cbos.gov.sd/` Foreign Trade Statistics | Quarterly / Annual | PDF / HTML Tables | **Official Sovereign Report** | **SAFE WITH ATTRIBUTION** | **Macro Trade & Export Valuation**. Official commodity export volumes, FOB prices, and official foreign trade aggregates. |
| `SRC_WORLD_BANK_PINK` | World Bank Prospects Group | `https://www.worldbank.org/en/research/commodity-markets` | Monthly (1st week of month) | CSV / Excel API | **CC BY 4.0** (Open access) | **SAFE WITH ATTRIBUTION** | **Global Commodity Benchmark (Layer 4)**. US No. 2 Sorghum, US Gulf Wheat, Groundnut Oil, international fertilizer prices. |
| `SRC_UN_COMTRADE` | UN Statistics Division | `https://comtradeplus.un.org/` API | Annual / Semi-Annual | REST API / JSON | **UN Open Data** (Attribution required) | **SAFE WITH ATTRIBUTION** | **Bilateral Export Flow Reference**. Verification of destination markets for Sudanese sesame, sorghum, and gum arabic. |
| `SRC_PARALLEL_FX` | Parallel Market Monitoring Aggregators | Market Survey Median (Port Sudan, Dubai, Cairo) | Daily Spot | Unstructured / Survey | **Proprietary Survey / Derived** | **RESTRICTED** | **R4-C Dedicated**. Strictly barred from R4-A baseline until FX architecture is implemented in R4-C. |

### 2.2 Statutory Prohibitions
1. **No Phantom APIs:** Neither the Gedaref Agricultural Market Authority nor the El Obeid Crop Exchange operates an electronic REST API. Any claims of automated WebSocket or REST scraping of Sudanese physical exchanges without manual or OCR ingestion are categorically rejected.
2. **Attribution Law:** Whenever WFP HDX data is rendered in public views, the platform must display: `"Source: World Food Programme (WFP) via Humanitarian Data Exchange (HDX) [CC BY-IGO 3.0]"`.

---

## 3. Recommended First Dataset & Historical Data Strategy

### 3.1 Initial Production Dataset: WFP Sudan Food Prices (HDX)
The designated initial seed dataset for Zarati R4-A is the **WFP Food Prices for Sudan** dataset hosted on the Humanitarian Data Exchange:
* **Canonical Identifier:** `wfp_food_prices_sdn.csv`
* **Authority:** United Nations World Food Programme (WFP VAM)
* **Dataset Period:** January 15, 2001 – July 15, 2026 (Monthly series, updated continuously)
* **Geographic Depth:** 40+ wholesale and retail markets across 18 Sudanese States.
* **Core Commodities Tracked:**
  - **Sorghum (Feterita)** — *ذرة رفيعة (فتريتة)*: Wholesale and Retail
  - **Millet** — *دخن*: Wholesale and Retail
  - **Wheat** — *قمح*: Wholesale (imported and local) and Retail
  - **Sesame** — *سمسم*: Wholesale (Gedaref auction)
  - **Groundnuts** — *فول سوداني*: Wholesale and Retail
* **Licensing:** CC BY-IGO 3.0 (legally cleared for platform ingestion with attribution).

### 3.2 Historical Data Ingestion & Backfill Strategy
1. **Cold-Start Backfill (2020–2026):**
   - Historical records from 2020 to 2026 will be backfilled to establish seasonal price bands, five-year moving medians, and regional price spreads.
   - Every historical record is ingested with `temporal_class = 'historical_archive'`, `temporal_precision = 'CALENDAR_MONTH'`, and `source_provenance = 'institutional_multilateral'`.
   - Never back-calculate USD prices using today's exchange rate. Normalized USD prices remain `NULL` in R4-A.
2. **Monthly Delta Ingestion Worker (Post-Launch):**
   - A scheduled cron worker (`ingest-wfp-hdx`) executes monthly on the 5th business day of each month to fetch the updated CSV delta.
   - Records are validated and deduplicated using the non-null `source_record_key`.

---

## 4. Canonical Geographic Taxonomy & Market Registry

Zarati adheres strictly to the official post-2011 18-state administrative geography of the Republic of the Sudan, supporting hierarchical drilldowns from National down to Locality and Physical Auction Floor.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GEOGRAPHIC TAXONOMY HIERARCHY                   │
├────────────────────────────────────────────────────────────────────────┤
│ Level 0: COUNTRY (SD - Sudan / جمهورية السودان)                        │
│   └── Level 1: STATE / WILAYA (18 Sovereign States)                    │
│         └── Level 2: LOCALITY / MAHALIYA (e.g. Baladiya, Sheikan)      │
│               ├── Level 3A: PHYSICAL MARKET / AUCTION FLOOR            │
│               │     (e.g., Gedaref Crop Exchange, El Obeid Exchange)   │
│               └── Level 3B: AGRICULTURAL SCHEME                        │
│                     (e.g., Gezira Scheme, Rahad, New Halfa)            │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Primary Market Registry (Sudanese Ground Truth)

| Market Code | Market Name (EN / AR) | State Code | Locality (Mahaliya) | Market Nature | Primary Commodities Cleared | Customary Trading Unit |
|:---|:---|:---|:---|:---|:---|:---|
| `MKT-GD-01` | Gedaref Crop Exchange<br/>سوق محاصيل القضارف | `SD-GD` | Baladiyat Al-Qadarif | Primary Auction Floor / Wholesale Spot | Sorghum (Feterita, Dabar, Tetron), White Sesame, Sunflower | Ardeb (customary), Qintar, 90kg Sack |
| `MKT-OB-01` | El Obeid Crop Exchange<br/>بورصة محاصيل الأبيض | `SD-NK` | Sheikan | Primary Auction Floor / Wholesale Spot | Gum Arabic (Hashab, Talha), Groundnuts, Sesame, Hibiscus | Qintar, Metric Ton |
| `MKT-WM-01` | Wad Madani Central Wholesale<br/>سوق ود مدني المركزي | `SD-GZ` | Madani Al-Kubra | Regional Wholesale Distribution | Wheat, Sorghum, Faba Beans, Horticultural | 50kg Sack, 100kg Bag, Metric Ton |
| `MKT-SN-01` | Sennar Crops Market<br/>سوق سنار الزراعي | `SD-SN` | Sennar | Regional Wholesale / Semi-Mechanized Hub | Sorghum, Sesame, Maize, Sunflower | Ardeb, 90kg Sack |
| `MKT-KS-01` | Kassala Crops Market<br/>سوق محاصيل كسلا | `SD-KS` | Kassala | Regional Wholesale & Border Corridor | Sorghum, Onion, Horticultural, Wheat | 100kg Bag, Ardeb |
| `MKT-PS-01` | Port Sudan Terminal Market<br/>سوق بورتسودان النهائي | `SD-RS` | Port Sudan | Terminal Export / Port Silo | Export Sesame, Export Gum Arabic, Imported Wheat | Metric Ton, Bulk Container |
| `MKT-NY-01` | Nyala Crops Market<br/>سوق محاصيل نيالا | `SD-SD` | Nyala | Western Regional Wholesale | Groundnuts, Millet, Gum Arabic, Sesame | Metric Ton, Qintar |
| `MKT-KT-01` | Kosti Crops Market<br/>سوق محاصيل كوستي | `SD-WN` | Kosti | River / Transit Wholesale Hub | Sorghum, Millet, Oilseeds | Ardeb, 90kg Sack |
| `MKT-DM-01` | Ad-Damazin Crops Market<br/>سوق محاصيل الدمازين | `SD-BN` | Ad-Damazin | Blue Nile Rainfed Assembly | Sorghum, Sesame, Cotton | Ardeb, 90kg Sack |
| `MKT-DL-01` | Dongola Agricultural Market<br/>سوق دنقلا الزراعي | `SD-NO` | Dongola | Northern Riverine Wholesale | Winter Wheat, Dates, Faba Beans | 50kg Sack, Metric Ton |

---

## 5. Canonical Commodity & Currency Taxonomy

### 5.1 Commodity Hierarchy
Zarati implements a 4-tier taxonomy separating biological species from commercial varieties and quality grades:
1. `COMMODITY`: Macro Category (Grain, Oilseed, Cash, Pulse)
2. `CROP`: Species level linked to existing `public.crops(id)` (e.g. Sorghum / ذرة رفيعة)
3. `VARIETY`: Agronomic variety (e.g. Feterita, Dabar, Tetron)
4. `COMMERCIAL GRADE`: Commercial trade specification (e.g. Grade 1 Export, Commercial, Crushing)

### 5.2 Currency Reference Model (No FX in R4-A)
`canonical_currencies` maintains standard ISO 4217 currency metadata (`SDG`, `USD`, `SAR`, `AED`). R4-A records raw currency text and validates foreign key linkages. **FX conversion logic belongs exclusively to R4-C.**

---

## 6. Customary Unit Reference & Safety Model

Regional measures in Sudan vary across production zones, grain varieties, and moisture levels:
* An Ardeb of sorghum in Gedaref is customarily treated as 12 Rub' (~198 kg), but localized rainfed markets occasionally clear lots between 180 and 195 kg per Ardeb.
* A Qintar of sesame is customarily 100 lbs (44.93 kg), while gum arabic in Kordofan is traded at 45.0 kg per Qintar.

### Safety Protocol:
1. `canonical_units` stores `weight_kg_nominal`, `min_weight_kg`, `max_weight_kg`, `confidence_level` (`STATUTORY_STANDARD`, `REGIONAL_ESTIMATE`, `VARIABLE_UNVERIFIED`), and `is_verified_standard BOOLEAN`.
2. **R4-A does NOT execute automated unit conversion on unverified or variable customary units.** Conversion is deferred to R4-C when verified conversion rules with effective dates are established.
3. Original customary unit strings are preserved verbatim in `raw_unit_text`.

---

## 7. Verbatim Source Truth & Immutable Observation Model

### 7.1 Separation of Raw Ground Truth and Numeric Parsing
* `raw_price_text TEXT NOT NULL`: Preserves the exact character string from the source (e.g. `'450,000'`, `'12.5'`, `'1500-1600'`).
* `parsed_price_numeric NUMERIC(16,4)`: Nullable parsed value. Parsing is treated as a logged transformation in `observation_transformations`.
* `raw_currency_text TEXT NOT NULL` & `raw_unit_text TEXT NOT NULL`: Preserved verbatim.

### 7.2 Strict Temporal Model & Precision
To prevent fabricating exact timestamps for monthly surveys:
* `temporal_precision`: `EXACT_TIMESTAMP`, `CALENDAR_DAY`, `CALENDAR_MONTH`, `SEASONAL_RANGE`.
* `valid_from` & `valid_to`: Defines the temporal validity window for continuous price indicators.
* `stale_after_at`: Deterministic timestamp calculated at ingestion based on market type and cadence.

---

## 8. Orthogonal Provenance & Multi-Dimensional Verification

### 8.1 Orthogonal Provenance Dimensions
Conflation of source identity, ingestion method, and verification state is strictly eliminated:
1. `source_provenance`: `sovereign_statutory`, `institutional_multilateral`, `commercial_exchange`, `market_reported`, `field_survey`.
2. `ingestion_method`: `automated_api`, `automated_feed`, `manual_bulletin_entry`, `ocr_extract`, `batch_import`.
3. `temporal_class`: `current_spot`, `historical_archive`, `backfill`.
4. `derivation_class`: `observed_transaction`, `reported_survey`, `calculated_median`, `model_estimated`.
5. `verification_state`: `unassessed`, `partially_verified`, `verified`, `disputed`, `rejected`.

### 8.2 Multi-Dimensional Verification Evidence Ledger
An observation can satisfy multiple independent evidentiary criteria. Evidence is recorded in `observation_verification_evidence`:
* `SOURCE_AUTHORITY`: Producer credentials verified against accredited statutory/institutional registries.
* `INGESTION_INTEGRITY`: Cryptographic SHA-256 hash verified against immutable `raw_ingestion_snapshots`.
* `FIELD_CORROBORATION`: Physical auction slips, weighing bridge receipts, or independent second-party confirmation.
* `STATISTICAL_PLAUSIBILITY`: Algorithmic variance check against historical moving distribution. *Statistical plausibility is explicitly NOT treated as proof of factual verification.*

### 8.3 Zero Default Trust
* `trust_score` is nullable (`CHAR(1) DEFAULT NULL`).
* Verification state initializes to `'unassessed'`.
* Trust scores (A–E) are assigned only after evaluation of verification evidence.

---

## 9. Data Quality, Conflict Management & Transformation Audit

### 9.1 Ingestion Quality Checks
* `negative_or_zero_price`: Immediate rejection.
* `temporal_inversion`: `observed_at > published_at` $\rightarrow$ Immediate rejection.
* `outlier_anomaly`: Deviation $> 60\%$ from 30-day moving median $\rightarrow$ Status set to `QUARANTINED`, flagged in `observation_quality_flags`.

### 9.2 Non-Destructive Conflict Management
When competing sources report conflicting prices for the same commodity, market, and date:
* Both records are committed to `market_price_observations`.
* The divergence is logged in `observation_conflict_ledger`.
* Example:
  ```text
  [EXAMPLE / NOT REAL MARKET DATA]
  Gedaref Floor Sheet: 450,000 SDG vs WFP Monthly Survey: 435,000 SDG (Variance: 3.4%)
  ```

### 9.3 Transformation Audit Ledger
Every parsing or normalization step is logged in `observation_transformations` (`transformation_type`, `input_value`, `output_value`, `rule_code`, `rule_version`, `performed_by`, `performed_at`).

---

## 10. Security Architecture, RLS & Safe Public Views

### 10.1 Public Data Minimization
Public anonymous and authenticated users have **ZERO direct table access** to:
* `market_price_observations`
* `raw_ingestion_snapshots`
* `observation_verification_evidence`
* `observation_transformations`
* `observation_quality_flags`
* `observation_conflict_ledger`

### 10.2 Safe Public Intelligence View (`v_approved_market_prices`)
* Configured with `WITH (security_barrier = true)` to prevent query optimizer leakage.
* Filters strictly: `WHERE publication_status = 'PUBLISHED'`.
* Dynamically derives staleness: `(NOW() > mpo.stale_after_at) AS is_stale`.
* Exposes only sanitized metrics, trust scores, provenance metadata, and mandatory source attribution.

### 10.3 Hardened Backward Compatibility Bridge (`v_legacy_crop_prices_bridge`)
* Configured with `WITH (security_barrier = true)`.
* Maps faithfully to R1 `crop_prices` schema:
  - `source`: Truthfully maps based on `source_provenance` (`market_authority`, `fao_amis`, `trader_survey`).
  - `is_official`: `true` ONLY if `source_provenance IN ('sovereign_statutory', 'commercial_exchange') AND verification_state = 'verified'`.
  - `notes`: Truthfully displays `src.code || ' [' || mpo.verification_state || ']'`.
  - Zero synthetic or fake hardcoded assertions.

---

## 11. "Market Price Today" Statutory Standard

The phrase:
$$\text{“Today’s Market Price” / “سعر السوق اليوم”}$$
is strictly banned unless **ALL** of the following conditions are simultaneously met:
1. `observed_at` occurred within the last **24 hours** (or previous business day).
2. Physical market auction floor is unambiguously identified.
3. Crop, variety, and grade are explicitly identified.
4. Original quotation unit and currency are displayed verbatim.
5. Sourced from a certified physical auction sheet (`Tier A`) or dual-corroborated market reporters (`Tier C`).
6. `stale_after_at` has not elapsed.

Until then, displayed intelligence is explicitly labeled as **INDICATIVE / HISTORICAL BENCHMARK**.

---

## 12. Subsystem Interface Boundaries (R4-B through R4-E)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        R4 SUBSYSTEM INTERFACE MAP                      │
├────────────────────────────────────────────────────────────────────────┤
│ R4-A: INSTITUTIONAL & HISTORICAL DATA FOUNDATION (Current Base)        │
│   ├── Exposes: `v_approved_market_prices`, `canonical_sources`,        │
│   │            `canonical_commodities`, `canonical_units`              │
│   └── Ingestion worker contracts for CSV/JSON snapshots                │
├────────────────────────────────────────────────────────────────────────┤
│ R4-B: WEATHER & AUTOMATED EXTERNAL FEEDS (Deferred)                    │
│   └── Open-Meteo / ECMWF weather observations.                         │
├────────────────────────────────────────────────────────────────────────┤
│ R4-C: FX & UNIT NORMALIZATION ENGINE (Deferred)                        │
│   └── Historical FX rates & auditable normalization rules.             │
├────────────────────────────────────────────────────────────────────────┤
│ R4-D: SUDAN MARKET REPORTER STAGING BOUNDARY (Deferred)                │
│   └── Controlled staging area (`market_reporter_submissions_staging`). │
│       Reporters NEVER insert directly into `market_price_observations`.│
├────────────────────────────────────────────────────────────────────────┤
│ R4-E: TRADER & INSTITUTIONAL ANALYTICS (Deferred)                      │
│   └── Time series analysis, aggregations, and export APIs.             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Gedaref Pilot Readiness Requirements

Before activating a future market intelligence pilot in Gedaref State:
1. Double-entry review protocol for physical auction sheets.
2. Cryptographic reporter signing and geofenced staging submission pipeline.
3. Formally executed bilateral data-sharing frameworks with local agricultural associations.
*Current State:* **GEDAREF PILOT NOT ACTIVATED**.
