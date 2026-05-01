
-- Drop all write policies on websites
DROP POLICY IF EXISTS "Allow insert websites" ON public.websites;
DROP POLICY IF EXISTS "Allow update websites" ON public.websites;
DROP POLICY IF EXISTS "Allow delete websites" ON public.websites;

-- Drop all write policies on social_media
DROP POLICY IF EXISTS "Allow insert social_media" ON public.social_media;
DROP POLICY IF EXISTS "Allow update social_media" ON public.social_media;
DROP POLICY IF EXISTS "Allow delete social_media" ON public.social_media;

-- Drop all write policies on about_profile
DROP POLICY IF EXISTS "Allow insert about_profile" ON public.about_profile;
DROP POLICY IF EXISTS "Allow update about_profile" ON public.about_profile;
DROP POLICY IF EXISTS "Allow delete about_profile" ON public.about_profile;

-- Drop all write policies on about_achievements
DROP POLICY IF EXISTS "Allow insert about_achievements" ON public.about_achievements;
DROP POLICY IF EXISTS "Allow update about_achievements" ON public.about_achievements;
DROP POLICY IF EXISTS "Allow delete about_achievements" ON public.about_achievements;

-- Drop all write policies on about_gallery
DROP POLICY IF EXISTS "Allow insert about_gallery" ON public.about_gallery;
DROP POLICY IF EXISTS "Allow update about_gallery" ON public.about_gallery;
DROP POLICY IF EXISTS "Allow delete about_gallery" ON public.about_gallery;

-- Drop anonymous write policies on storage
DROP POLICY IF EXISTS "Anyone can upload icons" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update icons" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete icons" ON storage.objects;
