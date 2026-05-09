import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function extFor(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  if (mime === "image/svg+xml") return "svg";
  return "jpg";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const formData = await req.formData();
    const password = formData.get("password") as string;
    const file = formData.get("file") as File;
    const customName = (formData.get("customName") as string) || "";
    const title = (formData.get("title") as string) || "";
    const alt = (formData.get("alt") as string) || "";
    const isPrimary = formData.get("isPrimary") === "true";

    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    if (!adminPassword || password !== adminPassword) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!file || !customName) {
      return new Response(JSON.stringify({ error: "file and customName required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!file.type.startsWith("image/")) {
      return new Response(JSON.stringify({ error: "Only images allowed" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "Max 5MB" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const slug = slugify(customName);
    if (!slug) {
      return new Response(JSON.stringify({ error: "Invalid name" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ext = extFor(file.type);
    const storagePath = `${slug}.${ext}`;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(storagePath, file, { contentType: file.type, upsert: true });

    if (upErr) {
      return new Response(JSON.stringify({ error: "Upload failed: " + upErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(storagePath);

    if (isPrimary) {
      await supabase.from("media_assets").update({ is_primary: false }).eq("is_primary", true);
    }

    const { error: dbErr } = await supabase
      .from("media_assets")
      .upsert({
        slug,
        storage_path: storagePath,
        supabase_url: urlData.publicUrl,
        title: title || `Xini Rox - ${customName}`,
        alt: alt || `${customName} - Aanand Maurya (Xini Rox) official image`,
        content_type: file.type,
        is_primary: isPrimary,
      }, { onConflict: "slug" });

    if (dbErr) {
      return new Response(JSON.stringify({ error: "DB error: " + dbErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      slug,
      seoUrl: `https://xinirox.co.in/media/${slug}.${ext}`,
      previewUrl: urlData.publicUrl,
      storagePath,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
