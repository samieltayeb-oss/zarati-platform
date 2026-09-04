-- ==============================================================================
-- Migration 002: Create Profiles Table, Role Helpers, and Security Triggers
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'farmer'
    CHECK (role IN ('farmer', 'trader', 'admin', 'government', 'ngo', 'investor')),
  full_name TEXT NOT NULL,
  full_name_ar TEXT,
  phone TEXT UNIQUE,
  email TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'ar'
    CHECK (preferred_language IN ('ar', 'en')),
  state_id UUID, -- Linked to states(id) in Migration 004
  avatar_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles (phone);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_state ON public.profiles (state_id);

-- ------------------------------------------------------------------------------
-- Helper Function: Safe anti-recursion public.is_admin() check
-- Deliberately hardened with SET search_path = public, pg_temp
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ------------------------------------------------------------------------------
-- Helper Function: Safe current_user_role() check
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ------------------------------------------------------------------------------
-- Privilege & Role Protection Trigger
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_profile_privileges_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.role <> OLD.role THEN
    IF NOT (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized: Only platform administrators can change user roles.';
    END IF;
  END IF;
  IF NEW.is_verified <> OLD.is_verified THEN
    IF NOT (public.is_admin() OR auth.jwt() ->> 'role' = 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized: Only platform administrators can modify verification status.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_privileges ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileges
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_profile_privileges_update();

-- Automatic timestamp trigger
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();
