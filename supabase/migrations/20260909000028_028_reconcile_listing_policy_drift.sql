-- Reconcile pre-existing 019/021 production policies with 026 intent.
-- One permissive policy per command; active administrators retain moderation
-- and deletion, while owner deletion remains limited to draft/archived rows.
DROP POLICY IF EXISTS "Farmers can read own listings" ON public.listings;
DROP POLICY IF EXISTS listings_insert_owner ON public.listings;
DROP POLICY IF EXISTS listings_update_owner ON public.listings;
DROP POLICY IF EXISTS listings_delete_owner ON public.listings;
DROP POLICY IF EXISTS "Farmers can insert own listings" ON public.listings;
DROP POLICY IF EXISTS "Farmers can update own listings" ON public.listings;
DROP POLICY IF EXISTS "Farmers can delete own draft/archived listings" ON public.listings;

-- TRUNCATE is not subject to RLS and must not bypass the delete lifecycle.
REVOKE TRUNCATE ON public.listings FROM PUBLIC, anon, authenticated;

-- Preserve listings_select_public and its existing public-view/grant boundary.
CREATE POLICY listings_insert_active_owner ON public.listings
  FOR INSERT TO authenticated
  WITH CHECK (public.is_active_user() AND user_id = auth.uid());

CREATE POLICY listings_update_active_owner_or_admin ON public.listings
  FOR UPDATE TO authenticated
  USING (public.is_active_user() AND (user_id = auth.uid() OR public.is_admin()))
  WITH CHECK (public.is_active_user() AND (user_id = auth.uid() OR public.is_admin()));

CREATE POLICY listings_delete_lifecycle_owner_or_admin ON public.listings
  FOR DELETE TO authenticated
  USING (public.is_active_user() AND (
    public.is_admin() OR (user_id = auth.uid() AND status IN ('draft', 'archived'))
  ));

-- Enforce the existing lib/actions/listings.ts lifecycle at the database
-- boundary too. RLS determines WHO; this trigger protects privileged fields.
-- The 027 initial-state trigger remains unchanged and continues to apply.
CREATE OR REPLACE FUNCTION public.trg_enforce_listing_immutability()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF auth.jwt()->>'role' = 'service_role'
     OR (public.is_admin() AND public.is_active_user()) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.featured OR NEW.views_count <> 0 OR NEW.inquiries_count <> 0 THEN
      RAISE EXCEPTION 'Cannot initialize privileged listing fields';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Cannot change listing owner or identity';
  END IF;
  IF NEW.moderation_status IS DISTINCT FROM OLD.moderation_status THEN
    RAISE EXCEPTION 'Cannot self-moderate listing';
  END IF;
  IF NEW.featured IS DISTINCT FROM OLD.featured
     OR NEW.views_count IS DISTINCT FROM OLD.views_count
     OR NEW.inquiries_count IS DISTINCT FROM OLD.inquiries_count
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Cannot change privileged listing fields';
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status AND NOT (
    (OLD.status = 'draft' AND NEW.status IN ('pending_review', 'archived'))
    OR (OLD.status = 'active' AND NEW.status IN ('paused', 'sold', 'archived'))
    OR (OLD.status = 'paused' AND NEW.status = 'archived')
    OR (OLD.status = 'paused' AND NEW.status = 'active' AND NEW.moderation_status = 'approved')
  ) THEN
    RAISE EXCEPTION 'Unauthorized listing lifecycle transition';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS enforce_listing_immutability ON public.listings;
CREATE TRIGGER enforce_listing_immutability BEFORE INSERT OR UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.trg_enforce_listing_immutability();
REVOKE ALL ON FUNCTION public.trg_enforce_listing_immutability() FROM PUBLIC, anon, authenticated, service_role;
