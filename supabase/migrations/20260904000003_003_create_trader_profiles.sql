-- ==============================================================================
-- Migration 003: Create Trader Profiles Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.trader_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_name_ar TEXT,
  registration_number TEXT,
  tax_id TEXT,
  trader_type TEXT NOT NULL DEFAULT 'wholesaler'
    CHECK (trader_type IN ('wholesaler', 'exporter', 'processor', 'retailer', 'broker', 'input_supplier')),
  operating_markets JSONB NOT NULL DEFAULT '[]'::jsonb,
  commodities_of_interest JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_verified_trader BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.00
    CHECK (rating >= 1.00 AND rating <= 5.00),
  total_deals_completed INTEGER NOT NULL DEFAULT 0
    CHECK (total_deals_completed >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trader_type ON public.trader_profiles (trader_type);
CREATE INDEX IF NOT EXISTS idx_trader_verified ON public.trader_profiles (is_verified_trader);

-- Privilege protection trigger for trader credentials
CREATE OR REPLACE FUNCTION public.check_trader_privileges_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.is_verified_trader <> OLD.is_verified_trader OR NEW.rating <> OLD.rating OR NEW.total_deals_completed <> OLD.total_deals_completed THEN
    IF NOT (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized: Only platform administrators can modify trader verification or reputation metrics.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_trader_privileges ON public.trader_profiles;
CREATE TRIGGER trg_protect_trader_privileges
  BEFORE UPDATE ON public.trader_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_trader_privileges_update();

DROP TRIGGER IF EXISTS trg_trader_profiles_updated_at ON public.trader_profiles;
CREATE TRIGGER trg_trader_profiles_updated_at
  BEFORE UPDATE ON public.trader_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();
