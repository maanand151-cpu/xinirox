import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Share2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SocialMediaSection = () => {
  const { data: socials, isLoading } = useQuery({
    queryKey: ["social_media"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_media")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section id="social" className="py-20 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-4 text-gradient-gold">Social Media</h2>
          <p className="text-center text-muted-foreground mb-12">Loading...</p>
        </div>
      </section>
    );
  }

  if (!socials?.length) return null;

  return (
    <section id="social" className="py-20 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-4 text-gradient-gold">
          Social Media
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Stay connected across platforms
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {socials.map((social, i) => (
            <a
              key={social.id}
              href={social.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card
                className="card-hover bg-card border-border/50 group cursor-pointer"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  {social.icon_url ? (
                    <img
                      src={social.icon_url}
                      alt={social.platform_name}
                      className="w-12 h-12 rounded-lg object-cover border border-border"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center border border-border">
                      <Share2 className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{social.platform_name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{social.owner_name}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
