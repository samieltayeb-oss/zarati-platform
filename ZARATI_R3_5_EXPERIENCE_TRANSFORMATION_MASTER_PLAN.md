# ZARATI | زرعتي — Experience Transformation Master Plan (R3.5-A)
## Sovereign Agricultural Intelligence Infrastructure for Sudan

**Document Identifier:** `ZARATI-R3.5-A-ETMP-2026-09`  
**Phase:** R3.5-A — Experience Transformation / Design Intelligence  
**Mode:** Product & UX Architecture, Design System Engineering, Sovereign Institutional Framework  
**Scope:** GUI / GUX Redesign & Information Architecture Across Web, Mobile, and Command Infrastructure  
**Author:** Antigravity Multi-Agent Research & Design Intelligence Consortium  
**Governance Authority:** Founder & Executive Architecture Review  
**Date Context:** September 2026  
**Implementation Constraint:** Pure Architecture & Design Specification (No code modifications, no database changes, no migrations, no deployments)

---

## CRITICAL PRODUCT TRUTH BASELINE (TECHNICAL BOUNDARY REGISTER)

Before establishing any visual or interactive specification, the platform's immutable technical boundary is registered:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ZARATI TECHNICAL REALITY REGISTER                                │
├───────┬─────────────────────────────────────────────────┬──────────────┬─────────────────────────┤
│ PHASE │ DOMAIN & CAPABILITY                             │ STATUS       │ UI/UX REPRESENTATION    │
├───────┼─────────────────────────────────────────────────┼──────────────┼─────────────────────────┤
│ R1    │ Production Data Layer (Supabase, Postgres, RLS) │ CLOSED / LIVE│ Active Foundation       │
│ R2    │ Authentication & Security (RBAC, Rate Limiting) │ CLOSED / LIVE│ Active Security Gate    │
│ R3    │ Marketplace Discovery, Matching & RFQ Engine   │ CLOSED / LIVE│ Operational B2B Engine  │
│ R4    │ Market / Price / Weather Intelligence Feeds     │ NOT BUILT    │ Roadmapped / Coming Soon│
│ R5    │ Operations / Admin / Data Verification Desk     │ NOT BUILT    │ Roadmapped / Internal   │
│ R6    │ Gedaref Pilot Execution                         │ FROZEN       │ Planned Pilot Territory │
│ R7    │ Government / NGO National Command Center        │ NOT BUILT    │ Architectural Shell Only│
│ R8    │ Agronomic AI / Advisory Models                  │ NOT BUILT    │ Future Vision (Not Live)│
│ R9    │ SMS / USSD / Offline Mesh Sync Engine           │ NOT BUILT    │ Low-Bandwidth Prep Only │
│ R10   │ GIS / Satellite Remote-Sensing Ingestion        │ NOT BUILT    │ Geospatial Shell Only   │
└───────┴─────────────────────────────────────────────────┴──────────────┴─────────────────────────┘
```

> [!IMPORTANT]
> **THE ANTI-FABRICATION DIRECTIVE:**  
> Under no circumstances will any interface within ZARATI simulate, fabricate, or present mock data as live operational reality. Mock market prices, simulated weather telemetry, fake farmer counters, and unverified national statistics are strictly quarantined and marked with clear provenance labels (`DEMO DATA`, `PREVIEW`, `PLANNED`).

---

# SECTION 1: EXECUTIVE EXPERIENCE VISION

### 1.1 The Sovereign Mandate: Beyond Startup Aesthetics
ZARATI is not a consumer e-commerce shop, nor is it a Silicon Valley agritech pitch deck. It is Sudan’s **Sovereign Agricultural Intelligence Infrastructure**—the digital bedrock for the nation’s 3.2M to 4.2M farming households, commercial schemes spanning 24+ million cultivated feddans, regional commodity exchange floors, central banking clearinghouses, and international development institutions.

To achieve credibility with Federal Ministries, State Governors (*Walis*), the Agricultural Bank of Sudan (ABS), the World Bank, FAO, WFP, and commercial syndicates, ZARATI’s GUI/GUX must project:
* **Palantir-Grade Information Hierarchy:** Relational ontologies where spatial geography, commodity lots, auction clearing, and transport corridors interconnect seamlessly.
* **Stripe-Grade Visual Precision:** Mathematical 4px/8px spacing, razor-sharp 1px structural borders, tabular data density, and flawless status demarcation.
* **Linear-Grade Interaction Velocity:** Sub-100ms micro-transitions, zero cumulative layout shift (CLS), keyboard command navigation, and zero ornamental friction.
* **Apple-Grade Restraint:** Generous macro-whitespace framing dense analytical micro-components, quiet typography, and deep respect for user attention.
* **World Bank / FAO Institutional Authority:** Sober analytical prose, transparent data provenance, explicit statistical confidence intervals, and zero unverified marketing hype.

### 1.2 Dual-Audience Architectural Harmony
The visual architecture bridges two divergent user realities:
1. **The Sovereign & Institutional War-Room:** High-density, multi-pane situational awareness for ministers, analysts, and traders operating on multi-monitor 4K displays or laptops with fast internet.
2. **The High-Glare, Low-Bandwidth Field Reality:** Large-target, high-contrast, audio-supported, vernacular Arabic interfaces engineered for smallholders and local grain brokers (*Dallaleen*) operating Tecno/Infinix smartphones under 100,000 lux desert sunlight and spotty 2G/3G connectivity.

---

# SECTION 2: CURRENT UI AUDIT & DEFECT CATALOG

A comprehensive forensic audit of the existing codebase (`app/`, `components/`, `lib/`) reveals 12 major structural, visual, and communicative deficiencies:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CURRENT UI DEFICIENCY AUDIT                                          │
├────┬───────────────────────┬───────────────────────────────────────────┬───────────────────────────────┤
│ #  │ LOCATION              │ IDENTIFIED DEFECT                         │ SEVERITY & IMPACT             │
├────┼───────────────────────┼───────────────────────────────────────────┼───────────────────────────────┤
│ 01 │ `home/hero-section`   │ Fabricated live counters: "1,250 Farmers, │ **CRITICAL (P0)**             │
│    │ lines 20–25           │ 32° Avg Temp, 48 Facilities, +12.5k Ha"   │ Destroys institutional trust. │
├────┼───────────────────────┼───────────────────────────────────────────┼───────────────────────────────┤
│ 02 │ `home/crop-snapshot`  │ Hardcoded simulated crop prices presented │ **CRITICAL (P0)**             │
│    │ & `crops/page.tsx`    │ as real-time market movements.            │ Misleads commercial traders.  │
├────┼───────────────────────┼───────────────────────────────────────────┼───────────────────────────────┤
│ 03 │ `home/weather-snapshot│ Hardcoded city weather data with fake     │ **CRITICAL (P0)**             │
│    │ & `weather/page.tsx`  │ forecasts and generic weather emojis.     │ R4 capability faked in R3.    │
├────┼───────────────────────┼───────────────────────────────────────────┼───────────────────────────────┤
│ 04 │ `home/ai-preview`     │ "Meet Your AI Farm Advisor" marketing     │ **CRITICAL (P0)**             │
│    │                       │ hype for R8 capability that is not built. │ Violates Claims Governance.   │
├────┼───────────────────────┼───────────────────────────────────────────┼───────────────────────────────┤
│ 05 │ `en.json` / `ar.json` │ Consumer SaaS copy: "Get Started Free",   │ **HIGH (P1)**                 │
│    │                       │ "No credit card required" in Sudan!       │ Western template cliché.      │
├────┼───────────────────────┼───────────────────────────────────────────┼───────────────────────────────┤
│ 06 │ Throughout all views  │ Emoji overload (`🌾`, `🚜`, `🌱`, `🧪`,    │ **HIGH (P1)**                 │
│    │                       │ `📋`, `🔔`, `💬`, `➕`, `🛒`, `👨‍🌾`, `🇸🇩`)│ Degrades sovereign gravitas.  │
├────┼───────────────────────┼───────────────────────────────────────────┼───────────────────────────────┤
│ 07 │ `components/maps/`    │ Static SVG map with hardcoded fake temps  │ **HIGH (P1)**                 │
│    │ `SudanMap.tsx`        │ (`Khartoum 34°C`) and no spatial depth.   │ Missed signature asset chance.│
├────┼───────────────────────┼───────────────────────────────────────────┼───────────────────────────────┤
│ 08 │ `marketplace-client`  │ Generic card layouts lacking B2B bulk     │ **HIGH (P1)**                 │
│    │                       │ commodity fields (Grade, Moisture, Bags). │ Cannot support bulk trade.    │
├────┼───────────────────────┼───────────────────────────────────────────┼───────────────────────────────┤
│ 09 │ `farmer-dashboard`    │ 5-step form requiring English titles and  │ **HIGH (P1)**                 │
│    │                       │ manual text entry for unit strings.       │ Unusable for rural farmers.   │
├────┼───────────────────────┼───────────────────────────────────────────┼───────────────────────────────┤
│ 10 │ `overview/page.tsx`   │ Generic dashboard template with fake alert│ **MEDIUM (P2)**               │
│    │                       │ counters (3 alerts, 2 messages).          │ Shallow prototype feel.       │
├────┼───────────────────────┼───────────────────────────────────────────┼───────────────────────────────┤
│ 11 │ `about/page.tsx`      │ Startup value cards with emoji icons      │ **MEDIUM (P2)**               │
│    │                       │ lacking institutional & governance depth. │ Fails NGO/Gov credibility.    │
├────┼───────────────────────┼───────────────────────────────────────────┼───────────────────────────────┤
│ 12 │ `app/globals.css`     │ Low contrast outdoor text (`#757575`) and │ **HIGH (P1)**                 │
│    │                       │ missing Arabic-specific line-heights.     │ Fails outdoor sunlight test.  │
└────┴───────────────────────┴───────────────────────────────────────────┴───────────────────────────────┘
```

---

# SECTION 3: COMPETITIVE & REFERENCE RESEARCH

### 3.1 Sovereign & Institutional Benchmarks
1. **Estonia e-Gov / X-Road:** Decentralized data exchange layer; immutable cryptographic audit ledgers; zero decorative clutter; deterministic task completion.
2. **UK Government Digital Service (GDS):** Strict phase badges (`ALPHA`, `BETA`, `OFFICIAL`); clear language; high contrast; statistical releases accompanied by methodology notes.
3. **Singapore GovTech (SGDS / CODEX):** Top sovereign trust verification banner; 4-tier data classification (`UNCLASSIFIED`, `RESTRICTED`, `CONFIDENTIAL`); live ingestion latency telemetry.
4. **India AgriStack (IDEA):** 3-pillar spatial registry: Farmer Registry, Geo-referenced Cadastral Farm Plots, and Seasonal Crop Sown Survey; clear hierarchical rollups.
5. **World Bank / FAO Hand-in-Hand (HiH):** Multi-spectral remote sensing layer stack; transparent layer provenance cards with spatial resolution and sensor metadata.
6. **WFP VAM & HungerMap LIVE:** Standardized IPC 5-phase food security chromatic spectrum; explicit sample sizes ($n$) and statistical confidence intervals ($\pm X\%$).

### 3.2 Product Design & Interaction Benchmarks
1. **Stripe:** High-density financial data tables, 1px structural borders, label-to-value optical ratios ($0.65 - 0.75$), tabular numerals.
2. **Linear:** Sub-100ms transitions, keyboard-driven navigation (`⌘K` command palette), monochromatic discipline with status-only accent colors, zero layout shift.
3. **Apple:** Restrained typography scale, expansive macro-whitespace framing dense operational modules, human-first clarity.
4. **Physical Commodity Exchanges (AFEX, ECX, Chicago Board of Trade):** Electronic Warehouse Receipts (e-WRs), grade purity parameters, moisture thresholds, dual-currency pricing (domestic currency vs USD metric ton parity), pre-settlement sampling gates.

### 3.3 African AgriTech Failure Modes & "What Zarati Must NOT Do"
* **DO NOT** own physical truck fleets or cold storage warehouses (The Twiga Capex Trap).
* **DO NOT** construct physical concrete grain silos (The AFEX Infrastructure Burden); leverage existing auction floors in Gedaref, El Obeid, and Sennar.
* **DO NOT** lend from Zarati’s balance sheet (The Apollo Credit Default Trap); provide data-only underwriting to partner banks under Islamic *Salam* financing.
* **DO NOT** force farmers into desktop SaaS onboarding with passwords and email addresses.
* **DO NOT** rely on continuous 4G/5G connectivity; engineer for offline-first IndexedDB caching.

---

# SECTION 4: CORE DESIGN PRINCIPLES

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 THE SIX SOVEREIGN DESIGN PRINCIPLES                              │
├──────────────────────────┬───────────────────────────────────────────────────────────────────────┤
│ 1. INSTITUTIONAL GRAVITAS│ Every screen must look like a sovereign national operating system,    │
│    OVER STARTUP HYPE     │ not a venture capital pitch deck. Zero gradients, zero emojis.        │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ 2. SCIENTIFIC & FORENSIC │ Disclose data sources, sensor resolutions, collection timestamps,     │
│    PROVENANCE TRUTH      │ and statistical confidence intervals. Never present estimates as fact.│
├──────────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ 3. ARABIC-FIRST COGNITIVE│ Design from the right-to-left optical flow. Respect Arabic vertical   │
│    ERGONOMICS            │ rhythm (1.5x-1.65x line-height) and absolute zero letter-spacing.     │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ 4. HIGH-GLARE SUN-PROOF  │ All text must achieve WCAG AAA contrast (minimum 12:1). Thick 2px     │
│    FIELD LEGIBILITY      │ structural card borders to cut through 100,000 lux desert sunlight.   │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ 5. COMMODITY REALISM &   │ Physical lots require moisture %, quality grade, packaging type, and  │
│    COMMERCIAL HONESTY    │ customary Sudanese units (Feddan, Ardeb, Qintar, Hawasha).            │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ 6. PROGRESSIVE DISCLOSURE│ 3-stage visual architecture: 30,000-ft executive overview ->          │
│    WITHOUT CONTEXT LOSS  │ diagnostic drilldown -> atomic record dossier. Zero disruptive jumps. │
└──────────────────────────┴───────────────────────────────────────────────────────────────────────┘
```

