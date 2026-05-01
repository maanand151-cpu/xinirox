import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Globe, Share2, Zap, ExternalLink, ArrowRight, Shield, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import AppShell from "@/components/AppShell";
import JsonLdSchema from "@/components/JsonLdSchema";
import SeoHead from "@/components/SeoHead";

const Dashboard = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { canInstall, isInstalled, promptInstall } = useInstallPrompt();

  const { data: websites = [] } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const { data, error } = await supabase.from("websites").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const { data: socials = [] } = useQuery({
    queryKey: ["social_media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("social_media").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const handleTitleClick = useCallback(() => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setClickCount(0), 2000);
    if (newCount >= 6) {
      setClickCount(0);
      if (clickTimer.current) clearTimeout(clickTimer.current);
      setShowPasswordDialog(true);
    }
  }, [clickCount]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin-password", {
        body: { password },
      });
      if (error || !data?.success) {
        toast.error("Access denied");
      } else {
        sessionStorage.setItem("admin_token", data.token);
        sessionStorage.setItem("admin_password", password);
        toast.success("Welcome back!");
        setShowPasswordDialog(false);
        setPassword("");
        navigate("/admin/dashboard");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  const topWebsites = websites.slice(0, 3);
  const topSocials = socials.slice(0, 3);

  return (
    <AppShell>
      <SeoHead
        title="Xini Rox Super Hub – Digital Identity Dashboard"
        description="Central hub for all websites, social media profiles, and ventures by Xini Rox (Aanand Maurya). Explore the full digital ecosystem."
        canonical="https://xinirox.lovable.app"
      />
      <JsonLdSchema websites={websites} socials={socials} />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-secondary/30 border border-border/30 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
          <div className="relative z-10">
            {!isInstalled && (
              <div className="mb-4">
                <button
                  onClick={promptInstall}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[hsl(260,80%,55%)] shadow-[0_0_20px_hsl(260_80%_55%/0.4)] hover:shadow-[0_0_30px_hsl(260_80%_55%/0.6)] transition-all duration-300 animate-install-glow"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install App
                </button>
              </div>
            )}
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-primary/70">Welcome to</span>
            <h1
              className="text-4xl sm:text-5xl font-bold font-serif text-gradient-gold mt-2 cursor-default select-none"
              onClick={handleTitleClick}
            >
              Xini Rox Super Hub
            </h1>
            <p className="text-muted-foreground mt-3 max-w-xl font-light">
              Your centralized digital identity dashboard — all ventures, brands, and connections in one place.
            </p>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-3 gap-4">
          {[
            { label: "Websites", value: websites.length, icon: Globe, color: "text-blue-400" },
            { label: "Social Accounts", value: socials.length, icon: Share2, color: "text-emerald-400" },
            { label: "Active Projects", value: websites.length + socials.length, icon: Zap, color: "text-amber-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-card/80 backdrop-blur border border-border/30 p-5 text-center hover:glow-gold-sm transition-all duration-300"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Quick Access - Top Websites */}
        {topWebsites.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Top Websites
              </h2>
              <Link to="/websites" className="text-xs text-primary flex items-center gap-1 hover:underline">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid gap-3">
              {topWebsites.map((site) => (
                <a
                  key={site.id}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl bg-card/80 backdrop-blur border border-border/30 p-4 hover:border-primary/30 hover:glow-gold-sm transition-all duration-300"
                >
                  {site.icon_url ? (
                    <img src={site.icon_url} alt={site.name} className="w-10 h-10 rounded-lg object-cover border border-border/30" loading="lazy" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary/60" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{site.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{site.owner_name}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Quick Access - Top Social */}
        {topSocials.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" /> Top Social
              </h2>
              <Link to="/social" className="text-xs text-primary flex items-center gap-1 hover:underline">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid gap-3">
              {topSocials.map((social) => (
                <a
                  key={social.id}
                  href={social.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl bg-card/80 backdrop-blur border border-border/30 p-4 hover:border-primary/30 hover:glow-gold-sm transition-all duration-300"
                >
                  {social.icon_url ? (
                    <img src={social.icon_url} alt={social.platform_name} className="w-10 h-10 rounded-lg object-cover border border-border/30" loading="lazy" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-primary/60" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{social.platform_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{social.owner_name}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Featured Project */}
        {websites.length > 0 && (
          <section>
            <h2 className="text-lg font-serif font-bold text-foreground mb-4">✨ Featured Project</h2>
            <a
              href={websites[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 p-8 hover:glow-gold transition-all duration-500"
            >
              <div className="flex items-center gap-5">
                {websites[0].icon_url ? (
                  <img src={websites[0].icon_url} alt={websites[0].name} className="w-16 h-16 rounded-2xl object-cover border border-border/30" loading="lazy" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-primary/60" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-foreground">{websites[0].name}</h3>
                  <p className="text-sm text-muted-foreground">{websites[0].owner_name}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                <span>Visit Project</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          </section>
        )}
      </div>

      {/* Hidden admin password dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="bg-card border-border/50 max-w-sm">
          <DialogHeader>
            <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-center font-serif text-gradient-gold">Admin Access</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-secondary border-border"
              autoFocus
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Access"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default Dashboard;
