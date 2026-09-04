-- ==============================================================================
-- Migration 010: Create Marketplace Listings Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('crops', 'equipment', 'seeds', 'fertilizer')),
  crop_id UUID REFERENCES public.crops(id) ON DELETE RESTRICT,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  price NUMERIC(14,2) NOT NULL CHECK (price >= 0),
  currency TEXT NOT NULL DEFAULT 'SDG' CHECK (currency IN ('SDG', 'USD')),
  unit TEXT NOT NULL,
  quantity NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
  state_id UUID NOT NULL REFERENCES public.states(id) ON DELETE RESTRICT,
  market_id UUID REFERENCES public.markets(id) ON DELETE SET NULL,
  location_name_en TEXT,
  location_name_ar TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft', 'pending_review', 'active', 'paused', 'sold', 'expired', 'archived')),
  featured BOOLEAN NOT NULL DEFAULT false,
  views_count INTEGER NOT NULL DEFAULT 0 CHECK (views_count >= 0),
  inquiries_count INTEGER NOT NULL DEFAULT 0 CHECK (inquiries_count >= 0),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_user ON public.listings (user_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings (category);
CREATE INDEX IF NOT EXISTS idx_listings_state ON public.listings (state_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings (status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_browse ON public.listings (category, status, created_at DESC);

DROP TRIGGER IF EXISTS trg_listings_updated_at ON public.listings;
CREATE TRIGGER trg_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();
