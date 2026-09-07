# ZARATI | زرعتي — R4-A Migration 024 Test Report

## MANDATORY DATABASE TEST MATRIX RESULTS

| Test Code | Description | Result |
| :--- | :--- | :--- |
| **A** | `v_legacy_crop_prices_bridge` contains no WFP hardcoding and uses truthful provenance mappings. | PASS |
| **B** | Immutability triggers correctly use `IS DISTINCT FROM` for all nullable fields. | PASS |
| **C** | `ON DELETE CASCADE` correctly replaced with `ON DELETE RESTRICT` for evidence and transformation ledgers where applicable. | PASS |
| **D** | `v_approved_market_prices` successfully mounts with `security_barrier = true, security_invoker = true`. | PASS |
| **E** | Direct public access remains explicitly revoked for observation ledgers. | PASS |
| **F** | `RETRACTED` state blocks direct transition back to `PUBLISHED` without `UNDER_REVIEW`. | PASS |
| **G** | Local Supabase DB reset completes entirely (001–024) without syntax errors or warnings. | PASS |
| **H** | Types successfully re-generated from the DB shadow graph correctly yielding enum definitions. | PASS |
