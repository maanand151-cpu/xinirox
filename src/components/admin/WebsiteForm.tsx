import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import IconUpload from "./IconUpload";
import type { Tables } from "@/integrations/supabase/types";

type Website = Tables<"websites">;

interface WebsiteFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; url: string; owner_name: string; icon_url: string; category: string }) => void;
  initial?: Website | null;
  loading?: boolean;
}

const WebsiteForm = ({ open, onClose, onSubmit, initial, loading }: WebsiteFormProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setUrl(initial.url);
      setOwnerName(initial.owner_name);
      setIconUrl(initial.icon_url || "");
      setCategory(initial.category || "");
    } else {
      setName("");
      setUrl("");
      setOwnerName("");
      setIconUrl("");
      setCategory("");
    }
  }, [initial, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, url, owner_name: ownerName, icon_url: iconUrl, category });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="font-serif text-gradient-gold">
            {initial ? "Edit Website" : "Add Website"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <IconUpload value={iconUrl} onChange={setIconUrl} />
          <div>
            <Label>Website Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="bg-secondary border-border" />
          </div>
          <div>
            <Label>Website URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} required type="url" className="bg-secondary border-border" />
          </div>
          <div>
            <Label>Owner Name</Label>
            <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required className="bg-secondary border-border" />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Shopping, Education, Tech" className="bg-secondary border-border" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : initial ? "Update" : "Add Website"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WebsiteForm;
