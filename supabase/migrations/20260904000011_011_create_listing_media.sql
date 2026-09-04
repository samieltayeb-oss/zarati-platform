-- ==============================================================================
-- Migration 011: Create Listing Media Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.listing_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image/jpeg'
    CHECK (media_type IN ('image/jpeg', 'image/png', 'image/webp')),
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listing_media_listing ON public.listing_media (listing_id, sort_order);
