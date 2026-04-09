import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save, User, Trophy, Image as ImageIcon } from "lucide-react";
import IconUpload from "@/components/admin/IconUpload";

const AboutAdmin = () => {
  const queryClient = useQueryClient();

  // Profile
  const { data: profile } = useQuery({
    queryKey: ["about_profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_profile").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  const [profileForm, setProfileForm] = useState<Record<string, string | boolean>>({});
  const profileDirty = Object.keys(profileForm).length > 0;

  const getProfileValue = (field: string) =>
    field in profileForm ? profileForm[field] : (profile as any)?.[field] ?? "";

  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!profile) return;
      const updateData: Record<string, unknown> = { ...profileForm };
      const { error } = await supabase.from("about_profile").update(updateData as any).eq("id", profile.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about_profile"] });
      setProfileForm({});
      toast.success("Profile updated!");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  // Achievements
  const { data: achievements = [] } = useQuery({
    queryKey: ["about_achievements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_achievements").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const [achForm, setAchForm] = useState({ title: "", description: "" });
  const [editingAch, setEditingAch] = useState<string | null>(null);

  const achMutation = useMutation({
    mutationFn: async (data: { id?: string; title: string; description: string }) => {
      if (data.id) {
        const { error } = await supabase.from("about_achievements").update({ title: data.title, description: data.description }).eq("id", data.id);
        if (error) throw error;
      } else {
        const maxOrder = achievements.length > 0 ? Math.max(...achievements.map((a) => a.sort_order)) + 1 : 0;
        const { error } = await supabase.from("about_achievements").insert({ title: data.title, description: data.description, sort_order: maxOrder });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about_achievements"] });
      setAchForm({ title: "", description: "" });
      setEditingAch(null);
      toast.success("Achievement saved!");
    },
    onError: () => toast.error("Failed to save"),
  });

  const deleteAch = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("about_achievements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about_achievements"] });
      toast.success("Deleted");
    },
  });

  // Gallery
  const { data: gallery = [] } = useQuery({
    queryKey: ["about_gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_gallery").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const [galleryUrl, setGalleryUrl] = useState("");
  const [galleryCaption, setGalleryCaption] = useState("");

  const addGalleryImage = useMutation({
    mutationFn: async (imageUrl: string) => {
      const maxOrder = gallery.length > 0 ? Math.max(...gallery.map((g) => g.sort_order)) + 1 : 0;
      const { error } = await supabase.from("about_gallery").insert({ image_url: imageUrl, caption: galleryCaption, sort_order: maxOrder });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about_gallery"] });
      setGalleryUrl("");
      setGalleryCaption("");
      toast.success("Image added!");
    },
    onError: () => toast.error("Failed to add image"),
  });

  const deleteGalleryImage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("about_gallery").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about_gallery"] });
      toast.success("Image removed");
    },
  });

  const handleGalleryUpload = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `gallery/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("icons").upload(path, file);
    if (error) { toast.error("Upload failed"); return; }
    const { data: urlData } = supabase.storage.from("icons").getPublicUrl(path);
    addGalleryImage.mutate(urlData.publicUrl);
  };

  return (
    <div className="space-y-10">
      {/* Profile Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-serif font-bold text-foreground">About Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground text-sm">Profile Image</Label>
            <div className="flex items-center gap-4 mt-1">
              {getProfileValue("profile_image_url") && (
                <img src={getProfileValue("profile_image_url") as string} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-border/30" />
              )}
              <IconUpload
                value={(getProfileValue("profile_image_url") as string) || ""}
                onChange={(url) => setProfileForm((p) => ({ ...p, profile_image_url: url }))}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground text-sm">Full Name</Label>
              <Input value={getProfileValue("full_name") as string} onChange={(e) => setProfileForm((p) => ({ ...p, full_name: e.target.value }))} className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Tagline</Label>
              <Input value={getProfileValue("tagline") as string} onChange={(e) => setProfileForm((p) => ({ ...p, tagline: e.target.value }))} className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Contact Number</Label>
              <Input value={getProfileValue("contact_number") as string} onChange={(e) => setProfileForm((p) => ({ ...p, contact_number: e.target.value }))} className="bg-secondary border-border mt-1" />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Email Address</Label>
              <Input value={getProfileValue("email") as string} onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))} className="bg-secondary border-border mt-1" />
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground text-sm">Address</Label>
            <Textarea value={getProfileValue("address") as string} onChange={(e) => setProfileForm((p) => ({ ...p, address: e.target.value }))} className="bg-secondary border-border mt-1" rows={2} />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={(profileForm.is_verified ?? profile?.is_verified ?? false) as boolean}
              onCheckedChange={(v) => setProfileForm((p) => ({ ...p, is_verified: v }))}
            />
            <Label className="text-foreground">Verified Badge</Label>
          </div>

          {profileDirty && (
            <Button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending}>
              <Save className="w-4 h-4 mr-2" /> Save Profile
            </Button>
          )}
        </div>
      </section>

      {/* Achievements */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-serif font-bold text-foreground">Achievements</h2>
        </div>

        <div className="space-y-3 mb-4">
          {achievements.map((a) => (
            <Card key={a.id} className="bg-card border-border/30">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{a.title}</p>
                  {a.description && <p className="text-sm text-muted-foreground truncate">{a.description}</p>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { setEditingAch(a.id); setAchForm({ title: a.title, description: a.description || "" }); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteAch.mutate(a.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card border-border/30">
          <CardContent className="p-4 space-y-3">
            <Input placeholder="Achievement title" value={achForm.title} onChange={(e) => setAchForm((f) => ({ ...f, title: e.target.value }))} className="bg-secondary border-border" />
            <Input placeholder="Description (optional)" value={achForm.description} onChange={(e) => setAchForm((f) => ({ ...f, description: e.target.value }))} className="bg-secondary border-border" />
            <Button
              disabled={!achForm.title || achMutation.isPending}
              onClick={() => achMutation.mutate({ id: editingAch || undefined, title: achForm.title, description: achForm.description })}
            >
              <Plus className="w-4 h-4 mr-2" /> {editingAch ? "Update" : "Add"} Achievement
            </Button>
            {editingAch && (
              <Button variant="ghost" onClick={() => { setEditingAch(null); setAchForm({ title: "", description: "" }); }}>
                Cancel
              </Button>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Gallery */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <ImageIcon className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-serif font-bold text-foreground">Gallery</h2>
        </div>

        {gallery.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {gallery.map((img) => (
              <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border/30">
                <img src={img.image_url} alt={img.caption || ""} className="w-full h-full object-cover" />
                <button
                  onClick={() => deleteGalleryImage.mutate(img.id)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Card className="bg-card border-border/30">
          <CardContent className="p-4 space-y-3">
            <div>
              <Label className="text-muted-foreground text-sm">Upload Image</Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => { if (e.target.files?.[0]) handleGalleryUpload(e.target.files[0]); }}
                className="mt-1 block w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-secondary file:text-foreground hover:file:bg-secondary/80"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>— or —</span>
            </div>
            <Input placeholder="Image URL" value={galleryUrl} onChange={(e) => setGalleryUrl(e.target.value)} className="bg-secondary border-border" />
            <Input placeholder="Caption (optional)" value={galleryCaption} onChange={(e) => setGalleryCaption(e.target.value)} className="bg-secondary border-border" />
            {galleryUrl && (
              <Button onClick={() => addGalleryImage.mutate(galleryUrl)} disabled={addGalleryImage.isPending}>
                <Plus className="w-4 h-4 mr-2" /> Add from URL
              </Button>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AboutAdmin;
