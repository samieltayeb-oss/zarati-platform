# ZARATI | زرعتي — Row Level Security (RLS) Policy Matrix (Phase R1-A)
**Version:** 1.0.0-draft  
**Date:** September 4, 2026  
**Status:** ARCHITECTURE & SPECIFICATION ONLY (Zero policies executed)  
**Security Standard:** Zero-Trust Row Level Security  
**Project Path:** `C:\Users\mcreg\Desktop\zarati`

---

## 1. Security Infrastructure & Helper Functions

In Supabase, RLS policies that query `profiles` to check if the current user has the `'admin'` role can trigger an **infinite recursion loop** if a policy on `profiles` itself checks `profiles`. 

To prevent this critical flaw, we define a secure helper function with `SECURITY DEFINER`:

```sql
-- Helper function to check if the current user is an administrator without RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

---

## 2. Complete Table RLS Policy Matrix

| Table | Operation | Policy Name | Permitted Roles | Target / Filter Rule (`USING` / `WITH CHECK`) |
|---|---|---|---|---|
| **`profiles`** | `SELECT` | `profiles_read_own` | Authenticated Owner | `auth.uid() = id` |
| | `SELECT` | `profiles_read_public_alias` | Public / Anon | Only non-sensitive fields via API view (see Section 3) |
| | `SELECT` | `profiles_admin_all` | Admin | `public.is_admin() = true` |
| | `INSERT` | `profiles_insert_own` | Authenticated User | `auth.uid() = id` (triggered on auth signup) |
| | `UPDATE` | `profiles_update_own` | Authenticated Owner | `auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())` *(cannot escalate own role)* |
| | `UPDATE` | `profiles_admin_update` | Admin | `public.is_admin() = true` |
| | `DELETE` | `profiles_admin_delete` | Admin | `public.is_admin() = true` |
| **`trader_profiles`**| `SELECT` | `traders_read_verified` | Public / Anon | `verification_status = 'verified'` (business name, type only) |
| | `SELECT` | `traders_read_own` | Trader Owner | `auth.uid() = user_id` |
| | `SELECT` | `traders_admin_all` | Admin | `public.is_admin() = true` |
| | `INSERT` | `traders_insert_own` | Trader Owner | `auth.uid() = user_id` |
| | `UPDATE` | `traders_update_own` | Trader Owner | `auth.uid() = user_id` *(verification_status cannot be self-updated)* |
| | `UPDATE` | `traders_admin_update` | Admin | `public.is_admin() = true` |
| | `DELETE` | `traders_admin_delete` | Admin | `public.is_admin() = true` |
| **`states`** | `SELECT` | `states_public_read` | Public / Anon | `is_active = true` |
| | `ALL` | `states_admin_manage` | Admin | `public.is_admin() = true` |
| **`markets`** | `SELECT` | `markets_public_read` | Public / Anon | `is_active = true` |
| | `ALL` | `markets_admin_manage` | Admin | `public.is_admin() = true` |
| **`crops`** | `SELECT` | `crops_public_read` | Public / Anon | `is_active = true` |
| | `ALL` | `crops_admin_manage` | Admin | `public.is_admin() = true` |
| **`farms`** | `SELECT` | `farms_owner_read` | Farmer Owner | `auth.uid() = farmer_id` |
| | `SELECT` | `farms_admin_all` | Admin | `public.is_admin() = true` |
| | `INSERT` | `farms_owner_insert` | Farmer Owner | `auth.uid() = farmer_id` |
| | `UPDATE` | `farms_owner_update` | Farmer Owner | `auth.uid() = farmer_id` |
| | `DELETE` | `farms_owner_delete` | Farmer Owner | `auth.uid() = farmer_id` |
| **`farm_crops`** | `SELECT` | `farm_crops_owner_read` | Farmer Owner | `EXISTS (SELECT 1 FROM public.farms WHERE farms.id = farm_crops.farm_id AND farms.farmer_id = auth.uid())` |
| | `SELECT` | `farm_crops_admin_all` | Admin | `public.is_admin() = true` |
| | `INSERT` | `farm_crops_owner_insert` | Farmer Owner | `EXISTS (SELECT 1 FROM public.farms WHERE farms.id = farm_crops.farm_id AND farms.farmer_id = auth.uid())` |
| | `UPDATE` | `farm_crops_owner_update` | Farmer Owner | `EXISTS (SELECT 1 FROM public.farms WHERE farms.id = farm_crops.farm_id AND farms.farmer_id = auth.uid())` |
| | `DELETE` | `farm_crops_owner_delete` | Farmer Owner | `EXISTS (SELECT 1 FROM public.farms WHERE farms.id = farm_crops.farm_id AND farms.farmer_id = auth.uid())` |
| **`crop_prices`** | `SELECT` | `prices_public_read` | Public / Anon | `is_verified = true` |
| | `SELECT` | `prices_admin_all` | Admin | `public.is_admin() = true` |
| | `INSERT` | `prices_admin_insert` | Admin | `public.is_admin() = true` |
| | `UPDATE` | `prices_admin_update` | Admin | `public.is_admin() = true` |
| | `DELETE` | `prices_admin_delete` | Admin | `public.is_admin() = true` |
| **`listings`** | `SELECT` | `listings_public_active` | Public / Anon | `status = 'active' AND moderation_status = 'approved' AND (expires_at IS NULL OR expires_at > now())` |
| | `SELECT` | `listings_owner_all` | Seller Owner | `auth.uid() = seller_id` |
| | `SELECT` | `listings_admin_all` | Admin | `public.is_admin() = true` |
| | `INSERT` | `listings_owner_insert` | Seller Owner | `auth.uid() = seller_id` |
| | `UPDATE` | `listings_owner_update` | Seller Owner | `auth.uid() = seller_id` *(moderation fields cannot be modified by seller)* |
| | `UPDATE` | `listings_admin_moderate` | Admin | `public.is_admin() = true` |
| | `DELETE` | `listings_owner_delete` | Seller Owner | `auth.uid() = seller_id` |
| **`listing_media`**| `SELECT` | `media_public_read` | Public / Anon | `EXISTS (SELECT 1 FROM public.listings WHERE listings.id = listing_media.listing_id AND listings.status = 'active' AND listings.moderation_status = 'approved')` |
| | `SELECT` | `media_owner_read` | Seller Owner | `EXISTS (SELECT 1 FROM public.listings WHERE listings.id = listing_media.listing_id AND listings.seller_id = auth.uid())` |
| | `INSERT` | `media_owner_insert` | Seller Owner | `EXISTS (SELECT 1 FROM public.listings WHERE listings.id = listing_media.listing_id AND listings.seller_id = auth.uid())` |
| | `DELETE` | `media_owner_delete` | Seller Owner | `EXISTS (SELECT 1 FROM public.listings WHERE listings.id = listing_media.listing_id AND listings.seller_id = auth.uid())` |
| **`inquiries`** | `SELECT` | `inquiries_buyer_read` | Buyer | `auth.uid() = buyer_id` |
| | `SELECT` | `inquiries_seller_read`| Seller | `auth.uid() = seller_id` |
| | `SELECT` | `inquiries_admin_read` | Admin | `public.is_admin() = true` |
| | `INSERT` | `inquiries_buyer_insert`| Buyer | `auth.uid() = buyer_id AND buyer_id != seller_id` |
| | `UPDATE` | `inquiries_parties_update`| Buyer & Seller | `auth.uid() IN (buyer_id, seller_id)` |
| | `DELETE` | `inquiries_admin_only` | Admin | `public.is_admin() = true` |
| **`moderation_events`**| `ALL` | `moderation_admin_only` | Admin | `public.is_admin() = true` |
| **`waitlist`** | `SELECT` | `waitlist_admin_only` | Admin | `public.is_admin() = true` (or via Service Role) |
| | `INSERT` | `waitlist_public_insert`| Public / Anon | `true` (server action rate-limited) |

---

## 3. Privacy-Preserving Public Views

To prevent leaking smallholder farmers' private telephone numbers, emails, or precise home locality details to anonymous web scrapers, public components must **NEVER** select directly from `profiles`. 

We define a dedicated secure PostgreSQL View for public marketplace display:

```sql
CREATE OR REPLACE VIEW public.marketplace_seller_public AS
SELECT 
  p.id,
  p.role,
  CASE 
    WHEN p.role = 'farmer' THEN 
      -- Display first name and last initial: "Ahmed M."
      split_part(p.full_name, ' ', 1) || ' ' || 
      CASE WHEN char_length(split_part(p.full_name, ' ', 2)) > 0 
           THEN left(split_part(p.full_name, ' ', 2), 1) || '.' 
           ELSE '' 
      END
    ELSE p.full_name 
  END AS display_name,
  p.state_code,
  s.name_ar AS state_name_ar,
  s.name_en AS state_name_en,
  p.is_verified,
  p.created_at AS member_since,
  tp.company_name,
  tp.business_type,
  tp.verification_status AS trader_verified_status
