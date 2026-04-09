import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Shield, Download } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

const HeroSection = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { canInstall, isInstalled, promptInstall } = useInstallPrompt();

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

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/3 blur-[120px]" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px]" />
      <div className="absolute inset-0 bg-noise opacity-30" />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Install Button */}
        {!isInstalled && (
          <div className="mb-6">
            <button
              onClick={promptInstall}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-[hsl(260,80%,55%)] shadow-[0_0_20px_hsl(260_80%_55%/0.4),0_0_40px_hsl(220_90%_55%/0.2)] hover:shadow-[0_0_30px_hsl(260_80%_55%/0.6),0_0_60px_hsl(220_90%_55%/0.3)] transition-all duration-300 animate-install-glow"
            >
              <Download className="w-4 h-4" />
              Install Xini Rox App
            </button>
          </div>
        )}

        <div className="mb-8 inline-block">
          <span className="text-xs font-medium tracking-[0.4em] uppercase text-primary/70 border border-primary/20 px-4 py-2 rounded-full">
            Business Manager & Entrepreneur
          </span>
        </div>

        <h1
          className="text-6xl sm:text-8xl font-bold font-serif mb-8 text-gradient-gold cursor-default select-none"
          onClick={handleTitleClick}
        >
          Xini Rox
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
          A visionary business manager and entrepreneur driving innovation across multiple ventures.
          Connecting brands, ideas, and people — all in one place.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/50" />
          <div className="w-2 h-2 rounded-full bg-primary glow-gold-sm" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/50" />
        </div>
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
    </section>
  );
};

export default HeroSection;
