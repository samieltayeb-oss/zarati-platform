# ZARATI | زرعتي — Applied AI, GIS & Remote Sensing Strategy
**Mandate:** Rigorous, Hype-Free Technological Roadmap for Spatial & Predictive Agronomy  
**Scope:** Satellites (Sentinel, Landsat), Agrometeorology (ECMWF, CHIRPS) & Applied Machine Learning  
**Date Context:** September 2026  
**Document Ref:** `18. ZARATI_AI_GIS_SATELLITE_ROADMAP.md`

---

## 1. Technological Guiding Principles

1. **Rejection of "AI-Powered" Marketing Hype:** Zarati explicitly bans nebulous claims of "revolutionary AI." Every machine learning or remote sensing model deployed must specify its underlying architecture, training data corpus, empirical error margin (RMSE / F1-Score), inference latency, and human-in-the-loop oversight protocol.
2. **Zero-Capex Spatial Pipeline:** Zarati utilizes open-access, public-good satellite constellations (Copernicus Sentinel-2 and USGS Landsat-8/9) via SpatioTemporal Asset Catalogs (STAC), eliminating multi-million-dollar proprietary commercial imagery licenses for baseline monitoring.
3. **Ground-Truth Calibration:** Pure top-down satellite indices (NDVI) are meaningless in isolation without ground-truth calibration from local research stations (Agricultural Research Corporation - ARC) and field crop-cut surveys.

---

## 2. Remote Sensing & GIS Dataset Feasibility Classification

