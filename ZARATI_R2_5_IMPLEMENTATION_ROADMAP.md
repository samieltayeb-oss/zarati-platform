# ZARATI | زرعتي — R2.5 Implementation Roadmap & Staged Engineering Plan
**Scope:** Chronological Sequencing (Phases R1 through R10)  
**Classification:** Engineering Roadmap & Milestones  
**Date Context:** September 2026  
**Document Ref:** `20. ZARATI_R2_5_IMPLEMENTATION_ROADMAP.md`

---

## 1. Master Phase Matrix (R1 through R10)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        ZARATI 36-MONTH STRATEGIC ROADMAP (R1 – R10)                    │
├───────┬──────────────────────────────────┬────────────────────┬────────────────────────┤
│ Phase │ Title                            │ Target Horizon     │ Execution Status       │
├───────┼──────────────────────────────────┼────────────────────┼────────────────────────┤
│ R1    │ Production Data Foundation       │ Q1 2026            │ ✅ CLOSED & VERIFIED   │
│ R2    │ Production Authentication & RBAC │ Q2 2026            │ ✅ CLOSED & VERIFIED   │
│ R2.5  │ Master Strategy & Real Data Arch │ Q3 2026 (Current)  │ 🚀 ARCHITECTURE FREEZE │
│ R3    │ B2B Marketplace & RFQ Engine     │ Q4 2026 – Q1 2027  │ 🔒 PENDING APPROVAL    │
│ R4    │ Market, Price & Weather Intel    │ Q1 2027 – Q2 2027  │ 🔒 REDEFINED IN R2.5   │
│ R5    │ Sovereign Administration & Audit │ Q2 2027            │ 🔒 PLANNED             │
│ R6    │ Gedaref State Pilot Readiness    │ Q3 2027            │ 🔒 FLAGSHIP DEPLOYMENT │
│ R7    │ Government & NGO Analytics       │ Q4 2027            │ 🔒 B2G EXPANSION       │
│ R8    │ Applied Agronomic AI             │ Q1 2028            │ 🔒 R&D STAGE           │
│ R9    │ Telecom USSD & SMS Gateways      │ Q2 2028            │ 🔒 OFFLINE HARDENING   │
│ R10   │ Autonomous Satellite / GIS Engine│ Q3 2028            │ 🔒 REMOTE SENSING SCALE│
└───────┴──────────────────────────────────┴────────────────────┴────────────────────────┘
```

---

## 2. Redefinition of Phase R4: Market, Price & Weather Intelligence

In previous preliminary roadmaps, Phase R4 was narrowly labeled "Prices + Weather." In R2.5, this phase is formally elevated and expanded into:
**R4: SOVEREIGN MARKET, PRICE & WEATHER INTELLIGENCE ENGINE**

Phase R4 is structured into 5 sequential sub-releases:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    PHASE R4 STAGED SUB-RELEASE BLUEPRINT                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ R4-A: INSTITUTIONAL REAL-DATA INGESTION                                      │
│ • Automated ingestion of WFP HDX monthly market feeds (CSV/CKAN API).       │
│ • Ingestion of FEWS NET Data Warehouse (FDW) REST grain time series.        │
│ • Integration of Open-Meteo & ECMWF historical and 7-day weather APIs.       │
├──────────────────────────────────────────────────────────────────────────────┤
│ R4-B: SUDAN VERIFIED MARKET REPORTER NETWORK                                 │
│ • Field reporter mobile interface for daily physical auction reporting.     │
│ • Onboarding of certified market officers in Gedaref and El Obeid.           │
│ • Multi-stage outlier detection (Z-score filter flagging deviations >30%).   │
├──────────────────────────────────────────────────────────────────────────────┤
│ R4-C: REGIONAL & INTERNATIONAL BENCHMARKS                                    │
│ • Automated tracking of KSA (Jeddah/Jizan wholesale livestock/fodder).      │
│ • Tracking of UAE (Dubai DMCC) and Egypt (Borsa El Selaa) commodity feeds.   │
│ • Global reference tracking (CBOT Wheat/Sorghum, World Bank Pink Sheet).     │
├──────────────────────────────────────────────────────────────────────────────┤
│ R4-D: AUDITABLE TRADE & LOGISTICS INTELLIGENCE                               │
│ • Correlated corridor gross spread calculator (Gedaref -> Port Sudan -> KSA).│
│ • Diesel transport indexing and border clearance tariff modeling.            │
│ • Cryptographic audit logging of all historical FX and price transactions.   │
├──────────────────────────────────────────────────────────────────────────────┤
│ R4-E: PREDICTIVE PRICE & CLIMATE VOLATILITY MODELING                         │
│ • Seasonal price arrival wave forecasting based on historical monsoon onset. │
│ • Food security early-warning triggers for locality cereal deficits.         │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed 12-Month Engineering Sprint Sequence

### Quarters 1 & 2 (Months 1–6): Core Marketplace & Real Price Ingestion
* **Sprint 1–3 (R3 Marketplace MVP):** 
  - Verified farmer listing creation with photo uploads and lot size specifications.
  - Trader RFQ (Request for Quotation) bidding flow with in-app counter-offers.
  - Strict escrow status machine (Listing -> Offer -> Accepted -> Bankak Escrow -> Released).
* **Sprint 4–6 (R4-A & R4-B Ingestion Engine):**
  - Edge cron workers fetching WFP and FEWS NET endpoints every 24 hours.
  - Conversion pipeline translating Ardebs, Qintars, and Sacks to Metric Tonnes.
  - Dual-currency display ticker on home page with dynamic parallel/official rate badges.

### Quarters 3 & 4 (Months 7–12): Gedaref Flagship Pilot & Command Center
* **Sprint 7–9 (R5 & R6 Pilot Readiness):**
  - Onboarding 5,000 farmers and 150 traders across Gedaref Localities (El Fashaga, Galaa El Nahal, Central Gedaref).
  - Localization testing with low-end Android smartphones (Tecno, Infinix) under 2G/3G conditions.
  - Emergency offline caching using Service Workers and IndexedDB.
* **Sprint 10–12 (R7 Command Center Prototype):**
  - Launch of `/intelligence` portal for Ministry of Agriculture officials and donor partners.
  - Dynamic PostGIS geospatial visualization of cultivated feddan blocks and price heatmaps.

---

## 4. Phase Exit Gates & Verification Criteria

To ensure architectural integrity, no phase may close without passing its objective verification gate:

| Phase Gate | Mandatory Exit Criteria | Verification Tooling |
|---|---|---|
| **R3 Exit Gate** | Zero inventory holding risk; complete transaction state machine test; trader identity verification enforced before bidding. | Vitest E2E Suite, Supabase Transaction Tests |
| **R4 Exit Gate** | 100% automated ingestion of external feeds; zero raw table overwrites; USD shadow price immutable historical storage. | Ingestion Regression Suite, FX Historical Audit Script |
| **R5 Exit Gate** | Role-based administrative isolation; zero service-role keys exposed to client; full audit log of state tax changes. | Security Penetration Audit, Playwright Admin Tests |
| **R6 Exit Gate** | Field validation in Gedaref; 5,000 real farmers onboarded; verified positive price realization impact reported. | Field Audit Report, Farmer Cooperative Interviews |
| **R7 Exit Gate** | Federal & State ministry sign-off; sub-second GeoJSON polygon aggregation; zero PII leakage to public dashboards. | GovTech Compliance Review, Load Testing ($10k\text{ users}$) |
