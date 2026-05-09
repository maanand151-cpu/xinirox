import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    // Match /media-proxy/<slug> or /media/<slug>
    const parts = url.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    // Strip extension to allow /media/foo.jpg or /media/foo
    const slug = last.replace(/\.(jpe?g|png|webp|gif|svg)$/i, "").toLowerCase();

    if (!slug) {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from("media_assets")
      .select("supabase_url, content_type, alt, title")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return new Response("Image not found", { status: 404, headers: corsHeaders });
    }

    // Proxy fetch the file so the URL keeps xinirox branding
    const fileRes = await fetch(data.supabase_url);
    if (!fileRes.ok) {
      return new Response("Upstream error", { status: 502, headers: corsHeaders });
    }

    return new Response(fileRes.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": data.content_type || fileRes.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Image-Alt": data.alt || "",
        "X-Image-Title": data.title || "",
      },
    });
  } catch {
    return new Response("Server error", { status: 500, headers: corsHeaders });
  }
});
