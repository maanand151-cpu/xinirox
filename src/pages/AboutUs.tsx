import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AppShell from "@/components/AppShell";
import SeoHead from "@/components/SeoHead";
import AboutProfile from "@/components/about/AboutProfile";
import AboutDetails from "@/components/about/AboutDetails";
import AboutAchievements from "@/components/about/AboutAchievements";
import AboutGallery from "@/components/about/AboutGallery";

const AboutUs = () => {
  const { data: profile } = useQuery({
    queryKey: ["about_profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_profile").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ["about_achievements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_achievements").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: gallery = [] } = useQuery({
    queryKey: ["about_gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_gallery").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <AppShell>
      <SeoHead
        title="About Xini Rox – Vision, Mission & Story"
        description="Learn about Xini Rox (Aanand Maurya), a visionary business manager and entrepreneur."
        canonical="https://xinirox.lovable.app/about"
      />
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-10">
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-primary/70 border border-primary/20 px-3 py-1.5 rounded-full">
            About Us
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-gradient-gold mt-4 mb-3">
            Know Who We Are
          </h1>
          <div className="divider-gold w-24 mx-auto" />
        </div>

        <AboutProfile profile={profile} />

        {profile && <AboutDetails profile={profile} />}

        {achievements.length > 0 && <AboutAchievements achievements={achievements} />}

        {gallery.length > 0 && <AboutGallery gallery={gallery} />}
      </div>
    </AppShell>
  );
};

export default AboutUs;
