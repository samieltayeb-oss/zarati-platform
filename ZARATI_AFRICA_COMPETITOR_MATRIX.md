# ZARATI | زرعتي — Pan-African Competitor Matrix & Capability Benchmark
**Scope:** 15 Major African AgriTech Platforms & National Systems  
**Classification:** Regional Competitive Intelligence  
**Date Context:** September 2026  
**Document Ref:** `03. ZARATI_AFRICA_COMPETITOR_MATRIX.md`

---

## 1. Comprehensive Pan-African Capabilities Matrix

The following benchmark evaluates leading private, government-backed, and development-sponsored agricultural platforms across Sub-Saharan Africa.

*Status Definitions:*
- **LIVE:** Fully active and commercially deployed in production.
- **BUILT:** Technologically developed and verified, currently in limited rollout.
- **PARTIAL:** Basic or fragmented implementation.
- **PLANNED:** Publicly announced roadmap or under active development.
- **NOT OFFERED:** Explicitly outside platform operational scope.

| Feature / Capability | **ZARATI (Sudan)** | **Farmerline (Ghana)** | **Twiga Foods (Kenya)** | **Apollo Ag (Kenya/Zambia)** | **AFEX (Nigeria/Kenya)** | **Lersha (Ethiopia)** | **DigiFarm (Kenya)** | **Pula (Pan-Africa)** |
|---|---|---|---|---|---|---|---|---|
| **Farmer Registry** | **BUILT** | LIVE | LIVE | LIVE | LIVE | LIVE | LIVE | LIVE |
| **Farm Polygon Registry (GIS)**| **BUILT** | PARTIAL | NOT OFFERED | LIVE | PARTIAL | NOT OFFERED | NOT OFFERED | PARTIAL |
| **Market Prices (Dual SDG/USD)**| **BUILT** | PARTIAL | LIVE (Internal) | NOT OFFERED | LIVE | PARTIAL | LIVE | NOT OFFERED |
| **B2B Spot Marketplace** | **PLANNED (R3)** | PARTIAL | LIVE (Restruct) | NOT OFFERED | LIVE (ComX) | PARTIAL | PARTIAL | NOT OFFERED |
| **Hyper-Local Weather** | **BUILT (R4)** | LIVE | NOT OFFERED | LIVE | NOT OFFERED | LIVE | LIVE | LIVE |
| **Agronomic Advisory / Extension**| **PLANNED (R8)** | LIVE (IVR/Voice)| NOT OFFERED | LIVE (SMS) | PARTIAL | LIVE (Agents) | LIVE (SMS) | NOT OFFERED |
| **Satellite Crop Health (NDVI)**| **PLANNED (R10)**| NOT OFFERED | NOT OFFERED | LIVE | NOT OFFERED | NOT OFFERED | NOT OFFERED | LIVE (Area Yield)|
| **Yield Forecasting Engine** | **PLANNED (R10)**| NOT OFFERED | NOT OFFERED | LIVE | NOT OFFERED | NOT OFFERED | NOT OFFERED | LIVE |
| **Subsidies / e-Vouchers** | **PLANNED (R7)** | PARTIAL | NOT OFFERED | NOT OFFERED | PARTIAL | NOT OFFERED | LIVE | NOT OFFERED |
| **Direct Credit Underwriting** | **NOT OFFERED\***| NOT OFFERED | NOT OFFERED | LIVE (Balance) | LIVE (Trade) | NOT OFFERED | LIVE (M-Pesa) | NOT OFFERED |
| **Embedded Climate Insurance** | **PLANNED** | NOT OFFERED | NOT OFFERED | LIVE | NOT OFFERED | NOT OFFERED | LIVE | LIVE (Underwriter)|
| **Government Command Dashboard**| **BUILT (R7)** | NOT OFFERED | NOT OFFERED | NOT OFFERED | NOT OFFERED | NOT OFFERED | PARTIAL | PARTIAL |
| **NGO / Donor Monitoring** | **BUILT (R7)** | LIVE (Mergdata)| NOT OFFERED | NOT OFFERED | NOT OFFERED | NOT OFFERED | NOT OFFERED | LIVE |
| **Food Security Early Warning** | **BUILT (R7)** | NOT OFFERED | NOT OFFERED | NOT OFFERED | NOT OFFERED | NOT OFFERED | NOT OFFERED | NOT OFFERED |
| **Logistics / Fleet Ownership** | **NOT OFFERED\***| NOT OFFERED | LIVE (High Burn)| NOT OFFERED | LIVE (Warehouses)| NOT OFFERED | NOT OFFERED | NOT OFFERED |
| **Electronic Warehouse Receipts**| **PLANNED** | NOT OFFERED | NOT OFFERED | NOT OFFERED | LIVE (Chartered)| NOT OFFERED | NOT OFFERED | NOT OFFERED |
| **USSD / SMS Offline Gateways** | **PLANNED (R9)** | LIVE | NOT OFFERED | LIVE | NOT OFFERED | NOT OFFERED | LIVE (*944#) | LIVE |
| **Offline-First PWA / Cache** | **BUILT** | LIVE | NOT OFFERED | LIVE | NOT OFFERED | NOT OFFERED | NOT OFFERED | NOT OFFERED |
| **Arabic-First RTL Interface** | **LIVE** | NOT OFFERED | NOT OFFERED | NOT OFFERED | NOT OFFERED | NOT OFFERED | NOT OFFERED | NOT OFFERED |
| **Sovereign In-Country Hosting**| **LIVE** | PARTIAL | NOT OFFERED | NOT OFFERED | NOT OFFERED | PARTIAL | NOT OFFERED | NOT OFFERED |

*\*Strategic Guardrail: Zarati deliberately marks Logistics Ownership and Direct Balance-Sheet Credit as NOT OFFERED to preserve an asset-light, high-margin SaaS profile.*

---

## 2. In-Depth Competitor Profiles & Tactical Learnings

### 2.1 Farmerline (Ghana / West Africa)
* **Model:** Enterprise B2B SaaS platform (Mergdata) sold to cocoa/grain aggregators and multilateral agencies (USAID, World Bank), combined with localized input delivery.
* **Capital Raised:** $\approx\$14.4\text{M}$ (Debt + Equity).
* **Zarati Tactical Advantage:** Farmerline proved that charging NGOs and food conglomerates for ESG supply-chain mapping is a viable, high-margin revenue model. However, Farmerline lacks a national-level macro command center for ministries of agriculture and has zero presence in Arab-speaking markets.

### 2.2 Twiga Foods (Kenya)
* **Model:** High-volume B2B farm-to-retail produce supply chain in Nairobi.
* **Capital Raised:** $\approx\$160\text{M}$ (SoftBank, IFC, Creadev).
* **Critical Flaw:** Over-capitalized asset-heavy logistics. Twiga bought diesel trucks, leased multi-million-dollar fulfillment depots, and suffered negative gross margins on low-value fresh commodities. When global venture liquidity contracted in 2023, Twiga underwent severe restructuring and legal disputes.
* **Zarati Tactical Guardrail:** Zarati never takes physical ownership of crops and never buys delivery fleets.

### 2.3 Apollo Agriculture (Kenya & Zambia)
* **Model:** Bundled seasonal input credit, satellite agronomic advisory, and crop insurance sold to smallholders via rural commission agents.
* **Capital Raised:** $\approx\$52\text{M}$ (SoftBank Vision Fund 2, Anthemis).
* **Strengths:** Excellent high-resolution satellite imagery used to assess historical field productivity for credit scoring.
* **Vulnerability:** Balance-sheet loan default risk during macro climatic shocks (e.g., severe El Niño droughts).
* **Zarati Tactical Advantage:** Zarati partners with regulated commercial banks (e.g., Faisal Islamic Bank) and Islamic financing institutions (Salam contracts), acting as the data and verification layer rather than the principal lender.

### 2.4 AFEX (Nigeria, Kenya, Uganda)
* **Model:** Private commodity exchange operating over 150 physical aggregation warehouses, issuing SEC-regulated Electronic Warehouse Receipts (e-WRs) traded on its digital ComX exchange.
* **Capital Raised:** $\approx\$100\text{M}+$ (BII, Consonance).
* **Strengths:** Creates real physical liquidity and collateralized grain trade for commercial mills.
* **Limitations:** Tremendous physical capex required to construct, secure, and insure physical concrete warehouses.
* **Zarati Tactical Advantage:** In Sudan, Zarati leverages existing historical market exchange infrastructure (the physical auctions of Gedaref and El Obeid) by acting as the digital clearing and trade discovery software layer, avoiding warehouse construction capex.

### 2.5 Lersha (Ethiopia)
* **Model:** Agent-assisted digital ag-services platform tailored to smallholders in Amhara and Oromia.
* **Relevance to Zarati:** Ethiopia's land tenure system (state-owned land, smallholder usufruct certificates) is highly analogous to Sudan's scheme tenant allocations. Lersha's agent network model demonstrates that hybrid digital/human models succeed where pure consumer self-serve fails.

---

## 3. The Zarati Strategic Moat in Africa

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    ZARATI'S UNASSAILABLE PAN-AFRICAN MOAT                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ 1. ARABIC-FIRST SOVEREIGN ARCHITECTURE                                       │
│    Zero major African agritech platforms possess native Arabic RTL language  │
│    interfaces, Islamic agricultural finance models (Salam / Murabaha), or    │
│    customary measurement conversions (Ardeb, Qintar, Feddan).                │
├──────────────────────────────────────────────────────────────────────────────┤
│ 2. RESILIENCE UNDER MACRO CURRENCY COLLAPSE                                  │
│    While competitors price services in depreciating local currencies, Zarati │
│    incorporates a real-time USD shadow normalization engine designed for     │
│    economies with 100%+ inflation.                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ 3. GOVERNMENT COMMAND CENTER COUPLING                                        │
│    Competitors build apps for farmers or traders. Zarati builds a national   │
│    decision-support operating system for ministries, enabling sovereign data │
│    ownership that protects national security.                                │
└──────────────────────────────────────────────────────────────────────────────┘
```
