# ZARATI | زرعتي — National Agriculture Command Center Architecture
**System Path:** `/intelligence`  
**Target Personas:** Federal Ministers, State Governors, Multilateral Country Directors, Sovereign Food Security Authorities  
**Classification:** Executive Decision-Support System & Sovereign Intelligence Portal  
**Date Context:** September 2026  
**Document Ref:** `09. ZARATI_NATIONAL_COMMAND_CENTER_UX.md`

---

## 1. Executive Vision & The "Ministerial War-Room" Mandate

The Zarati National Agriculture Command Center transforms national agricultural governance from retrospective paper reporting into a **real-time, operational situation room**. 

In times of food crisis, conflict recovery, and macroeconomic reconstruction, a Sudanese Minister of Agriculture, a State Governor in Gedaref, or a World Bank Country Director cannot wait 6 months for a post-harvest survey. They require an immediate, interactive command interface answering:
* *Where is food growing right now?*
* *What are the rainfall anomalies and drought stress vectors across our key granaries?*
* *Are commodity market prices clearing normally or experiencing speculative spikes?*
* *Where are the logistical bottlenecks between inland scheme storage and Port Sudan export berths?*
* *How many emergency seed vouchers have reached smallholders in safe localities?*

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ZARATI NATIONAL AGRICULTURE COMMAND CENTER (/intelligence)                              │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [TOP BAR: SOVEREIGN TELEMETRY]                                                                                        │
│  🇸🇩 SUDAN AGRI-OS | NATIONAL FOOD BALANCE: 5.2M / 7.8M MT (-33% DEFICIT) | ACTIVE MONITORED FEDDANS: 24.2M           │
│  MODE: [EXECUTIVE DESKTOP] [WAR-ROOM WALL DISPLAY] [TABLET BRIEFING] | REFRESH: REAL-TIME (EDGE POSTGIS)              │
├────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────┤
│  [LEFT PANEL: 5-TIER DRILL-DOWN]       │  [CENTER: HIGH-DENSITY SOVEREIGN SPATIAL CHOROPLETH MAP]                      │
│  • NATIONAL OVERVIEW (SUDAN)           │  Layer Toggles:                                                               │
│    ├── 01. Gedaref State               │  [x] Cultivated Area (Feddan Density)   [x] Rainfall Anomaly (CHIRPS)        │
│    │   ├── Locality: El Fashaga        │  [x] Vegetation Vigor (Sentinel NDVI)    [ ] Soil Moisture Stress (ECMWF)     │
│    │   ├── Locality: Galaa El Nahal    │  [x] Market Spot Price Ticker (Ardeb)   [x] Food Insecurity Severity (IPC 3+) │
│    │   └── Market: Gedaref Exchange    │                                                                               │
│    ├── 02. Al Jazirah State            │  Interactive Map Feature:                                                     │
│    │   └── Gezira Scheme (North/South) │  Clicking any state or locality dynamically filters all surrounding telemetry│
│    ├── 03. Kassala State               │  charts, commodity arrival curves, and local market price tickers.            │
│    ├── 04. River Nile State            │                                                                               │
│    └── 05. Red Sea Port Corridor       │                                                                               │
├────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
│  [RIGHT PANEL: CRISIS & MARKET ALERTS] │  [BOTTOM DOCK: NATIONAL COMMODITY FLOWS & LOGISTICS TRACKER]                  │
│  🚨 ALERTS (PRIORITY 1):               │  • Sorghum (Feterita): 450,000 SDG/Ardeb ($757/MT) ▲ +4.2% (Gedaref Spot)    │
│  • El Fashaga: Late dry spell detected │  • White Sesame: 400,000 SDG/Qintar ($2,960/MT) ── Stable (Export Grade A)    │
│  • Suakin Port: 120k live sheep staged │  • Winter Wheat: 240,000 SDG/Sack ($800/MT) ▼ -1.5% (River Nile Basin)        │
│  • Kordofan Transit: Road closure alert│  • Logistics Corridor: 140 Trucks En Route (Eastern Highway to Port Sudan)    │
└────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The 5-Tier Hierarchical Drill-Down

The Command Center provides a seamless spatial zoom hierarchy:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    THE 5-TIER ADMINISTRATIVE DRILL-DOWN                      │
├──────────────────────────────────────────────────────────────────────────────┤
│ TIER 1: NATIONAL SOVEREIGN COMPASS (REPUBLIC OF THE SUDAN)                   │
│ Aggregate national cereal production balance, macro food deficit, national   │
│ average grain prices, cumulative national rainfall vs. 30-year mean.         │
├──────────────────────────────────────────────────────────────────────────────┤
│ TIER 2: STATE EXECUTIVE LEVEL (E.G., GEDAREF STATE)                          │
│ Total state cultivated feddans, breakdown by scheme vs. traditional rainfed, │
│ state crop market auction turnover, local fuel & fertilizer availability.    │
├──────────────────────────────────────────────────────────────────────────────┤
│ TIER 3: LOCALITY ADMINISTRATIVE LEVEL (E.G., EL FASHAGA LOCALITY)            │
│ Number of active farming households, primary crop varieties planted, local   │
│ rainfall gauge readings, flood and pest outbreak risk indices.               │
├──────────────────────────────────────────────────────────────────────────────┤
│ TIER 4: MARKET AUCTION & PROGRAM NODE (E.G., GEDAREF CROP EXCHANGE)          │
│ Daily closing auction lots, volume in Ardebs/Qintars, buyer syndicate volume,│
│ WFP emergency procurement quota fulfillment, local warehouse occupancy.      │
├──────────────────────────────────────────────────────────────────────────────┤
│ TIER 5: FARM & PLOT LEVEL (AUTHORIZED MINISTERIAL ACCESS ONLY)               │
│ Certified landholder identity, PostGIS boundary polygon, historical NDVI     │
│ vegetation curve, verified crop type, input subsidy redemption log.          │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Operational Display Modes

1. **Desktop Command Mode:** Full multi-panel layout optimized for dual $4\text{K}$ monitors in ministerial private offices, enabling deep data exploration, custom SQL filtering, and instant GeoJSON/CSV exports.
2. **War-Room Wall Display Mode:** Ultra-high-contrast, dark-mode optimized view designed for executive wall projection screens during cabinet meetings. Features automated 60-second cycling between national crop health, logistics corridors, and market price movements with zero manual clicks required.
3. **Executive Tablet Briefing Mode:** Touch-optimized, lightweight responsive layout designed for iPad/Android tablets, enabling governors and ministers to review morning briefings during field inspection tours with offline-cached data.

---

## 4. Intelligence Layers & Sensor Telemetry

* **Vegetative Health (Sentinel-2 NDVI):** Updated every 5 days; renders green-to-red chlorophyll vitality gradients across all registered schemes.
* **Precipitation Stress (CHIRPS & Open-Meteo):** Daily gridded precipitation showing millimeters of rainfall and standard deviations from historical averages.
* **Market Disruption Risk:** Color-coded spot auction pins:
  - *Green:* Normal trading liquidity ($>5,000\text{ Ardebs traded}$).
  - *Amber:* Below-average volume; anomalous price volatility ($>15\%\text{ shift}$).
  - *Red:* Market auction shuttered or inaccessible due to conflict/flooding.
* **Donor & NGO Program Overlay:** Visualizes active seed distribution campaigns by FAO, WFP, and Islamic Development Bank, displaying real-time voucher redemption percentages by locality.
