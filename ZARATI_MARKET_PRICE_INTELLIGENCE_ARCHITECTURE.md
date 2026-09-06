# ZARATI | زرعتي — Market Price Intelligence Architecture & Trust Engine
**Scope:** 4-Layer Price Discovery Engine, Trust Scoring (A–E) & Trade Corridor Telemetry  
**Classification:** Commodity Intelligence Architecture  
**Date Context:** September 2026  
**Document Ref:** `22. ZARATI_MARKET_PRICE_INTELLIGENCE_ARCHITECTURE.md`

---

## 1. The 4-Layer Price Intelligence Model

To resolve the extreme volatility, hyper-inflation, and geographic fragmentation of agricultural commodities, Zarati implements a strictly partitioned **Four-Layer Price System**.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    ZARATI 4-LAYER PRICE DISCOVERY PYRAMID                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ LAYER 4: GLOBAL BENCHMARKS                                                   │
│ Reference prices from global commodity exchanges (CBOT Wheat/Sorghum,        │
│ World Bank Pink Sheet, FAO Food Price Index). Expressed in USD / Metric Ton. │
├──────────────────────────────────────────────────────────────────────────────┤
│ LAYER 3: REGIONAL DESTINATION BENCHMARKS                                     │
│ Wholesale spot and terminal import prices in core destination markets:       │
│ • Saudi Arabia: Jeddah Islamic Port, Jizan wholesale grain & livestock.      │
│ • UAE: Dubai DMCC wholesale sesame / Silal strategic reserve price.          │
│ • Egypt: Borsa El Selaa / Cairo wholesale legumes & faba beans.              │
├──────────────────────────────────────────────────────────────────────────────┤
│ LAYER 2: SUDAN USD-NORMALIZED BENCHMARK                                      │
│ Domestic local prices normalized into USD/Metric Ton using the verified      │
│ prevailing historical foreign exchange rate at the exact moment of trade.    │
├──────────────────────────────────────────────────────────────────────────────┤
│ LAYER 1: SUDAN LOCAL PHYSICAL SPOT PRICE (GROUND TRUTH)                      │
│ Actual cash auction clearing prices recorded on Sudanese exchange floors     │
│ (Gedaref, El Obeid, Sennar, Kassala). Quoted in local currency and customary │
│ units (SDG per Ardeb / Qintar / 90kg Sack).                                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The Immutable Observation Law

> **Core Architectural Principle:**  
> Zarati strictly prohibits destructive mutations or retroactive overwrites of historical price observations. Every recorded price transaction is cryptographically immutable.

