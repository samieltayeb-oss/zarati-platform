-- ==============================================================================
-- Migration 021: R3 Marketplace Discovery Foundation
-- ==============================================================================

-- 1. Extend listings
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS available_from DATE,
ADD COLUMN IF NOT EXISTS available_until DATE,
ADD COLUMN IF NOT EXISTS farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS moderation_status TEXT NOT NULL DEFAULT 'pending' 
  CHECK (moderation_status IN ('pending', 'approved', 'rejected'));

-- Update price check to allow 0 temporarily if needed, but the prompt says:
-- "price = 0 must NOT represent missing price... price NUMERIC NULLABLE... price > 0".
-- Let's drop the old constraint and add the new one.
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_price_check;
ALTER TABLE public.listings ADD CONSTRAINT listings_price_check CHECK (price IS NULL OR price > 0);

-- Make price and currency nullable
ALTER TABLE public.listings ALTER COLUMN price DROP NOT NULL;
ALTER TABLE public.listings ALTER COLUMN currency DROP NOT NULL;

-- 2. Extend inquiries (RFQs)
-- Update status check constraint
ALTER TABLE public.inquiries DROP CONSTRAINT IF EXISTS inquiries_status_check;
ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_status_check 
  CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn', 'expired', 'closed'));

-- Ensure unique active RFQ per buyer/listing pair
DROP INDEX IF EXISTS idx_unique_open_rfq;
CREATE UNIQUE INDEX idx_unique_open_rfq ON public.inquiries (buyer_id, listing_id) WHERE status IN ('pending', 'accepted');

-- 3. Create secure public_listings_view
DROP VIEW IF EXISTS public.public_listings_view;
CREATE VIEW public.public_listings_view AS
SELECT
  l.id,
  l.category,
  l.crop_id,
  l.title_en,
  l.title_ar,
  l.description_en,
  l.description_ar,
  l.price,
  l.currency,
  l.unit,
  l.quantity,
  l.state_id,
  l.market_id,
  l.location_name_en,
  l.location_name_ar,
  l.available_from,
  l.available_until,
  l.created_at,
  l.updated_at
FROM public.listings l
WHERE l.status = 'active'
  AND l.moderation_status = 'approved'
  AND (l.expires_at IS NULL OR l.expires_at > NOW());

-- Revoke anonymous access from raw listings table
REVOKE SELECT ON public.listings FROM anon;
-- Grant select on view
GRANT SELECT ON public.public_listings_view TO anon, authenticated;

-- 4. RLS for listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Farmer can read own listings
DROP POLICY IF EXISTS "Farmers can read own listings" ON public.listings;
CREATE POLICY "Farmers can read own listings"
ON public.listings FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Farmer can insert own listings
DROP POLICY IF EXISTS "Farmers can insert own listings" ON public.listings;
CREATE POLICY "Farmers can insert own listings"
ON public.listings FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Farmer can update own listings
DROP POLICY IF EXISTS "Farmers can update own listings" ON public.listings;
CREATE POLICY "Farmers can update own listings"
ON public.listings FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Farmer can delete own listings (if draft or archived)
DROP POLICY IF EXISTS "Farmers can delete own draft/archived listings" ON public.listings;
CREATE POLICY "Farmers can delete own draft/archived listings"
ON public.listings FOR DELETE
TO authenticated
USING (user_id = auth.uid() AND status IN ('draft', 'archived'));


-- 5. RLS for inquiries (RFQs)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Buyer can read own
DROP POLICY IF EXISTS "Buyers can read own inquiries" ON public.inquiries;
CREATE POLICY "Buyers can read own inquiries"
ON public.inquiries FOR SELECT
TO authenticated
USING (buyer_id = auth.uid());

-- Seller can read own
DROP POLICY IF EXISTS "Sellers can read received inquiries" ON public.inquiries;
CREATE POLICY "Sellers can read received inquiries"
ON public.inquiries FOR SELECT
TO authenticated
USING (seller_id = auth.uid());

-- Buyer can insert
DROP POLICY IF EXISTS "Buyers can insert inquiries" ON public.inquiries;
CREATE POLICY "Buyers can insert inquiries"
ON public.inquiries FOR INSERT
TO authenticated
WITH CHECK (buyer_id = auth.uid());

-- Buyer can update (withdraw/close)
DROP POLICY IF EXISTS "Buyers can update own inquiries" ON public.inquiries;
CREATE POLICY "Buyers can update own inquiries"
ON public.inquiries FOR UPDATE
TO authenticated
USING (buyer_id = auth.uid())
WITH CHECK (buyer_id = auth.uid());

-- Seller can update (accept/reject/close)
DROP POLICY IF EXISTS "Sellers can update received inquiries" ON public.inquiries;
CREATE POLICY "Sellers can update received inquiries"
ON public.inquiries FOR UPDATE
TO authenticated
USING (seller_id = auth.uid())
WITH CHECK (seller_id = auth.uid());


-- 6. RPC: Secure Contact Release
DROP FUNCTION IF EXISTS public.get_rfq_contact_details(UUID);
CREATE OR REPLACE FUNCTION public.get_rfq_contact_details(p_inquiry_id UUID)
RETURNS TABLE (
  role TEXT,
  phone TEXT,
  email TEXT,
  full_name TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inquiry public.inquiries%ROWTYPE;
  v_caller_uid UUID;
  v_counterpart_uid UUID;
BEGIN
  v_caller_uid := auth.uid();
  
  -- Find inquiry
  SELECT * INTO v_inquiry FROM public.inquiries WHERE id = p_inquiry_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inquiry not found';
  END IF;
  
  -- Must be accepted or closed
  IF v_inquiry.status NOT IN ('accepted', 'closed') THEN
    RAISE EXCEPTION 'Contact details only available for accepted RFQs';
  END IF;
  
  -- Verify caller is involved and determine counterpart
  IF v_caller_uid = v_inquiry.buyer_id THEN
    v_counterpart_uid := v_inquiry.seller_id;
    role := 'seller';
  ELSIF v_caller_uid = v_inquiry.seller_id THEN
    v_counterpart_uid := v_inquiry.buyer_id;
    role := 'buyer';
  ELSE
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  -- Return counterpart details safely
  RETURN QUERY
  SELECT 
    role,
    p.phone,
    p.email,
    p.full_name
  FROM public.profiles p
  WHERE p.id = v_counterpart_uid;
END;
$$;

