import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Globe, ExternalLink, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { slugify } from "@/lib/slugify";

const SiteDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: websites = [] } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const { data, error } = await supabase.from("websites").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const site = websites.find((w) => slugify(w.name) === slug);

  if (!site && websites.length > 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-foreground mb-4">Website Not Found</h1>
          <Link to="/network" className="text-primary hover:underline">← Back to Network</Link>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>
    );
  }

  const otherSites = websites.filter((w) => w.id !== site.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={`${site.name} – Xini Rox Network | Official Website`}
        description={`${site.name} is managed by ${site.owner_name} and is part of the Xini Rox digital network. Visit the official website.`}
        canonical={`https://xinirox.lovable.app/site/${slug}`}
      />
      <Navbar />
      <main className="pt-16">
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
          <div className="absolute inset-0 bg-noise opacity-30" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <Link to="/network" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Network
            </Link>

            <div className="card-luxury p-8 sm:p-12 text-center">
              {site.icon_url ? (
                <img src={site.icon_url} alt={site.name} className="w-24 h-24 rounded-2xl object-cover mx-auto mb-6 border border-border/30" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-6 border border-border/30">
                  <Globe className="w-10 h-10 text-primary/60" />
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gradient-gold mb-3">{site.name}</h1>
              <p className="text-muted-foreground mb-2">Managed by <strong className="text-foreground">{site.owner_name}</strong></p>
              <p className="text-sm text-muted-foreground mb-8">Part of the Xini Rox Digital Network</p>

              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Visit {site.name} <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {otherSites.length > 0 && (
              <div className="mt-16">
                <h2 className="text-xl font-serif font-bold text-foreground mb-6">Related Websites</h2>
                <div className="grid gap-3">
                  {otherSites.map((s) => (
                    <Link key={s.id} to={`/site/${slugify(s.name)}`} className="card-luxury p-4 flex items-center justify-between hover:border-primary/30 transition-colors">
                      <div>
                        <p className="font-semibold text-foreground">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.owner_name}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <nav className="mt-12 text-center space-x-6 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/network" className="hover:text-primary transition-colors">Network</Link>
              <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SiteDetail;
