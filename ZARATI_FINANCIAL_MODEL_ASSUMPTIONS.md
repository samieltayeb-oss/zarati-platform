# ZARATI | زرعتي — 5-Year Financial Model & Macroeconomic Assumptions
**Classification:** Financial Engineering, Unit Economics & Scenario Modeling  
**Timeline:** Year 1 (2027) through Year 5 (2031)  
**Currency Standard:** United States Dollars (USD)  
**Date Context:** September 2026  
**Document Ref:** `12. ZARATI_FINANCIAL_MODEL_ASSUMPTIONS.md`

---

## 1. Modeling Principles & Integrity Standards

1. **Zero Fabricated Historical Revenue:** Zarati acknowledges that all revenue projections are forward-looking scenario models. Zero prior commercial revenues are claimed.
2. **Grounded emerging-market procurement cycles:** Government (B2G) and multilateral (B2D) enterprise sales cycles are conservatively modeled at 6 to 12 months from initial engagement to contract signing.
3. **Foreign Exchange Insulation:** While operational expenses in Sudan occur in Sudanese Pounds (SDG), all commercial contracts with governments, UN agencies, and regional exporters are strictly denominated in United States Dollars (USD) or backed by sovereign letters of credit.

---

## 2. Five-Year Pro-Forma Income Statement (Base Case Scenario)

