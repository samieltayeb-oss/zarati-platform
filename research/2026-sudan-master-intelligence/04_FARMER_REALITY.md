# Sudanese Farmer Reality: Operational, Societal & Economic Ground Truth
**Document Ref:** 04_FARMER_REALITY.md  
**Classification:** Field Sociology & Human-Centered Product Design  
**Geographic Scope:** Rural Farming Communities across Kordofan, Gedaref, Gezira, Kassala, River Nile  
**Date Context:** September 2026  
**Author:** Zarati Master Research Program  

---

## 1. Land Sizing, Feddan Sizing & Land Tenure Systems

### 1.1 The Feddan Standard (فدان)
Metric hectares are absent from rural conversation in Sudan. All farm sizing, leasing, and trade calculations are conducted in **Feddans**:
* **1 Feddan** = $4,200 \text{ m}^2 = 1.038 \text{ acres} = 0.4200 \text{ hectares}$
* **1 Hectare** = $10,000 \text{ m}^2 = 2.381 \text{ feddans}$
* **1 Acre** = $4,046.86 \text{ m}^2 = 0.9635 \text{ feddans}$

**Design Rule:** Zarati must present and receive farm sizes in **Feddans** in Arabic mode, while transparently converting to metric hectares in the background database (`area_hectares`) for GIS polygons, satellite calculations, and institutional donor reporting.

### 1.2 Land Tenure Regimes
1. **Customary Communal Tenure (*Hawakeer*, singular *Hakura* / حواكير):**
   * Prevalent across Darfur, Kordofan, and traditional rainfed zones. Governed by the Native Administration (*Nazir*, *Omda*, *Sheikh*). Farmers hold inheritable usufruct rights; land cannot be mortgaged to commercial banks.
2. **Irrigated Scheme Tenancies (*Hawashat* / حواشات inside *Nimras* / نمر):**
   * Dominates the Gezira Scheme (2.2M feddans), New Halfa, and Rahad. Plots are divided into standard 5-feddan *hawashat*, aggregated into administrative *nimras* (90–180 feddans).
3. **State Leaseholds (*Hukr* / حكر):**
   * Dominates the Eastern Semi-Mechanized Rainfed Belt (Gedaref, Blue Nile). 25- to 50-year leases granted to agricultural syndicates and commercial operators.

---

## 2. Hardware Ecosystem, Connectivity & Cognitive Realities

```
+---------------------------------------------------------------------------------------------------+
| RURAL HARDWARE & COGNITIVE LANDSCAPE IN SUDAN                                                     |
+--------------------------+---------------------+--------------------------------------------------+
| Metric / Dimension       | Rural Reality       | Product Design Mandate for Zarati                |
+--------------------------+---------------------+--------------------------------------------------+
| Feature Phones (2G)      | 65% – 75%           | Mandatory SMS broadcast & USSD lookup capability |
+--------------------------+---------------------+--------------------------------------------------+
| Low-End Android (3G/4G)  | 25% – 35%           | Lightweight PWA (<1.5s load on 2G), offline sync |
+--------------------------+---------------------+--------------------------------------------------+
| Rural Adult Illiteracy   | 35% – 45%           | Voice notes, audio summaries, visual icons       |
+--------------------------+---------------------+--------------------------------------------------+
| Grid Electricity         | Near 0% in villages | Zero high-frequency polling; minimal battery burn|
+--------------------------+---------------------+--------------------------------------------------+
| Language                 | Sudanese Arabic     | Native agricultural idioms (Ardeb, Qintar, Kharif|
+--------------------------+---------------------+--------------------------------------------------+
```

---

## 3. Agricultural Calendars & Seasonal Bottlenecks

### 3.1 The Two Cropping Regimes
* **Summer Monsoon Season (*Kharif* / الخريف):**
  * *Land Prep:* April – May.
  * *Sowing:* June – July (upon first soaking rains).
  * *Weeding (*Hash* / الحش):* July – August.
  * *Harvest (*Darat* / الدرت):* October – January.
  * *Crops:* Sorghum, Pearl Millet, Sesame, Groundnuts, Sunflower.
* **Winter Irrigated Season (*Shita* / الشتاء):**
  * *Land Prep:* September – October.
  * *Sowing:* Mid-November – Early December (critical thermal window).
  * *Irrigation Cycles (*Rayat* 1 to 6):* December – February.
  * *Harvest:* Late February – March.
  * *Crops:* Winter Wheat, Faba Beans (*Ful Masri*), Chickpeas, Onions.

### 3.2 Critical Agronomic Vulnerabilities
1. **The Weeding Bottleneck (*Al-Hash*):** Weeds explode 14–21 days after Kharif rains. Delaying hand-weeding by 10 days reduces sorghum yields by up to 40%. Requires massive seasonal cash for casual labor (*Ummala*).
2. **The Sesame Shattering Cliff:** Sesame seed pods dehisce (shatter) within 10–14 days of maturity. If not cut and stacked into sheaves (*Halaqil*) immediately, grain spills into the dirt, causing 50%+ yield loss.
3. **Winter Wheat Terminal Heat:** Sowing delayed past December 10 forces grain filling into the scorching heat of March (>38°C), causing terminal shriveling.

---

## 4. Middlemen Systems, Debt Traps (*Sheil*) & Transport Isolation

### 4.1 The Sheil System (نظام الشيّل — The Structural Credit Trap)
Smallholders face a total absence of formal bank credit. During the pre-harvest lean season (July–September), households deplete food and liquidity. Local village merchants (*Tujjar*) advance cash, fuel, or grain under the condition that the farmer repays with standing crops at harvest at a predetermined price—typically **30% to 50% below the expected market price**. At harvest in November, merchants seize the crop, leaving the farmer with minimal working capital and perpetuating the cycle.

### 4.2 Logistics Quagmires
* **Kharif Road Blackouts (انقطاع الخريف):** Vertisol clay plains in Gedaref, Blue Nile, and Sennar become impassable mud seas during July–October. Motor vehicles cannot move; only 4WD tractors or pack animals function.
* **Fuel Speculation:** Agricultural diesel (*Jazlin*) trades at 2x to 4x official Port Sudan terminal rates on rural parallel markets.
* **Jute Sack Deficits:** Standard jute/polypropylene bags (*Khaysha*) must be purchased in cash; war-induced factory shutdowns frequently cause packaging prices to jump to 15% of crop value.
