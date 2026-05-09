-- Public media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public read on media bucket
DO $$ BEGIN
  CREATE POLICY "Public can read media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- media_assets table (slug -> file mapping + SEO metadata)
CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  storage_path text NOT NULL,
  supabase_url text NOT NULL,
  title text NOT NULL DEFAULT '',
  alt text NOT NULL DEFAULT '',
  content_type text NOT NULL DEFAULT 'image/jpeg',
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Anyone can view media_assets"
    ON public.media_assets FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DROP TRIGGER IF EXISTS update_media_assets_updated_at ON public.media_assets;
CREATE TRIGGER update_media_assets_updated_at
BEFORE UPDATE ON public.media_assets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_media_assets_slug ON public.media_assets(slug);