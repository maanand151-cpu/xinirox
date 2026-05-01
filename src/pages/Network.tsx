import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Globe, Share2, ExternalLink, ArrowRight } from "lucide-react";
import AppShell from "@/components/AppShell";
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
    <AppShell>
      <SeoHead
        title="Xini Rox Network – All Websites & Social Profiles"
        description="Complete directory of all websites, businesses, and social media profiles connected to Xini Rox."
        canonical="https://xinirox.lovable.app/network"
      />
      <JsonLdSchema websites={websites} socials={socials} />

      <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-10">
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-primary/70 border border-primary/20 px-3 py-1.5 rounded-full">
            Ecosystem Map
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-gradient-gold mt-4 mb-3">
            Xini Rox Network
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Every website, business, and social media profile — all in one discoverable directory.
          </p>
          <div className="divider-gold w-24 mx-auto mt-6" />
        </div>

        {/* Websites */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">Websites & Businesses</h2>
          </div>
          <div className="grid gap-3">
            {websites.map((site) => (
              <article key={site.id} className="rounded-xl bg-card/80 backdrop-blur border border-border/30 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-primary/20 transition-all duration-300">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{site.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">Owner: {site.owner_name}</p>
                  <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                    {site.url} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <Link to={`/site/${slugify(site.name)}`} className="text-xs text-primary/70 hover:text-primary inline-flex items-center gap-1 whitespace-nowrap">
                  Details <ArrowRight className="w-3 h-3" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Social Media */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <Share2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">Social Media Profiles</h2>
          </div>
          <div className="grid gap-3">
            {socials.map((social) => (
              <article key={social.id} className="rounded-xl bg-card/80 backdrop-blur border border-border/30 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-primary/20 transition-all duration-300">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{social.platform_name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">Owner: {social.owner_name}</p>
                  <a href={social.profile_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                    {social.profile_url} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <Link to={`/profile/${slugify(social.platform_name + "-" + social.owner_name)}`} className="text-xs text-primary/70 hover:text-primary inline-flex items-center gap-1 whitespace-nowrap">
                  Details <ArrowRight className="w-3 h-3" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default Network;
