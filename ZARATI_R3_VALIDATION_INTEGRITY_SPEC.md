# ZARATI R3 VALIDATION & INTEGRITY SPEC

## Price Semantics
*   `price`: NUMERIC, NULLABLE.
*   **NULL** = "Contact for Price" (UI: "تواصل لمعرفة السعر").
*   **0** = Actual zero price. Rejected in validation for commercial listings.
*   If `price` IS NOT NULL: `currency` is REQUIRED and defaults to SDG. `price > 0`.
*   Fake zero values are strictly prohibited to prevent R4 market intelligence contamination.

## Unit Semantics
*   Original seller-entered units (e.g., `kg`, `mt`, `sack`, `ardeb`, `quintal`) are preserved exactly as entered.
*   No silent normalization is performed in R3. "Sack" variations are preserved.
*   R4 owns FX and unit normalization.

## Zod Schemas
*   `crop_id`: `z.string().uuid()`
*   `title_ar`: `z.string().min(5).max(100)`
*   `quantity`: `z.coerce.number().positive().max(1000000)`
*   `price`: `z.coerce.number().positive().optional().nullable()`
*   `currency`: `z.enum(['SDG']).optional()`
*   `unit`: `z.string().min(1)` (Local unit preserved)
