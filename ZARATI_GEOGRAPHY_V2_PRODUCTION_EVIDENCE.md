# ZARATI GEOGRAPHY V2 — PRODUCTION EVIDENCE & ACCEPTANCE REPORT

## 1. Executive Summary
ZARATI Geography V2 transforms `/en/geography` and `/ar/geography` into a flagship **Agricultural Geography Explorer** powered strictly by verified production truth. The previous non-functional "Coming in Next Phase" overlay has been completely eliminated. 

The explorer operates on zero mock geographic data, respects the public data boundary (102 approved public observations isolated from 5,663 internal records), preserves Sudan's post-2011 international borders, incorporates live MET Norway meteorological forecasts for El Gedarif, and maintains unambiguous geographic precision labeling.

---

## 2. Core Architectural & Data Truth Principles

### A. Absolute Data Law Compliance
1. **No Mock Geographic Data**: Every coordinate, market count, commodity classification, observation tally, and weather measurement is derived directly from production Supabase tables and approved views (`v_public_normalized_market_prices`, `v_public_weather`, `states`, `markets`).
2. **No Fake National Coverage**: Platform coverage is clearly distinguished from national agricultural productivity. When viewing states without public market observations (e.g., Khartoum, Gezira, Kassala, Sennar), the platform transparently displays:
   > *"No verified ZARATI market observations currently available for this state. This reflects platform data coverage, not agricultural productivity."*
3. **No Unverified Polygon Claims**: State-level data is navigated via structured selectors and accessible tables rather than speculative vector boundary interpolations. Agro-ecological zones (Gezira scheme and Gedaref vertisols) are clearly categorized as **Informational Agro-Ecological Context** referencing Ministry of Agriculture / FAO historical land surveys.

### B. Geographic Precision Policy
To uphold institutional credibility, coordinates are never fabricated. A strict tripartite hierarchy is enforced:
- **EXACT MARKET LOCATION**: Reserved for sub-meter or verified physical marketplace facility coordinates.
- **LOCALITY APPROXIMATION**: Applied to WFP VAM and MET Norway coordinates representing locality/municipal administrative centers:
  - **Gedaref Crops Market** (`MKT-GD-01`): 14.04° N, 35.38° E (WFP Market 2580 / MET Norway)
  - **El Obeid Crops Exchange** (`MKT-OB-01`): 13.19° N, 30.22° E (WFP Market 1029)
  - **Kosti Crops Market** (`MKT-KT-01`): 13.17° N, 32.67° E (WFP Market 1032)
  - **Khartoum Central Market** (`MKT-KH-01`): 15.51° N, 32.54° E (WFP Market 2588)
  - **Kassala Central Market** (`MKT-KS-01`): 15.46° N, 36.40° E (WFP Market 1031)
  - **Port Sudan Terminal Market** (`MKT-PS-01`): 19.62° N, 37.22° E (WFP Market 1034)
  - **Ad-Damazin Crops Market** (`MKT-DM-01`): 11.79° N, 34.36° E (WFP Market 1026)
  - **Wad Madani Wholesale Market** (`MKT-WM-01`): 14.40° N, 33.52° E (Locality approximation)
  - **Sennar Agricultural Market** (`MKT-SN-01`): 13.55° N, 33.56° E (Locality approximation)
- **NO VERIFIED LOCATION**: Markets in the reference database lacking verified coordinates:
  - **Nyala Crops Market** (`MKT-NY-01`): Explicitly suppressed from placing arbitrary markers on the map canvas; labeled *NO VERIFIED LOCATION* in the canonical registry.

---

## 3. Verified Layers & Explorer Features

### A. Layer 1: Verified Markets Layer
- **Markets Displayed with Active Public Intelligence**: 3
  1. `Gedaref Crops Market` (90 published observations, Sorghum & Millet, MET Norway weather active)
  2. `El Obeid Crops Exchange` (10 published observations, Millet)
  3. `Kosti Crops Market` (2 published observations, Wheat)
- **Interactive Pins**: Styled with pulse halos, observation badges, focus rings on selection, and tooltips on hover.
- **Reference Registry Access**: All 10 canonical reference markets are queryable through the market filter and accessible data table.

### B. Layer 2: Data Coverage Layer
- Categorizes all 18 Sudanese states into:
  - **VERIFIED MARKET DATA**: Gedaref (90 observations, active telemetry)
  - **LIMITED VERIFIED DATA**: North Kordofan (10 observations), White Nile (2 observations)
  - **NO VERIFIED ZARATI DATA**: 15 states (Khartoum, Gezira, Kassala, Red Sea, Sennar, Blue Nile, Northern, River Nile, South Kordofan, West Kordofan, North Darfur, South Darfur, West Darfur, East Darfur, Central Darfur)

