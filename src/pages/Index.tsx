import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WebsitesSection from "@/components/WebsitesSection";
import SocialMediaSection from "@/components/SocialMediaSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import JsonLdSchema from "@/components/JsonLdSchema";
import SemanticBlock from "@/components/SemanticBlock";

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
      <SemanticBlock
        page="home"
        entityType="Organization"
        summary="Central identity hub for Xini Rox (Aanand Maurya), connecting every venture, network, and service of the Xini Rox Super Hub ecosystem."
        relations={{
          founder: "Aanand Maurya",
          organization: "Xini Rox Super Hub",
          ventures: websites.map((w: any) => w.name),
          networks: socials.map((s: any) => s.platform_name),
        }}
      />
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
