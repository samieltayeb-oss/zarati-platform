# ZARATI | زرعتي — Sovereign Data Governance, Cybersecurity & Residency Strategy
**Classification:** Enterprise Data Governance, Legal Architecture & Sovereign Security  
**Mandate:** B2G Compliance, National Security Protection & Platform IP Demarcation  
**Date Context:** September 2026  
**Document Ref:** `17. ZARATI_DATA_SOVEREIGNTY_STRATEGY.md`

---

## 1. The Core Commercial & Intellectual Property Law

> **THE CARDINAL IP PRINCIPLE:**  
> 1. **The Sovereign Client (Government / Ministry / Donor) owns 100% of its operational and national agricultural data.** All records of registered citizens, farm boundaries, tax receipts, and classified strategic food reserve inventories belong exclusively to the sovereign state.
> 2. **Zarati retains exclusive, unencumbered 100% ownership of the Zarati Core Platform Intellectual Property.** This includes the underlying source code, database schemas, proprietary normalization algorithms, machine learning models, user experience designs, and declarative country-pack architecture.
> 
> Under no standard licensing agreement does a client acquire ownership of Zarati's source code or the right to commercialize the platform internationally.

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                    ZARATI DATA & IP SOVEREIGNTY DEMARCATION                       │
│                                                                                   │
│   CLIENT / STATE OPERATIONAL DATA                  ZARATI SOVEREIGN PLATFORM IP   │
│   (100% Owned by Sovereign Client)                 (100% Retained by Zarati)      │
│                                                                                   │
│   • National Farmer Registries (PII)               • Zarati Core Engine Codebase  │
│   • GPS Coordinates of Family Farms                • PostGIS Spatial Indexing Lib │
│   • State Auction Tax Revenue Records              • Multi-Tier Price Ingestion Engine│
│   • Strategic Grain Reserve Inventories            • UI/UX Component Library      │
│   • Bilateral Quarantine Invoices                  • Declarative Country-Pack Arch│
│   • Locality Vulnerability Assessments             • Agronomic AI Weight Vectors  │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Four Tiered Deployment Architectures

To satisfy diverse sovereign, regulatory, and national security mandates across Africa and the GCC, Zarati supports four isolated deployment topologies:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    FOUR SOVEREIGN DEPLOYMENT TOPOLOGIES                      │
├───────────────────┬──────────────────────────────────────────────────────────┤
│ 1. SHARED MULTI-  │ Multi-tenant SaaS running on hardened international cloud│
│    TENANT SAAS    │ (Vercel Edge / Supabase AWS Frankfurt). Strict RLS       │
│    (Standard)     │ tenant isolation by `country_code`. Lowest cost; ideal   │
│                   │ for initial NGO pilots and commercial traders.           │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ 2. DEDICATED      │ Dedicated PostgreSQL instance and isolated storage bucket│
│    SOVEREIGN      │ for a specific ministry or state government. Logical and │
│    TENANT         │ cryptographic database separation with client-managed    │
│    (Enterprise)   │ KMS encryption keys.                                     │
├───────────────────┼──────────────────────────────────────────────────────────┤
│ 3. IN-COUNTRY     │ Deployed strictly within national territorial boundaries │
│    SOVEREIGN      │ to satisfy national data residency statutes (e.g., KSA   │
│    CLOUD          │ CST Class B/C requirements on Oracle Cloud Jeddah or     │
│    (GovTech)      │ Sudatel Data Center Khartoum). Data never leaves borders.│
├───────────────────┼──────────────────────────────────────────────────────────┤
│ 4. AIR-GAPPED     │ On-premise bare-metal deployment inside a ministry's     │
│    PRIVATE CLOUD  │ physical data center. Zero external internet outbound    │
│    (Defense/Food  │ egress; updates delivered via cryptographically signed   │
│    Security)      │ offline container releases. Highest security tier.       │
└───────────────────┴──────────────────────────────────────────────────────────┘
```

---

## 3. Data Privacy & Smallholder Protection Protocols

Smallholder farmers in fragile conflict zones face severe physical risks if their personal identities or exact farm locations are weaponized or accessed by unauthorized actors. Zarati enforces bank-grade privacy controls:

### 3.1 PII Protection & Zero-Knowledge Storage
* **Phone Numbers & Identity Cards:** Personal phone numbers and national ID numbers (*Raqam Watani*) are stored using asymmetric column-level encryption (PostgreSQL `pgcrypto`).
* **Name & Contact Masking:** In public marketplace listings, farmer contact details are completely masked behind proxy routing or in-app messaging. Direct phone numbers are never rendered in client HTML.

### 3.2 Geospatial Obfuscation (The 500m Jitter Rule)
* **High-Precision Polygons:** Stored in restricted schema partitions accessible only to the verified landholder and authorized agricultural extension officers.
* **Public & Aggregated Views:** When farm data is aggregated for regional heatmaps or public yield statistics, farm coordinates are obfuscated using a deterministic 500-meter spatial jitter algorithm, or rendered solely as locality-level statistical densities, preventing the identification of individual homesteads.

---

## 4. Role-Based Access Control (RBAC) & Cryptographic Audit

Zarati's security foundation implements least-privilege RBAC:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    ZARATI SOVEREIGN RBAC PRIVILEGE TIERS                     │
├─────────────────┬────────────────────────────────────────────────────────────┤
│ 1. PUBLIC ANON  │ Read-only access to published crop prices, safe trader     │
│                 │ profiles (`public_traders` view), and aggregated weather.  │
│                 │ Direct SELECT on base `profiles` or `farms` strictly denied│
├─────────────────┼────────────────────────────────────────────────────────────┤
│ 2. VERIFIED     │ Read/Write access to own farm records, own crop listings,   │
│    FARMER       │ and received bids. Zero cross-user visibility.             │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ 3. VERIFIED     │ Read access to public listings and RFQs; write access to   │
│    TRADER       │ submit bids and track contracted deliveries.               │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ 4. EXTENSION    │ Delegated read/write access to assisted farmer profiles    │
│    OFFICER      │ within their designated administrative locality only.      │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ 5. STATE GOV    │ Aggregated locality reporting, auction tax summaries, and  │
│    DIRECTOR     │ yield forecasts for their specific state only.             │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ 6. NATIONAL     │ Unrestricted macro visibility across all states; zero      │
│    MINISTER     │ access to direct PII unless audited by judicial warrant.   │
└─────────────────┴────────────────────────────────────────────────────────────┘
```

### 4.1 Immutable Security Audit Log
Every administrative privilege change, role elevation, data export, or account suspension writes an append-only cryptographic event into `public.security_audit_ledger`:
$$\text{Event Hash}_n = \text{HMAC-SHA256}(\text{Event Hash}_{n-1} + \text{User ID} + \text{Action} + \text{Timestamp})$$
This ensures that government audit bureaus and international donor inspectors can verify that agricultural data has not been secretly modified, erased, or manipulated.