Every geospatial dataset integrated into Zarati is classified according to its operational readiness and cost profile:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       GEOSPATIAL & SATELLITE DATASET TAXONOMY                                          │
├───────────────────────┬─────────────────────────────┬──────────────┬───────────────┬─────────────────┬─────────────────┤
│ Dataset / Sensor      │ Constellation / Source      │ Spatial Res  │ Revisit Cycle │ Operational     │ Strategic       │
│                       │                             │              │ & Latency     │ Classification  │ Application     │
├───────────────────────┼─────────────────────────────┼──────────────┼───────────────┼─────────────────┼─────────────────┤
│ Sentinel-2 MSI        │ European Space Agency (ESA) │ 10m / 20m    │ 5 Days        │ AVAILABLE NOW / │ Field-level     │
│ Multispectral (B2-B12)│ Copernicus Open Access      │ Visible/NIR  │ (12h latency) │ FREE OPEN DATA  │ NDVI & NDWI     │
├───────────────────────┼─────────────────────────────┼──────────────┼───────────────┼─────────────────┼─────────────────┤
│ Landsat-8/9 OLI-2     │ USGS / NASA                 │ 30m Optical  │ 8–16 Days     │ AVAILABLE NOW / │ Historical multi│
│ & TIRS Thermal Bands  │ EarthExplorer               │ 100m Thermal │ (24h latency) │ FREE OPEN DATA  │ decade baseline │
├───────────────────────┼─────────────────────────────┼──────────────┼───────────────┼─────────────────┼─────────────────┤
│ CHIRPS Daily Rainfall │ Climate Hazards Center      │ 0.05°        │ Daily         │ AVAILABLE NOW / │ Monsoon anomaly │
│ Precipitation Gauge   │ UC Santa Barbara / USAID    │ (~5.5 km)    │ (24h latency) │ FREE OPEN DATA  │ & drought alert │
├───────────────────────┼─────────────────────────────┼──────────────┼───────────────┼─────────────────┼─────────────────┤
│ ECMWF ERA5 & IFS      │ European Centre for Medium- │ 9 km         │ Hourly / 6h   │ REQUIRES        │ 7-day forecast &│
│ High-Res Forecasts    │ Range Weather Forecasts     │ Gridded      │ (Real-time)   │ INTEGRATION     │ soil moisture   │
├───────────────────────┼─────────────────────────────┼──────────────┼───────────────┼─────────────────┼─────────────────┤
│ PlanetScope Doves     │ Planet Labs Commercial      │ 3m Optical   │ Daily Daily   │ PAID COMMERCIAL │ High-value seed │
│ High-Res Imagery      │ Constellation               │ RGB/NIR      │ (12h latency) │ (Enterprise)    │ trial audit     │
├───────────────────────┼─────────────────────────────┼──────────────┼───────────────┼─────────────────┼─────────────────┤
│ Dynamic World         │ Google / WRI / Sentinel-2   │ 10m          │ Near Real-    │ AVAILABLE NOW / │ National crop   │
│ Land Cover AI         │ AI Land Classification      │ Land Class   │ Time (5-day)  │ FREE OPEN DATA  │ acreage mapping │
└───────────────────────┴─────────────────────────────┴──────────────┴───────────────┴─────────────────┴─────────────────┘
```

---

## 3. Mathematical Vegetation & Moisture Indices

Zarati calculates three primary spectral indices per farm polygon:

### 3.1 Normalized Difference Vegetation Index (NDVI)
Evaluates chlorophyll absorption and vegetative canopy vigor:
$$\text{NDVI} = \frac{\text{B8 (NIR)} - \text{B4 (Red)}}{\text{B8 (NIR)} + \text{B4 (Red)}}$$
* **Calibration in Sudan:**
  - $\text{NDVI} < 0.20$: Bare sandy soil / fallow land.
  - $0.20 \le \text{NDVI} \le 0.45$: Emerging rainfed sorghum/sesame vegetative stage.
  - $\text{NDVI} > 0.55$: Dense canopy / peak grain filling stage.

### 3.2 Normalized Difference Water Index (NDWI - Gao Model)
Detects leaf water content and irrigation canal moisture:
$$\text{NDWI} = \frac{\text{B8 (NIR)} - \text{B11 (SWIR)}}{\text{B8 (NIR)} + \text{B11 (SWIR)}}$$
* **Strategic Utility:** Detects acute water stress in the Gezira and New Halfa schemes 7 to 10 days before visible leaf wilting occurs.

---

## 4. Practical Applied AI Capabilities Blueprint

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    ZARATI APPLIED AI CAPABILITY PORTFOLIO                    │
├───────────────────┬──────────────────────────────────────────────────────────┤
│ 1. SUDANESE       │ Fine-tuned Arabic LLM with Retrieval-Augmented Generation│
│    AGRONOMIC      │ (RAG) over the complete Agricultural Research Corp (ARC) │
│    ADVISOR        │ seed manuals, soil guides, and pest management handbooks.│
│    (R8 Prototype) │ Conversational Arabic in Sudanese dialect via audio/text. │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ 2. LEAF DISEASE   │ Mobile edge-computed MobileNet-V3 computer vision model  │
│    TRIAGE         │ diagnosing common Sudanese crop pathologies (e.g.,       │
│    (Computer Vis) │ Sorghum Anthracnose, Sesame Phyllody, Wheat Rust).       │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ 3. SATELLITE      │ Extreme Gradient Boosting (XGBoost) model combining      │
│    YIELD          │ historical multi-year Sentinel-2 NDVI integrals, CHIRPS  │
│    FORECASTING    │ cumulative precipitation, and ARC field trial baselines  │
│    (R10 Engine)   │ to predict state cereal yield 4–6 weeks pre-harvest.     │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ 4. ANOMALY & TAX  │ Unsupervised isolation forest algorithm detecting price  │
│    LEAKAGE        │ collusion, reporting outliers, and municipal auction     │
│    DETECTION      │ fee discrepancies across physical market gates.          │
└───────────────────┴──────────────────────────────────────────────────────────┘
```

---

## 5. Model Limitations, Human Oversight & Safety Guardrails

| AI Capability | Primary Accuracy Bottleneck | Maximum Acceptable Error | Mandatory Human Oversight Protocol |
|---|---|---|---|
| **Agronomic Chatbot** | Hallucination of chemical pesticide dosages | 0% tolerance for toxic chemical dosage errors | High-risk agrochemical inquiries enforce disclaimer & trigger local extension officer review. |
| **Disease Vision** | Poor smartphone camera focus & low lighting in field | Top-1 Accuracy $>85\%$; Top-3 $>95\%$ | Displays confidence score; if $<80\%$, prompts farmer to submit leaf sample to ARC station. |
| **Yield Forecast** | Cloud cover during peak August monsoon | RMSE $<0.35\text{ Metric Tonnes / Feddan}$ | State forecasts cross-validated by MOAF/CBS expert committees before public release. |
| **Price Predictor**| Macro geopolitical shocks & sudden border closures | Mean Absolute Percentage Error (MAPE) $<12\%$ | Explicitly labeled as `[FORECAST ESTIMATE]`; never displayed as guaranteed price. |
