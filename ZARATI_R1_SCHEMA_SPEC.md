# ZARATI | زرعتي — Database Schema Specification (Phase R1-A)
**Version:** 1.0.0-draft  
**Date:** September 4, 2026  
**Status:** ARCHITECTURE & SPECIFICATION ONLY (Zero SQL executed)  
**Database Target:** PostgreSQL 15+ (Supabase)  
**Project Path:** `C:\Users\mcreg\Desktop\zarati`

---

## 1. Schema Extensions & Common Helpers

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 2. Table Specifications

### 2.1 Table: `profiles`
**Purpose:** 1:1 public extension of Supabase `auth.users`. Stores application identity, role, language preference, and location.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'farmer'
    CHECK (role IN ('farmer', 'trader', 'admin', 'government', 'ngo', 'institution')),
  full_name TEXT NOT NULL CHECK (char_length(trim(full_name)) >= 2),
  phone TEXT UNIQUE CHECK (phone IS NULL OR phone ~ '^\+?[0-9]{9,15}$'),
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  preferred_language TEXT NOT NULL DEFAULT 'ar'
    CHECK (preferred_language IN ('ar', 'en')),
  state_code TEXT, -- Foreign key to states(code) added below
  locality TEXT,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'pending_verification')),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active_at TIMESTAMPTZ
);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.profiles IS 'Application user profile linked 1:1 to Supabase auth.users';
```

---

### 2.2 Table: `trader_profiles`
**Purpose:** Stores commercial and institutional attributes for traders without polluting smallholder farmer profiles.

```sql
CREATE TABLE public.trader_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  business_type TEXT NOT NULL DEFAULT 'individual'
    CHECK (business_type IN ('individual', 'wholesaler', 'processor', 'exporter', 'cooperative')),
  commercial_registration_no TEXT,
  tax_identification_no TEXT,
  preferred_crops TEXT[] DEFAULT '{}',
  trade_capacity_tons NUMERIC(10,2),
  verification_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_trader_profiles_updated_at
  BEFORE UPDATE ON public.trader_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

### 2.3 Table: `states` (Master Reference)
**Purpose:** Canonical geographic master data for all 18 Sudanese states.

```sql
CREATE TABLE public.states (
  code TEXT PRIMARY KEY CHECK (code ~ '^SD-[A-Z]{2}$'), -- ISO 3166-2:SD
  name_en TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL UNIQUE,
  capital_en TEXT NOT NULL,
  capital_ar TEXT NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('eastern', 'central', 'northern', 'darfur', 'kordofan', 'khartoum')),
  sort_order INT NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add foreign key constraint to profiles.state_code
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_state
  FOREIGN KEY (state_code) REFERENCES public.states(code)
  ON DELETE SET NULL;
```

---

### 2.4 Table: `markets` (Master Reference)
**Purpose:** Physical commodity exchanges, wholesale terminals, and rural crop auction yards.

```sql
CREATE TABLE public.markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE CHECK (code ~ '^MKT-[A-Z0-9-]+$'),
  state_code TEXT NOT NULL REFERENCES public.states(code) ON DELETE RESTRICT,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  locality TEXT NOT NULL,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_markets_updated_at
  BEFORE UPDATE ON public.markets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

### 2.5 Table: `crops` (Master Reference)
**Purpose:** Canonical catalogue of agricultural commodities produced in Sudan.

```sql
CREATE TABLE public.crops (
  id TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9-]+$'), -- e.g. 'sorghum', 'sesame'
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL
    CHECK (category IN ('grain', 'oilseed', 'cash', 'pulse', 'vegetable', 'fruit')),
  default_unit TEXT NOT NULL DEFAULT 'ton'
    CHECK (default_unit IN ('ton', 'kg', 'sack', 'gantar')),
  standard_sack_kg NUMERIC(6,2), -- e.g. 100kg for sorghum sack, 45kg for sesame
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_crops_updated_at
  BEFORE UPDATE ON public.crops
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

### 2.6 Table: `farms`
**Purpose:** Multi-farm management for farmers, supporting multi-unit land storage.

