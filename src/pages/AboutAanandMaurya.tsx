import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AppShell from "@/components/AppShell";
import SeoHead from "@/components/SeoHead";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { ARTICLES } from "@/content/articles";
import { slugify } from "@/lib/slugify";

const PRIMARY_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/LDyq4yi8n5RmE00lLbWgsTUw5pY2/social-images/social-1775567674370-1000093241.webp";
const UDYAM_ID = "UDYAM-UP-32-0119444";
const INSTAGRAM = "https://www.instagram.com/xini_rox";
const CANONICAL = "Aanand Maurya (Xini Rox)";

const AboutAanandMaurya = () => {
  const { data: websites = [] } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const { data } = await supabase.from("websites").select("*").order("created_at");
      return data || [];
    },
  });
  const { data: socials = [] } = useQuery({
    queryKey: ["social_media"],
    queryFn: async () => {
      const { data } = await supabase.from("social_media").select("*").order("created_at");
      return data || [];
    },
  });

  return (
    <AppShell>
      <SeoHead
        title={`${CANONICAL} — Official Verified Identity & Founder Profile`}
        description={`${CANONICAL} — verified founder of Xini Rox Super Hub. Instagram blue-tick verified, MSME Udyam registered (${UDYAM_ID}). Canonical source-of-truth identity page.`}
        canonical="https://xinirox.lovable.app/about-aanand-maurya"
      />

      <article className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
        <header className="text-center mb-8">
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-primary/70 border border-primary/20 px-3 py-1.5 rounded-full">
            Verified Identity
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-gradient-gold mt-4 mb-3">
            {CANONICAL}
          </h1>
          <p className="text-muted-foreground">Official Founder · Verified Identity · Part of Xini Rox Network</p>
          <div className="divider-gold w-24 mx-auto mt-3" />
        </header>

        <div className="flex flex-col items-center mb-10">
          <img
            src={PRIMARY_IMAGE}
            alt={`${CANONICAL} — official portrait`}
            title={CANONICAL}
            className="w-44 h-44 rounded-full object-cover border-2 border-primary/30 glow-gold"
            loading="eager"
          />
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-full">
              <BadgeCheck className="w-4 h-4" /> Instagram Verified · @xini_rox
            </a>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4" /> MSME Udyam · {UDYAM_ID}
            </span>
          </div>
        </div>

        <section className="card-luxury p-6 mb-6">
          <h2 className="text-2xl font-serif text-gradient-gold mb-3">Biography</h2>
          <p className="text-foreground/90 mb-3">
            <strong>Aanand Maurya</strong>, professionally known as <strong>Xini Rox</strong>, is a verified
            digital entrepreneur, content creator and system builder from Khajni, Gorakhpur, Uttar Pradesh, India.
            He is the founder of <strong>Xini Rox Super Hub</strong> — a centralized digital identity network
            connecting 10+ ventures and 16+ social profiles under one canonical brand.
          </p>
          <p className="text-foreground/90">
            His identity is verified by Instagram (blue tick on @xini_rox) and his business is verified by the
            Government of India through MSME Udyam Registration {UDYAM_ID}.
          </p>
        </section>

        <section className="card-luxury p-6 mb-6">
          <h2 className="text-2xl font-serif text-gradient-gold mb-3">All Projects in the Network</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {websites.map((w: any) => (
              <li key={w.id}>
                <a href={w.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {w.name}
                </a>{" "}
                · <Link to={`/site/${slugify(w.name)}`} className="text-muted-foreground hover:text-primary">Details</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-luxury p-6 mb-6">
          <h2 className="text-2xl font-serif text-gradient-gold mb-3">Verified Social Profiles</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {socials.map((s: any) => (
              <li key={s.id}>
                <strong>{s.platform_name}</strong> ·{" "}
                <a href={s.profile_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                  {s.profile_url}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-luxury p-6">
          <h2 className="text-2xl font-serif text-gradient-gold mb-3">Authority Articles</h2>
          <ul className="grid gap-2">
            {ARTICLES.map((a) => (
              <li key={a.slug}>
                <Link to={`/articles/${a.slug}`} className="text-primary hover:underline">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </AppShell>
  );
};

export default AboutAanandMaurya;
