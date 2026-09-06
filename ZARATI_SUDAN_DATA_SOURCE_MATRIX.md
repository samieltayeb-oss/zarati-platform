# ZARATI | زرعتي — Sudan Domestic Data Source Matrix & Ingestion Register
**Geographic Scope:** Republic of the Sudan (18 States, Subnational Markets)  
**Classification:** Empirical Data Source Inventory & Feasibility Audit  
**Date Context:** September 2026  
**Document Ref:** `23. ZARATI_SUDAN_DATA_SOURCE_MATRIX.md`

---

## 1. Master Sudan Data Ingestion Inventory

The following register details every empirical data source available within Sudan, assessing automated access feasibility, data formats, legal licensing, and production fallback protocols.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                      SUDAN DOMESTIC DATA SOURCE INVENTORY                                                              │
├───────────────────────┬──────────────────────────────┬──────────────────────────────┬───────────────┬────────────┬─────────────┬─────────────┬────────┤
│ Source Name           │ Publishing Authority         │ Primary Target Endpoint / URI│ Frequency &   │ Format &   │ Licensing   │ Reliability │Fallback│
│                       │                              │                              │ Latency       │ Protocol   │ & Access    │ & Tier      │Strategy│
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼────────────┼─────────────┼─────────────┼────────┤
│ Gedaref Crop Exchange │ Gedaref State Ag Market Auth │ SUNA News / State Radio /    │ Daily Spot    │ Unstruct   │ Public      │ HIGH        │FEWS NET│
│ (سوق محاصيل القضارف)  │ & Chamber of Commerce        │ Official Auction Board       │ (Same-day/24h)│ Arabic /IMG│ Spot Open   │ Tier A      │Gedaref │
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼────────────┼─────────────┼─────────────┼────────┤
│ El Obeid Crop Exchange│ North Kordofan Crops Market  │ Sheikan Locality Daily       │ Daily to 3x/wk│ Unstruct   │ Public      │ MEDIUM      │WFP HDX │
│ (بورصة محاصيل الأبيض) │ Administration               │ Bulletin / Kordofan Syndicate│ (24–48h lag)  │ Text / PDF │ Spot Open   │ Tier A      │Kordofan│
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼────────────┼─────────────┼─────────────┼────────┤
│ WFP HDX Sudan Food    │ UN World Food Programme      │ data.humdata.org/dataset/    │ Monthly       │ CSV / CKAN │ CC BY-IGO   │ VERY HIGH   │FEWS NET│
│ Prices Dataset        │ Humanitarian Data Exchange   │ wfp-food-prices-for-sudan    │ (3–4 wks lag) │ REST JSON  │ Open Public │ Tier B      │FDW API │
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼────────────┼─────────────┼─────────────┼────────┤
│ FEWS NET Data         │ USAID / Famine Early Warning │ fdw.fews.net/api/            │ Monthly       │ REST JSON  │ Open Public │ VERY HIGH   │WFP VAM │
│ Warehouse (FDW)       │ Systems Network              │ marketpricefacts/?country=SDN│ (2–3 wks lag) │ / CSV API  │ (Auth Token)│ Tier B      │Portal  │
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼────────────┼─────────────┼─────────────┼────────┤
│ FAO CFSAM Annual Crop │ FAO / WFP Crop & Food Supply │ fao.org/giews/reports/       │ Annual / Semi-│ PDF Report │ CC BY-NC-SA │ VERY HIGH   │ARC Seed│
│ Assessment Mission    │ Assessment Mission           │ special-reports/             │ Annual        │ / Tables   │ 3.0 IGO     │ Tier B      │Census  │
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼────────────┼─────────────┼─────────────┼────────┤
│ Sudan Meteorological  │ Ministry of Environment      │ Port Sudan National Climate  │ Daily 24h     │ Synoptic   │ Government  │ MEDIUM-LOW  │Open-   │
│ Authority (SMA)       │ & Civil Aviation Auth        │ Forecast Bulletins           │ Bulletins     │ Teleprinter│ Official    │ Tier C      │Meteo   │
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼────────────┼─────────────┼─────────────┼────────┤
│ Open-Meteo & ECMWF    │ European Centre for Medium-  │ api.open-meteo.com/v1/       │ Hourly & Daily│ REST JSON  │ Open Access │ VERY HIGH   │NASA    │
│ High-Res Weather      │ Range Weather Forecasts      │ forecast?latitude=...        │ (Real-time)   │ API        │ Commercial  │ Tier A      │POWER   │
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼────────────┼─────────────┼─────────────┼────────┤
│ Central Bank of Sudan │ Central Bank of Sudan (CBOS) │ cbos.gov.sd/en/foreign-trade │ Monthly &     │ HTML / PDF │ Official    │ MEDIUM      │Parallel│
│ Official FX & Trade   │ Research & Statistics Dept   │ -statistics                  │ Quarterly     │ Tables     │ Public      │ Tier B      │Median  │
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼────────────┼─────────────┼─────────────┼────────┤
│ Bankak P2P Liquidity  │ Bank of Khartoum Retail      │ Aggregated P2P Settlement    │ Real-time     │ In-App P2P │ Proprietary │ HIGH        │Direct  │
│ Clearing Spreads      │ Settlement Network           │ Clearing Spreads             │ Spot          │ Telemetry  │ Banking     │ Tier B      │Survey  │
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼────────────┼─────────────┼─────────────┼────────┤
│ Port Sudan Export &   │ Sea Ports Corporation (SPC)  │ Port Sudan Customs Terminal  │ Weekly / Bi-  │ Manifest   │ Port Auth / │ MEDIUM      │Chamber │
│ Shipping Manifests    │ & Marine Quarantine Auth     │ Loading & Clearance Logs     │ Weekly        │ Shipping   │ Commercial  │ Tier C      │Commerce│
└───────────────────────┴──────────────────────────────┴──────────────────────────────┴───────────────┴────────────┴─────────────┴─────────────┴────────┘
```

---

## 2. Granular Ingestion Pipelines for Sudan

### 2.1 Commodity Auctions: Gedaref Crop Exchange (سوق المحاصيل القضارف)
* **Status:** Primary grain clearing center for Sorghum (Feterita, Dabar, Tetron), White Sesame, and Sunflower.
* **Extraction Protocol:**
  1. Automated scraper monitors daily SUNA releases and official Telegram broadcasts from the Gedaref Market Authority at 14:00 Sudan Time (CAT).
  2. OCR and NLP parsing extracts: `[Commodity, Grade, Quantity_Ardebs, Low_Price, High_Price, Weighted_Avg]`.
  3. Conversion into standard metric tonnes:
     $$\text{Sorghum MT Price} = \frac{\text{Ardeb Price}}{0.198}$$
     $$\text{Sesame MT Price} = \frac{\text{Qintar Price}}{0.04493}$$

### 2.2 Western Kordofan & Darfur: El Obeid Crop Exchange (بورصة الأبيض)
* **Status:** Premier global marketplace for Gum Arabic (*Acacia senegal / Hashab* and *Acacia seyal / Talha*), Shelled Peanuts, and Karkadeh.
* **Extraction Protocol:**
  1. Bi-weekly telegraphic updates collected by certified Zarati market reporters stationed at the Sheikan auction floor.
  2. Submissions cross-checked against independent wholesale buyers in Khartoum North and Omdurman central markets.

### 2.3 Food Security Vulnerability: IPC & WFP VAM
* **Status:** Integrated Food Security Phase Classification (IPC Sudan) tracking populations across Phase 3 (Crisis), Phase 4 (Emergency), and Phase 5 (Catastrophe/Famine).
* **Extraction Protocol:**
  - Automated JSON parser ingesting locality-level IPC phase boundaries from `data.humdata.org` to update the National Command Center vulnerability heatmap quarterly.

---

## 3. Data Integrity & Validation Protocols

1. **Boundary Geofencing:** Every physical market has a certified PostGIS polygon. Field reports outside market bounding boxes are rejected automatically.
2. **Standard Unit Validation:** Rejects anomalous inputs (e.g., negative prices, unmapped units, prices deviating $>50\%$ from the preceding 3-day mean).
3. **Dual-Audit Trail:** Every stored record links to the original raw payload file archived in immutable S3/Supabase storage.