---

# SECTION 5: BRAND EVOLUTION & VISUAL IDENTITY

### 5.1 The Authentic Geographic Palette
ZARATI's color palette is grounded in Sudan's physical geography:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   SUDAN GEOGRAPHIC PALETTE TOKENS                                │
├───────────────────┬──────────────┬──────────────┬────────────────────────────────────────────────┤
│ COLOR NAME        │ HEX CODE     │ TOKEN        │ GEOGRAPHIC ORIGIN & INSTITUTIONAL PURPOSE      │
├───────────────────┼──────────────┼──────────────┼────────────────────────────────────────────────┤
│ Al-Muqran Blue    │ `#0F4C81`    │ `--za-blue-8`│ Confluence of White & Blue Nile at Khartoum.   │
│ Deep River Trench │ `#082846`    │ `--za-blue-9`│ Sovereign war-room backdrop, executive dark.   │
│ Clay Vertisol     │ `#2D241E`    │ `--za-clay-9`│ Gedaref/Gezira black cracking smectite soil.   │
│ Terracotta Silt   │ `#4A3B32`    │ `--za-clay-7`│ Alluvial scheme silt, high-contrast borders.   │
│ Golden Sesame     │ `#D4AF37`    │ `--za-gold-5`│ Harvested export-grade white sesame.           │
│ Acacia Amber      │ `#C2922E`    │ `--za-gold-7`│ Kordofan Hashab Gum Arabic tear.               │
│ Sorghum Canopy    │ `#1E5631`    │ `--za-gree-9`│ Rainfed Feterita/Tabat dense vegetative canopy.│
│ Active Zarati Grn │ `#2E7D32`    │ `--za-gree-7`│ Gezira irrigated flora, primary action green.  │
│ Nubian Sandstone  │ `#E8D8B8`    │ `--za-sand-4`│ Northern State bedrock, warm neutral accent.   │
│ Parchment Sheet   │ `#F5EFEB`    │ `--za-sand-1`│ Executive white background, non-glare surface. │
└───────────────────┴──────────────┴──────────────┴────────────────────────────────────────────────┘
```

### 5.2 Elimination of Orientalist Tourism Tropes
* **BANNED:** Meroe pyramids, camel caravans in sand dunes, folkloric dancers, sepia desert sunsets, mud huts, generic European farmer stock photos.
* **MANDATORY SOVEREIGN MOTIFS:** Corrugated steel grain silos (Gedaref / Rabak), concrete sluice gates and intake regulators (Sennar Dam, Roseires), tractor implements turning cracking clay vertisols, sesame windrows (*Muswaqa*) drying in straight lines, diesel river barges, real Sudanese agronomists using digital moisture meters, Wad Madani Agricultural Research Corporation (ARC) clean laboratories.

---

# SECTION 6: TYPOGRAPHY ARCHITECTURE

### 6.1 Font Pairing Strategy
* **Sovereign Display Font (Headlines, Hero, Big Metrics):** **Cairo** (`weights: 700, 800`). Modern geometric Arabic with commanding institutional authority.
* **Primary Enterprise UI & Tables Font:** **IBM Plex Sans Arabic** (`weights: 400, 500, 600, 700`). Engineered for technical density, open counters at tiny sizes (11px–13px), zero vertical baseline drop, and identical proportions to IBM Plex Latin.
* **Data & Financial Monospace Font:** **JetBrains Mono** or **IBM Plex Mono** (`font-variant-numeric: tabular-nums`). Guarantees zero horizontal jitter during live price ticking.
* **Formal Sovereign Decrees & Certifications:** **Amiri** (`weight: 700`). Quarantined exclusively for official ministerial charters and inspection certificates.

### 6.2 The Two Inviolable Arabic Typography Rules
1. **The Arabic Line-Height Multiplier Rule:** Standard Latin line-heights ($1.2 - 1.3$) cause clipping of Arabic diacritics (*Tashkeel*, *Hamza*) and dot collisions. Arabic text requires a **$1.45\times \text{ to } 1.65\times$ line-height** relative to font size.
2. **The Zero Letter-Spacing Rule:** Positive letter-spacing (`tracking-wider`) in Arabic breaks the cursive ligatures (*al-Wasl*), physically tearing words apart. Letter-spacing on all Arabic elements must be strictly **`0`**.

### 6.3 Complete Typography Scale

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              ZARATI SOVEREIGN TYPE SCALE                               │
├─────────────┬───────────┬──────────────────────┬─────────────┬────────┬────────────────┤
│ TOKEN       │ SIZE      │ FONT FAMILY          │ ARABIC LH   │ WEIGHT │ USAGE          │
├─────────────┼───────────┼──────────────────────┼─────────────┼────────┼────────────────┤
│ display-2xl │ 56px/3.5r │ Cairo                │ 1.15 (64px) │ 800    │ Sovereign Hero │
│ display-xl  │ 44px/2.75r│ Cairo                │ 1.20 (52px) │ 700    │ Command H1     │
│ display-lg  │ 36px/2.25r│ Cairo                │ 1.25 (45px) │ 700    │ Section Header │
│ heading-lg  │ 28px/1.75r│ IBM Plex Sans Arabic │ 1.35 (38px) │ 700    │ State Panels   │
│ heading-md  │ 22px/1.37r│ IBM Plex Sans Arabic │ 1.40 (31px) │ 600    │ Market Ticker  │
│ heading-sm  │ 18px/1.12r│ IBM Plex Sans Arabic │ 1.45 (26px) │ 600    │ Card Title/TH  │
│ body-lg     │ 16px/1.0r │ IBM Plex Sans Arabic │ 1.60 (26px) │ 400    │ Reports/Dossier│
│ body-md     │ 14px/0.87r│ IBM Plex Sans Arabic │ 1.55 (22px) │ 400    │ Standard UI/TD │
│ body-sm     │ 13px/0.81r│ IBM Plex Sans Arabic │ 1.50 (20px) │ 400    │ Meta/Captions  │
│ caption     │ 12px/0.75r│ IBM Plex Sans Arabic │ 1.45 (18px) │ 500    │ Axis/Tags      │
│ micro       │ 11px/0.68r│ IBM Plex Sans Arabic │ 1.40 (16px) │ 600    │ Status Badges  │
└─────────────┴───────────┴──────────────────────┴─────────────┴────────┴────────────────┘
```

