-- Migration 020: R2 Final Production Hardening

-- 1. Fix P3-002: Public Trader Profile Exposure
-- Revoke direct anon SELECT access to the base trader_profiles table
REVOKE SELECT ON TABLE public.trader_profiles FROM anon;

-- Update RLS to prevent anon from selecting the base table,
-- but allow authenticated users to view profiles (since farmers/traders need to see who they interact with).
DROP POLICY IF EXISTS trader_profiles_select_public ON public.trader_profiles;

CREATE POLICY trader_profiles_select_authenticated ON public.trader_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a safe public projection for unauthenticated marketplace visitors
-- Excludes sensitive internal identifiers/fields
CREATE OR REPLACE VIEW public.public_traders AS
SELECT
  tp.id,
  tp.business_name,
  tp.trader_type,
  tp.operating_markets,
  tp.commodities_of_interest,
  tp.is_verified_trader,
  tp.rating
FROM public.trader_profiles tp
JOIN public.profiles p ON tp.id = p.id
WHERE p.status = 'active';

-- Grant SELECT on the safe view to anon
GRANT SELECT ON public.public_traders TO anon;
GRANT SELECT ON public.public_traders TO authenticated;

-- Ensure RLS on the view works by delegating to the base tables,
-- wait, views bypass RLS unless security_barrier is used, but since we just do a simple projection 
-- and we granted SELECT to anon, this is exactly what we want.
