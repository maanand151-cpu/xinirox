import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import AppShell from "@/components/AppShell";
import SeoHead from "@/components/SeoHead";
import { ARTICLES } from "@/content/articles";

const Articles = () => {
  return (
    <AppShell>
      <SeoHead
        title="Xini Rox Articles — Bio, Network & Authority Content"
        description="Authoritative articles about Xini Rox (Aanand Maurya): biography, business network, and the story behind Xini Rox Super Hub."
        canonical="https://xinirox.lovable.app/articles"
      />
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <header className="text-center mb-10">
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-primary/70 border border-primary/20 px-3 py-1.5 rounded-full">
            Authority Library
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-gradient-gold mt-4 mb-3">
            Articles about Xini Rox
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Long-form, Google-readable content establishing the Xini Rox identity, network, and story.
          </p>
        </header>

        <div className="grid gap-4">
          {ARTICLES.map((a) => (
            <Link
              key={a.slug}
              to={`/articles/${a.slug}`}
              className="group block rounded-2xl bg-card/80 backdrop-blur border border-border/30 p-6 hover:border-primary/40 hover:glow-gold-sm transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                    {a.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{a.description}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary">
                    Read article <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Articles;
