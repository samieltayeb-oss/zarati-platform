-- ==============================================================================
-- Migration 007: Create Farms Table with Sudanese Land Area Engine
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT,
  state_id UUID NOT NULL REFERENCES public.states(id) ON DELETE RESTRICT,
  locality TEXT,
  area_value NUMERIC(10,2) NOT NULL CHECK (area_value > 0),
  area_unit TEXT NOT NULL DEFAULT 'feddan'
    CHECK (area_unit IN ('feddan', 'hectare', 'acre')),
  area_hectares NUMERIC(10,2) GENERATED ALWAYS AS (
    ROUND(
      CASE
        WHEN area_unit = 'feddan' THEN area_value * 0.4200
        WHEN area_unit = 'hectare' THEN area_value
        WHEN area_unit = 'acre' THEN area_value * 0.4047
      END,
      2
    )
  ) STORED,
  irrigation_type TEXT NOT NULL DEFAULT 'rainfed'
    CHECK (irrigation_type IN ('rainfed', 'irrigated_nile', 'irrigated_groundwater', 'flood_spate')),
  soil_type TEXT CHECK (soil_type IN ('clay', 'sandy_goz', 'alluvial', 'loam')),
  latitude NUMERIC(9,6) CHECK (latitude IS NULL OR (latitude BETWEEN 8.000000 AND 23.000000)),
  longitude NUMERIC(9,6) CHECK (longitude IS NULL OR (longitude BETWEEN 21.000000 AND 39.000000)),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farms_farmer ON public.farms (farmer_id);
CREATE INDEX IF NOT EXISTS idx_farms_state ON public.farms (state_id);
CREATE INDEX IF NOT EXISTS idx_farms_irrigation ON public.farms (irrigation_type);

DROP TRIGGER IF EXISTS trg_farms_updated_at ON public.farms;
CREATE TRIGGER trg_farms_updated_at
  BEFORE UPDATE ON public.farms
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();