### C. Layer 3: Weather Coverage Layer
- Focuses on the verified MET Norway contract location: **El Gedarif / Gedaref Crops Market** (14.04° N, 35.38° E).
- Telemetry: Real temperature (23.8°C), precipitation (1.1 mm), relative humidity (88.8%), wind speed (22.3 km/h).
- Attribution: Labeled `FORECAST`, Source `MET Norway`, License `CC BY 4.0`.
- **Side-by-side Context Rule**: When Gedaref is selected, market intelligence and weather telemetry appear together with the explicit notice:
  > *"Weather context presented alongside market observations. No causal relationship is inferred."*

---

## 4. Production Ground Truth Metrics
- **States in Canonical Registry**: 18
- **States with Verified Market Data**: 3 (Gedaref, North Kordofan, White Nile)
- **Markets in Canonical Registry**: 10
- **Markets with Active Public Intelligence**: 3
- **Markets Without Verified Coordinates**: 1 (`Nyala Crops Market`)
- **Published Market Observations**: 102
- **Tracked Commodities**: 3 (Sorghum: 54, Millet: 46, Wheat: 2)
- **Active Weather Stations**: 1 (`El Gedarif` via MET Norway)
- **Latest Observation Date**: 2024-01-15
- **Production Mock Data**: 0

---

## 5. Bilingual & Accessibility Implementation

### A. Arabic (RTL) & English (LTR)
- **Typography**: Cairo (`font-cairo`) for Arabic with appropriate vertical rhythm, Inter/Sans for English.
- **Bi-directional Isolation**: Western numerals and English commodity codes are wrapped with `<bdi>` or proper inline styles to prevent bidirectional punctuation flips.
- **Terminology**: Professional sovereign institutional Arabic (e.g., `الجغرافيا الزراعية لزاراتي`, `تقريب جغرافي للمحلية`, `المراقبات المنشورة`, `الأنماط والمشاهد الزراعية`).

### B. Universal Accessibility
- **Dual View Mode**: Seamless toggle between `[ 🗺️ Interactive Map ]` and `[ 📋 Accessible Data Table ]`.
- **Screen Reader Support**: Semantic table structure (`<table`, `<thead>`, `<tbody>`, `<th>`, `<td>`), ARIA labels on map elements (`role="button"`, `aria-label`).
- **Keyboard Navigation**: Full tab index traversal and Enter/Space event handlers for market selection.

---

## 6. Sourced Agricultural Landscapes (Editorial Storytelling)
Four authentic photographic editorial cards document Sudan's foundational agro-ecological belts below the interactive explorer:
1. **Riverine Irrigated Belt**: Blue Nile & Main Nile alluvial floodplains (*River Nile & Khartoum States* | Source: ZARATI Archive / FAO Land Cover).
2. **Mechanized Rainfed Vertisol Belt**: Gedaref cracking vertisol clay plains (*Gedaref State — Proposed Pilot Area* | Source: Gedaref Agricultural Research Station).
3. **Gravity-Fed Public Scheme**: Gezira Scheme irrigation canal networks (*Gezira & Sennar States* | Source: Sudan Gezira Board Archive).
4. **Savanna & Gum Arabic Belt**: North Kordofan sandy qoz dunes and Hashab acacia savanna (*North & West Kordofan* | Source: Agricultural Research Corporation Sudan).

---

## 7. Scope Boundaries & R10 Vision Freeze
- **R10 Status**: Remains firmly in **VISION**.
- **Institutional Governance Disclaimer**:
  > *"ZARATI V1 operates strictly on verified ground-truth market observations and meteorological forecasts. Automated parcel boundaries, satellite remote sensing, and vegetative index modeling (NDVI) remain part of the R10 Vision."*
- **No Database Modification**: Zero migrations created; schema remains frozen at `032_r4_c_explicit_metric.sql`.
- **No Modification of R1–R7 Architecture**: Marketplace, Intelligence, Institutional, and Operations routes remain completely untouched.

---

## 8. Quality Assurance Summary
- **ESLint**: Passed (0 errors in geography modules).
- **TypeScript**: Passed (`npx tsc --noEmit` clean).
- **Unit & Integration Tests**: 16 test files passed, 209 tests passed, 0 failures (`npm run test:run`).
- **Next.js Production Build**: Compiled successfully in Turbopack (`Route /[lang]/geography` dynamic server-rendered).
- **Production Deployment**: Verified on Vercel production environment.
