# ZARATI RESEARCH DOSSIER 11: OFFLINE-FIRST TELECOM & CONNECTIVITY STRATEGY

**Document Reference:** `ZARATI-RES-2026-11`  
**Classification:** Technical Architecture & Last-Mile Engineering  
**Geographic Scope:** Rural Sudan (Agricultural schemes, remote rainfed villages)  
**Date Context:** September 2026  

---

## 1. Ground Telecom Reality in Agricultural Sudan

Sudan's national telecommunications backbone has suffered major physical damage, power cuts, and fiber cuts since 2023. While primary core switches have been relocated to Port Sudan, rural farming schemes experience stark connectivity tiers:

| Connectivity Tier | Coverage Areas | Dominant Technology | Practical Data Speed | User Behavior | Zarati Delivery Strategy |
|:---|:---|:---|:---|:---|:---|
| **Tier 1: Urban / Hub** | Port Sudan, Gedaref City, Atbara, Kassala | Zain / Sudani 4G LTE | 5 – 25 Mbps | Modern smartphone, streaming, Bankak transfers | Full Zarati Web PWA & Trader Portal |
| **Tier 2: Semi-Rural Market** | El Fau, Doka, New Halfa, Shendi, Sennar | 3G / 2G EDGE + Community Starlink Hubs | 100 kbps – 2 Mbps | Spotty connectivity; users gather at Starlink shops | PWA with heavy IndexedDB caching; WhatsApp bot |
| **Tier 3: Deep Agricultural Scheme** | Rural Gedaref clay plains, North Kordofan gum belt | Intermittent 2G SMS / Voice only; complete dead zones | < 20 kbps (SMS-only) | Feature phones (Nokia/Tecno); weekly trips to market | **SMS broadcast, USSD code (`*384#`), audio voice notes** |

---

## 2. The Starlink Community Hub Phenomenon

In the absence of stable cellular networks, rural Sudanese entrepreneurs have established **decentralized Starlink internet hubs** in market centers, grain silos, and tea stalls:
- **Operating Model:** Local shops install a Starlink terminal powered by solar panels and small generators, charging farmers and traders 1,000 to 2,500 SDG ($0.40–$0.90) per hour for local Wi-Fi vouchers.
- **Zarati Opportunity:** Starlink hubs serve as natural digital aggregation points. A farmer visits the market hub once a week, connects to Wi-Fi, and the **Zarati PWA automatically syncs local farm records, fetches fresh market prices, and downloads regional weather forecasts** into local IndexedDB storage for the coming 7 days.

---

## 3. Zarati Offline-First Technical Architecture

```mermaid
graph TD
    subgraph "Farmer Client (Mobile Browser / PWA)"
        UI["Zarati UI Component"]
        SW["Service Worker (CacheStorage)"]
        IDB["IndexedDB (Local SQLite/Dexie)"]
        SyncMgr["Background Sync Manager"]
    end

    subgraph "Cloud Gateway"
        API["Zarati Supabase REST Gateway"]
    end

    UI <-->|1. Read / Write Offline| IDB
    UI <-->|2. Render Cached Assets| SW
    IDB -->|3. Queue Mutations| SyncMgr
    SyncMgr -->|4. Detect Network (Online Event)| API
    API -->|5. Resolve Conflicts (Server Wins / Last-Write-Wins)| IDB
```

### Engineering Specifications:
1. **Zero-Bandwidth Asset Footprint:**
   - Total initial page payload strictly constrained to `< 120 KB` gzip.
   - SVG icons instead of raster images; no bulky web font downloads (system sans-serif fonts: Cairo / Tahoma fallback).
2. **IndexedDB Local Storage Schema:**
   - Stores up to 30 days of historical crop prices for the farmer's state.
   - Allows offline listing creation (`draft_offline`), auto-stamping timestamp and GPS coordinates.
3. **Low-Bandwidth Audio Interaction:**
   - Compressed Opus audio codec (< 12 kbps) enabling semi-literate farmers to dictate crop condition reports or listing inquiries without typing.
