# ZARATI V1 PRODUCTION TRUTH

This document specifies the exact ground truth boundaries of ZARATI V1.0.0.

## 1. Market Data
- **Total Ingested WFP Observations**: 5,663
- **Publicly Approved Observations**: 102
- **Data Source**: UN WFP Sudan Market Monitor
- **Mock Data**: 0 records. All application features render strictly against actual ingested intelligence.
- **Normalization Methodology**: Standardized mathematically to SDG per Metric Ton and SDG per KG. 
- **USD Fallback**: USD calculations are disabled/unavailable as verified Forex (FX) data sources are not currently connected.

## 2. Weather Context
- **Data Source**: MET Norway (Open-Meteo).
- **Scope**: Gedaref region strictly.
- **Integration**: Presented alongside market intelligence without inferring automated causation.

## 3. Automation & Feed Health
- **WFP Sync**: ON (Manual / Cron executable).
- **Weather Sync**: ON (Manual / Cron executable).
- **Open-Meteo Recurring**: OFF.

## 4. Geographic Coverage
- Verified presence in Gedaref, Khartoum, El Obeid, and Sennar based strictly on available data.
- "LIMITED DATA" or "NO VERIFIED DATA" labels accurately render when queries lack underlying state presence.
