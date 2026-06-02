import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Globe, ExternalLink, Lock } from "lucide-react";
import VentureStatusBadge from "@/components/VentureStatusBadge";
import { getVentureStatus, ventureStatusMeta } from "@/lib/ventureStatus";
import { cn } from "@/lib/utils";

const WebsitesSection = () => {
  const { data: websites, isLoading } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("websites")
        .select("*")
        .order("display_priority", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section id="websites" className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4 text-gradient-gold">Ventures</h2>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  const visible = (websites ?? []).filter((w) => {
    if (w.visible === false) return false;
    const meta = ventureStatusMeta[getVentureStatus(w.status)];
    return !meta.hideFromShowcase;
  });

  if (!visible.length) return null;

  return (
    <section id="websites" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4 text-gradient-gold">Ventures</h2>
          <p className="text-muted-foreground font-light tracking-wide">Explore the Xini Rox ecosystem</p>
          <div className="divider-gold w-24 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((site) => {
            const status = getVentureStatus(site.status);
            const meta = ventureStatusMeta[status];
            const disabled = meta.ctaDisabled;
            const dimmed = status === "paused" || status === "under_development";

            const CardInner = (
              <div
                className={cn(
                  "card-luxury p-8 flex flex-col items-center text-center gap-5 h-full transition-all duration-300",
                  dimmed && "opacity-75",
                  !disabled && "group-hover:-translate-y-1",
                )}
              >
                <div className="w-full flex justify-between items-start">
                  <VentureStatusBadge status={status} />
                  {site.featured && (
                    <span className="text-[10px] uppercase tracking-wide text-primary border border-primary/30 rounded-full px-2 py-0.5">
                      Featured
                    </span>
                  )}
                </div>
                {site.icon_url ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border/30 group-hover:border-primary/30 transition-colors duration-500">
                    <img src={site.icon_url} alt={site.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center border border-border/30 group-hover:border-primary/30 transition-colors duration-500">
                    <Globe className="w-9 h-9 text-primary/60" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{site.name}</h3>
                  {site.short_description ? (
                    <p className="text-sm text-muted-foreground line-clamp-2">{site.short_description}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">{site.owner_name}</p>
                  )}
                </div>
                <div
                  className={cn(
                    "mt-auto pt-4 flex items-center gap-2 text-sm transition-colors duration-300",
                    disabled
                      ? "text-muted-foreground"
                      : "text-primary/70 group-hover:text-primary",
                  )}
                >
                  {disabled ? <Lock className="w-3.5 h-3.5" /> : null}
                  <span>{meta.ctaLabel}</span>
                  {!disabled && <ExternalLink className="w-3.5 h-3.5" />}
                </div>
              </div>
            );

            if (disabled) {
              return (
                <div
                  key={site.id}
                  aria-disabled
                  className="block cursor-not-allowed"
                  title={`${meta.label} — ${meta.description}`}
                >
                  {CardInner}
                </div>
              );
            }

            return (
              <a
                key={site.id}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                {CardInner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WebsitesSection;
