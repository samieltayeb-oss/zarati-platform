-- ==============================================================================
-- Migration 009: Create Crop Prices Time-Series Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.crop_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE RESTRICT,
  market_id UUID REFERENCES public.markets(id) ON DELETE SET NULL,
  price_sdg NUMERIC(12,2) NOT NULL CHECK (price_sdg > 0),
  price_usd NUMERIC(10,2) CHECK (price_usd IS NULL OR price_usd > 0),
  currency TEXT NOT NULL DEFAULT 'SDG' CHECK (currency IN ('SDG', 'USD')),
  unit TEXT NOT NULL DEFAULT 'ton' CHECK (unit IN ('ton', 'kantar', 'bag_50kg', 'bag_100kg', 'kg')),
  price_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL DEFAULT 'market_authority'
    CHECK (source IN ('market_authority', 'trader_survey', 'fao_amis', 'ebus_sudan', 'admin_override')),
  is_official BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_crop_market_date UNIQUE (crop_id, market_id, price_date, unit)
);

CREATE INDEX IF NOT EXISTS idx_crop_prices_lookup ON public.crop_prices (crop_id, price_date DESC);
CREATE INDEX IF NOT EXISTS idx_crop_prices_market ON public.crop_prices (market_id, price_date DESC);
