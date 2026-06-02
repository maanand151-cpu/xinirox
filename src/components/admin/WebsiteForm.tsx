import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import IconUpload from "./IconUpload";
import type { Tables } from "@/integrations/supabase/types";
import { VENTURE_STATUSES, ventureStatusMeta, getVentureStatus } from "@/lib/ventureStatus";

type Website = Tables<"websites">;

export interface WebsiteFormData {
  name: string;
  url: string;
  owner_name: string;
  icon_url: string;
  category: string;
  short_description: string;
  status: string;
  featured: boolean;
  display_priority: number;
  visible: boolean;
}

interface WebsiteFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: WebsiteFormData) => void;
  initial?: Website | null;
  loading?: boolean;
}

const WebsiteForm = ({ open, onClose, onSubmit, initial, loading }: WebsiteFormProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [status, setStatus] = useState<string>("active");
  const [featured, setFeatured] = useState(false);
  const [displayPriority, setDisplayPriority] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setUrl(initial.url);
      setOwnerName(initial.owner_name);
      setIconUrl(initial.icon_url || "");
      setCategory(initial.category || "");
      setShortDescription(initial.short_description || "");
      setStatus(getVentureStatus(initial.status));
      setFeatured(!!initial.featured);
      setDisplayPriority(initial.display_priority ?? 0);
      setVisible(initial.visible ?? true);
    } else {
      setName(""); setUrl(""); setOwnerName(""); setIconUrl("");
      setCategory(""); setShortDescription("");
      setStatus("active"); setFeatured(false); setDisplayPriority(0); setVisible(true);
    }
  }, [initial, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name, url, owner_name: ownerName, icon_url: iconUrl, category,
      short_description: shortDescription, status, featured,
      display_priority: Number(displayPriority) || 0, visible,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-gradient-gold">
            {initial ? "Edit Venture" : "Add Venture"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <IconUpload value={iconUrl} onChange={setIconUrl} />
          <div>
            <Label>Venture Name</Label>
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
            <Label>Short Description</Label>
            <Textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="One-line tagline shown on venture cards"
              rows={2}
              className="bg-secondary border-border"
            />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Shopping, Education, Tech" className="bg-secondary border-border" />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                {VENTURE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {ventureStatusMeta[s].label} — {ventureStatusMeta[s].description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Display Priority</Label>
            <Input
              type="number"
              value={displayPriority}
              onChange={(e) => setDisplayPriority(Number(e.target.value))}
              placeholder="Higher numbers appear first"
              className="bg-secondary border-border"
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border/40 bg-secondary/40 px-4 py-3">
            <div>
              <Label className="cursor-pointer">Featured</Label>
              <p className="text-xs text-muted-foreground">Highlight in primary showcase</p>
            </div>
            <Switch checked={featured} onCheckedChange={setFeatured} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border/40 bg-secondary/40 px-4 py-3">
            <div>
              <Label className="cursor-pointer">Visible</Label>
              <p className="text-xs text-muted-foreground">Show this venture publicly</p>
            </div>
            <Switch checked={visible} onCheckedChange={setVisible} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : initial ? "Update Venture" : "Add Venture"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WebsiteForm;
