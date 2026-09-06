# ZARATI | زرعتي — Global Product Architecture Dossier
**Design Philosophy:** Sovereign Core Engine with Declarative Country Packs  
**System Classification:** Agricultural Operating System (Agri-OS)  
**Date Context:** September 2026  
**Document Ref:** `08. ZARATI_GLOBAL_PRODUCT_ARCHITECTURE.md`

---

## 1. Architectural Manifesto: Core vs. Country Packs

Zarati rejects the antipattern of cloning codebases for different national markets. Building separate repositories for Sudan, Kenya, or Saudi Arabia leads to rapid divergence, unmaintainable technical debt, fragmented security patches, and prohibitive engineering overhead.

Instead, Zarati enforces an architectural separation:
* **The Zarati Sovereign Core:** A single, high-performance, multi-tenant monorepo housing all domain logic, cryptographic ledger audit trails, spatial indexing, satellite ingestion pipelines, role-based authorization gates, and data orchestration workflows.
* **Declarative Country Packs:** Isolated, version-controlled JSON/YAML configuration packages that dynamically parameterize the Core engine at runtime without altering core code.

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                 ZARATI CORE ENGINE                                │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │   Geospatial & STAC   │  │   Multi-Source Price  │  │  Multi-Tenant RLS &   │  │
│  │   Indexing Engine     │  │   Discovery Pipeline  │  │  Sovereignty Guard    │  │
│  └───────────────────────┘  └───────────────────────┘  └───────────────────────┘  │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │   Offline-First Sync  │  │   Applied Agronomic   │  │  Event-Driven Webhook │  │
│  │   & Conflict Engine   │  │   Inference Worker    │  │  & Integration Gateway│  │
│  └───────────────────────┘  └───────────────────────┘  └───────────────────────┘  │
└─────────────────────────────────────────▲─────────────────────────────────────────┘
                                          │ Runtime Parameterization
         ┌────────────────────────────────┼────────────────────────────────┐
         │                                │                                │
┌────────┴──────────────┐      ┌──────────┴────────────┐      ┌────────────┴──────────┐
│  SUDAN FLAGSHIP PACK  │      │   SAUDI ARABIA PACK   │      │    EAST AFRICA PACK   │
│  • Dialect: Arabic SD │      │  • Dialect: Arabic SA │      │  • Dialect: Swahili/EN│
│  • Currency: SDG/USD  │      │  • Currency: SAR/USD  │      │  • Currency: KES/USD  │
│  • Units: Ardeb/Feddan│      │  • Units: Dunam/Kg    │      │  • Units: Acre/Kg     │
│  • Pay: Bankak API    │      │  • Cloud: KSA Class B │      │  • Pay: M-Pesa API    │
│  • Admin: 18 States   │      │  • Admin: 13 Regions  │      │  • Admin: 47 Counties │
└───────────────────────┘      └───────────────────────┘      └───────────────────────┘
```

---

## 2. Declarative Country Pack Specification

Every Country Pack defines its national profile via a strictly typed configuration schema:

```typescript
export interface CountryPackConfig {
  countryCode: string; // ISO 3166-1 alpha-2 (e.g., 'SD', 'SA', 'KE')
  countryName: { en: string; ar?: string; local?: string };
  defaultLocale: string;
  supportedLocales: string[];
  direction: 'rtl' | 'ltr';
  
  // Currency & Macroeconomic Rules
  baseCurrency: {
    code: string; // 'SDG', 'SAR', 'KES'
    symbol: string;
    decimals: number;
    fxNormalizationModel: 'fixed_official' | 'dual_market_basket' | 'cbr_pegged';
    primaryFxSource: string;
  };
  
  // Customary Land & Commodity Measurement Units
  measurementUnits: {
    landArea: {
      canonicalName: string; // 'feddan', 'dunam', 'hectare', 'acre'
      toSquareMeters: number; // 1 feddan = 4,200 m²; 1 dunam = 1,000 m²
      displaySymbol: { en: string; ar?: string };
    };
    massUnits: Array<{
      code: string; // 'ardeb_sorghum', 'qintar_sesame', 'sack_wheat'
      applicableCrops: string[];
      toKilograms: number; // e.g. Ardeb = 198 kg; Qintar = 44.93 kg
      displaySymbol: { en: string; ar?: string };
    }>;
  };

  // Subnational Administrative Geographies
  administrativeStructure: {
    level1Name: { en: string; ar?: string }; // 'State' / 'Region' / 'County'
    level2Name: { en: string; ar?: string }; // 'Locality' / 'Governorate' / 'Sub-County'
    geojsonBoundarySource: string; // GeoJSON storage path
  };

  // Agronomic & Crop Catalog Mapping
  supportedCrops: Array<{
    cropId: string;
    scientificName: string;
    localNames: Record<string, string>;
    standardGrades: string[];
    seasons: Array<{
      name: string;
      plantingWindow: { startMonth: number; endMonth: number };
      harvestWindow: { startMonth: number; endMonth: number };
      waterRegime: 'rainfed' | 'irrigated' | 'spate' | 'greenhouse';
    }>;
  }>;

