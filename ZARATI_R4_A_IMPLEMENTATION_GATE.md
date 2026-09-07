# ZARATI | زرعتي — R4-A Implementation Gate & Forensic Hardening Audit
**Phase:** R4-A (Institutional & Historical Data Foundation)  
**Date Context:** September 2026  
**Auditor:** Sovereign Data Architecture Review  
**Base Commit:** `08d7e07877bed1e81dc3a82682791a0886f42fba` (Production Verified)  
**Production Target:** Supabase PostgreSQL (`nelsijiczufflyqosvzi`)

---

## 1. Forensic Pre-Implementation Hardening Cross-Check

A line-by-line forensic comparison between [ZARATI_R4_A_ARCHITECTURE_FREEZE.md](file:///c:/Users/mcreg/Desktop/zarati/ZARATI_R4_A_ARCHITECTURE_FREEZE.md) and [ZARATI_R4_A_MIGRATION_024_DESIGN.md](file:///c:/Users/mcreg/Desktop/zarati/ZARATI_R4_A_MIGRATION_024_DESIGN.md) was executed to verify all 22 Founder directives:

| # | Hardening Criterion | Architecture Specification | Migration 024 DDL Mechanism | Forensic Result |
|:---|:---|:---|:---|:---|
| 1 | **Verbatim Raw Source Preservation** | Preserve exact textual source representation alongside nullable parsed interpretation. | `raw_price_text TEXT NOT NULL`, `parsed_price_numeric NUMERIC(16,4)` (nullable), `raw_currency_text TEXT NOT NULL`, `raw_unit_text TEXT NOT NULL`, `source_record_raw TEXT`. | **PASS** |
| 2 | **R4-C Normalization Boundary** | Unit normalization and FX conversion owned by R4-C. R4-A must not require normalized values to store observations. | `normalized_price_per_mt`, `normalized_price_per_kg`, `normalized_price_usd_per_mt`, `conversion_factor_used`, `conversion_rule_applied` are all strictly **NULLABLE**. | **PASS** |
| 3 | **Orthogonal Provenance Model** | Eliminate conflated single provenance enum. Separate source identity, ingestion method, time horizon, and derivation class. | 4 distinct enums: `source_provenance_enum`, `ingestion_method_enum`, `temporal_class_enum`, `derivation_class_enum`, plus `verification_state_enum`. | **PASS** |
| 4 | **Multi-Dimension Verification Evidence** | Single verification column replaced by multi-criteria evidence ledger. Statistical plausibility is not proof of factual truth. | Separate `observation_verification_evidence` table tracking dimension, status, evaluated_by, evidence_reference, and notes. | **PASS** |
| 5 | **Zero Default Trust** | No synthetic or unearned default trust badges for incoming data. | `trust_score CHAR(1) DEFAULT NULL`, `verification_state DEFAULT 'unassessed'`. Zero unearned trust. | **PASS** |
| 6 | **Legacy Bridge Truth** | Remove fake hardcoded `fao_amis`, `is_official = true`, and `Verified` notes. | Truthful conditional mapping based on `source_provenance` and `verification_state`. Notes display actual source and verification status. | **PASS** |
| 7 | **Public Data Minimization** | Revoke direct public table SELECT on observations and internal ledgers. | Direct table access **REVOKED** from `anon, authenticated`. Public reads exclusively mediated via `v_approved_market_prices`. | **PASS** |
| 8 | **View Security Barrier** | Prevent query optimizer data leakage in security views. | `v_approved_market_prices` and `v_legacy_crop_prices_bridge` created `WITH (security_barrier = true)`. | **PASS** |
| 9 | **Deterministic Deduplication** | Prevent duplicate insertions caused by PostgreSQL NULL semantics in composite keys. | `source_record_key TEXT NOT NULL` with `CONSTRAINT uq_mpo_source_record_key UNIQUE (source_id, source_record_key)`. Snapshots enforce `(dataset_id, payload_sha256)`. | **PASS** |
| 10 | **Source / Dataset Relational Guard** | Prevent an observation from linking a dataset belonging to Source A while claiming Source B. | Composite unique key on `canonical_datasets(id, source_id)` and matching composite foreign key `(dataset_id, source_id)` in `market_price_observations`. | **PASS** |
| 11 | **Temporal Completeness & Precision** | Support calendar day, month, and range without fabricating fake 00:00 exact times. | `temporal_precision_enum`, `valid_from TIMESTAMPTZ`, `valid_to TIMESTAMPTZ`, `observed_at TIMESTAMPTZ`. | **PASS** |
| 12 | **Deterministic Staleness** | Eliminate mutable boolean column that becomes outdated in storage. | Replaced by immutable `stale_after_at TIMESTAMPTZ NOT NULL`. `is_stale` derived dynamically in view as `(NOW() > stale_after_at)`. | **PASS** |
| 13 | **Raw Observation Immutability** | Prevent UPDATE and DELETE mutations on raw ground truth. | Triggers `trg_protect_mpo_immutability` (blocks updates to raw fields) and `trg_prevent_mpo_delete` (blocks physical deletion; requires retraction). | **PASS** |
| 14 | **Publication State Machine** | Enforce valid state transitions; prevent arbitrary jumps from INGESTED to PUBLISHED. | Trigger `trg_enforce_mpo_publication_state` validates allowed transitions (`INGESTED -> UNDER_REVIEW/QUARANTINED`, `APPROVED -> PUBLISHED`, etc.). | **PASS** |
| 15 | **Transformation Audit Ledger** | Trace every parsing and normalization step. | `observation_transformations` ledger records transformation type, input, output, rule code, version, parameters, and actor. | **PASS** |
| 16 | **Currency Reference Model** | Support currency metadata without executing R4-C FX conversion. | `canonical_currencies` (ISO 4217 metadata: `SDG`, `USD`, `SAR`, `AED`). No FX conversion in R4-A. | **PASS** |
| 17 | **Customary Unit Safety** | Do not freeze questionable constants as universal truth where regional variance exists. | `canonical_units` stores `weight_kg_nominal`, bounds (`min_weight_kg`, `max_weight_kg`), confidence level, and `is_verified_standard BOOLEAN`. Unverified units are not auto-converted. | **PASS** |
| 18 | **Source Licensing Safety** | Accurate, sober legal classification. Access != Redistribution rights. | WFP HDX: Safe with attribution. FAO FPMA: Restricted / Requires MOU. Sovereign bulletins: Requires institutional review. | **PASS** |
| 19 | **Source Claim Precision** | Eliminate hyperbolic or speculative terminology. | All claims grounded in empirical reality. UNKNOWN remains UNKNOWN. | **PASS** |
| 20 | **R4-D Reporter Staging Boundary** | Field reporters must not write directly into the canonical observation ledger. | R4-D interface defined as a staging boundary (`market_reporter_submissions_staging`). Core observation ledger is protected. | **PASS** |
| 21 | **Example Data Labeling** | Disclaim all illustrative numbers in documentation. | Every illustrative example labeled: `[EXAMPLE / NOT REAL MARKET DATA]`. | **PASS** |
| 22 | **Migration 024 Scope Discipline** | Strictly foundational data structures only. | Zero weather, zero FX rates, zero reporter UI, zero analytics, zero GIS, zero AI. | **PASS** |

---

## 2. Risk & Blocker Classification Register

* **BLOCKERS:** `0` (Zero architectural or schema blockers remain)
* **HIGH:** `0` (All high-severity truth and immutability risks resolved by the hardened DDL)
* **MEDIUM:** `2` (Operational workflow implementation items for Phase R4-A execution):
  1. `RISK-M-01`: Seeding `canonical_commodity_aliases` to resolve all 40+ UN WFP commodity label variations to canonical Sudanese crops.
  2. `RISK-M-02`: Seeding `canonical_localities` with UN OCHA P-Codes for administrative georeferencing.
* **LOW:** `1`:
  1. `RISK-L-01`: Cataloging localized customary volumetric unit variances across rainfed localities in Gedaref and Kordofan.

---

## 3. Strict Boundary Compliance Confirmation

```text
MIGRATION 024 CREATED: NO
APPLICATION CODE MODIFIED: NO
DATABASE MODIFIED: NO
PRODUCTION TOUCHED: NO

R1 COMPATIBILITY PRESERVED: YES (Legacy bridge view hardened)
R2 AUTH/RLS PRESERVED: YES (Zero identity leakage, public data minimization)
R3 MARKETPLACE PRESERVED: YES (Listing media truth intact)

R4-B (WEATHER) STARTED: NO
R4-C (FX) STARTED: NO
R4-D (MARKET REPORTERS) STARTED: NO
R4-E (ANALYTICS) STARTED: NO
GEDAREF PILOT ACTIVATED: NO
```

---

## 4. Final Verdict

### **✅ R4-A HARDENED — READY FOR MIGRATION 024 IMPLEMENTATION AUTHORIZATION**
The architecture and Migration 024 schema design are relationally sound, cryptographically auditable, non-destructive, and strictly aligned with the Founder's directives. No code or migration file has been created.
