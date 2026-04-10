import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Share2, ExternalLink, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { slugify } from "@/lib/slugify";

const ProfileDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: socials = [] } = useQuery({
    queryKey: ["social_media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("social_media").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const social = socials.find((s) => slugify(s.platform_name + "-" + s.owner_name) === slug);

  if (!social && socials.length > 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-foreground mb-4">Profile Not Found</h1>
          <Link to="/network" className="text-primary hover:underline">← Back to Network</Link>
        </div>
      </div>
    );
  }

  if (!social) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>
    );
  }

  const otherProfiles = socials.filter((s) => s.id !== social.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={`${social.platform_name} – ${social.owner_name} | Xini Rox Network`}
        description={`Official ${social.platform_name} profile of ${social.owner_name}, part of the Xini Rox digital network. Follow and connect.`}
        canonical={`https://xinirox.lovable.app/profile/${slug}`}
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
              {social.icon_url ? (
                <img src={social.icon_url} alt={social.platform_name} className="w-24 h-24 rounded-2xl object-cover mx-auto mb-6 border border-border/30" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-6 border border-border/30">
                  <Share2 className="w-10 h-10 text-primary/60" />
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gradient-gold mb-3">{social.platform_name}</h1>
              <p className="text-muted-foreground mb-2">Profile of <strong className="text-foreground">{social.owner_name}</strong></p>
              <p className="text-sm text-muted-foreground mb-8">Connected via Xini Rox Network</p>

              <a
                href={social.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Visit {social.platform_name} <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {otherProfiles.length > 0 && (
              <div className="mt-16">
                <h2 className="text-xl font-serif font-bold text-foreground mb-6">Other Profiles</h2>
                <div className="grid gap-3">
                  {otherProfiles.map((s) => (
                    <Link key={s.id} to={`/profile/${slugify(s.platform_name + "-" + s.owner_name)}`} className="card-luxury p-4 flex items-center justify-between hover:border-primary/30 transition-colors">
                      <div>
                        <p className="font-semibold text-foreground">{s.platform_name}</p>
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

export default ProfileDetail;
