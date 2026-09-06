# ZARATI | زرعتي — R2.5 Master Strategy Dossier
**Positioning:** Sovereign Agricultural Intelligence Infrastructure  
**Origin & Flagship Market:** Republic of the Sudan  
**Future Horizon:** Selected African Markets, MENA & The Gulf  
**Classification:** Strategic Blueprint / Institutional Master Plan  
**Date Context:** September 2026  
**Document Ref:** `01. ZARATI_R2_5_MASTER_STRATEGY.md`

---

## 1. Executive Mandate & Strategic Purpose

Zarati is architected to solve the fundamental data void in emerging-market agriculture, starting in Sudan. Agriculture in Sudan sustains over 65% to 80% of the population, contributes 30% to 34.5% of pre-conflict GDP, and spans 175 million feddans of arable land, yet operates with near-total digital opacity, fragmented physical spot auctions, severe supply chain disruption, and paper-based administrative records.

Zarati's mandate is not to build another consumer e-commerce app or an asset-heavy trucking brokerage. Zarati is built as a **Sovereign Agricultural Intelligence Operating System (Agri-OS)**. It provides:
1. **At the National Level:** A National Agriculture Command Center enabling the Federal Ministry of Agriculture and Forestry (MOAF), state governments, and multilateral institutions (FAO, WFP, World Bank) to see crop cultivation, vegetative health, market price flows, and food security deficits in near real-time.
2. **At the Market Level:** A verifiable, multi-source price discovery and trade intelligence engine connecting primary agricultural exchanges (Gedaref, El Obeid, Sennar, Kassala) to national and international export corridors.
3. **At the Producer Level:** A low-bandwidth, Arabic-first decision-support interface delivering actionable daily agronomy, hyper-local weather risk alerts, and transparent market pricing to smallholder farmers and commercial scheme tenants.

---

## 2. Core Philosophy: "Sudan-First, Sovereign-Grade"

### 2.1 Flagship Anchor
Sudan is not merely an initial test market; it is the **flagship sovereign proving ground**. The challenges of Sudan—unstable electrical grids, hyper-inflation, currency devaluation, paper administrative destruction, telecom intermittency, and displacement—represent the most stringent operating environment in emerging markets. If an agricultural intelligence infrastructure proves resilient, auditable, and indispensable in Sudan, it establishes an unassailable technical and operational moat for deployment across the Sahel, East Africa, and MENA.

### 2.2 Reusable Core vs. Country Packs
To prevent fragmented codebases while honoring national specificities, Zarati is strictly partitioned into:
* **Zarati Core:** Tenant-isolated, event-driven data engine handling geospatial polygon indexing, remote sensing ingestion (Sentinel/Landsat), multi-source price normalization, currency abstraction, cryptographic audit ledgers, role-based access control (RBAC), and offline-first client synchronization.
* **Country Packs:** Declarative, schema-driven configuration modules defining national administrative boundaries (States/Localities), localized crop taxonomies, customary units (Ardeb, Qintar, Feddan), national telecom SMS/USSD gateways, domestic payment protocols (e.g., Bank of Khartoum Bankak), sovereign cloud requirements, and bilingual RTL/LTR dictionaries.

---

## 3. The 5 Strategic Pillars of Zarati

```
+---------------------------------------------------------------------------------------------------+
| ZARATI STRATEGIC PILLARS                                                                          |
+-------------------+-------------------+-------------------+-------------------+-------------------+
| Pillar 1:         | Pillar 2:         | Pillar 3:         | Pillar 4:         | Pillar 5:         |
| Sovereign Data    | Multi-Tiered      | Asset-Light       | Low-Bandwidth     | Hybrid Public-    |
| Command Center    | Price Discovery   | Intelligence      | Vernacular UX     | Private Business  |
+-------------------+-------------------+-------------------+-------------------+-------------------+
| National & state  | Physical spot     | Software and data | Arabic-first RTL, | Institutional     |
| command dashboards| feeds + regional  | coordination only;| audio guidance,   | B2G licensing +   |
| for government &  | benchmarks (KSA,  | zero inventory,   | PWA offline cache,| B2B trader take-  |
| multilaterals with| UAE, Egypt) +     | zero company-     | USSD and SMS      | rate; core farmer |
| remote sensing.   | FX normalization. | owned trucks.     | fallbacks.        | tools free.       |
+-------------------+-------------------+-------------------+-------------------+-------------------+
```

