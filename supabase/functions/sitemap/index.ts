import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

Deno.serve(async () => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const baseUrl = "https://xinirox.lovable.app";
  const now = new Date().toISOString().split("T")[0];

  const [{ data: websites }, { data: socials }] = await Promise.all([
    supabase.from("websites").select("name, updated_at").order("created_at"),
    supabase.from("social_media").select("platform_name, owner_name, updated_at").order("created_at"),
  ]);

  const urls: { loc: string; lastmod: string; priority: string }[] = [
    { loc: `${baseUrl}/`, lastmod: now, priority: "1.0" },
    { loc: `${baseUrl}/about`, lastmod: now, priority: "0.9" },
    { loc: `${baseUrl}/network`, lastmod: now, priority: "0.9" },
  ];

  for (const site of websites || []) {
    urls.push({
      loc: `${baseUrl}/site/${slugify(site.name)}`,
      lastmod: site.updated_at?.split("T")[0] || now,
      priority: "0.8",
    });
  }

  for (const social of socials || []) {
    urls.push({
      loc: `${baseUrl}/profile/${slugify(social.platform_name + "-" + social.owner_name)}`,
      lastmod: social.updated_at?.split("T")[0] || now,
      priority: "0.7",
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
});
