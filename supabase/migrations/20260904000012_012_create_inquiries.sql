-- ==============================================================================
-- Migration 012: Create Inquiries Table with Buyer/Seller Isolation
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  offered_price NUMERIC(14,2) CHECK (offered_price IS NULL OR offered_price > 0),
  requested_quantity NUMERIC(12,2) CHECK (requested_quantity IS NULL OR requested_quantity > 0),
  message TEXT NOT NULL,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_buyer_not_seller CHECK (buyer_id <> seller_id)
);

CREATE INDEX IF NOT EXISTS idx_inquiries_listing ON public.inquiries (listing_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_buyer ON public.inquiries (buyer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_seller ON public.inquiries (seller_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);

DROP TRIGGER IF EXISTS trg_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER trg_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();
