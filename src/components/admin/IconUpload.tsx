import { useState, useRef } from "react";
import { adminUpload } from "@/lib/adminUpload";
import { mediaUpload, slugify } from "@/lib/mediaUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface IconUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const IconUpload = ({ value, onChange }: IconUploadProps) => {
  const [mode, setMode] = useState<"url" | "upload" | "branded">(value ? "url" : "upload");
  const [uploading, setUploading] = useState(false);
  const [customName, setCustomName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const brandedRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image");
    if (file.size > 2 * 1024 * 1024) return toast.error("File must be under 2MB");

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const url = await adminUpload(file, fileName);
      onChange(url);
      toast.success("Icon uploaded!");
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  const handleBrandedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!customName.trim()) return toast.error("Enter a custom name first");
    if (!file.type.startsWith("image/")) return toast.error("Please select an image");
    if (file.size > 5 * 1024 * 1024) return toast.error("File must be under 5MB");

    setUploading(true);
    try {
      const result = await mediaUpload(file, customName);
      // Use the SEO branded URL as the stored value
      onChange(result.seoUrl);
      toast.success(`Uploaded as /media/${result.slug}`);
      setCustomName("");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    }
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      <Label>Icon / Image</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        <Button type="button" size="sm" variant={mode === "branded" ? "default" : "outline"} onClick={() => setMode("branded")} className="text-xs">
          <Sparkles className="w-3 h-3 mr-1" /> SEO Upload
        </Button>
        <Button type="button" size="sm" variant={mode === "upload" ? "default" : "outline"} onClick={() => setMode("upload")} className="text-xs">
          <Upload className="w-3 h-3 mr-1" /> Quick
        </Button>
        <Button type="button" size="sm" variant={mode === "url" ? "default" : "outline"} onClick={() => setMode("url")} className="text-xs">
          <Link className="w-3 h-3 mr-1" /> URL
        </Button>
      </div>

      {mode === "branded" ? (
        <div className="space-y-2">
          <Input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder='e.g. "Xini Rox Aanand Maurya"'
            className="bg-secondary border-border"
          />
          {customName && (
            <p className="text-xs text-muted-foreground">
              Will publish as: <span className="text-primary">/media/{slugify(customName)}.jpg</span>
            </p>
          )}
          <input ref={brandedRef} type="file" accept="image/*" onChange={handleBrandedUpload} className="hidden" />
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-primary/40 bg-secondary/50"
            onClick={() => brandedRef.current?.click()}
            disabled={uploading || !customName.trim()}
          >
            {uploading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>) : (<><Sparkles className="w-4 h-4 mr-2" /> Upload Branded Image</>)}
          </Button>
        </div>
      ) : mode === "upload" ? (
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          <Button type="button" variant="outline" className="w-full border-dashed border-border bg-secondary/50" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>) : (<><Upload className="w-4 h-4 mr-2" /> Choose Image</>)}
          </Button>
        </div>
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://example.com/icon.png" className="bg-secondary border-border" />
      )}

      {value && (
        <div className="flex items-center gap-3 p-2 bg-secondary/30 rounded-lg">
          <img src={value} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-border" />
          <span className="text-xs text-muted-foreground truncate flex-1">{value}</span>
        </div>
      )}
    </div>
  );
};

export default IconUpload;