---

# SECTION 7: COLOR & SURFACE SYSTEM

```css
/* Canonical Design Tokens (design-system/tokens.css extension) */
:root {
  /* Surfaces */
  --za-surface-canvas:      #FAF7F2;  /* Nubian parchment light */
  --za-surface-card:        #FFFFFF;  /* Crisp structural card */
  --za-surface-elevated:    #F5EFEB;  /* Warm secondary container */
  --za-surface-dark-canvas: #082846;  /* Nile trench war-room base */
  --za-surface-dark-card:   #0D365C;  /* Elevated command container */

  /* Borders */
  --za-border-subtle:       #E8D8B8;  /* Sandstone structural line (1px) */
  --za-border-strong:       #4A3B32;  /* Vertisol boundary line (1px/2px) */
  --za-border-dark:         #154B78;  /* High-contrast dark border */

  /* Status Colors (Sovereign Semantic) */
  --za-status-verified:     #1E5631;  /* Verified canopy green */
  --za-status-pending:      #C2922E;  /* Review / In-negotiation amber */
  --za-status-critical:     #991B1B;  /* Expired / Distress / Famine red */
  --za-status-informational:#0F4C81;  /* Nile blue institutional note */

  /* Telemetry Spectral Scales */
  --za-ndvi-high:           #1E5631;  /* Dense canopy (>0.65) */
  --za-ndvi-mod:            #C2922E;  /* Moderate canopy (0.35-0.50) */
  --za-ndvi-stress:         #B71C1C;  /* Severe wilting (<0.20) */
  
  --za-moisture-opt:        #00897B;  /* Field capacity (45-70%) */
  --za-moisture-dry:        #E65100;  /* Cracking drought (<20%) */
}
```

