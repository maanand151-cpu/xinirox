import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Share2, ExternalLink } from "lucide-react";
import AppShell from "@/components/AppShell";
import SeoHead from "@/components/SeoHead";

const SocialPage = () => {
  const { data: socials = [], isLoading } = useQuery({
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
        title="Social Media – Xini Rox Super Hub"
        description="All social media profiles and platforms connected to Xini Rox."
        canonical="https://xinirox.lovable.app/social"
      />
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gradient-gold mb-2">Social Media</h1>
        <p className="text-muted-foreground text-sm mb-8">Stay connected across platforms</p>

        {isLoading ? (
          <p className="text-muted-foreground text-center py-12">Loading...</p>
        ) : socials.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No social media profiles yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="rounded-xl bg-card/80 backdrop-blur border border-border/30 p-6 flex items-center gap-4 hover:border-primary/30 hover:glow-gold-sm transition-all duration-300 hover:-translate-y-1">
                  {social.icon_url ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-border/30 group-hover:border-primary/30 transition-colors flex-shrink-0">
                      <img src={social.icon_url} alt={social.platform_name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-secondary/50 flex items-center justify-center border border-border/30 flex-shrink-0">
                      <Share2 className="w-6 h-6 text-primary/60" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{social.platform_name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{social.owner_name}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default SocialPage;
