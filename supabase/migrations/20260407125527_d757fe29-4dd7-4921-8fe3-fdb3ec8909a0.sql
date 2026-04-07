
-- Create websites table
CREATE TABLE public.websites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_url TEXT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create social_media table
CREATE TABLE public.social_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_url TEXT,
  platform_name TEXT NOT NULL,
  profile_url TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view websites" ON public.websites FOR SELECT USING (true);
CREATE POLICY "Anyone can view social media" ON public.social_media FOR SELECT USING (true);

-- Authenticated users can manage (admin will be the only authenticated user)
CREATE POLICY "Authenticated users can insert websites" ON public.websites FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update websites" ON public.websites FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete websites" ON public.websites FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert social media" ON public.social_media FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update social media" ON public.social_media FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete social media" ON public.social_media FOR DELETE TO authenticated USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_websites_updated_at BEFORE UPDATE ON public.websites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_social_media_updated_at BEFORE UPDATE ON public.social_media FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
