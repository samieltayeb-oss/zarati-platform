-- Fix ambiguous "role" in get_rfq_contact_details
-- Preserve SECURITY DEFINER and search_path='' for security

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
SET search_path = ''
AS $$
DECLARE
  v_inquiry public.inquiries%ROWTYPE;
  v_caller_uid UUID;
  v_counterpart_uid UUID;
  v_caller_status TEXT;
  v_role_val TEXT;
BEGIN
  v_caller_uid := auth.uid();
  
  -- Check if caller is active
  SELECT status INTO v_caller_status FROM public.profiles WHERE id = v_caller_uid;
  IF v_caller_status != 'active' THEN
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
    v_role_val := 'seller';
  ELSIF v_caller_uid = v_inquiry.seller_id THEN
    v_counterpart_uid := v_inquiry.buyer_id;
    v_role_val := 'buyer';
  ELSE
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  -- Return counterpart details safely (no ambiguous names)
  RETURN QUERY
  SELECT 
    v_role_val,
    p.phone,
    p.email,
    p.full_name
  FROM public.profiles p
  WHERE p.id = v_counterpart_uid;
END;
$$;
