# ZARATI | زرعتي — Foreign Exchange (FX) Normalization & Multi-Currency Strategy
**Subject:** Dual-Currency Architecture, Hyper-Inflation Resilience & Auditable Historical Anchors  
**Scope:** Sudanese Pound (SDG) $\leftrightarrow$ United States Dollar (USD) $\leftrightarrow$ Regional Currencies (SAR, AED)  
**Date Context:** September 2026  
**Document Ref:** `25. ZARATI_FX_NORMALIZATION_STRATEGY.md`

---

## 1. The Macroeconomic Reality: Navigating Extreme Currency Volatility

Between April 2023 and late 2026, the Sudanese Pound (SDG) suffered unprecedented depreciation:
* **Pre-Conflict Baseline (April 2023):** $\sim 570 - 600\text{ SDG / 1 USD}$.
* **Late 2024 Benchmark:** $\sim 1,800 - 2,400\text{ SDG / 1 USD}$.
* **September 2026 Reality:** $\sim 2,600 - 3,300\text{ SDG / 1 USD}$ on the parallel market, with domestic commercial inflation exceeding 150% annually `[VERIFIED FACT]`.

In such an economic environment, displaying commodity prices solely in nominal SDG produces complete historical distortion: a farmer's sorghum price might appear to have tripled over two years, while in real purchasing power terms, their net margin collapsed by 40% due to soaring diesel and imported fertilizer costs.

Conversely, forcing smallholder farmers to transact solely in USD is illegal under domestic currency laws and practically impossible in rural cash markets. 

**Zarati's Solution is an Auditable, Dual-Currency Normalization Engine.**

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           ZARATI FX NORMALIZATION PIPELINE                        │
│                                                                                   │
│  [OBSERVED PHYSICAL TRADE]                                                        │
│  Sorghum Auction in Gedaref: 450,000 SDG / Ardeb                                  │
│             │                                                                     │
│             ▼                                                                     │
│  [TIMESTAMPED FX CAPTURE]                                                         │
│  Parallel Rate on Sept 3, 2026: 3,000 SDG / 1 USD (Source: Parallel Median)      │
│  Official CBOS Rate on Sept 3, 2026: 1,980 SDG / 1 USD (Source: CBOS Bulletin)    │
│             │                                                                     │
│             ▼                                                                     │
│  [DUAL PERSISTENCE ENGINE]                                                        │
│  • Local Nominal Price: 450,000 SDG / Ardeb  (2,272,727 SDG / MT)                │
│  • USD Shadow Benchmark: $757.57 USD / MT   (Using 3,000 SDG/USD)                │
│  • Official Parity Metric: $1,147.84 USD / MT (Using 1,980 SDG/USD)              │
│             │                                                                     │
│             ▼                                                                     │
│  [IMMUTABLE CRYPTOGRAPHIC ARCHIVE]                                                │
│  FX rate locked forever to that observation ID. Never retroactively updated.      │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The Golden Law of Historical FX Immutability

> **THE GOLDEN LAW:**  
> **Never recalculate a historical USD commodity price using today's exchange rate.**
> 
> A sack of sorghum sold in September 2024 at 150,000 SDG when the exchange rate was 2,000 SDG/USD had a real purchasing power of **$75.00 USD**.  
> If an algorithm retroactively evaluates that 2024 transaction using the September 2026 rate of 3,000 SDG/USD, the historical price falsely appears as **$50.00 USD**, erasing 33% of the historical economic value and rendering all multi-year econometric trend lines fraudulent.

Every historical price in Zarati permanently locks the exact exchange rate vector captured at the moment of trade:
$$\text{USD Normalized Price}(t_0) = \frac{\text{Local Price}(t_0)}{\text{FX Rate}(t_0)}$$

---

## 3. Four Recognized Sudanese FX Methodologies

