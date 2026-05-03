import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Globe, User, Share2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import SeoHead from "@/components/SeoHead";
import { getArticle, ARTICLES } from "@/content/articles";
import NotFound from "./NotFound";

const SITE = "https://xinirox.lovable.app";

const ArticleDetail = () => {
  const { slug = "" } = useParams();
  const article = getArticle(slug);
  if (!article) return <NotFound />;

  const canonical = `${SITE}/articles/${article.slug}`;

  return (
    <AppShell>
      <SeoHead title={`${article.title} | Xini Rox`} description={article.description} canonical={canonical} />

      <article className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/articles" className="hover:text-primary">Articles</Link>
          <span>/</span>
          <span className="text-foreground/80 truncate">{article.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gradient-gold mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-muted-foreground text-lg">{article.description}</p>
          <p className="text-xs text-muted-foreground/70 mt-3">
            Published {article.publishedAt} · About <Link to="/about" className="text-primary hover:underline">Xini Rox (Aanand Maurya)</Link>
          </p>
        </header>

        <div className="prose-invert space-y-8">
          {article.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-3">{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="text-foreground/85 leading-relaxed mb-3">
                  {p}
                </p>
              ))}
            </section>
          ))}

          {article.faqs.length > 0 && (
            <section>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-3">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {article.faqs.map((f) => (
                  <div key={f.q} className="rounded-xl bg-card/60 border border-border/30 p-4">
                    <h3 className="font-semibold text-foreground mb-1">{f.q}</h3>
                    <p className="text-sm text-foreground/80">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Internal linking block */}
        <aside className="mt-12 pt-8 border-t border-border/30">
          <h2 className="text-sm uppercase tracking-widest text-primary/70 mb-4">Continue Exploring</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link to="/about" className="group flex items-center gap-3 rounded-xl border border-border/30 bg-card/60 p-4 hover:border-primary/40">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm group-hover:text-primary">About Xini Rox</span>
            </Link>
            <Link to="/websites" className="group flex items-center gap-3 rounded-xl border border-border/30 bg-card/60 p-4 hover:border-primary/40">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm group-hover:text-primary">All Websites</span>
            </Link>
            <Link to="/network" className="group flex items-center gap-3 rounded-xl border border-border/30 bg-card/60 p-4 hover:border-primary/40">
              <Share2 className="w-4 h-4 text-primary" />
              <span className="text-sm group-hover:text-primary">Full Network</span>
            </Link>
          </div>

          <h3 className="text-sm uppercase tracking-widest text-primary/70 mt-8 mb-3">Related Articles</h3>
          <ul className="space-y-2">
            {ARTICLES.filter((a) => a.slug !== article.slug).map((a) => (
              <li key={a.slug}>
                <Link to={`/articles/${a.slug}`} className="text-sm text-foreground/80 hover:text-primary">
                  → {a.title}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link to="/articles" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to all articles
            </Link>
          </div>
        </aside>
      </article>
    </AppShell>
  );
};

export default ArticleDetail;
