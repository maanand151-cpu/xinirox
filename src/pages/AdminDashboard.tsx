import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogOut, Globe, Share2 } from "lucide-react";
import WebsiteForm from "@/components/admin/WebsiteForm";
import SocialMediaForm from "@/components/admin/SocialMediaForm";
import type { Tables } from "@/integrations/supabase/types";

type Website = Tables<"websites">;
type SocialMedia = Tables<"social_media">;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [authorized, setAuthorized] = useState(false);

  const [websiteFormOpen, setWebsiteFormOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [socialFormOpen, setSocialFormOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialMedia | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin");
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  const { data: websites = [] } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const { data, error } = await supabase.from("websites").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: authorized,
  });

  const { data: socials = [] } = useQuery({
    queryKey: ["social_media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("social_media").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: authorized,
  });

  const websiteMutation = useMutation({
    mutationFn: async (data: { id?: string; name: string; url: string; owner_name: string; icon_url: string }) => {
      if (data.id) {
        const { error } = await supabase.from("websites").update({ name: data.name, url: data.url, owner_name: data.owner_name, icon_url: data.icon_url || null }).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("websites").insert({ name: data.name, url: data.url, owner_name: data.owner_name, icon_url: data.icon_url || null });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      setWebsiteFormOpen(false);
      setEditingWebsite(null);
      toast.success("Website saved!");
    },
    onError: () => toast.error("Failed to save website"),
  });

  const deleteWebsite = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("websites").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      toast.success("Website deleted");
    },
  });

  const socialMutation = useMutation({
    mutationFn: async (data: { id?: string; platform_name: string; profile_url: string; owner_name: string; icon_url: string }) => {
      if (data.id) {
        const { error } = await supabase.from("social_media").update({ platform_name: data.platform_name, profile_url: data.profile_url, owner_name: data.owner_name, icon_url: data.icon_url || null }).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("social_media").insert({ platform_name: data.platform_name, profile_url: data.profile_url, owner_name: data.owner_name, icon_url: data.icon_url || null });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social_media"] });
      setSocialFormOpen(false);
      setEditingSocial(null);
      toast.success("Social media saved!");
    },
    onError: () => toast.error("Failed to save social media"),
  });

  const deleteSocial = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("social_media").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social_media"] });
      toast.success("Social media deleted");
    },
  });

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    navigate("/admin");
  };

  if (!authorized) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-serif text-gradient-gold">Admin Dashboard</h1>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Exit
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Websites Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-serif font-bold text-foreground">Websites</h2>
            </div>
            <Button onClick={() => { setEditingWebsite(null); setWebsiteFormOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Add Website
            </Button>
          </div>

          {websites.length === 0 ? (
            <Card className="bg-card border-border/50">
              <CardContent className="p-8 text-center text-muted-foreground">
                No websites yet. Click "Add Website" to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {websites.map((site) => (
                <Card key={site.id} className="bg-card border-border/50">
                  <CardContent className="p-4 flex items-center gap-4">
                    {site.icon_url ? (
                      <img src={site.icon_url} alt={site.name} className="w-10 h-10 rounded-lg object-cover border border-border" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{site.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{site.url}</p>
                    </div>
                    <p className="text-sm text-muted-foreground hidden sm:block">{site.owner_name}</p>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => { setEditingWebsite(site); setSocialFormOpen(false); setWebsiteFormOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteWebsite.mutate(site.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Social Media Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-serif font-bold text-foreground">Social Media</h2>
            </div>
            <Button onClick={() => { setEditingSocial(null); setSocialFormOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Add Social Media
            </Button>
          </div>

          {socials.length === 0 ? (
            <Card className="bg-card border-border/50">
              <CardContent className="p-8 text-center text-muted-foreground">
                No social media yet. Click "Add Social Media" to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {socials.map((social) => (
                <Card key={social.id} className="bg-card border-border/50">
                  <CardContent className="p-4 flex items-center gap-4">
                    {social.icon_url ? (
                      <img src={social.icon_url} alt={social.platform_name} className="w-10 h-10 rounded-lg object-cover border border-border" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{social.platform_name}</p>
                      <p className="text-sm text-muted-foreground truncate">{social.profile_url}</p>
                    </div>
                    <p className="text-sm text-muted-foreground hidden sm:block">{social.owner_name}</p>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => { setEditingSocial(social); setWebsiteFormOpen(false); setSocialFormOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteSocial.mutate(social.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <WebsiteForm
        open={websiteFormOpen}
        onClose={() => { setWebsiteFormOpen(false); setEditingWebsite(null); }}
        onSubmit={(data) => websiteMutation.mutate({ ...data, id: editingWebsite?.id })}
        initial={editingWebsite}
        loading={websiteMutation.isPending}
      />

      <SocialMediaForm
        open={socialFormOpen}
        onClose={() => { setSocialFormOpen(false); setEditingSocial(null); }}
        onSubmit={(data) => socialMutation.mutate({ ...data, id: editingSocial?.id })}
        initial={editingSocial}
        loading={socialMutation.isPending}
      />
    </div>
  );
};

export default AdminDashboard;
