import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share, Plus, Smartphone, X } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

const DISMISS_KEY = "xini_install_dismissed_at";
const DISMISS_HOURS = 24;

function getPlatform() {
  const ua = navigator.userAgent || navigator.vendor || "";
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isAndroid = /android/i.test(ua);
  return { isIOS, isAndroid };
}

const InstallPromptModal = () => {
  const { canInstall, isInstalled, promptInstall } = useInstallPrompt();
  const [open, setOpen] = useState(false);
  const { isIOS, isAndroid } = getPlatform();

  useEffect(() => {
    if (isInstalled) return;
    // Skip in iframes / preview
    try {
      if (window.self !== window.top) return;
    } catch {
      return;
    }
    const host = window.location.hostname;
    if (host.includes("lovableproject.com") || host.includes("id-preview--")) return;

    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const hours = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60);
      if (hours < DISMISS_HOURS) return;
    }

    const t = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(t);
  }, [isInstalled]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setOpen(false);
  };

  const handleInstall = async () => {
    if (canInstall) {
      await promptInstall();
      setOpen(false);
    }
  };

  if (isInstalled) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? dismiss() : setOpen(true))}>
      <DialogContent className="bg-card border-primary/30 max-w-md p-0 overflow-hidden">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-[hsl(260,80%,25%)] via-[hsl(260,60%,15%)] to-[hsl(220,90%,20%)] p-8 text-center">
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white/80"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-4 shadow-xl">
            <img src="/icons/icon-192.png" alt="Xini Rox" className="w-16 h-16 rounded-xl" onError={(e)=> ((e.target as HTMLImageElement).style.display='none')} />
            <Smartphone className="w-10 h-10 text-white absolute opacity-0" />
          </div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-serif text-white">
              Install Xini Rox Super Hub
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm">
              Get the full app experience — fast access, offline support, and a home-screen icon.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {canInstall && (
            <Button
              onClick={handleInstall}
              className="w-full h-12 text-base font-semibold bg-[hsl(260,80%,55%)] hover:bg-[hsl(260,80%,60%)] text-white shadow-[0_0_25px_hsl(260_80%_55%/0.5)]"
            >
              <Download className="w-5 h-5 mr-2" />
              Install Now
            </Button>
          )}

          {!canInstall && isIOS && (
            <div className="space-y-3 text-sm text-foreground">
              <p className="font-semibold text-primary">How to install on iPhone / iPad:</p>
              <ol className="space-y-2 text-muted-foreground">
                <li className="flex gap-2"><span className="font-bold text-primary">1.</span> Tap the <Share className="inline w-4 h-4 mx-1" /> Share button in Safari</li>
                <li className="flex gap-2"><span className="font-bold text-primary">2.</span> Scroll and tap <Plus className="inline w-4 h-4 mx-1" /> "Add to Home Screen"</li>
                <li className="flex gap-2"><span className="font-bold text-primary">3.</span> Tap "Add" — done!</li>
              </ol>
            </div>
          )}

          {!canInstall && isAndroid && (
            <div className="space-y-3 text-sm text-foreground">
              <p className="font-semibold text-primary">How to install on Android:</p>
              <ol className="space-y-2 text-muted-foreground">
                <li className="flex gap-2"><span className="font-bold text-primary">1.</span> Tap the menu (⋮) in your browser</li>
                <li className="flex gap-2"><span className="font-bold text-primary">2.</span> Tap "Install app" or "Add to Home screen"</li>
                <li className="flex gap-2"><span className="font-bold text-primary">3.</span> Confirm — Xini Rox will appear on your home screen</li>
              </ol>
            </div>
          )}

          {!canInstall && !isIOS && !isAndroid && (
            <div className="space-y-3 text-sm text-foreground">
              <p className="font-semibold text-primary">How to install on Desktop:</p>
              <ol className="space-y-2 text-muted-foreground">
                <li className="flex gap-2"><span className="font-bold text-primary">1.</span> Look for the install icon in your address bar</li>
                <li className="flex gap-2"><span className="font-bold text-primary">2.</span> Or open browser menu → "Install Xini Rox"</li>
                <li className="flex gap-2"><span className="font-bold text-primary">3.</span> Click Install</li>
              </ol>
            </div>
          )}

          <button
            onClick={dismiss}
            className="w-full text-xs text-muted-foreground hover:text-foreground py-2"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstallPromptModal;
