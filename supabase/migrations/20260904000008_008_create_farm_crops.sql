-- ==============================================================================
-- Migration 008: Create Farm Crops Junction Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.farm_crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE RESTRICT,
  season TEXT NOT NULL CHECK (season IN ('summer', 'winter', 'autumn', 'perennial')),
  season_year SMALLINT NOT NULL CHECK (season_year BETWEEN 2020 AND 2100),
  allocated_area_value NUMERIC(10,2) CHECK (allocated_area_value > 0),
  allocated_area_unit TEXT DEFAULT 'feddan' CHECK (allocated_area_unit IN ('feddan', 'hectare', 'acre')),
  planting_date DATE,
  harvest_date DATE,
  expected_yield_tons NUMERIC(10,2) CHECK (expected_yield_tons >= 0),
  actual_yield_tons NUMERIC(10,2) CHECK (actual_yield_tons >= 0),
  status TEXT NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'planted', 'growing', 'harvesting', 'harvested', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_farm_crop_season UNIQUE (farm_id, crop_id, season, season_year),
  CONSTRAINT chk_harvest_after_planting CHECK (harvest_date IS NULL OR planting_date IS NULL OR harvest_date >= planting_date)
);

CREATE INDEX IF NOT EXISTS idx_farm_crops_farm ON public.farm_crops (farm_id);
CREATE INDEX IF NOT EXISTS idx_farm_crops_crop ON public.farm_crops (crop_id);
CREATE INDEX IF NOT EXISTS idx_farm_crops_status ON public.farm_crops (status);

DROP TRIGGER IF EXISTS trg_farm_crops_updated_at ON public.farm_crops;
CREATE TRIGGER trg_farm_crops_updated_at
  BEFORE UPDATE ON public.farm_crops
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();
