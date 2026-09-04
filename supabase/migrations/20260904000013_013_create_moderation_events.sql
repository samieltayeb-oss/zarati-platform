-- ==============================================================================
-- Migration 013: Create Moderation Events Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.moderation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('profile', 'listing', 'inquiry', 'farm')),
  entity_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('flagged', 'approved', 'rejected', 'hidden', 'banned')),
  reason TEXT NOT NULL,
  moderator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moderation_entity ON public.moderation_events (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_moderation_created ON public.moderation_events (created_at DESC);