```sql
CREATE TABLE public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  state_code TEXT NOT NULL REFERENCES public.states(code) ON DELETE RESTRICT,
  locality TEXT NOT NULL,
  village TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  area_value NUMERIC(12,2) NOT NULL CHECK (area_value > 0),
  area_unit TEXT NOT NULL DEFAULT 'feddan'
    CHECK (area_unit IN ('feddan', 'hectare', 'acre')),
  area_hectares NUMERIC(12,2) GENERATED ALWAYS AS (
    CASE 
      WHEN area_unit = 'hectare' THEN area_value
      WHEN area_unit = 'feddan'  THEN ROUND(area_value * 0.4200, 2)
      WHEN area_unit = 'acre'    THEN ROUND(area_value * 0.4047, 2)
      ELSE area_value
    END
  ) STORED,
  irrigation_type TEXT NOT NULL DEFAULT 'rainfed'
    CHECK (irrigation_type IN ('rainfed', 'irrigated_nile', 'irrigated_well', 'flood_spate')),
  soil_type TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_farms_updated_at
  BEFORE UPDATE ON public.farms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

### 2.7 Table: `farm_crops`
**Purpose:** Records active plantings and seasonal crop allocation per farm.

```sql
CREATE TABLE public.farm_crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  crop_id TEXT NOT NULL REFERENCES public.crops(id) ON DELETE RESTRICT,
  season TEXT NOT NULL, -- e.g. 'kharif_2026', 'shitwi_2026'
  planted_area NUMERIC(10,2) CHECK (planted_area IS NULL OR planted_area > 0),
  area_unit TEXT DEFAULT 'feddan' CHECK (area_unit IN ('feddan', 'hectare')),
  planting_date DATE,
  expected_harvest_date DATE,
  status TEXT NOT NULL DEFAULT 'planted'
    CHECK (status IN ('planned', 'planted', 'growing', 'harvested', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_farm_crop_season UNIQUE (farm_id, crop_id, season)
);

CREATE TRIGGER set_farm_crops_updated_at
  BEFORE UPDATE ON public.farm_crops
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

### 2.8 Table: `crop_prices`
**Purpose:** Append-only daily commodity price bulletin observations.

```sql
CREATE TABLE public.crop_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id TEXT NOT NULL REFERENCES public.crops(id) ON DELETE RESTRICT,
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE RESTRICT,
  price_sdg NUMERIC(12,2) NOT NULL CHECK (price_sdg > 0),
  currency CHAR(3) NOT NULL DEFAULT 'SDG',
  unit TEXT NOT NULL DEFAULT 'ton' CHECK (unit IN ('ton', 'sack', 'kg', 'gantar')),
  price_date DATE NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'exchange'
    CHECK (source_type IN ('exchange', 'bulletin', 'enumerator', 'official', 'partner')),
  source_name TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  change_sdg NUMERIC(12,2) DEFAULT 0,
  change_percent NUMERIC(6,2) DEFAULT 0,
  entered_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_crop_market_date UNIQUE (crop_id, market_id, price_date, unit)
);

CREATE TRIGGER set_crop_prices_updated_at
  BEFORE UPDATE ON public.crop_prices
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

### 2.9 Table: `listings`
**Purpose:** Central marketplace supply offerings created by farmers or vendors.

```sql
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
  crop_id TEXT REFERENCES public.crops(id) ON DELETE RESTRICT,
  category TEXT NOT NULL DEFAULT 'crops'
    CHECK (category IN ('crops', 'equipment', 'seeds', 'fertilizer')),
  title_ar TEXT NOT NULL CHECK (char_length(trim(title_ar)) >= 3),
  title_en TEXT NOT NULL CHECK (char_length(trim(title_en)) >= 3),
  description_ar TEXT,
  description_en TEXT,
  quantity NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
  quantity_unit TEXT NOT NULL DEFAULT 'ton'
    CHECK (quantity_unit IN ('ton', 'kg', 'sack', 'unit', 'day', 'bag (50kg)', 'bag (25kg)')),
  price_sdg NUMERIC(14,2) NOT NULL CHECK (price_sdg > 0),
  currency CHAR(3) NOT NULL DEFAULT 'SDG',
  price_type TEXT NOT NULL DEFAULT 'negotiable'
    CHECK (price_type IN ('fixed', 'negotiable', 'starting_bid')),
  state_code TEXT NOT NULL REFERENCES public.states(code) ON DELETE RESTRICT,
  locality TEXT NOT NULL,
  harvest_date DATE,
  quality_grade TEXT CHECK (quality_grade IN ('grade_1', 'grade_2', 'grade_3', 'export', 'standard')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft', 'active', 'paused', 'sold', 'expired', 'archived')),
  moderation_status TEXT NOT NULL DEFAULT 'approved' -- Default approved for verified farmers in MVP
    CHECK (moderation_status IN ('pending_review', 'approved', 'rejected')),
  rejection_reason TEXT,
  moderated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  moderated_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

### 2.10 Table: `listing_media`
**Purpose:** Photo attachments for listings stored in Supabase Storage bucket `listing-images`.

```sql
CREATE TABLE public.listing_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image/jpeg'
    CHECK (media_type IN ('image/jpeg', 'image/png', 'image/webp')),
  file_size_bytes INT CHECK (file_size_bytes <= 5242880), -- 5MB limit
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 2.11 Table: `inquiries`
**Purpose:** Asynchronous lead capture and commercial communication gateway between traders and sellers.

```sql
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL CHECK (char_length(trim(message)) >= 5),
  requested_quantity NUMERIC(12,2) CHECK (requested_quantity IS NULL OR requested_quantity > 0),
  quantity_unit TEXT,
  offered_price_sdg NUMERIC(14,2) CHECK (offered_price_sdg IS NULL OR offered_price_sdg > 0),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'responded', 'closed', 'cancelled')),
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_different_parties CHECK (buyer_id != seller_id)
);

