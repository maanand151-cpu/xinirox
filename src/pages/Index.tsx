import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WebsitesSection from "@/components/WebsitesSection";
import SocialMediaSection from "@/components/SocialMediaSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
