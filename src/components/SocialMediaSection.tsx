import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Share2, ExternalLink } from "lucide-react";

const SocialMediaSection = () => {
  const { data: socials, isLoading } = useQuery({
    queryKey: ["social_media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("social_media").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section id="social" className="py-24 px-4 bg-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4 text-gradient-gold">Social Media</h2>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  if (!socials?.length) return null;

  return (
    <section id="social" className="py-24 px-4 bg-secondary/10 relative">
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4 text-gradient-gold">Social Media</h2>
          <p className="text-muted-foreground font-light tracking-wide">Stay connected across platforms</p>
          <div className="divider-gold w-24 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="card-luxury p-6 flex items-center gap-5">
                {social.icon_url ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-border/30 group-hover:border-primary/30 transition-colors duration-500 flex-shrink-0">
                    <img src={social.icon_url} alt={social.platform_name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-secondary/50 flex items-center justify-center border border-border/30 group-hover:border-primary/30 transition-colors duration-500 flex-shrink-0">
                    <Share2 className="w-6 h-6 text-primary/60" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{social.platform_name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{social.owner_name}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors duration-300 flex-shrink-0" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
