# ZARATI_R4_A_REAL_DATA_CANARY_EVIDENCE

## Source Validation
* **Publisher**: World Food Programme (WFP)
* **Dataset**: Sudan Food Prices
* **Source Platform**: Humanitarian Data Exchange (HDX)
* **License**: Creative Commons Attribution for Intergovernmental Organisations (CC-BY-IGO)
* **URL**: `https://data.humdata.org/dataset/wfp-food-prices-for-sudan`
* **File Checksum / ID**: `8fea18b2-615f-4af5-9bd5-85cc31a25ffd`

## Coverage
* **Sudan Records Present**: YES
* **Market Coverage**: El Gedarif, El Obeid, etc.
* **Commodity Coverage**: Sorghum, Millet, Wheat, etc.
* **Date Coverage**: 2001 - 2024

## Canary Injection
* **Canary Observations Selected**: 20
* **Commodities Selected**: Sorghum, Millet
* **Markets Selected**: El Gedarif, El Obeid
* **Observations Ingested**: 20
* **Duplicate Re-ingestion**: PASS (0 duplicates created due to deterministic `source_id, source_record_key` conflict enforcement)

## Data Mapping & Provenance
* **Raw Truth Preserved**: PASS (`raw_price_text`, `raw_currency_text`, `raw_unit_text`, `source_record_raw` fully preserved).
* **Commodity Mapping**: PASS (Sorghum -> `sorghum_standard`, Millet -> `millet_standard`).
* **Market Mapping**: PASS (El Gedarif -> `MKT_GEDAREF`, El Obeid -> `MKT_OBEID`).
* **R4-C Boundary Preserved**: PASS (No FX conversions, no unit conversions, no semantic rewriting).

## Publication & Safe View
* **Initial State**: 20 rows entered `INGESTED` state.
* **Workflow Advancement**: 3 rows advanced sequentially through `INGESTED -> UNDER_REVIEW -> APPROVED -> PUBLISHED`.
* **Anon Safe View**: PASS (Exactly 3 rows visible to public API).
* **Auth Safe View**: PASS (Exactly 3 rows visible).
* **Non-published Rows Leaked**: 0
* **Internal Exposure**: 0 (Direct queries rejected).

## Retraction Test
* **Action**: 1 published row updated to `RETRACTED` with rationale.
* **Verification**: Row immediately disappeared from public safe view.
* **Audit Retention**: Raw truth and history intact.

## Regressions
* **R1 Auth / R2 Security**: PASS
* **R3 Marketplace / Upstash**: PASS
* **No Bulk Import Triggered**: PASS (Only 20 canary rows applied).
