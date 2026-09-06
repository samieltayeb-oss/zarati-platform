# ZARATI | زرعتي — Master Research Source Register & Bibliographic Ledger
**Scope:** Exhaustive Citation Ledger for Phase R2.5 Strategic Dossiers  
**Classification:** Evidence Provenance, Ground Truth Auditing & Academic Integrity  
**Date Context:** September 2026  
**Document Ref:** `26. ZARATI_RESEARCH_SOURCE_REGISTER.md`

---

## 1. Provenance Classification Standards

Every citation recorded in the Zarati Master Intelligence Repository is audited against five standard criteria:
1. **Source Nature:** Primary (direct institutional producer of data) vs. Secondary (analytical synthesis or third-party report).
2. **Confidence Level:** `[HIGH]` (audited government statistics, multilateral field missions, peer-reviewed), `[MEDIUM]` (reputable media, commercial filings), or `[ESTIMATE]` (econometric projections, field surveys).
3. **Fact Categorization:** `[VERIFIED FACT]`, `[SOURCE CLAIM]`, `[INFERENCE]`, or `[ASSUMPTION]`.

---

## 2. Master Bibliographic Register

### 2.1 Sudanese Official & Institutional Sources

| ID | Author / Entity | Publication Title / Dataset | Date | URL / Reference | Confidence & Nature | Key Facts Derived |
|---|---|---|---|---|---|---|
| **SD-01** | Central Bank of Sudan (CBOS) | *Annual Economic Reports & Foreign Trade Bulletins* | 2020–2024 | `https://cbos.gov.sd/` | `[HIGH]` Primary | Pre-conflict ag GDP share (30.0%–34.5%); export sesame/gum earnings ($442M). |
| **SD-02** | Federal Ministry of Agriculture & Forestry (MOAF) | *National Land Allocation & Scheme Area Records* | 2022/2024 | Port Sudan Administrative Archive | `[HIGH]` Primary | Arable land endowment (175M feddans); Gezira Scheme area (2.2M feddans). |
| **SD-03** | Gedaref State Ag Market Authority | *Gedaref Daily Crop Auction Bulletins & SUNA Releases* | Aug–Sep 2026 | `https://suna-sd.net/` | `[HIGH]` Primary | Spot prices: Sorghum Feterita (450k SDG/Ardeb), White Sesame (400k SDG/Qintar). |
| **SD-04** | North Kordofan Crops Market Administration | *El Obeid Exchange Daily Auction Sheets* | Aug–Sep 2026 | Sheikan Locality Bulletins | `[MEDIUM]` Primary | Spot prices: Gum Arabic Hashab (1.1M SDG/Qintar), Groundnuts (11.5M SDG/MT). |
| **SD-05** | Central Bureau of Statistics (CBS Sudan) | *Statistical Yearbooks & Rural Demographic Surveys* | 2021/2024 | CBS Archives | `[HIGH]` Primary | Rural demographic percentage (64.5%–65.2%); national population (49.2M). |

### 2.2 Multilateral Agencies & Development Finance

| ID | Author / Entity | Publication Title / Dataset | Date | URL / Reference | Confidence & Nature | Key Facts Derived |
|---|---|---|---|---|---|---|
| **UN-01** | UN World Food Programme (WFP) | *WFP Food Prices for Sudan Dataset (HDX)* | Monthly (2026)| `https://data.humdata.org/dataset/wfp-food-prices-for-sudan` | `[HIGH]` Primary | Time series prices for cereals and pulses across 40+ Sudanese markets. |
| **UN-02** | USAID FEWS NET | *FEWS NET Data Warehouse (FDW) Sudan* | Monthly (2026)| `https://fdw.fews.net/api/marketpricefacts/?country=Sudan` | `[HIGH]` Primary | Grain price benchmarks; livestock-to-cereal terms of trade; conflict impact. |
| **UN-03** | FAO / WFP Crop & Food Supply Assessment Mission (CFSAM) | *Special Report: 2025/2026 Crop and Food Supply Assessment Mission to Sudan* | March 2025 / April 2026 | `https://www.fao.org/giews/reports/special-reports/` | `[HIGH]` Primary | National cereal output (5.2M MT vs 7.8M MT demand); 19.5M in IPC Phase 3+. |
| **UN-04** | International Food Policy Research Institute (IFPRI) | *Economy-wide Modeling of Sudan Conflict & Agrifood System Disruption* | 2025/2026 | IFPRI Sudan Strategy Support Program | `[HIGH]` Secondary | -33.6% contraction in agrifood system GDP; -50% ag employment in conflict zones. |
| **UN-05** | African Development Bank (AfDB) | *Sudan Emergency Wheat Production Project Implementation Report* | 2024/2025 | `https://www.afdb.org/` | `[HIGH]` Primary | $34M grant financing irrigated winter wheat in Northern and River Nile states. |
| **UN-06** | UN FAO Emergency & Resilience Programme | *Sudan Humanitarian Response Plan 2025–2026* | 2025/2026 | `https://www.fao.org/emergencies/` | `[HIGH]` Primary | 1.0M households reached with seeds (2023); target of 1.5M households in 2026. |

