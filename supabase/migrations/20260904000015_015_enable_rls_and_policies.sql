-- ==============================================================================
-- Migration 015: Enable Row Level Security (RLS) and Create Security Policies
-- ==============================================================================

-- Enable RLS across all application tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trader_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_events ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 1. Profiles Table Policies
-- ------------------------------------------------------------------------------
CREATE POLICY profiles_select_owner ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY profiles_select_admin ON public.profiles
  FOR SELECT USING (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY profiles_insert_service_or_owner ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY profiles_update_owner ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_delete_admin ON public.profiles
  FOR DELETE USING (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role');

-- ------------------------------------------------------------------------------
-- 2. Trader Profiles Table Policies
-- ------------------------------------------------------------------------------
CREATE POLICY trader_profiles_select_public ON public.trader_profiles
  FOR SELECT USING (true);

CREATE POLICY trader_profiles_insert_owner ON public.trader_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY trader_profiles_update_owner ON public.trader_profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY trader_profiles_delete_admin ON public.trader_profiles
  FOR DELETE USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. States Reference Policies
-- ------------------------------------------------------------------------------
CREATE POLICY states_select_public ON public.states
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY states_admin_mutation ON public.states
  FOR ALL USING (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role');

-- ------------------------------------------------------------------------------
-- 4. Markets Reference Policies
-- ------------------------------------------------------------------------------
CREATE POLICY markets_select_public ON public.markets
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY markets_admin_mutation ON public.markets
  FOR ALL USING (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role');

-- ------------------------------------------------------------------------------
-- 5. Crops Reference Policies
-- ------------------------------------------------------------------------------
CREATE POLICY crops_select_public ON public.crops
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY crops_admin_mutation ON public.crops
  FOR ALL USING (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role');

-- ------------------------------------------------------------------------------
-- 6. Farms Policies
-- ------------------------------------------------------------------------------
CREATE POLICY farms_select_owner_or_admin ON public.farms
  FOR SELECT USING (farmer_id = auth.uid() OR public.is_admin());

CREATE POLICY farms_insert_owner ON public.farms
  FOR INSERT WITH CHECK (farmer_id = auth.uid());

CREATE POLICY farms_update_owner ON public.farms
  FOR UPDATE USING (farmer_id = auth.uid()) WITH CHECK (farmer_id = auth.uid());

CREATE POLICY farms_delete_owner_or_admin ON public.farms
  FOR DELETE USING (farmer_id = auth.uid() OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. Farm Crops Policies
-- ------------------------------------------------------------------------------
CREATE POLICY farm_crops_select_owner_or_admin ON public.farm_crops
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_crops.farm_id AND farmer_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY farm_crops_insert_owner ON public.farm_crops
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_crops.farm_id AND farmer_id = auth.uid())
  );

CREATE POLICY farm_crops_update_owner ON public.farm_crops
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_crops.farm_id AND farmer_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_crops.farm_id AND farmer_id = auth.uid())
  );

CREATE POLICY farm_crops_delete_owner ON public.farm_crops
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.farms WHERE id = farm_crops.farm_id AND farmer_id = auth.uid())
    OR public.is_admin()
  );

-- ------------------------------------------------------------------------------
-- 8. Crop Prices Policies (Append-only public index)
-- ------------------------------------------------------------------------------
CREATE POLICY crop_prices_select_public ON public.crop_prices
  FOR SELECT USING (is_official = true OR public.is_admin());

CREATE POLICY crop_prices_admin_mutation ON public.crop_prices
  FOR ALL USING (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role');

-- ------------------------------------------------------------------------------
-- 9. Marketplace Listings Policies
-- ------------------------------------------------------------------------------
CREATE POLICY listings_select_public ON public.listings
  FOR SELECT USING (status = 'active' OR user_id = auth.uid() OR public.is_admin());

CREATE POLICY listings_insert_owner ON public.listings
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY listings_update_owner ON public.listings
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY listings_delete_owner ON public.listings
  FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 10. Listing Media Policies
-- ------------------------------------------------------------------------------
CREATE POLICY listing_media_select_public ON public.listing_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_media.listing_id
        AND (l.status = 'active' OR l.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY listing_media_insert_owner ON public.listing_media
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_media.listing_id AND l.user_id = auth.uid()
    )
  );

CREATE POLICY listing_media_delete_owner ON public.listing_media
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_media.listing_id AND l.user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ------------------------------------------------------------------------------
-- 11. Inquiries Policies (Strict Buyer/Seller Isolation)
-- ------------------------------------------------------------------------------
CREATE POLICY inquiries_select_participants ON public.inquiries
  FOR SELECT USING (
    buyer_id = auth.uid() OR seller_id = auth.uid() OR public.is_admin()
  );

CREATE POLICY inquiries_insert_buyer ON public.inquiries
  FOR INSERT WITH CHECK (
    buyer_id = auth.uid()
  );

CREATE POLICY inquiries_update_participants ON public.inquiries
  FOR UPDATE USING (
    buyer_id = auth.uid() OR seller_id = auth.uid() OR public.is_admin()
  ) WITH CHECK (
    buyer_id = auth.uid() OR seller_id = auth.uid() OR public.is_admin()
  );

CREATE POLICY inquiries_delete_admin ON public.inquiries
  FOR DELETE USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 12. Moderation Events Policies
-- ------------------------------------------------------------------------------
CREATE POLICY moderation_admin_all ON public.moderation_events
  FOR ALL USING (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role');

-- ------------------------------------------------------------------------------
-- 13. Waitlist Policies (Preserved Live Table)
-- ------------------------------------------------------------------------------
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY waitlist_public_insert ON public.waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY waitlist_admin_select ON public.waitlist
  FOR SELECT USING (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role');

-- ------------------------------------------------------------------------------
-- 14. Standard Role Schema Grants
-- ------------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;