Every recorded price entity preserves the following immutable schema:
```sql
CREATE TABLE public.commodity_price_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL DEFAULT 'SD',
  market_id UUID NOT NULL REFERENCES public.markets(id),
  crop_id UUID NOT NULL REFERENCES public.crops(id),
  variety TEXT,
  quality_grade TEXT NOT NULL DEFAULT 'commercial' 
    CHECK (quality_grade IN ('grade_1_export', 'grade_2', 'commercial', 'crushing')),
  
  -- Layer 1: Original Ground Truth
  original_price NUMERIC(15,2) NOT NULL,
  original_currency TEXT NOT NULL, -- 'SDG', 'SAR', 'AED', 'USD'
  original_unit TEXT NOT NULL,     -- 'ardeb', 'qintar', 'sack_90kg', 'metric_ton'
  
  -- Normalized Metrics
  normalized_price_per_kg NUMERIC(15,4) NOT NULL,
  normalized_price_per_mt NUMERIC(15,2) NOT NULL,
  
  -- Layer 2: USD Normalization & Auditable FX Anchor
  usd_normalized_price_per_mt NUMERIC(15,2) NOT NULL,
  fx_rate_used NUMERIC(15,4) NOT NULL,
  fx_source TEXT NOT NULL, -- 'parallel_market_median', 'cbos_official', 'bankak_p2p'
  fx_captured_at TIMESTAMPTZ NOT NULL,
  
  -- Layer 3 & 4 Comparative Linkage
  regional_benchmark_id UUID,
  global_benchmark_id UUID,
  
  -- Verification & Provenance
  source_type TEXT NOT NULL 
    CHECK (source_type IN ('exchange_auction', 'field_reporter', 'wfp_hdx', 'fews_net', 'trader_invoice')),
  reporter_id UUID REFERENCES public.profiles(id),
  verification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'verified', 'flagged_anomaly', 'rejected')),
  confidence_score TEXT NOT NULL DEFAULT 'C'
    CHECK (confidence_score IN ('A', 'B', 'C', 'D', 'E')),
  
  -- Audit Ledger
  observed_at TIMESTAMPTZ NOT NULL,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. The Zarati Price Trust Score (A through E)

To prevent misinformation and give institutional buyers complete transparency, every price displayed across Zarati carries a clear, auditable Trust Badge:

* **Tier A — Verified Primary Exchange Floor:** Direct electronic feed or certified auction sheet signed by a recognized market authority (e.g., Gedaref State Agricultural Market Authority). Zero interpolation.
* **Tier B — Institutional UN / Multilateral Feed:** Verified reports published by UN WFP (HDX/VAM), FAO FPMA, or USAID FEWS NET. High reliability, typical 2- to 4-week publishing lag.
* **Tier C — Multi-Source Confirmed Spot:** Price reported independently by $\ge 3$ verified local traders or certified market reporters within a 24-hour window, with standard deviation $<8\%$.
* **Tier D — Indicative Market Report:** Single-source field report from a registered cooperative or local trader, awaiting secondary cross-validation.
* **Tier E — Econometrically Derived / Model Estimated:** Algorithmic calculation based on transport cost differentials, historical seasonal spreads, or regional price arbitrage models.

---

## 4. The Zarati Market Reporter Network (MRN)

To capture live spot prices from markets lacking electronic auction infrastructure, Zarati deploys the **Market Reporter Network (MRN)**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    ZARATI MARKET REPORTER AUDIT PIPELINE                     │
│                                                                              │
│  1. CAPTURE              2. VALIDATE            3. ANOMALY FILTER            │
│  Certified field         GPS geolocation        Z-score filter flags         │
│  reporter submits photo  match within 500m      submissions deviating        │
│  of physical auction     of official market     >25% from 7-day rolling      │
│  sheet via mobile PWA.   boundary.              median for admin review.     │
│           │                         │                         │              │
│           └─────────────────────────┼─────────────────────────┘              │
│                                     ▼                                        │
│  4. CONSENSUS            5. SETTLEMENT          6. PERSISTENCE               │
│  Algorithm matches with  Reporter earns micro-  Immutable insert into        │
│  companion submissions   reputation score       `crop_prices` with Tier      │
│  from parallel traders.  & Bankak airtime.      Badge and audit provenance.  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Trade Intelligence: Corridor Arbitrage & Spread Modeling

Zarati enables commercial exporters and institutional food procurement agencies to model regional trade margins with complete transparency:

### Example Value Corridor: Gedaref $\rightarrow$ Port Sudan $\rightarrow$ Jeddah (White Sesame)
$$\text{Indicative Gross Margin} = P_{\text{Destination (Jeddah)}} - \left(P_{\text{Farmgate (Gedaref)}} + T_{\text{Domestic Transport}} + C_{\text{Quarantine \& Port}} + F_{\text{Red Sea Freight}} + \text{Tariffs}\right)$$

| Component | Nature of Metric | Source / Methodology |
|---|---|---|
| **Gedaref Farmgate / Auction** | `[OBSERVED]` | Gedaref Crop Exchange daily closing spot lot (Tier A) |
| **Domestic Truck Freight** | `[OBSERVED]` | Port Sudan Freight Syndicate weekly container tariff |
| **Quarantine & Suakin Port Handling** | `[CALCULATED]` | Ministry of Agriculture statutory fee schedule |
| **Red Sea Vessel Charter Freight** | `[OBSERVED]` | Suakin-to-Jeddah bulk feeder shipping tariff |
| **Jeddah Wholesale Benchmark** | `[OBSERVED]` | Jeddah Central Food Wholesalers daily quote |
| **Net Exporter Gross Margin** | `[CALCULATED]` | Deterministic arithmetic spread |
| **Next-Month Seasonal Spread** | `[FORECAST]` | Machine learning model based on historical monsoon curves |

*Rule:* Zarati interfaces strictly demarcate `[OBSERVED]`, `[CALCULATED]`, and `[FORECAST]` metrics to prevent speculative projections from being mistaken for audited facts.
