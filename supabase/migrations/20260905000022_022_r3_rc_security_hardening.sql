-- ==============================================================================
-- Migration 022: R3 RC Security Hardening
-- ==============================================================================

-- 1. Helper function for active user check (if not exists from R2)
CREATE OR REPLACE FUNCTION public.is_active_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND status = 'active'
  );
$$;

-- 2. Harden Listings RLS (Suspended/Banned enforcement)
DROP POLICY IF EXISTS "Farmers can insert own listings" ON public.listings;
CREATE POLICY "Farmers can insert own listings"
ON public.listings FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() AND public.is_active_user());

DROP POLICY IF EXISTS "Farmers can update own listings" ON public.listings;
CREATE POLICY "Farmers can update own listings"
ON public.listings FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND public.is_active_user())
WITH CHECK (user_id = auth.uid() AND public.is_active_user());

DROP POLICY IF EXISTS "Farmers can delete own draft/archived listings" ON public.listings;
CREATE POLICY "Farmers can delete own draft/archived listings"
ON public.listings FOR DELETE
TO authenticated
USING (user_id = auth.uid() AND status IN ('draft', 'archived') AND public.is_active_user());

-- 3. Harden Inquiries (RFQs) RLS (Suspended/Banned enforcement)
DROP POLICY IF EXISTS "Buyers can insert inquiries" ON public.inquiries;
CREATE POLICY "Buyers can insert inquiries"
ON public.inquiries FOR INSERT
TO authenticated
WITH CHECK (buyer_id = auth.uid() AND public.is_active_user());

DROP POLICY IF EXISTS "Buyers can update own inquiries" ON public.inquiries;
CREATE POLICY "Buyers can update own inquiries"
ON public.inquiries FOR UPDATE
TO authenticated
USING (buyer_id = auth.uid() AND public.is_active_user())
WITH CHECK (buyer_id = auth.uid() AND public.is_active_user());

DROP POLICY IF EXISTS "Sellers can update received inquiries" ON public.inquiries;
CREATE POLICY "Sellers can update received inquiries"
ON public.inquiries FOR UPDATE
TO authenticated
USING (seller_id = auth.uid() AND public.is_active_user())
WITH CHECK (seller_id = auth.uid() AND public.is_active_user());

-- 4. Harden Security Definer RPC: get_rfq_contact_details
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
SET search_path = '' -- Enforce empty search path to prevent search_path manipulation
AS $$
DECLARE
  v_inquiry public.inquiries%ROWTYPE;
  v_caller_uid UUID;
  v_counterpart_uid UUID;
BEGIN
  v_caller_uid := auth.uid();
  
  -- Caller must be active
  IF NOT public.is_active_user() THEN
    RAISE EXCEPTION 'Unauthorized: Account is suspended or banned';
  END IF;

  -- Find inquiry
  SELECT * INTO v_inquiry FROM public.inquiries WHERE id = p_inquiry_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inquiry not found';
  END IF;
  
  -- Must be accepted or closed
  IF v_inquiry.status NOT IN ('accepted', 'closed') THEN
    RAISE EXCEPTION 'Contact details only available for accepted or closed RFQs';
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
  
  -- Counterpart must be active
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_counterpart_uid AND status = 'active') THEN
     RAISE EXCEPTION 'Counterpart account is not active';
  END IF;

  -- Return counterpart details safely (minimum PII)
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
