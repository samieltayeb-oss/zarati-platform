-- ==============================================================================
-- Migration 019: Security Remediation (P0-001, P1-005, P1-006)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Suspended Account State (P0-001)
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles 
  ADD COLUMN status TEXT NOT NULL DEFAULT 'active' 
  CHECK (status IN ('active', 'suspended', 'banned'));

-- ------------------------------------------------------------------------------
-- 2. Consolidate and Fix Profile Update Triggers (P1-005)
-- ------------------------------------------------------------------------------
-- Drop the conflicting triggers from 002 and 018
DROP TRIGGER IF EXISTS trg_protect_profile_privileges ON public.profiles;
DROP FUNCTION IF EXISTS public.check_profile_privileges_update();

DROP TRIGGER IF EXISTS trg_protect_privileged_profile_fields ON public.profiles;
DROP FUNCTION IF EXISTS public.protect_privileged_profile_fields();

-- Create single authoritative trigger using IS DISTINCT FROM
CREATE OR REPLACE FUNCTION public.protect_privileged_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Prevent self-modification of role
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized: Only platform administrators can change user roles.';
    END IF;
  END IF;

  -- Prevent self-modification of verification status
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
    IF NOT (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized: Only platform administrators can modify verification status.';
    END IF;
  END IF;
  
  -- Prevent self-modification of account status
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NOT (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized: Only platform administrators can modify account status.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_protect_privileged_profile_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_privileged_profile_fields();

-- ------------------------------------------------------------------------------
-- 3. Overly Broad Anon Grants (P1-006)
-- ------------------------------------------------------------------------------
-- Revoke the overly broad ALL privileges from anon
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM anon;

-- Apply least-privilege specific grants for anon
-- Anon needs to SELECT public data
GRANT SELECT ON TABLE public.states TO anon;
GRANT SELECT ON TABLE public.markets TO anon;
GRANT SELECT ON TABLE public.crops TO anon;
GRANT SELECT ON TABLE public.crop_prices TO anon;
GRANT SELECT ON TABLE public.trader_profiles TO anon;
GRANT SELECT ON TABLE public.listings TO anon;
GRANT SELECT ON TABLE public.listing_media TO anon;

-- Anon needs to INSERT into waitlist
GRANT INSERT ON TABLE public.waitlist TO anon;

-- Fix DEFAULT PRIVILEGES so future tables don't automatically get ALL for anon
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON ROUTINES FROM anon;
-- ------------------------------------------------------------------------------
-- 4. Active User Helper & Mutation Protection (P0-001)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_active_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND status = 'active'
  );
$$;

-- Profiles
DROP POLICY IF EXISTS profiles_update_owner ON public.profiles;
CREATE POLICY profiles_update_owner ON public.profiles
  FOR UPDATE USING (auth.uid() = id AND public.is_active_user()) WITH CHECK (auth.uid() = id AND public.is_active_user());

-- Trader Profiles
DROP POLICY IF EXISTS trader_profiles_insert_owner ON public.trader_profiles;
CREATE POLICY trader_profiles_insert_owner ON public.trader_profiles
  FOR INSERT WITH CHECK (auth.uid() = id AND public.is_active_user());

DROP POLICY IF EXISTS trader_profiles_update_owner ON public.trader_profiles;
CREATE POLICY trader_profiles_update_owner ON public.trader_profiles
  FOR UPDATE USING (auth.uid() = id AND public.is_active_user()) WITH CHECK (auth.uid() = id AND public.is_active_user());

-- Farms
DROP POLICY IF EXISTS farms_insert_owner ON public.farms;
CREATE POLICY farms_insert_owner ON public.farms
  FOR INSERT WITH CHECK (farmer_id = auth.uid() AND public.is_active_user());

DROP POLICY IF EXISTS farms_update_owner ON public.farms;
CREATE POLICY farms_update_owner ON public.farms
  FOR UPDATE USING (farmer_id = auth.uid() AND public.is_active_user()) WITH CHECK (farmer_id = auth.uid() AND public.is_active_user());

DROP POLICY IF EXISTS farms_delete_owner_or_admin ON public.farms;
CREATE POLICY farms_delete_owner_or_admin ON public.farms
  FOR DELETE USING ((farmer_id = auth.uid() AND public.is_active_user()) OR public.is_admin());

-- Farm Crops
DROP POLICY IF EXISTS farm_crops_insert_owner ON public.farm_crops;
CREATE POLICY farm_crops_insert_owner ON public.farm_crops
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_crops.farm_id AND farmer_id = auth.uid() AND public.is_active_user())
  );

DROP POLICY IF EXISTS farm_crops_update_owner ON public.farm_crops;
CREATE POLICY farm_crops_update_owner ON public.farm_crops
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_crops.farm_id AND farmer_id = auth.uid() AND public.is_active_user())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_crops.farm_id AND farmer_id = auth.uid() AND public.is_active_user())
  );

DROP POLICY IF EXISTS farm_crops_delete_owner ON public.farm_crops;
CREATE POLICY farm_crops_delete_owner ON public.farm_crops
  FOR DELETE USING (
    (EXISTS (SELECT 1 FROM public.farms WHERE id = farm_crops.farm_id AND farmer_id = auth.uid() AND public.is_active_user()))
    OR public.is_admin()
  );

-- Listings
DROP POLICY IF EXISTS listings_insert_owner ON public.listings;
CREATE POLICY listings_insert_owner ON public.listings
  FOR INSERT WITH CHECK (user_id = auth.uid() AND public.is_active_user());

DROP POLICY IF EXISTS listings_update_owner ON public.listings;
CREATE POLICY listings_update_owner ON public.listings
  FOR UPDATE USING ((user_id = auth.uid() AND public.is_active_user()) OR public.is_admin())
  WITH CHECK ((user_id = auth.uid() AND public.is_active_user()) OR public.is_admin());

DROP POLICY IF EXISTS listings_delete_owner ON public.listings;
CREATE POLICY listings_delete_owner ON public.listings
  FOR DELETE USING ((user_id = auth.uid() AND public.is_active_user()) OR public.is_admin());

-- Listing Media
DROP POLICY IF EXISTS listing_media_insert_owner ON public.listing_media;
CREATE POLICY listing_media_insert_owner ON public.listing_media
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_media.listing_id AND l.user_id = auth.uid() AND public.is_active_user()
    )
  );

DROP POLICY IF EXISTS listing_media_delete_owner ON public.listing_media;
CREATE POLICY listing_media_delete_owner ON public.listing_media
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_media.listing_id AND l.user_id = auth.uid() AND public.is_active_user()
    )
    OR public.is_admin()
  );

-- Inquiries
DROP POLICY IF EXISTS inquiries_insert_buyer ON public.inquiries;
CREATE POLICY inquiries_insert_buyer ON public.inquiries
  FOR INSERT WITH CHECK (
    buyer_id = auth.uid() AND public.is_active_user()
  );

DROP POLICY IF EXISTS inquiries_update_participants ON public.inquiries;
CREATE POLICY inquiries_update_participants ON public.inquiries
  FOR UPDATE USING (
    ((buyer_id = auth.uid() OR seller_id = auth.uid()) AND public.is_active_user()) OR public.is_admin()
  ) WITH CHECK (
    ((buyer_id = auth.uid() OR seller_id = auth.uid()) AND public.is_active_user()) OR public.is_admin()
  );
