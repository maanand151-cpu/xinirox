import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Plugin to generate dynamic sitemap.xml at build time
function sitemapPlugin(): Plugin {
  return {
    name: "generate-sitemap",
    apply: "build",
    async closeBundle() {
      try {
        const supabaseUrl = "https://lswynjfkkutmttcqoaqo.supabase.co";
        const supabaseKey =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxzd3luamZra3V0bXR0Y3FvYXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjMxNTEsImV4cCI6MjA5MTEzOTE1MX0.-mtmNwAMM-G_qyvJpXqkMxwa6KEvd5AelhA10J2vNnQ";

        const slugify = (t: string) =>
          t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        const [sitesRes, socialsRes] = await Promise.all([
          fetch(`${supabaseUrl}/rest/v1/websites?select=name,updated_at&order=created_at`, {
            headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
          }),
          fetch(`${supabaseUrl}/rest/v1/social_media?select=platform_name,owner_name,updated_at&order=created_at`, {
            headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
          }),
        ]);

        const websites = await sitesRes.json();
        const socials = await socialsRes.json();
        const base = "https://xinirox.lovable.app";
        const now = new Date().toISOString().split("T")[0];

        const urls = [
          { loc: `${base}/`, lastmod: now, priority: "1.0" },
          { loc: `${base}/about`, lastmod: now, priority: "0.9" },
          { loc: `${base}/network`, lastmod: now, priority: "0.9" },
        ];

        for (const s of websites || []) {
          urls.push({ loc: `${base}/site/${slugify(s.name)}`, lastmod: s.updated_at?.split("T")[0] || now, priority: "0.8" });
        }
        for (const s of socials || []) {
          urls.push({ loc: `${base}/profile/${slugify(s.platform_name + "-" + s.owner_name)}`, lastmod: s.updated_at?.split("T")[0] || now, priority: "0.7" });
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n")}
</urlset>`;

        const fs = await import("fs");
        fs.writeFileSync(path.resolve(__dirname, "dist/sitemap.xml"), xml);
        console.log(`✅ Sitemap generated with ${urls.length} URLs`);
      } catch (e) {
        console.warn("⚠️ Sitemap generation failed, using static fallback:", e);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), sitemapPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
