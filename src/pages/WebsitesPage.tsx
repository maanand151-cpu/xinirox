import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Globe, ExternalLink } from "lucide-react";
import AppShell from "@/components/AppShell";
import SeoHead from "@/components/SeoHead";

const WebsitesPage = () => {
  const [activeTab, setActiveTab] = useState<"all" | "categories">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: websites = [], isLoading } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const { data, error } = await supabase.from("websites").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const categories = useMemo(() => {
    const cats = new Set<string>();
    websites.forEach((w) => {
      if (w.category && w.category.trim()) cats.add(w.category.trim());
    });
    return Array.from(cats).sort();
  }, [websites]);

  const filteredWebsites = useMemo(() => {
    if (activeTab === "all" || !selectedCategory) return websites;
    return websites.filter((w) => w.category?.trim() === selectedCategory);
  }, [websites, activeTab, selectedCategory]);

  return (
    <AppShell>
      <SeoHead
        title="Websites – Xini Rox Super Hub"
        description="Explore all websites and digital ventures managed by Xini Rox."
        canonical="https://xinirox.lovable.app/websites"
      />
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gradient-gold mb-2">Websites</h1>
        <p className="text-muted-foreground text-sm mb-6">All digital ventures and projects</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setActiveTab("all"); setSelectedCategory(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "all"
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-card border border-border/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            All Websites
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "categories"
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-card border border-border/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            Categories
          </button>
        </div>

        {/* Category chips */}
        {activeTab === "categories" && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                !selectedCategory ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {activeTab === "categories" && categories.length === 0 && (
          <p className="text-sm text-muted-foreground mb-6">No categories set yet. Admin can assign categories to websites.</p>
        )}

        {isLoading ? (
          <p className="text-muted-foreground text-center py-12">Loading...</p>
        ) : filteredWebsites.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No websites found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWebsites.map((site) => (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="rounded-xl bg-card/80 backdrop-blur border border-border/30 p-6 flex flex-col items-center text-center gap-4 h-full hover:border-primary/30 hover:glow-gold-sm transition-all duration-300 hover:-translate-y-1">
                  {site.icon_url ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border/30 group-hover:border-primary/30 transition-colors">
                      <img src={site.icon_url} alt={site.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center border border-border/30">
                      <Globe className="w-7 h-7 text-primary/60" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{site.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{site.owner_name}</p>
                    {site.category && (
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                        {site.category}
                      </span>
                    )}
                  </div>
                  <div className="mt-auto pt-3 flex items-center gap-1.5 text-xs text-primary/70 group-hover:text-primary transition-colors">
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default WebsitesPage;
