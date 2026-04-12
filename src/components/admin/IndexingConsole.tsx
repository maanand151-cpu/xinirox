import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Search, Globe, Share2, CheckCircle, ExternalLink } from "lucide-react";
import { slugify } from "@/lib/slugify";
import type { Tables } from "@/integrations/supabase/types";

type Website = Tables<"websites">;
type SocialMedia = Tables<"social_media">;

interface IndexingConsoleProps {
  websites: Website[];
  socials: SocialMedia[];
}

const BASE = "https://xinirox.lovable.app";
const SITEMAP_URL = `${BASE}/sitemap.xml`;

const IndexingConsole = ({ websites, socials }: IndexingConsoleProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  const allUrls = [
    { label: "Homepage", url: `${BASE}/`, type: "page" as const },
    { label: "About", url: `${BASE}/about`, type: "page" as const },
    { label: "Network", url: `${BASE}/network`, type: "page" as const },
    ...websites.map((w) => ({
      label: w.name,
      url: `${BASE}/site/${slugify(w.name)}`,
      type: "website" as const,
    })),
    ...socials.map((s) => ({
      label: `${s.platform_name} – ${s.owner_name}`,
      url: `${BASE}/profile/${slugify(s.platform_name + "-" + s.owner_name)}`,
      type: "social" as const,
    })),
  ];

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    toast.success("URL copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  const openSitemap = () => {
    window.open(SITEMAP_URL, "_blank");
  };

  const openSearchConsole = () => {
    window.open(`https://search.google.com/search-console?resource_id=${encodeURIComponent(BASE)}`, "_blank");
  };

  return (
    <section>
      <Card className="bg-card border-border/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gradient-gold">
              <Search className="w-5 h-5 text-primary" />
              Indexing Console
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={openSearchConsole}>
                <ExternalLink className="w-3 h-3 mr-1" /> Search Console
              </Button>
              <Button size="sm" onClick={openSitemap}>
                <ExternalLink className="w-3 h-3 mr-1" /> Open Sitemap
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {allUrls.length} URLs prepared for Google discovery • Copy any URL to inspect in Google Search Console
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {allUrls.map(({ label, url, type }) => (
            <div
              key={url}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/20 hover:border-primary/30 transition-colors"
            >
              {type === "website" ? (
                <Globe className="w-4 h-4 text-primary/60 shrink-0" />
              ) : type === "social" ? (
                <Share2 className="w-4 h-4 text-primary/60 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground truncate">{url}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="shrink-0"
                onClick={() => copyUrl(url)}
              >
                {copied === url ? (
                  <CheckCircle className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}

          <div className="pt-4 border-t border-border/20">
            <p className="text-xs text-muted-foreground">
              <strong>Fastest supported flow:</strong> Sitemap + internal links + structured data + Search Console URL Inspection. Google does not provide direct API-based request indexing for normal website pages.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default IndexingConsole;