CREATE TRIGGER set_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

### 2.12 Table: `moderation_events` (Auditability)
**Purpose:** Immutable ledger of admin actions on users and listings.

```sql
CREATE TABLE public.moderation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  target_type TEXT NOT NULL CHECK (target_type IN ('listing', 'profile', 'price')),
  target_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approve', 'reject', 'suspend', 'reinstate', 'override_price')),
  reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 2.13 Table: `waitlist` (Preserved Existing Table)
**Purpose:** Preserved untouched from current production for early signups and pre-launch interest.

```sql
-- Already present in Supabase. Documented here for reference integrity:
-- TABLE public.waitlist (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   email TEXT NOT NULL UNIQUE,
--   role TEXT NOT NULL,
--   language TEXT NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT now()
-- );
```

---

## 3. High-Performance Indexing Strategy

```sql
-- Profiles Indexes
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_state ON public.profiles(state_code);
CREATE INDEX idx_profiles_phone ON public.profiles(phone) WHERE phone IS NOT NULL;

-- Farms Indexes
CREATE INDEX idx_farms_farmer ON public.farms(farmer_id);
CREATE INDEX idx_farms_state ON public.farms(state_code);

-- Farm Crops Indexes
CREATE INDEX idx_farm_crops_farm ON public.farm_crops(farm_id);
CREATE INDEX idx_farm_crops_crop ON public.farm_crops(crop_id);

-- Crop Prices Time-Series Indexes (Critical for instant chart and snapshot rendering)
CREATE INDEX idx_crop_prices_lookup ON public.crop_prices(crop_id, market_id, price_date DESC);
CREATE INDEX idx_crop_prices_market ON public.crop_prices(market_id, price_date DESC);
CREATE INDEX idx_crop_prices_date ON public.crop_prices(price_date DESC);

-- Listings Marketplace Indexes (Critical for search, filtering, and pagination)
CREATE INDEX idx_listings_marketplace_active 
  ON public.listings(category, state_code, published_at DESC) 
  WHERE status = 'active' AND moderation_status = 'approved';

CREATE INDEX idx_listings_seller ON public.listings(seller_id, status);
CREATE INDEX idx_listings_crop ON public.listings(crop_id) WHERE crop_id IS NOT NULL;

-- Inquiries Communication Indexes
CREATE INDEX idx_inquiries_buyer ON public.inquiries(buyer_id, status, created_at DESC);
CREATE INDEX idx_inquiries_seller ON public.inquiries(seller_id, status, created_at DESC);
CREATE INDEX idx_inquiries_listing ON public.inquiries(listing_id, created_at DESC);

-- Listing Media
CREATE INDEX idx_listing_media_listing ON public.listing_media(listing_id, sort_order);
```