FROM public.profiles p
LEFT JOIN public.states s ON s.code = p.state_code
LEFT JOIN public.trader_profiles tp ON tp.user_id = p.id
WHERE p.status = 'active';

-- Grant access to public and authenticated users
GRANT SELECT ON public.marketplace_seller_public TO anon, authenticated;
```

---

## 4. RLS Code Definitions (SQL Template)

```sql
-- 1. Enable RLS across all tables
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

-- 2. Profiles Policies
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
  );

CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL TO authenticated USING (public.is_admin());

-- 3. Listings Policies
CREATE POLICY "listings_public_select" ON public.listings
  FOR SELECT TO anon, authenticated
  USING (
    status = 'active' AND 
    moderation_status = 'approved' AND 
    (expires_at IS NULL OR expires_at > now())
  );

CREATE POLICY "listings_owner_select" ON public.listings
  FOR SELECT TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "listings_owner_insert" ON public.listings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "listings_owner_update" ON public.listings
  FOR UPDATE TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (
    auth.uid() = seller_id AND
    moderation_status = (SELECT l.moderation_status FROM public.listings l WHERE l.id = id)
  );

CREATE POLICY "listings_owner_delete" ON public.listings
  FOR DELETE TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "listings_admin_all" ON public.listings
  FOR ALL TO authenticated
  USING (public.is_admin());