### 2.3 Regional Gulf & MENA Sources

| ID | Author / Entity | Publication Title / Dataset | Date | URL / Reference | Confidence & Nature | Key Facts Derived |
|---|---|---|---|---|---|---|
| **ME-01** | Saudi Ministry of Environment, Water & Agriculture (MEWA) | *Naama E-Services Portal Documentation* | 2025/2026 | `https://naama.sa/` & `https://mewa.gov.sa/` | `[HIGH]` Primary | Naama consolidates 260+ domestic e-services; AI smart voice assistant launched. |
| **ME-02** | Saudi National Cybersecurity Authority (NCA) | *Essential Cybersecurity Controls (ECC-1:2018)* | Official Reg | `https://nca.gov.sa/` | `[HIGH]` Primary | Statutory cybersecurity & data protection standards for in-Kingdom gov systems. |
| **ME-03** | Saudi Communications, Space & Tech Commission (CST) | *Cloud Computing Regulatory Framework (CCRF)* | Official Reg | `https://cst.gov.sa/` | `[HIGH]` Primary | Class B / Class C data classification requiring in-Kingdom cloud data residency. |
| **ME-04** | ADQ / Silal Food & Agriculture (Abu Dhabi) | *UAE Food Security & Strategic Reserves Overview* | 2024/2025 | `https://silal.ae/` | `[HIGH]` Primary | Silal grain storage at Zayed Port; AI-driven smart desert farming contracts. |
| **ME-05** | Egyptian Exchange & MOSIT | *Borsa El Selaa (Egyptian Commodity Exchange)* | 2025/2026 | `http://belsa.com.eg/` | `[MEDIUM]` Primary | Spot agricultural trading prices for yellow corn, wheat, and faba beans. |

### 2.4 Global Technology & Remote Sensing Sources

| ID | Author / Entity | Publication Title / Dataset | Date | URL / Reference | Confidence & Nature | Key Facts Derived |
|---|---|---|---|---|---|---|
| **GL-01** | Microsoft Corporation | *Azure Data Manager for Agriculture (ADMA) Retirement Notice* | 2024/2025 | Official Azure Docs (Retirement: Sep 1, 2025) | `[HIGH]` Primary | Proof that generalized horizontal cloud ag data platforms failed commercially. |
| **GL-02** | European Space Agency (ESA) | *Copernicus Sentinel-2 MSI Technical Guide* | 2025/2026 | `https://sentinels.copernicus.eu/` | `[HIGH]` Primary | 10m multispectral bands (B2, B3, B4, B8); 5-day revisit cycle; free STAC API. |
| **GL-03** | Open-Meteo GmbH | *Open-Meteo Weather Forecast API Documentation* | 2026 | `https://open-meteo.com/` | `[HIGH]` Primary | Hourly high-resolution agrometeorological forecast and historical ERA5 grids. |
| **GL-04** | World Bank Prospects Group | *World Bank Commodity Markets "Pink Sheet"* | Monthly (2026)| `https://www.worldbank.org/en/research/commodity-markets` | `[HIGH]` Primary | Global reference price series for wheat, sorghum, oilseeds, and fertilizers. |
| **GL-05** | Commercial Insolvency Filings | *High Court of Kenya Insolvency Petitions (iProcure / Twiga)* | 2023/2024 | Kenya Law Reports / Official Gazette | `[HIGH]` Primary | Insolvency of iProcure (April 2024); restructuring of Twiga Foods (late 2023). |
