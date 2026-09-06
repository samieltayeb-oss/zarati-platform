# ZARATI | زرعتي — Real Data Source Strategy & Transition Blueprint
**Objective:** Systematic Replacement of Mock Agricultural Data with Trustworthy Real Feeds  
**Classification:** Enterprise Data Engineering & Provenance Protocol  
**Date Context:** September 2026  
**Document Ref:** `21. ZARATI_REAL_DATA_SOURCE_STRATEGY.md`

---

## 1. Executive Mandate: The Real-Data Transition

Zarati currently uses mock data in several public experiences to illustrate platform capabilities while the database and security foundations were being hardened (Phases R1 and R2).

In Phase R2.5, Zarati freezes mock data and establishes the definitive **Real-Data Ingestion Architecture**. This strategy establishes:
1. An exhaustive inventory of verified data feeds across Sudan, regional trade corridors, and global benchmark exchanges.
2. A strict provenance protocol ensuring every displayed data point is cited, verifiable, and confidence-scored.
3. An explicit architectural ban against blending real and synthetic data without explicit user notification badges (`[VERIFIED SOURCE]` vs `[DEMO / ILLUSTRATIVE]`).

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                    ZARATI REAL-DATA ARCHITECTURAL SPECTRUM                        │
│                                                                                   │
│  TIER 1: SUDAN LOCAL DATA           TIER 2: REGIONAL BENCHMARKS   TIER 3: GLOBAL  │
│  (Ground Truth Realities)          (Trade Corridor Spreads)      (Reference Feeds)│
│                                                                                   │
│  • Gedaref Spot Auction Sheets     • KSA Wholesale Livestock     • World Bank     │
│  • El Obeid Crop Bulletins         • UAE (DMCC / Silal Radar)      Pink Sheet     │
│  • WFP Sudan HDX Price Series      • Egypt (Borsa El Selaa)      • CBOT Grains    │
│  • FEWS NET Data Warehouse         • Red Sea Shipping Manifests  • UN Comtrade    │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Ingestion Evaluation Framework (16 Standard Parameters)

Every candidate data source evaluated for Zarati production ingestion must satisfy the 16-parameter audit scorecard:

1. **Source Owner:** Legal entity publishing the dataset.
2. **Dataset Name:** Canonical title and reference.
3. **Target URL / Endpoint:** Direct API URI or data download repository.
4. **API Availability:** REST, GraphQL, CKAN, FTP, or Webhook availability.
5. **Authentication Method:** Bearer token, API key, OAuth2, or open access.
6. **Commercial Licensing Rights:** Creative Commons (CC-BY, CC-BY-IGO), Open Data Commons, or proprietary commercial contract.
7. **Update Frequency:** Real-time, daily, weekly, monthly, or seasonal.
8. **Historical Depth:** Years of verified backward time series available.
9. **Geographic Granularity:** National, state, locality, or physical market auction floor.
10. **Commodity Coverage:** Exact agricultural products tracked.
11. **Customary Units:** Native reporting unit (Ardeb, Qintar, MT, Kg).
12. **Native Currency:** Currency of observation (SDG, SAR, USD, EGP).
13. **Empirical Reliability Score:** Uptime, completeness, latency consistency.
14. **Data Acquisition Cost:** Free open data, freemium API, or institutional subscription.
15. **Production Suitability:** Tier classification (A: Direct automated ingestion to E: Modeling only).
16. **Fallback Strategy:** Automated secondary pipeline if primary source fails.

---

## 3. Core External Data Ingestion Pipelines

### 3.1 Pipeline A: UN WFP Humanitarian Data Exchange (HDX)
* **Endpoint:** `https://data.humdata.org/api/3/action/package_show?id=wfp-food-prices-for-sudan`
* **Direct Download:** `https://data.humdata.org/dataset/369e003b-f0af-4e48-99d7-34fc85b44635/resource/8fea18b2-615f-4af5-9bd5-85cc31a25ffd/download/wfp_food_prices_sdn.csv`
* **Coverage:** Sorghum (Feterita), Millet, Wheat, Groundnuts, Sesame across 40+ Sudanese markets.
* **Update Frequency:** Monthly (3–4 weeks lag).
* **Licensing:** CC BY-IGO (Open Public Commercial Permitted with Attribution).
* **Role in Zarati:** Baseline monthly historical anchor and national trend validator.

### 3.2 Pipeline B: FEWS NET Data Warehouse (FDW)
* **Endpoint:** `https://fdw.fews.net/api/marketpricefacts/?country=Sudan`
* **Format:** REST JSON with token authentication.
* **Coverage:** Grain prices, livestock terms-of-trade (Goat-to-Sorghum ratio), wage labor rates.
* **Role in Zarati:** Food security vulnerability metrics and terms-of-trade tracking.

### 3.3 Pipeline C: Physical Auction Floor Scrapers & NLP Ingestion
* **Targets:** Gedaref State Agricultural Market Authority daily bulletin & SUNA News Agency.
* **Format:** Unstructured Arabic daily auction sheets broadcast via local radio and Telegram channels.
* **Mechanism:** Python NLP extraction pipeline parsing daily Arabic text releases:
  $$\text{Closing Lot Price} \rightarrow \text{Volume (Ardebs)} \rightarrow \text{Quality Grade (1, 2, Commercial)} \rightarrow \text{Buyer Syndicate}$$
* **Role in Zarati:** Daily spot market clearing prices for active traders.

### 3.4 Pipeline D: Weather & Agrometeorology (Open-Meteo & ECMWF)
* **Endpoint:** `https://api.open-meteo.com/v1/forecast` & `https://archive-api.open-meteo.com/v1/archive`
* **Parameters:** Hourly 2m temperature, precipitation sum, soil moisture ($0-7\text{ cm}$ and $7-28\text{ cm}$), vapor pressure deficit (VPD).
* **Licensing:** Open-Meteo Non-Commercial / Attribution Commercial License.
* **Role in Zarati:** Real-time 7-day weather forecast and planting window recommendations for farmers.

---

## 4. Staged Mock Data Decommissioning Plan

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    MOCK DATA DECOMMISSIONING GATES                           │
├───────────────────┬──────────────────────────────────────────────────────────┤
│ Phase R2.5        │ Strategy freeze; design multi-tier schema; zero mock     │
│ (Current)         │ data removal in production code yet.                     │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ Phase R4-A        │ Deploy automated WFP HDX & Open-Meteo ingestion workers; │
│ (Sprint 4)        │ seed real historical prices (2020–2026); add badge       │
│                   │ "[VERIFIED WFP SOURCE]" on public market tickers.        │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ Phase R4-B        │ Onboard Gedaref & El Obeid field reporters; activate     │
│ (Sprint 5)        │ daily spot price tickers; retire mock price arrays.      │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ Phase R6          │ Onboard real registered farmers in Gedaref; delete all   │
│ (Sprint 8)        │ mock farmer profile generators; 100% real database rows. │
└───────────────────┴──────────────────────────────────────────────────────────┘
```
