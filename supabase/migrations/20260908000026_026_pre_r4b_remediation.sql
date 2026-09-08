-- 026_pre_r4b_remediation.sql

-- ====================================================================================
-- PART 1: LISTING RLS / MODERATION FIX
-- ====================================================================================

-- Drop ALL existing listings policies to avoid any OR conflicts
DROP POLICY IF EXISTS "listings_select_public" ON public.listings;
DROP POLICY IF EXISTS "listings_insert_owner" ON public.listings;
DROP POLICY IF EXISTS "listings_update_owner" ON public.listings;
DROP POLICY IF EXISTS "listings_delete_owner" ON public.listings;
DROP POLICY IF EXISTS "Farmers can read own listings" ON public.listings;
DROP POLICY IF EXISTS "Farmers can insert own listings" ON public.listings;
DROP POLICY IF EXISTS "Farmers can update own listings" ON public.listings;
DROP POLICY IF EXISTS "Farmers can delete own draft/archived listings" ON public.listings;

-- Recreate properly scoped policies
CREATE POLICY "listings_select_public"
ON public.listings FOR SELECT
USING (status = 'active' OR user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Farmers can insert own listings"
ON public.listings FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() AND public.is_active_user());

CREATE POLICY "Farmers can update own listings"
ON public.listings FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND public.is_active_user())
WITH CHECK (user_id = auth.uid() AND public.is_active_user());

CREATE POLICY "Farmers can delete own draft/archived listings"
ON public.listings FOR DELETE
TO authenticated
USING (user_id = auth.uid() AND status IN ('draft', 'archived') AND public.is_active_user());

-- Enforce listing field immutability for non-admins via trigger
CREATE OR REPLACE FUNCTION public.trg_enforce_listing_immutability()
RETURNS trigger AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'Cannot change listing owner';
    END IF;
    IF NEW.moderation_status IS DISTINCT FROM OLD.moderation_status THEN
      RAISE EXCEPTION 'Cannot self-moderate listing';
    END IF;
    -- Note: Add other admin-only fields here if they exist
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_listing_immutability ON public.listings;
CREATE TRIGGER enforce_listing_immutability
BEFORE UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.trg_enforce_listing_immutability();

-- ====================================================================================
-- PART 2: RFQ AUTHORIZATION FIX
-- ====================================================================================

CREATE OR REPLACE FUNCTION public.trg_enforce_inquiry_state()
RETURNS trigger AS $$
BEGIN
  -- If admin, allow any change
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  -- Buyer rules
  IF auth.uid() = OLD.buyer_id THEN
    -- Buyer cannot change seller_id, listing_id
    IF NEW.seller_id IS DISTINCT FROM OLD.seller_id OR NEW.listing_id IS DISTINCT FROM OLD.listing_id THEN
      RAISE EXCEPTION 'Buyer cannot change listing or seller';
    END IF;

    -- State transition checks for Buyer
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      IF OLD.status = 'pending' AND NEW.status = 'withdrawn' THEN
        -- Allowed
      ELSE
        RAISE EXCEPTION 'Buyer cannot transition from % to %', OLD.status, NEW.status;
      END IF;
    END IF;
  END IF;

  -- Seller rules
  IF auth.uid() = OLD.seller_id THEN
    -- Seller cannot change buyer_id, listing_id, offered_price, requested_quantity, message
    IF NEW.buyer_id IS DISTINCT FROM OLD.buyer_id OR 
       NEW.listing_id IS DISTINCT FROM OLD.listing_id OR
       NEW.offered_price IS DISTINCT FROM OLD.offered_price OR
       NEW.requested_quantity IS DISTINCT FROM OLD.requested_quantity OR
       NEW.message IS DISTINCT FROM OLD.message THEN
      RAISE EXCEPTION 'Seller cannot modify inquiry terms';
    END IF;

    -- State transition checks for Seller
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      IF OLD.status = 'pending' AND NEW.status IN ('accepted', 'rejected') THEN
        -- Allowed
      ELSIF OLD.status = 'accepted' AND NEW.status = 'closed' THEN
        -- Allowed
      ELSE
        RAISE EXCEPTION 'Seller cannot transition from % to %', OLD.status, NEW.status;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_inquiry_state ON public.inquiries;
CREATE TRIGGER enforce_inquiry_state
BEFORE UPDATE ON public.inquiries
FOR EACH ROW
EXECUTE FUNCTION public.trg_enforce_inquiry_state();

