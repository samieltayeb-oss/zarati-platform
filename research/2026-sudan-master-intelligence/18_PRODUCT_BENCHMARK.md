# ZARATI RESEARCH DOSSIER 18: PRODUCT BENCHMARK & FEATURE-BY-FEATURE GAP MATRIX

**Document Reference:** `ZARATI-RES-2026-18`  
**Classification:** Product Architecture & Feature Benchmarking  
**Benchmarked Platforms:** Zarati (Sudan), Twiga Foods (Kenya), Apollo Agriculture (Kenya), Farmerline (Ghana), AFEX (Nigeria/Kenya), DigiFarm (Kenya)  
**Date Context:** September 2026  

---

## 1. Feature-by-Feature Competitor Benchmark Matrix

| Feature / Architectural Capability | ZARATI (Sudan) | Twiga Foods (Kenya) | Apollo Agriculture (Kenya) | Farmerline (Ghana) | AFEX (Nigeria) | DigiFarm (Kenya) |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Native Arabic & RTL First** | ⭐ **YES (Full)** | ❌ No (EN/SW) | ❌ No (EN/SW) | ❌ No (EN only) | ❌ No (EN only) | ❌ No (EN/SW) |
| **Sudanese Dialect Audio Support** | ⭐ **YES (Opus)** | ❌ No | ❌ No | ⚠️ Yes (Twi/Ewe) | ❌ No | ❌ No |
| **Feddan (فدان) Unit Native Engine** | ⭐ **YES (Native)** | ❌ No (Acres) | ❌ No (Acres) | ❌ No (Acres/Ha) | ❌ No (Hectares) | ❌ No (Acres) |
| **Asset-Light Broker Model** | ⭐ **YES (100%)** | ❌ No (Heavy Fleet) | ⚠️ Partial | ⚠️ Partial | ❌ No (Warehouses) | ⭐ YES |
| **Bankak (بنكك) Payment Integration** | ⭐ **YES (Core)** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No (M-Pesa) |
| **Open Satellite EO (Sentinel-2 10m)**| ⭐ **YES (Zero Cost)**| ❌ No | ⭐ YES (Proprietary)| ⚠️ Basic | ⚠️ Basic | ❌ No |
| **Offline-First PWA (IndexedDB)** | ⭐ **YES (<120KB)** | ❌ No (Native App) | ❌ No | ⚠️ Agent App | ❌ No | ❌ No (USSD) |
| **Multi-Currency Hedging (SDG/USD)** | ⭐ **YES** | ❌ No (KES only) | ❌ No (KES only) | ❌ No (GHS only) | ❌ No (NGN only) | ❌ No (KES only) |
| **Digital Escrow / Inspection Tokens**| ⭐ **YES** | ❌ No (Internal) | ❌ No | ❌ No | ⭐ YES (e-WRs) | ❌ No |
| **Public Waitlist & Community Trust** | ⭐ **YES (Live)** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

---

## 2. Product Architecture Gap Analysis & Zarati's Strategic Sweet Spot

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ZARATI ARCHITECTURAL SWEET SPOT                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. THE ARABIC AGRITECH VACUUM:                                              │
│    Virtually every venture-backed African agritech is Anglophone East or    │
│    West African (Kenya, Nigeria, Ghana). North African / Sudanese Arab      │
│    agro-economies have been completely ignored by Silicon Valley & London VC.│
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. CLOUD-NATIVE SERVERLESS VS. RUNAWAY OPEX:                                │
│    Competitors like Twiga built multi-million-dollar internal data centers  │
│    and logistics fleets. Zarati runs on modern Next.js Turbopack, Supabase  │
│    PostgreSQL with RLS, and AWS STAC open satellite buckets, operating with │
│    nearly zero baseline cloud infrastructure costs during early growth.     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. DEFENSIBLE LOCAL FINTECH MOAT:                                           │
│    Integrating Bankak deep into agricultural trading workflows creates an   │
│    unassailable network effect that foreign entrants cannot easily match.   │
└─────────────────────────────────────────────────────────────────────────────┘
```