---

# SECTION 8: GLOBAL NAVIGATION ARCHITECTURE

### 8.1 Information Architecture & Phase Status Mapping
The global navigation reflects real technical capabilities while maintaining a unified institutional structure:

```
ZARATI SOVEREIGN NAVIGATION ARCHITECTURE
├── 01. Overview [LIVE]
│   ├── National Agricultural Situation (Sovereign Baseline)
│   ├── Production Belts Geography
│   └── System Capabilities & Governance
├── 02. Marketplace [LIVE — R3]
│   ├── Commodity Discovery (Crops, Grades, States)
│   ├── Bulk Listing Register
│   └── RFQ & Mutual Contact Handover
├── 03. Agricultural Intelligence [R4 — COMING SOON / PREVIEW SHELL]
│   ├── Gedaref Spot Ticker (Preview / Methodology Only)
│   ├── Agro-Ecological Rainfall & Weather (Planned R4-B)
│   └── Cereal Price Historical Benchmarks (WFP/FAO Data Citations)
├── 04. Agricultural Production Belts [INFORMATIONAL / GEOGRAPHY]
│   ├── The Irrigated Schemes (Gezira, Rahad, New Halfa)
│   ├── The Semi-Mechanized Rainfed Belt (Gedaref, Blue Nile)
│   └── The Traditional Rainfed Belt (Kordofan, Darfur)
├── 05. National Command Center [R7 — INSTITUTIONAL SHELL]
│   ├── Sovereign Food Balance Sheet (Structural Mock / Restricted)
│   ├── Spatial Situation Room (18 Wilayat Vector Map)
│   └── Strategic Grain Silo Reserve Monitor (Restricted)
├── 06. My Workspace [ROLE-GATED AUTH — R2/R3]
│   ├── Farmer Dashboard (My Listings, Received RFQs, 3-Tap Form)
│   └── Trader Dashboard (Market Discovery, Sent RFQs, Contact Reveal)
└── 07. Institutional & Governance [LIVE]
    ├── Data Provenance & Claims Governance Charter
    ├── About the Infrastructure & Partnership Network
    └── Security, Auditability & Privacy Protections
```

---

# SECTION 9: HOMEPAGE TRANSFORMATION ARCHITECTURE

