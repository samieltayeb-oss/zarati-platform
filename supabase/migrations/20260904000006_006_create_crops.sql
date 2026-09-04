-- ==============================================================================
-- Migration 006: Create Crops Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('grain', 'oilseed', 'cash', 'vegetable', 'fruit', 'fodder')),
  standard_unit TEXT NOT NULL DEFAULT 'ton'
    CHECK (standard_unit IN ('ton', 'kantar', 'bag_50kg', 'bag_100kg', 'kg', 'bundle')),
  sort_order SMALLINT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crops_category ON public.crops (category);
CREATE INDEX IF NOT EXISTS idx_crops_sort_order ON public.crops (sort_order);
CREATE INDEX IF NOT EXISTS idx_crops_is_active ON public.crops (is_active);
