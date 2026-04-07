DROP POLICY IF EXISTS "Authenticated users can insert websites" ON public.websites;
DROP POLICY IF EXISTS "Authenticated users can update websites" ON public.websites;
DROP POLICY IF EXISTS "Authenticated users can delete websites" ON public.websites;
DROP POLICY IF EXISTS "Authenticated users can insert social media" ON public.social_media;
DROP POLICY IF EXISTS "Authenticated users can update social media" ON public.social_media;
DROP POLICY IF EXISTS "Authenticated users can delete social media" ON public.social_media;

CREATE POLICY "Allow insert websites" ON public.websites FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow update websites" ON public.websites FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow delete websites" ON public.websites FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "Allow insert social_media" ON public.social_media FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow update social_media" ON public.social_media FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow delete social_media" ON public.social_media FOR DELETE TO anon, authenticated USING (true);