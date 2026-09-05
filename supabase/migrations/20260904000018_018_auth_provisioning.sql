-- Migration 018: Automatic Profile Provisioning Trigger on auth.users

-- This trigger ensures that when a user signs up via Supabase Auth,
-- a corresponding row in public.profiles (and trader_profiles if applicable)
-- is created atomically and transactionally, avoiding partial-state failures.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  extracted_role text;
  extracted_full_name text;
  extracted_phone text;
  extracted_language text;
BEGIN
  -- Extract raw metadata
  extracted_role := COALESCE(NEW.raw_user_meta_data->>'role', 'farmer');
  
  -- Security Guard: NEVER allow 'admin' or privileged roles via public signup
  IF extracted_role NOT IN ('farmer', 'trader') THEN
    RAISE EXCEPTION 'Invalid role requested: %', extracted_role;
  END IF;

  extracted_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown User');
  
  extracted_phone := NEW.phone;
  IF extracted_phone IS NULL THEN
    extracted_phone := NEW.raw_user_meta_data->>'phone';
  END IF;
  
  extracted_language := COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'ar');

  -- 1. Insert base profile
  INSERT INTO public.profiles (id, full_name, email, phone, role, preferred_language)
  VALUES (
    NEW.id,
    extracted_full_name,
    NEW.email,
    extracted_phone,
    extracted_role,
    extracted_language
  );

  -- 2. If trader, insert trader_profiles
  IF extracted_role = 'trader' THEN
    INSERT INTO public.trader_profiles (id, business_name, trader_type)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'business_name', extracted_full_name),
      COALESCE(NEW.raw_user_meta_data->>'trader_type', 'wholesaler')
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Strict RLS for updating roles and verification status
CREATE OR REPLACE FUNCTION public.protect_privileged_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Only allow service_role to bypass this protection
  IF auth.jwt() ->> 'role' != 'service_role' THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Cannot self-modify role';
    END IF;
    IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
      RAISE EXCEPTION 'Cannot self-modify verification status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_privileged_profile_fields ON public.profiles;
CREATE TRIGGER trg_protect_privileged_profile_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_privileged_profile_fields();