-- 4. Inquiries Policies
CREATE POLICY "inquiries_select_participants" ON public.inquiries
  FOR SELECT TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR public.is_admin());

CREATE POLICY "inquiries_insert_buyer" ON public.inquiries
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = buyer_id AND buyer_id != seller_id);

CREATE POLICY "inquiries_update_participants" ON public.inquiries
  FOR UPDATE TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- 5. Farms & Farm Crops Policies
CREATE POLICY "farms_owner_all" ON public.farms
  FOR ALL TO authenticated
  USING (auth.uid() = farmer_id OR public.is_admin());

CREATE POLICY "farm_crops_owner_all" ON public.farm_crops
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = farm_crops.farm_id AND farms.farmer_id = auth.uid()
    ) OR public.is_admin()
  );

-- 6. Reference Data Policies (Public Read, Admin Write)
CREATE POLICY "crops_read" ON public.crops FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "crops_admin" ON public.crops FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "states_read" ON public.states FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "states_admin" ON public.states FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "markets_read" ON public.markets FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "markets_admin" ON public.markets FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "prices_read" ON public.crop_prices FOR SELECT TO anon, authenticated USING (is_verified);
CREATE POLICY "prices_admin" ON public.crop_prices FOR ALL TO authenticated USING (public.is_admin());
```
