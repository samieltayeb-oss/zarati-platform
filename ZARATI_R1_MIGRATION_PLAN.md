# ZARATI | زرعتي — Deterministic Database Migration Plan (Phase R1-A)
**Version:** 1.0.0-draft  
**Date:** September 4, 2026  
**Status:** ARCHITECTURE & PLANNING ONLY (Zero migrations executed)  
**Migration Directory:** `supabase/migrations/` (to be created in Phase R1-B)  
**Target Engine:** PostgreSQL 15+ (Supabase CLI)  
**Project Path:** `C:\Users\mcreg\Desktop\zarati`

---

## 1. Migration Philosophy & Rules

1. **Deterministic Order:** Migrations are strictly numbered and ordered to respect relational foreign key dependencies.
2. **Idempotency:** Every DDL statement uses `CREATE ... IF NOT EXISTS` and `CREATE OR REPLACE FUNCTION` where possible.
3. **Transaction Safety:** Each migration script must execute within a single transaction (`BEGIN ... COMMIT`). If any statement fails, the database rolls back to the prior clean state.
4. **Preservation of Existing Data:** Table `waitlist` is never dropped or mutated.
5. **Separation of Concerns:** Schema structure (DDL), Security (RLS), and Seed Data (DML) are kept in dedicated migration files.
6. **Zero Migration Execution during R1-A:** This document plans the execution sequence. **No SQL is executed until explicit user approval of Phase R1-B.**

---

## 2. Migration Sequence & File Breakdown

```
supabase/migrations/
├── 20260904000001_extensions_and_helpers.sql     # 001: Extensions & updated_at trigger
├── 20260904000002_states_master.sql              # 002: Sudan 18 states master table
├── 20260904000003_markets_master.sql             # 003: Physical commodity markets table
├── 20260904000004_crops_master.sql               # 004: Agricultural commodities catalog
├── 20260904000005_profiles.sql                   # 005: 1:1 auth.users application profile
├── 20260904000006_trader_profiles.sql            # 006: Trader enterprise attributes
├── 20260904000007_farms.sql                      # 007: Multi-farm land management & Feddan
├── 20260904000008_farm_crops.sql                 # 008: Seasonal crop allocations per farm
├── 20260904000009_crop_prices.sql                # 009: Append-only price observations
├── 20260904000010_listings.sql                   # 010: Marketplace supply catalog
├── 20260904000011_listing_media.sql              # 011: Image attachments for listings
├── 20260904000012_inquiries.sql                  # 012: Trader-to-seller inquiry gateway
├── 20260904000013_moderation_events.sql          # 013: Admin audit trail
├── 20260904000014_indexes.sql                    # 014: High-performance query indexes
├── 20260904000015_rls_policies.sql               # 015: Comprehensive Zero-Trust RLS rules
├── 20260904000016_seed_reference.sql             # 016: Reference seed (18 states, crops, markets)
└── 20260904000017_seed_demo_staging_only.sql     # 017: Development/staging test fixtures
```

---

## 3. Detailed Step-by-Step Migration Specifications

### Step 001: Extensions & Common Helpers (`20260904000001_extensions_and_helpers.sql`)
- Enables `uuid-ossp` and `pgcrypto`.
- Creates `handle_updated_at()` trigger function for automated timestamp management.

### Step 002: States Master Data (`20260904000002_states_master.sql`)
- Creates table `public.states` with primary key `code CHAR(5)`.
- Defines bilingual state names, regional categorization (`eastern`, `central`, `northern`, etc.).

### Step 003: Markets Master Data (`20260904000003_markets_master.sql`)
- Creates table `public.markets` referencing `states(code)`.
- Enforces unique market codes (e.g. `MKT-GEDAREF-EXCHANGE`).

### Step 004: Crops Master Data (`20260904000004_crops_master.sql`)
- Creates table `public.crops` with primary key `id TEXT` (lowercase slug).
- Categorizes commodities (`grain`, `oilseed`, `cash`, `pulse`, etc.) and sets standard sack weights.

