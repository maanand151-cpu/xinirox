import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Globe, Share2, ExternalLink, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import JsonLdSchema from "@/components/JsonLdSchema";
import { slugify } from "@/lib/slugify";

const Network = () => {
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
      <SeoHead
        title="Xini Rox Network – All Websites & Social Profiles"
        description="Complete directory of all websites, businesses, and social media profiles connected to Xini Rox. Discover the full digital network."
        canonical="https://xinirox.lovable.app/network"
      />
      <JsonLdSchema websites={websites} socials={socials} />
      <Navbar />
      <main className="pt-16">
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
          <div className="absolute inset-0 bg-noise opacity-30" />
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="text-center mb-4">
              <span className="text-xs font-medium tracking-[0.4em] uppercase text-primary/70 border border-primary/20 px-4 py-2 rounded-full">
                Full Directory
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold font-serif text-center mb-6 text-gradient-gold">
              Xini Rox Network
            </h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-4">
              Every website, business, and social media profile connected to Xini Rox — all in one discoverable directory.
            </p>
            <div className="divider-gold w-24 mx-auto mb-16" />

            {/* Websites */}
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <Globe className="w-6 h-6 text-primary" />
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Websites & Businesses</h2>
              </div>
              <div className="grid gap-4">
                {websites.map((site) => (
                  <article key={site.id} className="card-luxury p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground">{site.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">Owner: {site.owner_name}</p>
                      <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                        {site.url} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <Link to={`/site/${slugify(site.name)}`} className="text-sm text-primary/70 hover:text-primary inline-flex items-center gap-1 whitespace-nowrap">
                      View Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            {/* Social Media */}
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <Share2 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Social Media Profiles</h2>
              </div>
              <div className="grid gap-4">
                {socials.map((social) => (
                  <article key={social.id} className="card-luxury p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground">{social.platform_name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">Owner: {social.owner_name}</p>
                      <a href={social.profile_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                        {social.profile_url} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <Link to={`/profile/${slugify(social.platform_name + "-" + social.owner_name)}`} className="text-sm text-primary/70 hover:text-primary inline-flex items-center gap-1 whitespace-nowrap">
                      View Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            {/* Internal links */}
            <nav className="text-center space-x-6 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">← Home</Link>
              <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Network;
