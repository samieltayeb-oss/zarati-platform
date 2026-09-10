# ZARATI_R4_A_HISTORICAL_BACKFILL_EVIDENCE

*(Note: This report has been corrected after forensic reconciliation. See ZARATI_R4_A_11_RECONCILIATION_EVIDENCE.md for details).*

## Source Validation
* **Publisher**: World Food Programme (WFP)
* **Dataset**: Sudan Food Prices
* **Source Platform**: Humanitarian Data Exchange (HDX)
* **License**: Creative Commons Attribution for Intergovernmental Organisations (CC-BY-IGO)
* **URL**: `https://data.humdata.org/dataset/wfp-food-prices-for-sudan`
* **File Checksum (SHA-256)**: `3C00925B7C04192E7170DC5BCE13CFACA898B0C1499E9F939540FEC19F6CBEE4`

## Inventory & Quality Classification
* **Total Source Rows**: 23,225
* **Missing/Invalid Price**: 0 (Cleaned dynamically)
* **Unresolved Commodities**: 5,032
* **Unresolved Markets**: 6,159
* **Unresolved Both**: 6,371
* **Duplicate Source Rows (Internal to CSV)**: 100
* **Valid for Ingestion (Unique Keys)**: 5,563 (Corrected from 5,663)

## Dry Run & Batch Plan
* **Dry Run**: PASS (Validation parsed the CSV properly).
* **Batch Plan**: 3 Batches executed with size up to 2,000.
* **Batch Size**: 2,000
* **Batches Executed**: 3

## Execution & Idempotency
* **Observations Inserted**: 5,563 (Corrected from 5,580)
* **Pre-existing Canary Observations**: 20 (Corrected from 3)
* **Exact Duplicate Source Rows Filtered**: 100 (Internal to CSV)
* **Idempotency**: PASS (Batch 1 re-run created 0 duplicates).
* **Reconciliation**: 5563 inserted + 20 pre-existing canary rows = 5583 Total DB Rows. MATCHES EXACTLY.

## Provenance & Boundary
* **Provenance Linked**: PASS
* **Raw Truth 50-Row Audit**: PASS
* **R4-C Boundary Preserved**: PASS (No FX conversions, no unit conversions).
* **Automated Feeds**: NO
* **FAO Ingestion Started**: NO
* **R4-B/R4-C Started**: NO
* **Gedaref Pilot Activated**: NO
* **Migration 026 Created**: NO

## Publication & Safe View
* **Observations Published**: 100 Backfill + 2 Canary = 102 Total
* **Anon Safe View**: PASS (Exactly 102 rows returned).
* **Auth Safe View**: PASS (Matches Anon).
* **Unpublished Leak**: 0
* **Raw Data Leak**: NO
* **Staleness Handling**: PASS

## Regressions
* **R1/R2/R3 Regressions**: PASS
* **Upstash**: PASS
* **Performance Query**: PASS