---

## 4. Grounded Baseline Reality: What Zarati Is & What It Is Not

### 4.1 What Zarati Is Today
* **A Production-Verified Web Platform:** Built on Next.js 16.2 Turbopack, Tailwind CSS, TypeScript, and Supabase PostgreSQL.
* **A Hardened RBAC & Security Foundation (R1 & R2 Closed):** Featuring multi-role architecture (`farmer`, `trader`, `admin`), Row-Level Security (RLS) denying cross-tenant leaks, rate-limiting backed by Upstash Redis, server-side account suspension enforcement, email verification enforcement, and isolated public views (`public_traders`) preventing PII exposure.
* **A Dual-Language Arabic/English Interface:** Fully supporting native Sudanese terminology and RTL layouts.

### 4.2 What Zarati Is Not (And Must Never Become)
* **Not an Asset-Heavy Logistics Company:** Zarati will never buy trucks, lease regional grain warehouses, or manage physical fuel distribution (the structural trap that bankrupted Twiga Foods and iProcure).
* **Not a Commodity Speculator:** Zarati never takes balance-sheet title to grain, avoiding commodity price fluctuation risks.
* **Not an Unregulated Balance-Sheet Lender:** Zarati will not issue uncollateralized micro-loans off its own balance sheet. It provides verifiable agronomic data to enable commercial banks and donor funds to extend credit safely.
* **Not an Isolated "Vanity Analytics" Tool:** Zarati connects top-down satellite indices directly to ground-truth farmer registries and actual physical market auctions.

---

## 5. Horizon Mapping & Roadmap Alignment

| Phase | Designation | Strategic Objective | Operational Status |
|---|---|---|---|
| **R1** | Production Data Foundation | PostgreSQL schema, geographic entities, reference data, RLS | **CLOSED & VERIFIED** |
| **R2** | Production Auth & Security | Multi-role identity, rate limiting, suspension guardrails, session management | **CLOSED & VERIFIED** |
| **R2.5** | Master Strategy & Real Data Architecture | Institutional business plan, sovereign architecture, price intelligence, GUI transformation | **CURRENT PHASE** |
| **R3** | B2B Marketplace Architecture | Verified crop listings, RFQs, escrow workflow design, trader matching | **NEXT (PLANNED)** |
| **R4** | Market, Price & Weather Intelligence | Ingestion of WFP/FEWS NET/Spot exchange prices, FX engine, Open-Meteo feeds | **PLANNED** |
| **R5** | Sovereign Administration | Enterprise admin portals, moderation queues, data export controls | **PLANNED** |
| **R6** | State Pilot Readiness | Gedaref State deployment, farmer cooperative onboarding, field audit | **PLANNED** |
| **R7** | Government & NGO Analytics | Command Center dashboards, donor project tracking, food balance telemetry | **PLANNED** |
| **R8** | Applied Agronomic AI | Offline disease diagnosis, crop calendar forecasting, anomaly detection | **PLANNED** |
| **R9** | SMS & USSD Offline Gateways | Integration with Zain, Sudani, MTN for non-smartphone smallholders | **PLANNED** |
| **R10** | Satellite & GIS Precision | Automated STAC pipeline for Sentinel-2 NDVI, moisture stress, acreage estimation | **PLANNED** |

---

## 6. Strategic Validation Classifications

* `[VERIFIED FACT]`: Production code, active migrations (001–020), and audited security controls currently running in production.
* `[RECOMMENDATION]`: Core architectural and commercial guidance formulated in R2.5 to govern R3 through R10 execution.
* `[ASSUMPTION]`: Macroeconomic projections regarding post-conflict recovery pace, donor grant releases, and institutional procurement cycles.