  // Domestic Integrations & Sovereignty
  integrations: {
    telecomSmsProviders: string[]; // ['sudani_smpp', 'zain_sd', 'stc_sms']
    ussdEnabled: boolean;
    ussdCode?: string;
    nationalPaymentGateways: string[]; // ['bankak_p2p', 'mada', 'mpesa']
    weatherProviderPriority: Array<'open_meteo' | 'ecmwf' | 'chirps' | 'nasa_power'>;
    dataResidencyRequirement: 'shared_global' | 'sovereign_in_country' | 'air_gapped';
  };
}
```

---

## 3. Technology Stack & Component Architecture

### 3.1 Core Modern Stack
* **Application Framework:** Next.js 16.2 (Turbopack Engine, App Router, React Server Components).
* **Language & Typing:** TypeScript 5.5+ (Strict Type-Checking, zero `any` allowance in production code).
* **Styling & Design System:** Tailwind CSS with native RTL directionality, CSS variables for theme customization.
* **Database & Auth Engine:** Supabase PostgreSQL 15+ with native PostGIS extensions for vector and polygon manipulation.
* **Distributed Cache & Rate Limiting:** Upstash Redis with edge REST token authorization for millisecond-level IP and tenant throttling.
* **Geospatial & Remote Sensing Pipeline:** Python/GDAL/Rasterio microservices running on Cloudflare Workers / Fly.io for STAC (SpatioTemporal Asset Catalog) querying of Sentinel-2 multispectral tiles.

### 3.2 Security & Multi-Tenant Data Isolation
1. **Row-Level Security (RLS) Isolation:** Every table in the core schema includes a composite tenancy anchor `(country_code, tenant_id)`. RLS policies enforce that users can only query rows matching their cryptographic JWT claims.
2. **Suspension & Invalidation Guard:** `public.is_active_user()` is evaluated directly in database triggers, instantly cutting off direct SQL or API mutations if an account is suspended or banned by administration.
3. **Data Sanitization Views:** Direct access to raw user metadata and sensitive business columns is revoked for anonymous visitors. Public marketplace endpoints query hardened projections (`public_traders`) that exclude private phone numbers, tax IDs, and KYC verification records.

---

## 4. Entity-Relationship Domain Model (Core Abstraction)

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│          core.countries         │           │        core.admin_regions       │
├─────────────────────────────────┤           ├─────────────────────────────────┤
│ id (PK): UUID                   │ 1       N │ id (PK): UUID                   │
│ iso_code: TEXT ('SD', 'SA')     │──────────<│ country_id (FK): UUID           │
│ config_payload: JSONB           │           │ level: INT (1=State, 2=Locality)│
│ is_active: BOOLEAN              │           │ boundary_polygon: GEOMETRY      │
└─────────────────────────────────┘           └─────────────────────────────────┘
                 │ 1                                           │ 1
                 │                                             │
                 │ N                                           │ N
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│        public.profiles          │           │          public.farms           │
├─────────────────────────────────┤           ├─────────────────────────────────┤
│ id (PK): UUID (references auth) │ 1       N │ id (PK): UUID                   │
│ country_id (FK): UUID           │──────────<│ farmer_id (FK): UUID            │
│ role: TEXT ('farmer', 'trader') │           │ admin_region_id (FK): UUID      │
│ status: TEXT ('active', 'susp') │           │ boundary_polygon: GEOMETRY      │
│ is_verified: BOOLEAN            │           │ total_area_feddan: NUMERIC      │
└─────────────────────────────────┘           └─────────────────────────────────┘
                 │ 1                                           │ 1
                 │                                             │
                 │ N                                           │ N
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│       public.crop_prices        │           │       public.farm_crops         │
├─────────────────────────────────┤           ├─────────────────────────────────┤
│ id (PK): UUID                   │           │ id (PK): UUID                   │
│ market_id (FK): UUID            │           │ farm_id (FK): UUID              │
│ crop_id (FK): UUID              │           │ crop_id (FK): UUID              │
│ original_price: NUMERIC         │           │ cultivated_area: NUMERIC        │
│ usd_normalized_price: NUMERIC   │           │ estimated_yield_mt: NUMERIC     │
│ confidence_score: TEXT ('A'-'E')│           │ remote_sensing_ndvi: NUMERIC    │
└─────────────────────────────────┘           └─────────────────────────────────┘
```

---

## 5. API Layer & Integration Protocols

1. **REST / GraphQL Edge Endpoints:** Next.js Route Handlers deploying on edge networks to guarantee $<100\text{ ms}$ response latencies.
2. **Webhook Event Bus:** Standardized outbound webhooks notifying enterprise buyers, UN agencies, and financial institutions when verified price shifts occur or crop yields are certified.
3. **Offline-Sync Delta Protocol:** Mobile PWA clients store local operations in SQLite/IndexedDB, generating cryptographic mutation hashes that synchronize atomically with PostgreSQL upon network reconnect.
