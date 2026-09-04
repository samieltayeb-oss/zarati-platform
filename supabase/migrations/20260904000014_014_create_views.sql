-- ==============================================================================
-- Migration 014: Create Privacy-Preserving Public Views
-- ==============================================================================

-- Marketplace seller view concealing private phone numbers and email
CREATE OR REPLACE VIEW public.marketplace_seller_public AS
SELECT
  p.id,
  p.full_name,
  p.full_name_ar,
  p.role,
  p.avatar_url,
  p.is_verified,
  COALESCE(tp.rating, 5.00) AS rating,
  COALESCE(tp.total_deals_completed, 0) AS total_deals_completed
FROM public.profiles p
LEFT JOIN public.trader_profiles tp ON p.id = tp.id;
