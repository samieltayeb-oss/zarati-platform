-- ==============================================================================
-- Migration 005: Create Markets Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID NOT NULL REFERENCES public.states(id) ON DELETE RESTRICT,
  code TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  city_en TEXT NOT NULL,
  city_ar TEXT NOT NULL,
  market_type TEXT NOT NULL DEFAULT 'physical'
    CHECK (market_type IN ('physical', 'auction', 'terminal', 'border_post')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_markets_state ON public.markets (state_id);
CREATE INDEX IF NOT EXISTS idx_markets_is_active ON public.markets (is_active);
