# ZARATI | زرعتي — Website Information Architecture & Content Strategy
**Routing Standard:** Next.js App Router Bilingual Pattern (`/[lang]/...`)  
**Locales:** `ar` (Primary / RTL) & `en` (Secondary / LTR)  
**Classification:** Information Architecture, Sitemap & Content Blueprint  
**Date Context:** September 2026  
**Document Ref:** `19. ZARATI_WEBSITE_INFORMATION_ARCHITECTURE.md`

---

## 1. Master Site Map & Route Hierarchy

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         ZARATI MASTER SITEMAP (/en & /ar)                    │
├───────────────────┬──────────────────────────────────────────────────────────┤
│ PRIMARY ROUTES    │ • /[lang] (Sovereign Living Nile Hero & Overview)        │
│                   │ • /[lang]/platform (Core Engine & Architecture)          │
│                   │ • /[lang]/intelligence (National Command Center)         │
│                   │ • /[lang]/marketplace (Spot Commodity Listings)         │
│                   │ • /[lang]/crops (National Crop Catalog & Seasonal Cycles)│
│                   │ • /[lang]/weather (Agrometeorological Risk Telemetry)    │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ SOLUTIONS PORTFOLIO│ • /[lang]/solutions/farmers (Smallholders & Tenants)    │
│                   │ • /[lang]/solutions/traders (Commercial Exporters & Mills│
│                   │ • /[lang]/solutions/government (Ministries & Governors) │
│                   │ • /[lang]/solutions/development (FAO, WFP, World Bank)   │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ ENTERPRISE & GOV  │ • /[lang]/technology (STAC GIS, Edge DB, APIs)           │
│                   │ • /[lang]/security (Data Sovereignty & Residency)        │
│                   │ • /[lang]/impact (Food Balance, Livelihood Metrics)      │
│                   │ • /[lang]/countries (Sudan Flagship + Expansion Matrix)  │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ BUSINESS PLAN HUB │ • /[lang]/business-plan (Master Portal)                  │
│                   │   ├── /executive-summary                                 │
│                   │   ├── /problem & /solution                               │
│                   │   ├── /market & /competition                             │
│                   │   ├── /business-model & /financial-model                 │
│                   │   ├── /government & /development                         │
│                   │   ├── /technology & /security                            │
│                   │   └── /roadmap & /risks                                  │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ INVESTOR PORTAL   │ • /[lang]/investors (Data Moats, Audited Track Record)   │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ AUTH & SESSIONS   │ • /[lang]/login (Protected Multi-Role Authentication)    │
│                   │ • /[lang]/register (Farmer & Trader Registration)        │
│                   │ • /[lang]/reset-password (Secure Password Recovery)      │
│                   │ • /[lang]/dashboard/farmer & /dashboard/trader           │
└───────────────────┴──────────────────────────────────────────────────────────┘
```

---

## 2. Granular Route Specifications

### 2.1 Route: `/[lang]/intelligence` (The Command Center)
* **Audience:** Federal Ministers, State Directors, UN Economists, International Agribusiness Executives.
* **Purpose:** Deliver macro, near-real-time visibility into Sudan's agricultural balance, crop health, price movements, and food deficits.
* **Key Components:**
  - Interactive PostGIS Choropleth Map with layer toggles (NDVI, Rainfall, Insecurity).
  - 5-Tier Drill-Down Drawer (Sudan $\rightarrow$ State $\rightarrow$ Locality $\rightarrow$ Market $\rightarrow$ Parcel).
  - Real-time commodity ticker dock showing dual SDG/USD closing quotes.
* **Trust Signals:** `[VERIFIED INSTITUTIONAL FEED]`, `[GOVERNMENT STATUTORY DATA RESIDENCY COMPLIANT]`.

### 2.2 Route: `/[lang]/solutions/government` (Sovereign B2G)
* **Audience:** Federal Ministry of Agriculture and Forestry (MOAF), State Ministries of Production, Central Bureau of Statistics.
* **Core Narrative:** "Transforming Sudanese Agriculture into a Verifiable Sovereign Asset."
* **Sections:**
  1. *The Challenge:* Loss of physical scheme records, market tax leakage, agricultural planning blind spots.
  2. *The Sovereign Solution:* Digital Farmer Registry, automated yield forecasting, transparent market gate clearing.
  3. *Data Sovereignty Guarantee:* Full state ownership of data, zero-knowledge encryption, air-gapped hosting options.
* **Call to Action (CTA):** "Request Official Ministry Briefing & Pilot Blueprint."

### 2.3 Route: `/[lang]/solutions/development` (B2D / Multilaterals)
* **Audience:** UN FAO, WFP, World Bank, African Development Bank (AfDB), IFAD, International NGOs.
* **Core Narrative:** "Auditable Agricultural Telemetry & Ground-Truth Beneficiary Tracking."
* **Sections:**
  1. *Emergency Response Tracking:* Real-time monitoring of certified seed and tool distributions.
  2. *Voucher Redemption Ledger:* Cryptographic proof that smallholders received humanitarian inputs without diversion.
  3. *Food Security Heatmaps:* Real-time synchronization with IPC Phase classifications and FEWS NET data.
* **Call to Action (CTA):** "Download Donor Program Telemetry Whitepaper."

### 2.4 Route: `/[lang]/business-plan` (Institutional Knowledge Base)
* **Audience:** Strategic Investors, Sovereign Wealth Funds, Institutional Partners.
* **Purpose:** Provide a completely transparent, downloadable, interactive business plan covering all 15 operational dimensions.
* **Design Pattern:** Left-hand persistent navigation tree with reading progress indicator; one-click PDF compilation download.

---

## 3. Localization & Directionality Rules (Arabic vs. English)

1. **Strict Directionality Isolation:**
   - Arabic layout (`lang="ar"`): `dir="rtl"`, text aligned right, icon vectors mirrored where directionally significant (e.g., arrow chevrons).
   - English layout (`lang="en"`): `dir="ltr"`, text aligned left.
2. **Numbers & Mixed Phrases:**
   - Phone numbers, currency codes (`SDG`, `USD`), and percentages wrapped in `<span dir="ltr">` to guarantee zero visual character inversion.
3. **No Machine Translation:** Every Arabic label is handcrafted by native Sudanese agronomists and localization professionals, preserving local cultural accuracy.
