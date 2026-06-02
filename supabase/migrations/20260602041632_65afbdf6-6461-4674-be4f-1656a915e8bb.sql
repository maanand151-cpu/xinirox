ALTER TABLE public.websites
  ADD COLUMN IF NOT EXISTS short_description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS display_priority integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;

ALTER TABLE public.websites
  ADD CONSTRAINT websites_status_check
  CHECK (status IN ('active','beta','under_development','paused','archived'));

CREATE INDEX IF NOT EXISTS idx_websites_status ON public.websites(status);
CREATE INDEX IF NOT EXISTS idx_websites_visible ON public.websites(visible);