The homepage is transformed from a generic startup landing page into a **National Sovereign Digital Platform**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             ZARATI HOMEPAGE TRANSFORMATION BLUEPRINT                             │
├──────────────────────┬───────────────────────────────────────────────────────────────────────────┤
│ SECTION              │ CONTENT & ARCHITECTURAL EXECUTION                                         │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 01. Sovereign Header │ Official Republic of the Sudan banner; language toggle (العربية / English);│
│     & Top Bar        │ Live system latency indicator (DB: 32ms); Security Level: UNCLASSIFIED.   │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 02. Sovereign Hero   │ Headline: "ZARATI — Sudan's Agricultural Intelligence Infrastructure"     │
│                      │ Arabic: "زرعتي — البنية التحتية للذكاء الزراعي والسيادة الغذائية في السودان"│
│                      │ Interactive Sudan Agro-Map with live Nile vectors and scheme highlights.  │
│                      │ Dual CTAs: [Explore Marketplace] (Primary) and [Examine Architecture].    │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 03. National Ground  │ Honest, verified context on Sudan's agro-economy (24M cultivated feddans, │
│     Reality Briefing │ 60-80% population agricultural dependency, post-conflict food security).  │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 04. Technical Reality│ 10-Phase Capabilities Matrix clearly demarcating what is LIVE (R1-R3),    │
│     Register         │ PLANNED (R4-R7), and VISION (R8-R10). Zero fabricated claims.             │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 05. B2B Marketplace  │ Live feed of verified bulk commodity listings (Grade 1 Sesame, Feterita   │
│     Discovery        │ Sorghum, Gum Arabic) with moisture %, location, and dual SDG/USD pricing. │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 06. The 3 Production │ Interactive visual walkthrough: Irrigated Schemes vs Semi-Mechanized     │
│     Belts            │ Rainfed (Gedaref) vs Traditional Qoz Smallholders.                        │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 07. Sovereign Command│ Architectural preview shell of the National Food Balance Situation Room   │
│     Center Preview   │ with explicit [PLANNED FOR R7 // INSTITUTIONAL PARTNERS ONLY] banner.    │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 08. Field Experience │ Dual persona breakdown: Simple 3-Tap vernacular flow for Farmers;         │
│     Architecture     │ Bloomberg-grade faceted discovery & RFQ contact reveal for Traders.       │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 09. Trust & Data     │ Data Source Badges (SSMO, Gedaref Exchange, ESA Sentinel-2, WFP VAM),     │
│     Provenance Engine│ Privacy-preserving RFQ bilateral release protocol, security audit logs.   │
├──────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 10. Institutional CTA│ Direct pathways: Register as Producer (Farmer), Register as Certified     │
│                      │ Trader, or Request Institutional Intelligence Access (Ministries / NGOs). │
└──────────────────────┴───────────────────────────────────────────────────────────────────────────┘
```

---

# SECTION 10: SIGNATURE SUDAN MAP EXPERIENCE

The Sudan Agricultural Map in `components/maps/SudanMap.tsx` is transformed into ZARATI’s signature visual asset:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 SIGNATURE SUDAN MAP ARCHITECTURE                                 │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. BOUNDARY ACCURACY                                                                             │
│ • Official post-2011 international borders (geoBoundaries SDN ADM0).                             │
│ • All 18 Wilayat administrative boundary lines rendered with crisp 1px stroke (`#4A3B32`).       │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. HYDROLOGICAL CORRIDORS (VECTOR BEZIER NETWORKS)                                               │
│ • Blue Nile (`#1565C0`): Volcanic sediment gradient flowing from Roseires -> Sennar -> Khartoum.│
│ • White Nile (`#42A5F5`): Alkaline gentle gradient flowing from South Sudan border -> Khartoum. │
│ • Main Nile: Combined flow through Sabaloka Gorge -> Shendi -> Atbara -> Nubian Great Bend.     │
│ • Seasonal Rivers (Khors/Wadis): Khor el-Gash (Kassala) and Baraka Delta (Tokar) pulsing vector. │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. AGRO-ECOLOGICAL BELT OVERLAYS (SELECTABLE CHOROPLETH MODES)                                   │
│ • Irrigated Schemes Layer: High-density polygon mesh (Gezira 2.2M feddans, Rahad, New Halfa).   │
│ • Semi-Mechanized Rainfed Grid: Orthogonal 500-feddan block styling across Gedaref & Blue Nile.  │
│ • Spate Flood Recession: Organic alluvial fans in Tokar and Gash Deltas.                        │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. INTERACTION & TELEMETRY CONTROLS                                                              │
│ • Interactive State Hover: Displays Wilaya Name, Main Agricultural Belt, and Verified Crops.     │
│ • Dekad Scrubber Pill: 10-day seasonal playback slider (May to November Kharif cycle).           │
│ • Zero Fake Numbers: Remove all hardcoded temps (`Khartoum 34°C`). Replace with geographical     │
│   attributes until R4 live API integration.                                                      │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# SECTION 11: FARMER USER EXPERIENCE (FIELD-READY)

### 11.1 The "3-Tap" Visual Listing Engine
The current 5-step form in `farmer-dashboard-client.tsx` is replaced with a single-screen, pictorial flow:
1. **Tap 1 — Crop Selection Grid:** Large photographic cards with bold Sudanese names (`ذرة طابت`, `ذرة فتريتة`, `سمسم أبيض قضارفي`, `فول سوداني`).
2. **Tap 2 — Customary Unit Stepper:** Native units (`شوال`, `إردب`, `قنطار`, `طن`) with quick-select presets (`100`, `250`, `500`, `1,000`).
3. **Tap 3 — Harvest Stage & Storage:** (`قائم في الحقل`, `محصود ومكدس حلايق`, `معبأ في جوالات خيش`, `مخزن في صومعة/مطمورة`).
4. **Vernacular Audio Description:** Hold-to-record voice note button (`🎙️ سجّل وصف المحصول بصوتك`) encoded client-side to low-bitrate Opus ($<15\text{ KB}$).
5. **Sticky Bottom Action:** Full-width 56px touch target (`🟢 حفظ ونشر الإعلان`).

### 11.2 High-Glare Sun-Proof Mode
* Text rendered in Stark Black (`#0A0A0A`, 19.8:1 contrast ratio).
* Heavy 2px solid borders (`#111827`) on all cards to cut through screen glare.
* Elimination of all subtle grays (`#9CA3AF`) and light pastel fills.

---

# SECTION 12: TRADER USER EXPERIENCE (MARKET DISCOVERY)

* **Fast Faceted Filtering:** Multi-select taxonomy for Crop, Quality Grade (Grade 1 Export, Grade 2 Standard), Origin State, Packaging, and Volume bracket ($<25\text{ MT}$, $25\text{--}100\text{ MT}$, $>100\text{ MT}$).
* **Dual-Currency Financial Toggle:** Instant conversion between domestic currency (`SDG / قنطار`) and international export parity (`$ USD / Metric Ton`).
* **Structured RFQ Negotiation:** Form inputs for Target Quantity, Proposed Unit Price, Delivery Terms (Ex-Warehouse vs Delivered Port Sudan), and optional laboratory inspection conditions.
* **Negotiation Countdown Telemetry:** 7-day TTL countdown badge on accepted inquiries to maintain operational urgency.

---

# SECTION 13: MARKETPLACE REDESIGN & CARD ANATOMY

The "Bloomberg-Grade Commodity Card" replaces generic e-commerce tiles:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [🌾 سمسم أبيض قضارفي — درجة أولى للتصدير]                                   [✓ موثق من الهيئة]   │
│ ولاية القضارف — سوق محاصيل القضارف (مستودع المروة #14)                                           │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ الكمية المعروضة          الحد الأدنى للطلب         نسبة الرطوبة          نوع التعبئة             │
│ 100 طن متري             25 طن (شاحنة نصف مقطورة)  5.2% (معتمد)          خيش هندي جديد (100 كجم)  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ السعر المطلوب:                                                                                   │
│ 420,000 ج.س / قنطار                                    ~$3,110 USD / Metric Ton                  │
│ [السعر استرشادي — قابل للتفاوض]                        (مؤشر الصرف الموازي: 3,000 ج.س / دولار)   │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [📄 فحص الهيئة السودانية للمواصفات (SSMO)]              [تقديم طلب تسعير وشراء (RFQ) →]          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# SECTION 14: INSTITUTIONAL EXPERIENCE SHELL (R7 PREVIEW)

An executive war-room interface for Federal Ministries and multilateral partners:
* **Prominent Status Banner:** `[ ARCHITECTURAL PREVIEW // RESTRICTED ACCESS — PLANNED FOR R7 ]`.
* **National Cereal Balance Sheet:** Structural metrics tracking domestic production vs national caloric demand.
* **Corridor Transit Monitor:** Telemetry monitoring grain transit latency along the critical lifeline: Gedaref $\rightarrow$ Wad Madani $\rightarrow$ Port Sudan.
* **Audit Ledger Verification:** Cryptographic audit trail confirming all data queries are signed and recorded.

---

# SECTION 15: DATA TRUST & PROVENANCE SYSTEM

Every data point on ZARATI must carry an inspectable provenance badge:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               PROVENANCE CLASSIFICATION ARCHITECTURE                             │
├─────────────────────────┬────────────┬───────────────────────────────────────────────────────────┤
│ BADGE TYPE              │ COLOR      │ MEANING & EVIDENCE STANDARD                               │
├─────────────────────────┼────────────┼───────────────────────────────────────────────────────────┤
│ [✓ VERIFIED ON-SITE]    │ Dark Green │ Physically inspected at licensed weighbridge / warehouse. │
├─────────────────────────┼────────────┼───────────────────────────────────────────────────────────┤
│ [🛰️ SATELLITE DERIVED]  │ River Blue │ Derived from ESA Sentinel-2 / CHIRPS with CI disclosure.  │
├─────────────────────────┼────────────┼───────────────────────────────────────────────────────────┤
│ [🏛️ INSTITUTIONAL DATA]  │ Slate Grey │ Official ministerial release with publication date.       │
├─────────────────────────┼────────────┼───────────────────────────────────────────────────────────┤
│ [⚖️ ESTIMATED FORECAST]  │ Amber Gold │ Econometric model with sample size ($n$) and margin error.│
├─────────────────────────┼────────────┼───────────────────────────────────────────────────────────┤
│ [⚠️ DEMO / PROTOTYPE]   │ Purple     │ Educational placeholder. Explicitly not real.             │
└─────────────────────────┴────────────┴───────────────────────────────────────────────────────────┘
```

---

# SECTION 16: MOTION SYSTEM SPECIFICATION

Motion in ZARATI communicates system state and physical reality, not entertainment:
* **Durations & Easings:** Default `150ms` using `cubic-bezier(0.16, 1, 0.3, 1)` (Linear-style deceleration).
* **Map Transitions:** Smooth fly-to animations between Wilayat ($600\text{ms}$).
* **Telemetry Tickers:** Numbers transition via a mechanical slot-machine roll without horizontal width jitter.
* **Bilateral Acceptance:** "Slide-to-Accept" gesture with haptic feedback vibration on mobile.
* **Accessibility:** Full compliance with `prefers-reduced-motion: reduce` (all animation durations set to $0.01\text{ms}$).

---

# SECTION 17: ARABIC & RTL SYSTEM SPECIFICATION

1. **Western Arabic Numerals (`0-9`):** Universal standard in Sudanese banking (Bankak), commodity exchanges (Gedaref), and telecommunications.
2. **Bidirectional Isolation:** All numeric strings, telephone numbers (`+249...`), dates, and currencies must be wrapped in `<bdi dir="ltr">` elements to prevent punctuation inversion.
3. **Table Alignment Rules:** Text columns aligned to the **Right**; numeric columns aligned to the **Right** with `font-variant-numeric: tabular-nums`; technical IDs aligned to the **Left (LTR)**; status badges **Centered**.
4. **Icon Mirroring:** Directional chevrons and step arrows flip horizontally in RTL; clocks, search magnifying glasses, and media controls remain unmirrored.

---

# SECTION 18: MOBILE SYSTEM SPECIFICATION

* **Thumb-Zone Ergonomics:** Fixed 72px sticky bottom action bar containing primary actions within one-handed thumb reach.
* **Minimum Touch Targets:** `56px` height for primary buttons, `48px` for secondary controls, `12px` minimum spacing to prevent miss-taps on cracked screens.
* **Low-Bandwidth Budget:** Core bundle $<100\text{ KB}$ gzipped; zero remote web fonts; client-side image compression to $<180\text{ KB}$ WebP before upload.
* **Offline IndexedDB Store:** Optimistic local creation with clear status badges (`⏳ Saved locally — waiting for network`).

---

# SECTION 19: ACCESSIBILITY SPECIFICATION (WCAG 2.2 AA / AAA)

* **Contrast Ratios:** Minimum 7:1 for all body copy; 19.8:1 in Sun-Proof Field Mode.
* **Keyboard Navigation:** Full focus rings (`focus-visible:ring-2 focus-visible:ring-primary`); logical Tab order across RTL layouts.
* **Screen Reader Optimization:** Proper `aria-label` tags localized into Arabic; semantic HTML tables with `scope="col"` and `scope="row"`.
* **Form Error States:** Inline text messages accompanied by distinct error icons (never color alone).

---

# SECTION 20: DEMO DATA AUDIT & DEFLATION REGISTER

Every current claim and simulated datum across the platform is audited and assigned an exact replacement treatment:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DEMO DATA DEFLATION REGISTER                                     │
├──────────────────────┬─────────────┬─────────────┬───────────────────────────────────────────────┤
│ CURRENT CLAIM / DATA │ FILE        │ STATUS      │ MANDATORY REPLACEMENT TREATMENT               │
├──────────────────────┼─────────────┼─────────────┼───────────────────────────────────────────────┤
│ "1,250 Farmers"      │ `hero-      │ MISLEADING  │ REMOVE. Replace with: "24M Cultivated Feddans │
│ "48 Facilities"      │  section`   │             │ Under Monitored Production (National Baseline)│
├──────────────────────┼─────────────┼─────────────┼───────────────────────────────────────────────┤
│ "32° Avg Temp"       │ `hero-      │ MISLEADING  │ REMOVE. Replace with geographical belt labels:│
│ "+12,500 Hectares"   │  section`   │             │ "Rainfed Mechanized | Irrigated | Spate".     │
├──────────────────────┼─────────────┼─────────────┼───────────────────────────────────────────────┤
│ Real-Time Crop       │ `crop-      │ SIMULATED   │ Re-label table header: "[HISTORICAL FAO/WFP   │
│ Prices Table         │  snapshot`  │             │ BENCHMARK DATA // LIVE INGESTION IN R4]".     │
├──────────────────────┼─────────────┼─────────────┼───────────────────────────────────────────────┤
│ City Weather Cards   │ `weather-   │ SIMULATED   │ Add prominent badge: "[R4-B PREVIEW //        │
│ & 7-Day Forecasts    │  snapshot`  │             │ AUTOMATED METEOROLOGICAL FEEDS COMING SOON]". │
├──────────────────────┼─────────────┼─────────────┼───────────────────────────────────────────────┤
│ "Meet Your AI Farm   │ `ai-preview`│ PREMATURE   │ Replace with: "ZARATI Intelligence Framework —│
│ Advisor"             │             │ (VISION)    │ Agronomic Advisory Planned for Phase R8".     │
├──────────────────────┼─────────────┼─────────────┼───────────────────────────────────────────────┤
│ "No credit card      │ `en.json` / │ MISLEADING  │ Replace with: "Designed for Sudanese Producers│
│ required"            │ `ar.json`   │ (SaaS trope)│ and Commercial Traders. Bankak Ready."        │
├──────────────────────┼─────────────┼─────────────┼───────────────────────────────────────────────┤
│ Emojis on all cards  │ Throughout  │ UNPROFESS-  │ Replace all emojis with crisp, monochrome SVG │
│ (`🌾`, `🚜`, `🧪`)   │ codebase    │ IONAL       │ icons or authentic crop photography.          │
└──────────────────────┴─────────────┴─────────────┴───────────────────────────────────────────────┘
```

---

# SECTION 21: COMPONENT ARCHITECTURE & DESIGN SYSTEM TOKENS

The modular component architecture for R3.5+ consists of 8 core building blocks:
1. `<SovereignHeader />`: State banner, jurisdiction lockup, classification badge, live latency.
2. `<CommodityCard />`: Bloomberg-grade bulk listing tile with grade, moisture %, and dual-currency parity.
3. `<ProvenanceBadge />`: Standardized indicator disclosing data source, sensor resolution, and timestamp.
4. `<DirectionalIcon />`: Automated RTL-mirroring icon container.
5. `<TableDataCell />`: Tabular numeral cell with `<bdi>` protection and delta glyphs.
6. `<SudanMapCanvas />`: SVG/Canvas interactive cartography with hydrological and agro-belt overlays.
7. `<VoiceNoteRecorder />`: Opus-compressed vernacular audio capture tool.
8. `<SlideToAccept />`: High-consequence gesture slider for escrow and offer acceptance.

---

# SECTION 22: PAGE-BY-PAGE TRANSFORMATION DIRECTORY

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               PAGE-BY-PAGE TRANSFORMATION BLUEPRINT                              │
├─────────────────────┬────────────────────────────────────────────────────────────────────────────┤
│ PAGE / ROUTE        │ ARCHITECTURAL TRANSFORMATION                                               │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────┤
│ `/[lang]/page.tsx`  │ Complete restructure: Sovereign Hero -> Situational Briefing -> Technical  │
│ (Homepage)          │ Reality Register -> Live Marketplace Feed -> 3 Production Belts -> Trust.  │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────┤
│ `/[lang]/`          │ Upgrade listing cards to bulk commodity specification; add dual-currency   │
│ `marketplace`       │ converter; implement faceted filtering (Grade, Packaging, Scheme Origin).  │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────┤
│ `/[lang]/dashboard/`│ Replace 5-step form with 3-Tap visual grid; add native units (Jawal,       │
│ `farmer`            │ Ardeb, Qintar); enable audio voice notes; deploy Sun-Proof high-contrast.  │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────┤
│ `/[lang]/dashboard/`│ Add 7-day TTL negotiation counters to accepted RFQs; implement direct      │
│ `trader`            │ WhatsApp handoff links; add bulk lot inspection request modal.             │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────┤
│ `/[lang]/overview`  │ Purge fake alert counters; convert into National Production Compass        │
│                     │ summarizing monitored feddans and regional market clearing volumes.        │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────┤
│ `/[lang]/crops`     │ Add prominent benchmark disclosure; display botanical & commercial specs  │
│                     │ for Sudan's core export commodities (Sesame, Sorghum, Gum, Groundnut).     │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────┤
│ `/[lang]/weather`   │ Label clearly as R4-B preview; explain satellite rainfall data methodology │
│                     │ (CHIRPS / ECMWF) without fabricating live city readings.                   │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────┤
│ `/[lang]/about`     │ Replace startup value cards with sovereign institutional charter: Food     │
│                     │ Security Mandate, Public Data Integrity, and Technology Independence.      │
└─────────────────────┴────────────────────────────────────────────────────────────────────────────┘
```

---

# SECTION 23: VISUAL ASSET STRATEGY

* **No Stock Photos:** Strictly prohibit stock images of Western farmers, tractors on manicured European lawns, or orientalist desert nomads.
* **Authentic Industrial Photography:** Focus on real Sudanese agricultural machinery, Sennar Dam sluice gates, Gedaref corrugated steel silos, sesame drying windrows, and certified laboratory soil testing.
* **Vector Cartography:** High-precision SVG polygons derived from official post-2011 boundaries, with accurate river coordinates for the Blue Nile, White Nile, Main Nile, and seasonal Khors.
* **Monochrome Icons:** Replace all consumer emojis with precise, 1.5px stroke Lucide-style monochrome SVG icons.

---

# SECTION 24: IMPLEMENTATION PRIORITY MATRIX

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 IMPLEMENTATION PRIORITY MATRIX                                   │
├────┬───────────────────────┬──────────────┬─────────────┬────────────────────────────────────────┤
│ PR │ WORK PACKAGE          │ COMPLEXITY   │ PREREQUISITE│ CORE DELIVERABLES                      │
├────┼───────────────────────┼──────────────┼─────────────┼────────────────────────────────────────┤
│ P0 │ Truth & Deflation     │ LOW          │ Immediate   │ Purge fake counters, add R4 preview    │
│    │ Audit                 │              │             │ badges, replace SaaS copy in dicts.    │
├────┼───────────────────────┼──────────────┼─────────────┼────────────────────────────────────────┤
│ P1 │ Global Design System  │ MEDIUM       │ P0          │ Deploy geographic tokens, Cairo +      │
│    │ & Arabic Typography   │              │             │ IBM Plex Arabic, and RTL bidi rules.   │
├────┼───────────────────────┼──────────────┼─────────────┼────────────────────────────────────────┤
│ P2 │ Homepage Architecture │ HIGH         │ P1          │ Rebuild homepage around Sovereign Hero,│
│    │                       │              │             │ Ground Reality Briefing & Belts.       │
├────┼───────────────────────┼──────────────┼─────────────┼────────────────────────────────────────┤
│ P3 │ B2B Marketplace       │ MEDIUM       │ P1          │ Rebuild listing cards for bulk trade;  │
│    │ Redesign              │              │             │ add dual-currency SDG/USD converter.   │
├────┼───────────────────────┼──────────────┼─────────────┼────────────────────────────────────────┤
│ P4 │ Farmer Workspace      │ HIGH         │ P1, P3      │ Deploy 3-Tap pictorial listing engine; │
│    │ (Field-Ready)         │              │             │ add native units and audio recorder.   │
├────┼───────────────────────┼──────────────┼─────────────┼────────────────────────────────────────┤
│ P5 │ Trader Workspace      │ MEDIUM       │ P1, P3      │ Implement 7-day TTL countdown and      │
│    │                       │              │             │ direct WhatsApp negotiation handover.  │
├────┼───────────────────────┼──────────────┼─────────────┼────────────────────────────────────────┤
│ P6 │ Institutional Shell   │ MEDIUM       │ P1, P2      │ Build National Command Center preview  │
│    │ (Command Center)      │              │             │ with 4-tier spatial rollup shell.      │
├────┼───────────────────────┼──────────────┼─────────────┼────────────────────────────────────────┤
│ P7 │ Motion & Polish       │ LOW          │ P2–P6       │ Refine 150ms micro-transitions and     │
│    │                       │              │             │ enforce prefers-reduced-motion.        │
├────┼───────────────────────┼──────────────┼─────────────┼────────────────────────────────────────┤
│ P8 │ Accessibility & Sun-  │ MEDIUM       │ P1–P7       │ Final WCAG 2.2 AA audit and Sun-Proof  │
│    │ Proof Field QA        │              │             │ 19.8:1 contrast validation.            │
└────┴───────────────────────┴──────────────┴─────────────┴────────────────────────────────────────┘
```

---

# SECTION 25: ACCEPTANCE CRITERIA FOR R3.5 IMPLEMENTATION

1. **Truth Deflation:** Zero fabricated live statistics, weather readings, or market prices exist on any public page. All non-live modules carry explicit `PREVIEW` or `BENCHMARK` provenance badges.
2. **Design Language:** Platform visual tone reflects sovereign authority; all emojis are eliminated from UI components.
3. **Arabic Typography:** Cairo and IBM Plex Sans Arabic render with correct line-height multipliers ($1.45\times - 1.65\times$) and zero letter-spacing.
4. **Sudanese Numeric Standards:** Financial amounts and crop volumes render Western Arabic numerals (`0-9`) isolated inside `<bdi>` tags, preventing RTL punctuation corruption.
5. **Customary Commodity Units:** Marketplace and Farmer flows support *Feddan, Ardeb, Qintar, Jawal, and Metric Ton*.
6. **Marketplace Card Density:** Listing cards display crop variety, quality grade, moisture %, packaging type, and dual-currency SDG/USD parity.
7. **Bilateral Contact Protection:** Contact details remain strictly hidden until mutual bilateral acceptance is confirmed via RPC `023`.
8. **Field Usability:** Farmer listing flow operates via pictorial selection; primary buttons provide minimum $56\text{px}$ touch targets.
9. **Cartographic Precision:** The Sudan map accurately displays post-2011 borders, the 18 Wilayat, and correct Nile river courses.
10. **Accessibility & Contrast:** Text passes minimum 7:1 contrast; Sun-Proof Field Mode achieves 19.8:1 contrast.

---

## TOP 10 VISUAL & PRODUCT CHANGES WITH HIGHEST IMPACT

1. **Deflate All Mock Claims (P0):** Immediately purge the fake counters ("1,250 Farmers", "32° Avg Temp") and replace with sovereign agricultural baseline metrics.
2. **Sovereign Color Anchor Alignment (P1):** Introduce Al-Muqran Nile Blue (`#0F4C81`), Gedaref Clay Vertisol (`#2D241E`), and Golden Sesame (`#D4AF37`), eliminating generic startup greens.
3. **Arabic Enterprise Typography Stack (P1):** Provision Cairo for authoritative display and IBM Plex Sans Arabic for dense data tables, enforcing the 1.55x line-height rule.
4. **Emoji Elimination (P1):** Replace all consumer emojis (`🌾`, `🚜`, `🧪`) with crisp, monochrome SVG icons.
5. **Bidirectional Numeric Isolation (P1):** Wrap all numbers, prices, and phone numbers in `<bdi dir="ltr">` to eliminate RTL text reversal bugs.
6. **The 3-Tap Farmer Listing Engine (P4):** Replace the cumbersome 5-step form with a single-screen pictorial grid using native units (*Ardeb, Qintar, Jawal*).
7. **Bloomberg-Grade Commodity Card (P3):** Redesign marketplace cards to include quality grade, moisture %, packaging type, and origin warehouse.
8. **Dual-Currency SDG/USD Engine (P3):** Render domestic currency alongside USD/MT export parity using transparent parallel FX benchmark badges.
9. **Signature Sudan Vector Map (P2):** Upgrade the homepage map to include accurate post-2011 borders, the 18 Wilayat, and animated Nile hydrological vectors.
10. **National Command Center Architectural Shell (P6):** Implement the Palantir-style multi-pane situational awareness shell for institutional partners.

---

## RECOMMENDED IMPLEMENTATION SEQUENCE FOR GEMINI 3.1 PRO

When the Founder authorizes implementation in subsequent phases, execution should proceed in the following strict sequential batches:

* **Batch 1 (Truth & Hygiene — P0):** Edit `dictionaries/en.json` and `ar.json` to purge fake counters and SaaS marketing copy. Add provenance badges to `crop-snapshot` and `weather-snapshot`.
* **Batch 2 (Design Tokens & Typography — P1):** Update `design-system/tokens.css` and `app/globals.css` with the geographic palette tokens. Provision Cairo and IBM Plex Sans Arabic in `lib/fonts.ts`.
* **Batch 3 (Sovereign Homepage — P2):** Rebuild `components/home/hero-section.tsx` and homepage structure to incorporate the sovereign narrative and enhanced `SudanMap.tsx`.
* **Batch 4 (Marketplace & Commodity Cards — P3):** Refactor `components/marketplace/marketplace-client.tsx` and card components with bulk commodity specifications and dual-currency calculations.
* **Batch 5 (Farmer & Trader Workspaces — P4 & P5):** Streamline `farmer-dashboard-client.tsx` into the 3-Tap visual engine and add 7-day TTL countdowns to `trader-dashboard-client.tsx`.
* **Batch 6 (Command Center Shell & QA — P6, P7, P8):** Build the `/intelligence` layout shell with 4-tier spatial hierarchy and conduct final WCAG 2.2 AA validation.

---

**END OF MASTER PLAN — ZARATI R3.5-A ARCHITECTURE COMPLETE**
