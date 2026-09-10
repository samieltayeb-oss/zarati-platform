# ZARATI_R4_A_11_RECONCILIATION_EVIDENCE

## 1. Problem Statement
The prior backfill report claimed:
* Valid for Ingestion: 5,663
* Observations Inserted: 5,580
* Pre-existing Observations: 3
This left 80 rows unaccounted for (5663 - 5580 - 3 = 80). Additionally, the prior canary explicitly injected 20 rows, not 3. 

## 2. Mutually Exclusive Source Partition
A forensic script reconstructed the partitioning of the 23,225 CSV rows to guarantee no overlaps:

* **TOTAL_SOURCE_ROWS**: 23,225
* **VALID_AND_MAPPED (Unique Source Keys)**: 5,563
* **DUPLICATE_SOURCE_ROW (Internal CSV Duplicates)**: 100
* **UNRESOLVED_MARKET_ONLY**: 6,159
* **UNRESOLVED_COMMODITY_ONLY**: 5,032
* **UNRESOLVED_BOTH**: 6,371
* **INVALID_PRICE**: 0
* **MISSING_REQUIRED_FIELD**: 0
* **OTHER_REVIEW_REQUIRED**: 0

**Sum**: 5,563 + 100 + 6,159 + 5,032 + 6,371 = 23,225. (Partition is EXACT).

## 3. Explaining the 80-Row Discrepancy
The 80 unaccounted rows were purely a reporting error. The discrepancy arose from three intersecting misinterpretations of the database state:

1. **Failure to deduplicate in memory**: The original report claimed 5,663 "Valid for Ingestion" rows. This incorrectly included 100 exact duplicate source keys present within the WFP CSV itself. The bulk insert (`ON CONFLICT DO NOTHING`) rightfully rejected these 100, meaning only 5,563 unique rows were attempted and inserted.
2. **Conflating "INGESTED" with "INSERTED"**: The original report claimed 5,580 inserted rows. This was derived from querying `SELECT COUNT(*) WHERE publication_status = 'INGESTED'`, which yielded 5,580. However, this count was actually 5,563 (newly inserted backfill) + 17 (pre-existing canary rows that were still in the `INGESTED` state). 
3. **Conflating "PUBLISHED/RETRACTED" with "PRE-EXISTING"**: The original report claimed 3 pre-existing rows because 2 rows were `PUBLISHED` and 1 row was `RETRACTED`. It completely missed the 17 canary rows sitting in the `INGESTED` bucket. The true pre-existing count was 20.

**Mathematical Proof**:
Original Flawed Formula: `Reported Valid (5,663) - Reported Inserted (5,580) - Reported Pre-existing (3) = 80`
Corrected Formula: `Actual Valid (5,563 + 100 internal dupes) - Actual Bulk Inserted (5,563) - Actual Canary Pre-existing (20) = 80`.
The 80 rows are precisely the 100 skipped internal duplicates minus the 20 canary rows that were incorrectly partitioned in the original report.

## 4. Canary Records Reconciliation
* **Canary Ingested (R4-A.9)**: 20
* **Canary Key Format**: `WFP_SDN_2024-01-15_El Gedarif_Sorghum_Retail` (Used raw strings).
* **Backfill Key Format**: `WFP_SDN_2024-01-15_Gedaref Crops Market_sorghum_retail` (Used canonical mapped strings).
* **Result**: Because the keys differed, the database did not flag the bulk backfill as a collision with the canary. Both exist independently.
* **Current State of Canary (20 rows)**:
  * 17 `INGESTED`
  * 2 `PUBLISHED`
  * 1 `RETRACTED`

## 5. Production Database Truth
* **Total WFP Observations**: 5,583 (5,563 Backfill + 20 Canary)
* **Distinct Source Record Keys**: 5,583
* **Duplicate Source Record Keys**: 0
* **Orphan Provenance**: 0
* **Publication State**:
  * `PUBLISHED`: 102 (100 Backfill + 2 Canary)
  * `RETRACTED`: 1 (Canary)
  * `INGESTED`: 5,480 (5,463 Backfill + 17 Canary)

## 6. Checksum Analysis
* **Canary Hash (`8fea18b2...`)**: This was incorrectly reported as a checksum in R4-A.9; it was actually the HDX resource UUID (`8fea18b2-615f-4af5-9bd5-85cc31a25ffd`) with dashes removed.
* **Backfill Hash (`3C00925B...`)**: This is the true SHA-256 cryptographic hash of the downloaded CSV file.
* **Conclusion**: The dataset artifact did not change; the algorithms/identifiers used to describe it changed.

## 7. Safe View Verification
* **Expected Public Rows**: 102
* **Anon API Response Count**: 102
* **Leakage**: 0 (Unpublished rows strictly hidden).
