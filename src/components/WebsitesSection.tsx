import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Globe, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WebsitesSection = () => {
  const { data: websites, isLoading } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("websites")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section id="websites" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-4 text-gradient-gold">Websites</h2>
          <p className="text-center text-muted-foreground mb-12">Loading...</p>
        </div>
      </section>
    );
  }

  if (!websites?.length) return null;

  return (
    <section id="websites" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-4 text-gradient-gold">
          Websites
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Explore the digital portfolio
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((site, i) => (
            <Card
              key={site.id}
              className="card-hover bg-card border-border/50 overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                {site.icon_url ? (
                  <img
                    src={site.icon_url}
                    alt={site.name}
                    className="w-16 h-16 rounded-xl object-cover border border-border"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center border border-border">
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{site.name}</h3>
                  <p className="text-sm text-muted-foreground">{site.owner_name}</p>
                </div>
                <Button asChild variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                  <a href={site.url} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WebsitesSection;
