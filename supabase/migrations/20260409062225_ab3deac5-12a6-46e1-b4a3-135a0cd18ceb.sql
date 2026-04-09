
-- About profile (single row)
CREATE TABLE public.about_profile (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL DEFAULT 'Xini Rox',
  tagline text NOT NULL DEFAULT 'Business Manager & Digital Entrepreneur',
  contact_number text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  profile_image_url text DEFAULT '',
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.about_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view about_profile" ON public.about_profile FOR SELECT USING (true);
CREATE POLICY "Allow insert about_profile" ON public.about_profile FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update about_profile" ON public.about_profile FOR UPDATE USING (true);
CREATE POLICY "Allow delete about_profile" ON public.about_profile FOR DELETE USING (true);

CREATE TRIGGER update_about_profile_updated_at BEFORE UPDATE ON public.about_profile
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- About achievements
CREATE TABLE public.about_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.about_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view about_achievements" ON public.about_achievements FOR SELECT USING (true);
CREATE POLICY "Allow insert about_achievements" ON public.about_achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update about_achievements" ON public.about_achievements FOR UPDATE USING (true);
CREATE POLICY "Allow delete about_achievements" ON public.about_achievements FOR DELETE USING (true);

CREATE TRIGGER update_about_achievements_updated_at BEFORE UPDATE ON public.about_achievements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- About gallery
CREATE TABLE public.about_gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  caption text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.about_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view about_gallery" ON public.about_gallery FOR SELECT USING (true);
CREATE POLICY "Allow insert about_gallery" ON public.about_gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update about_gallery" ON public.about_gallery FOR UPDATE USING (true);
CREATE POLICY "Allow delete about_gallery" ON public.about_gallery FOR DELETE USING (true);

CREATE TRIGGER update_about_gallery_updated_at BEFORE UPDATE ON public.about_gallery
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default profile
INSERT INTO public.about_profile (full_name, tagline, is_verified)
VALUES ('Xini Rox', 'Business Manager & Digital Entrepreneur', true);

-- Seed default achievements
INSERT INTO public.about_achievements (title, description, sort_order) VALUES
('Managing Multiple Businesses', 'Successfully managing and scaling ventures across diverse industries', 0),
('Building Digital Platforms', 'Creating impactful digital platforms that drive growth and engagement', 1),
('Creating Xini Rox Super Hub', 'Building a central hub connecting all brands, websites, and social media', 2);
