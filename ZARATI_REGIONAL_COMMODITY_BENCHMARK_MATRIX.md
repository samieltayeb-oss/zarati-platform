# ZARATI | زرعتي — Regional & Global Commodity Benchmark Matrix
**Scope:** Benchmark Markets (Saudi Arabia, UAE, Egypt, Global Exchanges)  
**Classification:** Cross-Border Price Discovery & Corridor Spread Modeling  
**Date Context:** September 2026  
**Document Ref:** `24. ZARATI_REGIONAL_COMMODITY_BENCHMARK_MATRIX.md`

---

## 1. Architectural Guardrail: Domestic vs. Benchmark Isolation

> **Critical Rule of Integrity:**  
> Regional and global commodity prices must **NEVER** be mixed, blended, or confused with domestic Sudanese farmgate prices. 
> 
> Regional benchmarks (Jeddah, Dubai, Cairo) and international benchmarks (CBOT, World Bank Pink Sheet) serve strictly as **destination reference points** to calculate export gross margins, import parity thresholds, and trade competitiveness.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    ZARATI CROSS-BORDER COMMODITY ALIGNMENT                   │
│                                                                              │
│   SUDAN FOSTERED SUPPLY (FOB)                 REGIONAL DESTINATION (CIF)     │
│   • Gedaref White Sesame                      • Jeddah Tahina Processors     │
│   • Blue Nile Grain Sorghum                   • Gulf Dairy Livestock Feed    │
│   • Kordofan Peanuts / Oilseeds               • Cairo Crushing Mills         │
│   • Suakin Export Live Sheep                  • Jizan / Jeddah Livestock     │
│                     │                                     ▲                  │
│                     │           ARBITRAGE SPREAD          │                  │
│                     └─────────────────────────────────────┘                  │
│                                     │                                        │
│                                     ▼                                        │
│                        GLOBAL MACRO REFERENCE (USD)                          │
│                        • CBOT Sorghum / Wheat Futures                        │
│                        • World Bank Commodity Pink Sheet                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Regional Benchmark Inventory (Saudi Arabia, UAE, Egypt)

### 2.1 Kingdom of Saudi Arabia (Destination Market Anchor)
* **Wholesale Grain & Feed Benchmark:**
  - *Entity:* General Food Security Authority (GFSA / الهيئة العامة للأمن الغذائي) & MEWA Wholesale Monitor.
  - *Commodities:* Feed Sorghum, Imported Yellow Corn, Barley, Alfalfa Hay Bales.
  - *Data Feed:* MEWA Open Data Portal (`data.gov.sa`) & GFSA Monthly Import Tender Releases.
  - *Relevance to Sudan:* Establishes the ceiling price for Sudanese sorghum exports competing against subsidized American and Brazilian feed grains.
* **Live Animal & Meat Benchmark:**
  - *Entity:* Jeddah Central Wholesale Livestock Market (سوق الأنعام المركزي بجدة) & Jizan Port Quarantine Auctions.
  - *Commodity:* Live Sudanese Desert Sheep (*Kabashi / Hamari*).
  - *Quotation:* SAR per Head (converted to USD/Head).
  - *Relevance to Sudan:* The primary export driver for western pastoralists during the annual Hajj season.

### 2.2 United Arab Emirates (Regional Trading & Re-Export Hub)
* **Dubai Multi Commodities Centre (DMCC):**
  - *Entity:* DMCC Agriota & DMCC Tradeflow platform.
  - *Commodities:* Sesame Seeds, Pulses, Gum Arabic.
  - *Data Feed:* DMCC Trade Registry & Dubai Customs FOB/CIF Declarations.
  - *Relevance to Sudan:* Global price discovery benchmark for containerized sesame re-exported to East Asia (China, Japan, South Korea).
* **Silal Food & Agriculture (ADQ Abu Dhabi):**
  - *Entity:* Silal Strategic Food Reserve Index.
  - *Commodities:* Long-grain grains, edible oils, pulses.
  - *Relevance to Sudan:* Institutional bulk procurement reference for sovereign supply contracts.