### Step 005: User Profiles (`20260904000005_profiles.sql`)
- Creates `public.profiles` linked 1:1 to `auth.users(id)` via `ON DELETE CASCADE`.
- Defines application roles (`farmer`, `trader`, `admin`) and foreign key to `states(code)`.
- Adds `set_profiles_updated_at` trigger.

### Step 006: Trader Profiles (`20260904000006_trader_profiles.sql`)
- Creates `public.trader_profiles` linked 1:1 to `profiles(id)`.
- Stores commercial registration, preferred crops array, and verification status.

### Step 007: Farm Management (`20260904000007_farms.sql`)
- Creates `public.farms` referencing `profiles(id)` and `states(code)`.
- Implements `area_hectares` generated stored column converting Feddan and Acre values to metric hectares.

### Step 008: Farm Crops (`20260904000008_farm_crops.sql`)
- Creates `public.farm_crops` referencing `farms(id)` and `crops(id)`.
- Enforces unique constraint `(farm_id, crop_id, season)`.

### Step 009: Market Crop Prices (`20260904000009_crop_prices.sql`)
- Creates `public.crop_prices` referencing `crops(id)` and `markets(id)`.
- Enforces append-only daily observation constraint `(crop_id, market_id, price_date, unit)`.

### Step 010: Marketplace Listings (`20260904000010_listings.sql`)
- Creates `public.listings` referencing `profiles(id)`, `crops(id)`, and `states(code)`.
- Implements separate `status` and `moderation_status` fields.

### Step 011: Listing Media (`20260904000011_listing_media.sql`)
- Creates `public.listing_media` referencing `listings(id)` via `ON DELETE CASCADE`.
- Enforces maximum file size limit (5MB) and mime-type check constraints.

### Step 012: Inquiries Gateway (`20260904000012_inquiries.sql`)
- Creates `public.inquiries` linking buyer, seller, and listing.
- Enforces constraint `buyer_id != seller_id`.

### Step 013: Moderation Ledger (`20260904000013_moderation_events.sql`)
- Creates `public.moderation_events` audit table recording admin actions on listings and users.

### Step 014: High-Performance Indexes (`20260904000014_indexes.sql`)
- Creates compound B-tree indexes for active marketplace search (`category`, `state_code`, `published_at DESC`).
- Creates time-series index on `crop_prices(crop_id, market_id, price_date DESC)`.

### Step 015: Zero-Trust Row Level Security (`20260904000015_rls_policies.sql`)
- Enables RLS on all 12 tables.
- Creates `is_admin()` security-definer helper.
- Applies all 32 granular SELECT, INSERT, UPDATE, DELETE policies.
- Creates public view `marketplace_seller_public`.

### Step 016: Reference Seed Data (`20260904000016_seed_reference.sql`)
- Seeds all 18 official Sudanese states with English and Arabic names.
- Seeds initial Phase 1 markets:
  - Gedaref Crop Exchange (سوق القضارف للمحاصيل)
  - Kassala Central Market (سوق كسلا المركزي)
  - Port Sudan Wholesale Terminal (سوق بورتسودان للصادر)
  - El Obeid Crop Market (سوق محصولات الأبيض)
  - Khartoum Central Market (السوق المركزي الخرطوم)
- Seeds initial 8 crops: Sorghum, Sesame, Groundnuts, Gum Arabic, Wheat, Millet, Cotton, Sunflower.

### Step 017: Staging Demo Seeds (`20260904000017_seed_demo_staging_only.sql`)
- **STAGING / DEV ENVIRONMENT ONLY:** Never executed in production!
- Seeds test profiles, sample farms, and test listings matching current `lib/mock-data/` values to ensure zero UI regression.

---

## 4. Rollback & Disaster Recovery Strategy

Every migration file is paired with an inverted teardown command:
- If Step 010 (`listings`) fails during execution, a targeted rollback drops only Step 010.
- Because `waitlist` is excluded from migrations, user pre-registrations are never affected by migration rollbacks.
- Supabase CLI automatically tracks applied migration versions in `supabase_migrations.schema_migrations`.
