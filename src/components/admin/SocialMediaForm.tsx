import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Tables } from "@/integrations/supabase/types";

type SocialMedia = Tables<"social_media">;

interface SocialMediaFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { platform_name: string; profile_url: string; owner_name: string; icon_url: string }) => void;
  initial?: SocialMedia | null;
  loading?: boolean;
}

const SocialMediaForm = ({ open, onClose, onSubmit, initial, loading }: SocialMediaFormProps) => {
  const [platformName, setPlatformName] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  useEffect(() => {
    if (initial) {
      setPlatformName(initial.platform_name);
      setProfileUrl(initial.profile_url);
      setOwnerName(initial.owner_name);
      setIconUrl(initial.icon_url || "");
    } else {
      setPlatformName("");
      setProfileUrl("");
      setOwnerName("");
      setIconUrl("");
    }
  }, [initial, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ platform_name: platformName, profile_url: profileUrl, owner_name: ownerName, icon_url: iconUrl });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-gradient-gold">
            {initial ? "Edit Social Media" : "Add Social Media"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Icon URL</Label>
            <Input value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://example.com/icon.png" className="bg-secondary border-border" />
          </div>
          <div>
            <Label>Platform Name</Label>
            <Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} required className="bg-secondary border-border" />
          </div>
          <div>
            <Label>Profile URL</Label>
            <Input value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} required type="url" className="bg-secondary border-border" />
          </div>
          <div>
            <Label>Owner Name</Label>
            <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required className="bg-secondary border-border" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : initial ? "Update" : "Add Social Media"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SocialMediaForm;
