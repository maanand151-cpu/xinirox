import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const SUPABASE_URL = "https://lswynjfkkutmttcqoaqo.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxzd3luamZra3V0bXR0Y3FvYXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjMxNTEsImV4cCI6MjA5MTEzOTE1MX0.-mtmNwAMM-G_qyvJpXqkMxwa6KEvd5AelhA10J2vNnQ";
const BASE_URL = "https://xinirox.lovable.app";

const slugify = (t: string) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function fetchSupabaseData() {
  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
  const [sitesRes, socialsRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/websites?select=name,url,owner_name,updated_at&order=created_at`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/social_media?select=platform_name,profile_url,owner_name,updated_at&order=created_at`, { headers }),
  ]);
  const websites = await sitesRes.json();
  const socials = await socialsRes.json();
  return {
    websites: Array.isArray(websites) ? websites : [],
    socials: Array.isArray(socials) ? socials : [],
  };
}

// Plugin: Generate sitemap.xml at build time
function sitemapPlugin(): Plugin {
  return {
    name: "generate-sitemap",
    apply: "build",
    async closeBundle() {
      try {
        const { websites, socials } = await fetchSupabaseData();
        const now = new Date().toISOString().split("T")[0];

        const urls = [
          { loc: `${BASE_URL}/`, lastmod: now, priority: "1.0" },
          { loc: `${BASE_URL}/about`, lastmod: now, priority: "0.9" },
          { loc: `${BASE_URL}/network`, lastmod: now, priority: "0.9" },
        ];

        for (const s of websites) {
          urls.push({ loc: `${BASE_URL}/site/${slugify(s.name)}`, lastmod: s.updated_at?.split("T")[0] || now, priority: "0.8" });
        }
        for (const s of socials) {
          urls.push({ loc: `${BASE_URL}/profile/${slugify(s.platform_name + "-" + s.owner_name)}`, lastmod: s.updated_at?.split("T")[0] || now, priority: "0.7" });
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n")}
</urlset>`;

        const fs = await import("fs");
        fs.writeFileSync(path.resolve(__dirname, "dist/sitemap.xml"), xml);
        console.log(`✅ Sitemap generated with ${urls.length} URLs`);
      } catch (e) {
        console.warn("⚠️ Sitemap generation failed:", e);
      }
    },
  };
}

// Plugin: Inject real data into index.html <noscript> for Googlebot
function prerenderPlugin(): Plugin {
  return {
    name: "prerender-noscript",
    apply: "build",
    async transformIndexHtml(html) {
      try {
        const { websites, socials } = await fetchSupabaseData();

        const websiteLinks = websites.map(
          (s: any) =>
            `<li><strong>${s.name}</strong> — ${s.owner_name} — <a href="${s.url}">${s.url}</a> — <a href="${BASE_URL}/site/${slugify(s.name)}">Details</a></li>`
        ).join("\n            ");

        const socialLinks = socials.map(
          (s: any) =>
            `<li><strong>${s.platform_name}</strong> — ${s.owner_name} — <a href="${s.profile_url}">${s.profile_url}</a> — <a href="${BASE_URL}/profile/${slugify(s.platform_name + "-" + s.owner_name)}">Details</a></li>`
        ).join("\n            ");

        const socialUrls = socials.map((s: any) => `"${s.profile_url}"`).join(", ");

        const orgSchemas = websites.map((s: any) => JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: s.name,
          url: s.url,
          employee: { "@type": "Person", name: "Xini Rox" },
        })).map(json => `<script type="application/ld+json">${json}</script>`).join("\n    ");

        // Replace existing noscript block
        const noscriptBlock = `<noscript>
      <div style="max-width:800px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif;color:#e0e0e0;background:#0B0B0F;">
        <h1>Xini Rox – Business Manager &amp; Entrepreneur</h1>
        <p>Xini Rox (Aanand Maurya) is a visionary business manager and digital entrepreneur. This is the official digital hub connecting all websites, businesses, and social media profiles.</p>

        <h2>Navigation</h2>
        <ul>
          <li><a href="/" style="color:#D4AF37;">Home</a></li>
          <li><a href="/about" style="color:#D4AF37;">About Us</a></li>
          <li><a href="/network" style="color:#D4AF37;">Full Network Directory</a></li>
        </ul>

        <h2>Websites &amp; Businesses</h2>
        <ul>
            ${websiteLinks}
        </ul>

        <h2>Social Media Profiles</h2>
        <ul>
            ${socialLinks}
        </ul>

        <h2>About Xini Rox</h2>
        <p>Full Name: Aanand Maurya (Xini Rox)</p>
        <p>Role: Business Manager &amp; Digital Entrepreneur</p>
        <p>Specialties: Business Management, Digital Marketing, Entrepreneurship, Technology</p>

        <footer style="margin-top:40px;padding-top:20px;border-top:1px solid #333;">
          <p>&copy; 2025 Xini Rox. All rights reserved.</p>
        </footer>
      </div>
    </noscript>`;

        // Replace the noscript block
        html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, noscriptBlock);

        // Inject Organization schemas + sameAs into Person schema
        const personSchemaRegex = /"@type":\s*"Person"[\s\S]*?"hasOccupation"[\s\S]*?\}/;
        html = html.replace(personSchemaRegex, (match) => {
          return match.replace(
            '"knowsAbout"',
            `"sameAs": [${socialUrls}],\n      "knowsAbout"`
          );
        });

        // Add org schemas before </head>
        if (orgSchemas) {
          html = html.replace('</head>', `    ${orgSchemas}\n  </head>`);
        }

        return html;
      } catch (e) {
        console.warn("⚠️ Prerender injection failed:", e);
        return html;
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    prerenderPlugin(),
    sitemapPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