Zarati explicitly categorizes and labels every foreign exchange rate to prevent deceptive or ambiguous financial reporting:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    ZARATI FX METHODOLOGY TAXONOMY                            │
├──────────────────┬───────────────────────────────────────────────────────────┤
│ 1. OFFICIAL CBOS │ Central Bank of Sudan published indicative banking rate.  │
│    (cbos_official│ Used strictly for official government statistical filings │
│    _rate)        │ and statutory import tariff calculations.                 │
├──────────────────┼───────────────────────────────────────────────────────────┤
│ 2. COMMERCIAL    │ Average wire transfer rate quoted by licensed commercial  │
│    BANK RATE     │ banks (Faisal Islamic, Omdurman National, Bank of         │
│    (bank_rate)   │ Khartoum) for authorized documentary letters of credit.   │
├──────────────────┼───────────────────────────────────────────────────────────┤
│ 3. PARALLEL CASH │ Daily trimmed-mean of physical currency exchange houses   │
│    MEDIAN        │ operating in Port Sudan, Gedaref, and Atbara. Reflects   │
│    (parallel_cash│ the actual cash replacement cost of imported inputs.      │
│    _median)      │                                                           │
├──────────────────┼───────────────────────────────────────────────────────────┤
│ 4. BANKAK P2P    │ Clearing spread derived from peer-to-peer Bank of         │
│    SETTLEMENT    │ Khartoum (Bankak) digital account transfers versus physical│
│    (bankak_p2p   │ paper currency premiums. The dominant transactional rate   │
│    _spread)      │ for commercial grain traders.                             │
└──────────────────┴───────────────────────────────────────────────────────────┘
```

---

## 4. Persona-Specific Currency Presentation Rules

Zarati adapts its financial display logic dynamically to the needs and constraints of each persona:

### 4.1 Smallholder Farmer Experience
* **Default Display:** **SDG Native First** (e.g., `450,000 جنيه / إردب`).
* **Cognitive Load:** High-contrast, bold Arabic numerals.
* **Secondary Indicator:** Simple trend arrows showing whether real grain purchasing power (measured against local diesel/sugar baskets) increased or decreased, shielding farmers from complex FX jargon.

### 4.2 Commercial Trader & Exporter Experience
* **Default Display:** **Dual Currency (SDG / USD)** toggle on all spot bids and listings.
* **Corridor View:** Immediate real-time conversion between domestic auction closing prices in SDG and FOB Port Sudan export parity prices in USD/MT.

### 4.3 Government Minister & State Governor Command Center
* **Default Display:** **Dual-Track Reporting**.
* **Toggle Options:**
  - View national agricultural output in Official CBOS USD (for IMF / World Bank national account reporting).
  - View national output in Market Parity USD (for realistic food security import requirement costing).
* **Transparency Alert:** Prominent UI disclaimer: `"Computed using prevailing parallel market median of 3,000 SDG/USD as of 03-Sep-2026."`

### 4.4 Multilateral NGO & Institutional Donor Experience
* **Default Display:** **USD Normalized Standard ($ USD / Metric Ton)**.
* **Budget Tracking:** Direct export capabilities allowing humanitarian procurement teams (WFP, FAO) to compare local Sudan food basket procurement costs against international commodity import parity (Black Sea wheat / Indian rice).

---

## 5. PostgreSQL Schema for FX Rate Capture

```sql
CREATE TABLE public.fx_exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency TEXT NOT NULL DEFAULT 'USD',
  quote_currency TEXT NOT NULL, -- 'SDG', 'SAR', 'AED', 'EGP'
  official_rate NUMERIC(15,4),
  commercial_bank_rate NUMERIC(15,4),
  parallel_market_rate NUMERIC(15,4) NOT NULL,
  bankak_p2p_rate NUMERIC(15,4),
  source_provenance TEXT NOT NULL, -- 'suna_official', 'trader_survey', 'port_sudan_syndicate'
  captured_at TIMESTAMPTZ NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fx_currency_time ON public.fx_exchange_rates (quote_currency, captured_at DESC);
```
