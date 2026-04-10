import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WebsitesSection from "@/components/WebsitesSection";
import SocialMediaSection from "@/components/SocialMediaSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import JsonLdSchema from "@/components/JsonLdSchema";

const Index = () => {
  const { data: websites = [] } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const { data, error } = await supabase.from("websites").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const { data: socials = [] } = useQuery({
    queryKey: ["social_media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("social_media").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <JsonLdSchema websites={websites} socials={socials} />
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <WebsitesSection />
        <SocialMediaSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
