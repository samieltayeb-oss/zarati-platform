# ZARATI | زرعتي — R4-A ROADMAP RECONCILIATION
**Document Class:** Architecture Reconciliation Matrix  
**Status:** AUTHORITATIVE (Supersedes Master Completion Roadmap Phase Definitions)

## 1. PHASE RECONCILIATION MATRIX

A forensic audit of the newly generated `ZARATI_MASTER_COMPLETION_ROADMAP.md` revealed severe semantic conflicts with the Founder-frozen architecture. The new document attempted to silently redefine phases (e.g., pulling GIS/Satellite from R10 into R4-C, and SMS from R9 into R4-E). 

This matrix restores the **Founder-frozen authoritative phase definitions** while integrating the new technical payloads into their correct architectural boundaries.

| Phase | Original Frozen Definition | New Roadmap Attempted Definition | Conflict? | Authoritative Scope & Resolution |
| :--- | :--- | :--- | :---: | :--- |
| **R4-A** | Institutional & Historical Data Foundation | Real Data Foundation / DB Convergence | No | **Institutional & Historical Data Foundation.** (Migration 024 deployment. Schema convergence. Immutable ledger.) |
| **R4-B** | Basic Weather + Automated External Feeds | Market Price Ingestion | Yes | **Basic Weather + Automated External Feeds.** (WFP VAM & FAO FPMA automated ingestion. Basic Open-Meteo telemetry.) |
| **R4-C** | FX & Unit Normalization | Agro-Climatic & Satellite Integration | Yes | **FX & Unit Normalization.** (Satellite belongs in R10. R4-C focuses strictly on cross-currency normalization and regional unit conversions like Ardeb to MT.) |
| **R4-D** | Sudan Market Reporter & Verification Foundation | Commodity Marketplace Matching & RFQ | Yes | **Sudan Market Reporter & Verification Foundation.** (Gedaref mobile enumerator app, auction floor verification queue, and quality flags. RFQ belongs in R4-E.) |
| **R4-E** | Trader & Institutional Analytics | SMS & Low-Bandwidth | Yes | **Trader & Institutional Analytics.** (Bilateral B2B RFQ, Deal Rooms, trader analytics. SMS belongs in R9.) |
| **R5** | Operations/Admin + Data Verification | Sovereign Institutional Command Center | Yes | **Operations/Admin + Data Verification.** (Internal verification workflows, quarantine management. Command Center belongs in R7.) |
| **R6** | Gedaref Pilot Readiness / Operations | Gedaref Production Pilot | No | **Gedaref Pilot Readiness / Operations.** (250-farmer Stage 1 rollout, physical auction floor liaison.) |
| **R7** | Government/NGO Intelligence + National Command Center | Irrigated Scheme Integration | Yes | **Government/NGO Intelligence + National Command Center.** (18-State Ministerial dashboard, deficit/surplus balance sheets, institutional reporting.) |
| **R8** | AI | National Ag-Stack & Cross-Border | Yes | **AI.** (Automated anomaly detection, predictive pricing models.) |
| **R9** | SMS / USSD / Offline | (Merged into R4-E) | Yes | **SMS / USSD / Offline.** (PWA Service Worker offline sync, Zain/Sudani SMS broadcast, USSD gateway.) |
| **R10** | GIS / Satellite | (Merged into R4-C) | Yes | **GIS / Satellite.** (Sentinel-2 NDVI, Landsat vegetation indices, Mapbox edge tiling.) |

## 2. SETTLEMENT & PAYMENT SCOPE CORRECTION

ZARATI is NOT a financial institution, wallet, or escrow service. Misleading terminology in the previous roadmap is formally struck down.

* **"Settlement Handoff"** → CORRECTED TO: **"Payment Reference Recording"**
* **"Digital Settlement Tracing"** → CORRECTED TO: **"Off-Platform Payment Confirmation"**
* **"Bankak Integration"** → CORRECTED TO: **"Bankak Invoice Reference Tagging"**

**Absolute Rule:** Zarati does not hold funds, settle funds, guarantee payment, or provide escrow. Bank of Khartoum (Bankak) is utilized strictly for out-of-band transaction reference metadata.

## 3. INSTITUTIONAL CLAIM SAFETY CORRECTION

The previous roadmap falsely implied existing partnerships with sovereign entities. These are corrected to reflect actual reality:

* **Federal Ministry of Agriculture:** POTENTIAL INSTITUTIONAL STAKEHOLDER (Not a confirmed partner).
* **Gedaref State Ministry & Crop Exchange:** PROPOSED PILOT PARTICIPANT (Requires signed agreement).
* **UN WFP (VAM) & FAO:** PUBLIC DATA SOURCE (We are consuming their public open datasets; they are not active platform partners).
* **Bank of Khartoum:** POTENTIAL INTEGRATION (No direct API partnership exists).

Architectural diagrams and presentation decks MUST NOT claim these entities as active partners until documentary evidence is secured.
