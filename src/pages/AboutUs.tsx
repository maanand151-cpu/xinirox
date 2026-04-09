import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero area */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[120px]" />
          <div className="absolute inset-0 bg-noise opacity-30" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="text-center mb-4">
              <span className="text-xs font-medium tracking-[0.4em] uppercase text-primary/70 border border-primary/20 px-4 py-2 rounded-full">
                About Us
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold font-serif text-center mb-6 text-gradient-gold">
              Know Who We Are
            </h1>
            <div className="divider-gold w-24 mx-auto mb-12" />

            <AboutProfile profile={profile} />
          </div>
        </section>

        {profile && <AboutDetails profile={profile} />}

        {achievements.length > 0 && <AboutAchievements achievements={achievements} />}

        {gallery.length > 0 && <AboutGallery gallery={gallery} />}
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
