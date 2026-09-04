# Zarati Archive Directory | أرشيف زرعتي

This directory preserves obsolete, superseded, or intermediate assets for historical reference. Nothing in this directory is required for runtime operation of the Zarati application.

---

## Archived Assets

### 1. `product-vision-deck-v1.html`
- **Original Location:** `product-vision-deck.html` (root)
- **Superseded By:** `product-vision-deck-v2.html` (root)
- **Reason for Archival:** Version 1 of the 20-slide vision deck created in early June 2026. Following the extensive critique documented in `DECK_REVIEW.md`, Version 2 was developed with 24 slides, incorporating the Founder slide, refined unit economics, governance reality (SAF vs RSF), and the Gedaref/Kassala rollout plan. Relative image paths were updated to `../brand/` so this deck remains fully viewable for historical comparison.

### 2. `maps/sudan-path.txt`
- **Original Location:** `public/maps/sudan-path.txt`
- **Superseded By:** `components/maps/SudanMap.tsx`
- **Reason for Archival:** Raw coordinate dump (828 SVG vertices) extracted from geoBoundaries SDN ADM0 post-2011 boundaries during map development. Retained for geospatial reference and SVG projection audits.

### 3. `maps/sudan-outline.svg`
- **Original Location:** `public/maps/sudan-outline.svg` (copied to archive; original retained in `public/maps/` for backward compatibility)
- **Superseded By:** `components/maps/SudanMap.tsx`
- **Reason for Archival:** Standalone static SVG outline created prior to the interactive React component `components/maps/SudanMap.tsx`.