*All figures in Thousands of USD (\$000s):*

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ZARATI 5-YEAR PRO-FORMA FINANCIAL STATEMENT (BASE CASE)                                 │
├────────────────────────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┬───────────────────┤
│ Line Item                              │ Year 1 (2027)│ Year 2 (2028)│ Year 3 (2029)│ Year 4 (2030)│ Year 5 (2031)     │
├────────────────────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼───────────────────┤
│ REVENUE STREAMS:                       │              │              │              │              │                   │
│ • B2G Sovereign Licenses (Federal/State│ $220         │ $650         │ $1,400       │ $2,800       │ $4,500            │
│ • B2D Multilateral Aid Telemetry (UN)  │ $150         │ $450         │ $900         │ $1,600       │ $2,400            │
│ • B2B Marketplace Take-Rates (1.5%)    │ $85          │ $380         │ $1,150       │ $2,450       │ $4,800            │
│ • Enterprise Data Feeds & APIs         │ $45          │ $160         │ $420         │ $850         │ $1,550            │
│ • Implementation & Custom Integration  │ $110         │ $240         │ $480         │ $650         │ $800              │
├────────────────────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼───────────────────┤
│ TOTAL GROSS REVENUE                    │ $610         │ $1,880       │ $4,350       │ $8,350       │ $14,050           │
├────────────────────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼───────────────────┤
│ COST OF GOODS SOLD (COGS):             │              │              │              │              │                   │
│ • Cloud Hosting (Supabase, Vercel, AWS)│ ($42)        │ ($95)        │ ($180)       │ ($320)       │ ($480)            │
│ • Satellite Compute & STAC Processing  │ ($25)        │ ($65)        │ ($130)       │ ($210)       │ ($310)            │
│ • SMS & USSD Telco Gateway Fees        │ ($35)        │ ($110)       │ ($240)       │ ($420)       │ ($650)            │
│ • Field Agent Commissions & Quality Lab│ ($30)        │ ($90)        │ ($190)       │ ($340)       │ ($520)            │
├────────────────────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼───────────────────┤
│ GROSS PROFIT                           │ $478         │ $1,520       │ $3,610       │ $7,060       │ $12,090           │
│ Gross Margin (%)                       │ 78.4%        │ 80.9%        │ 83.0%        │ 84.6%        │ 86.0%             │
├────────────────────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼───────────────────┤
│ OPERATING EXPENSES (OPEX):             │              │              │              │              │                   │
│ • Core Engineering & Product R&D       │ ($480)       │ ($750)       │ ($1,150)     │ ($1,650)     │ ($2,200)          │
│ • Field Deployment & Farmer Success    │ ($210)       │ ($380)       │ ($620)       │ ($950)       │ ($1,400)          │
│ • Sales, B2G Gov Relations & BD        │ ($160)       │ ($320)       │ ($540)       │ ($820)       │ ($1,100)          │
│ • Legal, Sovereign Compliance & Audits │ ($95)        │ ($140)       │ ($180)       │ ($220)       │ ($280)            │
│ • General, Admin & Office Overhead     │ ($125)       │ ($190)       │ ($270)       │ ($360)       │ ($450)            │
├────────────────────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼───────────────────┤
│ TOTAL OPERATING EXPENSES               │ ($1,070)     │ ($1,780)     │ ($2,760)     │ ($4,000)     │ ($5,430)          │
├────────────────────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼───────────────────┤
│ EBITDA                                 │ ($592)       │ ($260)       │ +$850        │ +$3,060      │ +$6,660           │
│ EBITDA Margin (%)                      │ -97.0%       │ -13.8%       │ +19.5%       │ +36.6%       │ +47.4%            │
└────────────────────────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┴───────────────────┘
```

---

## 3. Comparative Scenario Analysis (Years 1–3)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    3-YEAR SCENARIO PROJECTION COMPARISON                     │
├──────────────────────────────┬───────────────┬───────────────┬───────────────┤
│ Metric                       │ Conservative  │ Base Case     │ Aggressive    │
├──────────────────────────────┼───────────────┼───────────────┼───────────────┤
│ Year 1 Revenue               │ $340,000      │ $610,000      │ $920,000      │
│ Year 2 Revenue               │ $980,000      │ $1,880,000    │ $3,100,000    │
│ Year 3 Revenue               │ $2,450,000    │ $4,350,000    │ $7,600,000    │
├──────────────────────────────┼───────────────┼───────────────┼───────────────┤
│ Month of Cash Breakeven      │ Month 31      │ Month 26      │ Month 20      │
├──────────────────────────────┼───────────────┼───────────────┼───────────────┤
│ Total 3-Year Capital Burn    │ ($1,620,000)  │ ($1,440,000)  │ ($1,150,000)  │
├──────────────────────────────┼───────────────┼───────────────┼───────────────┤
│ Registered Active Farmers Y3 │ 45,000        │ 120,000       │ 250,000       │
│ Verified Ag-Traders Y3       │ 450           │ 1,200         │ 2,500         │
│ Monitored Feddans Y3         │ 3.5 Million   │ 8.5 Million   │ 16.0 Million  │
└──────────────────────────────┴───────────────┴───────────────┴───────────────┘
```

---

## 4. Key Operating Assumptions & Sensitivity Stress-Testing

1. **Marketplace Gross Merchandise Value (GMV):**
   - Modeled at an average transaction size of \$28,000 USD (equivalent to $\sim 40\text{ MT}$ lot of white sesame or $70\text{ MT}$ lot of grain sorghum).
   - Take-rate modeled conservatively at **1.5%** charged to the commercial buyer upon escrow release.
2. **B2G Revenue Drivers:**
   - Base national platform contract with Federal MOAF: \$450,000 USD setup + \$150,000/yr support.
   - State ministry nodes (Gedaref, Kassala, River Nile): \$75,000 USD setup + \$35,000/yr support per state.
3. **Multilateral Donor Contracts:**
   - Modeled at \$150,000 USD/year per major UN program (FAO Emergency Agriculture Programme and WFP Local Food Procurement).
4. **Macro Sensitivity Stress-Test (Conflict Escalation):**
   - Even in an extreme downside shock where commercial marketplace trading in Khartoum and Gezira is 100% paralyzed, B2D humanitarian monitoring contracts in secure eastern states (Gedaref, Kassala, Red Sea) provide a resilient revenue floor of \$300,000+ annually.
