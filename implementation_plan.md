# ZARATI Intelligence Experience V1 Implementation Plan

## Goal
Replace the placeholder `/intelligence` page with a real, production-data-driven Intelligence Experience. This will expose R4-C normalized market prices and MET Norway weather data while adhering strictly to ZARATI's "No Mock Data" sovereign tenets.

## Proposed Changes

### `lib/services/intelligence.ts`
[NEW] Create a secure Next.js server-side service to fetch:
- Overview stats (Commodities, Markets, States, Dates)
- Public market observations from `v_public_normalized_market_prices`
- MET Norway weather from `weather_observations` (provider='MET_NORWAY')
- Historical chart data

### `app/[lang]/intelligence/page.tsx`
[MODIFY] Overhaul the entire page to remove placeholders and serve as the main dashboard entry point.

### `app/[lang]/intelligence/components/IntelligenceOverview.tsx`
[NEW] High-level metrics component showing verified counts, freshness, and geographic coverage.

### `app/[lang]/intelligence/components/MarketExplorer.tsx`
[NEW] Tabular market data with filters for Commodity, State, and Date Range. Includes USD unavailable states (since verified historical FX is not yet populated) and strictly formatted SDG metric values.

### `app/[lang]/intelligence/components/HistoricalCharts.tsx`
[NEW] Line charts plotting `normalized_sdg_per_kg` and `normalized_sdg_per_mt` over time, handling sparse data without misleading connections.

### `app/[lang]/intelligence/components/WeatherIntelligence.tsx`
[NEW] Elegant forecast presentation specifically restricted to MET Norway data for Gedaref. Includes a premium "Unavailable" state when the cron has not yet populated production feeds.

### `app/[lang]/page.tsx` (Homepage)
[MODIFY] Add a tasteful "Real Intelligence Preview" section linking to `/intelligence`, displaying a live statistic (e.g. number of published observations) to establish immediate credibility.

### Internationalization & RTL
All new components will fully support English and Arabic (using the existing `isAr` and `dir="rtl"` patterns), relying on the Cairo font.

## Verification Plan
### Manual Verification
- Ensure the `/intelligence` page correctly loads and displays `102` public observations.
- Confirm USD equivalents display as "Unavailable (Verified FX Required)".
- Verify Weather shows a premium "Data Unavailable" state due to missing MET Norway production data.
- Check RTL alignment and Arabic typography (Cairo font).
- Validate mobile responsiveness on 390px viewports.

### Automated Tests
- Ensure `npm run build`, `npm run lint`, and `npm run test` pass.
- Write a basic frontend render test for `/intelligence` ensuring no placeholders remain.
