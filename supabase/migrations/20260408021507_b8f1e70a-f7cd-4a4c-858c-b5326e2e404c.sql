
INSERT INTO storage.buckets (id, name, public) VALUES ('icons', 'icons', true);

CREATE POLICY "Anyone can view icons" ON storage.objects FOR SELECT TO public USING (bucket_id = 'icons');
CREATE POLICY "Anyone can upload icons" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'icons');
CREATE POLICY "Anyone can update icons" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'icons');
CREATE POLICY "Anyone can delete icons" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'icons');