### 2.3 Arab Republic of Egypt (Nile Basin Partner Market)
* **Borsa El Selaa (Egyptian Commodity Exchange / البورصة المصرية للسلع):**
  - *Entity:* Ministry of Supply and Internal Trade (MOSIT) & Egyptian Exchange (EGX).
  - *Commodities:* Yellow Corn, Milling Wheat, Faba Beans (*Ful Masri*).
  - *Data Feed:* Daily electronic trading floor closing sheets (`belsa.com.eg`).
  - *Relevance to Sudan:* Determines cross-border road trade arbitrage along the Dongola-Argeen-Aswan land border corridor.

---

## 3. Global Benchmark Feeds (International Reference)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          GLOBAL AGRICULTURAL BENCHMARK INVENTORY                                       │
├───────────────────────┬──────────────────────────────┬──────────────────────────────┬───────────────┬──────────────────┤
│ Benchmark Name        │ Operating Organization       │ Primary Data Endpoint / URL  │ Update Freq   │ Relevance to     │
│                       │                              │                              │ & Currency    │ Zarati Platforms │
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼──────────────────┤
│ World Bank Commodity  │ World Bank Development       │ worldbank.org/en/research/   │ Monthly       │ International    │
│ "Pink Sheet"          │ Prospects Group              │ commodity-markets (Excel/CSV)│ (USD / MT)    │ grain/fertilizer │
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼──────────────────┤
│ CBOT Sorghum & Wheat  │ Chicago Mercantile Exchange  │ cmegroup.com/markets/        │ Real-time &   │ Global benchmark │
│ Futures Time Series   │ (CME Group / CBOT)           │ agriculture/grains/          │ Daily (USD/bu)│ for cereal parity│
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼──────────────────┤
│ FAO Food Price Index  │ Food and Agriculture Org     │ fao.org/worldfoodsituation/  │ Monthly       │ Macro global     │
│ (FFPI) & GIEWS FPMA   │ of the United Nations        │ foodpricesindex/             │ Index (2014=1)│ food inflation   │
├───────────────────────┼──────────────────────────────┼──────────────────────────────┼───────────────┼──────────────────┤
│ UN Comtrade Global    │ United Nations Statistics    │ comtradeplus.un.org/         │ Annual / Qtr  │ Bilateral trade  │
│ Trade Database        │ Division (UNSD)              │ REST API (HS Codes 1007,1207)│ (USD Flows)   │ export/import vol│
└───────────────────────┴──────────────────────────────┴──────────────────────────────┴───────────────┴──────────────────┘
```

---

## 4. Corridor Spread & Freight Delta Mapping

| Commodity | Primary Origin Market | Regional Destination | Typical Logistics & Freight Delta | Benchmark Data Source |
|---|---|---|---|---|
| **White Sesame** | Gedaref Spot Auction | Jeddah Islamic Port (KSA) | $+\$250 - \$380\text{ USD/MT}$ (Truck + Port + Shipping) | Gedaref Auction vs. Jeddah Wholesale |
| **Sorghum (Feterita)**| Gedaref Grain Silos | Jizan Feeder Port (KSA) | $+\$180 - \$240\text{ USD/MT}$ (Truck + Vessel Charter) | Gedaref Auction vs. GFSA Feed Tender |
| **Gum Arabic (Hashab)**| El Obeid Exchange | Dubai DMCC Free Zone (UAE) | $+\$600 - \$950\text{ USD/MT}$ (Inland Transit + Container) | El Obeid Bulletin vs. DMCC Tradeflow |
| **Faba Beans** | Northern State (Dongola) | Cairo Wholesale (El Obour) | $+\$120 - \$190\text{ USD/MT}$ (Argeen Border Trucking) | Atbara Spot vs. Borsa El Selaa Egypt |
| **Live Desert Sheep** | Kordofan / Kassala | Suakin $\rightarrow$ Jeddah Port | $+\$35 - \$55\text{ USD/Head}$ (Quarantine + Livestock Vessel) | Suakin Export vs. Jeddah Livestock Auction |
