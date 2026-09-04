-- ==============================================================================
-- Migration 004: Create States Table and Link Profiles Foreign Key
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('eastern', 'central', 'northern', 'darfur', 'kordofan', 'khartoum')),
  capital_en TEXT NOT NULL,
  capital_ar TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_states_region ON public.states (region);
CREATE INDEX IF NOT EXISTS idx_states_is_active ON public.states (is_active);

-- Link state_id in profiles now that states table exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_profiles_state'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT fk_profiles_state
      FOREIGN KEY (state_id) REFERENCES public.states(id) ON DELETE SET NULL;
  END IF;
END $$;
