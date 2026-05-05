import fs from "fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ARTICLES, type Article } from "./src/content/articles";

const SUPABASE_URL = "https://lswynjfkkutmttcqoaqo.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxzd3luamZra3V0bXR0Y3FvYXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjMxNTEsImV4cCI6MjA5MTEzOTE1MX0.-mtmNwAMM-G_qyvJpXqkMxwa6KEvd5AelhA10J2vNnQ";
const BASE_URL = "https://xinirox.lovable.app";
const TODAY = new Date().toISOString().split("T")[0];

// Canonical identity assets — same image/name used everywhere for entity consistency
const PRIMARY_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/LDyq4yi8n5RmE00lLbWgsTUw5pY2/social-images/social-1775567674370-1000093241.webp";
const PRIMARY_LOGO = PRIMARY_IMAGE;
const UDYAM_ID = "UDYAM-UP-32-0119444";
const INSTAGRAM_VERIFIED = "https://www.instagram.com/xini_rox";
const CANONICAL_NAME = "Aanand Maurya (Xini Rox)";

type WebsiteRecord = {
  name: string;
  url: string;
  owner_name: string;
  updated_at?: string | null;
};

type SocialRecord = {
  platform_name: string;
  profile_url: string;
  owner_name: string;
  updated_at?: string | null;
};

type AboutProfileRecord = {
  full_name?: string | null;
  tagline?: string | null;
  email?: string | null;
  contact_number?: string | null;
  address?: string | null;
  is_verified?: boolean | null;
};

type AchievementRecord = {
  title: string;
  description?: string | null;
};

type SeoPage = {
  title: string;
  description: string;
  canonical: string;
  body: string;
  schemas: Array<Record<string, unknown>>;
};

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const escapeHtml = (value: string | null | undefined) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatDate = (value?: string | null) => value?.split("T")[0] || TODAY;

const renderLinkList = (items: string[]) =>
  items.length
    ? `<ul style="margin:0;padding-left:1.2rem;color:#e7e7e7;display:grid;gap:0.8rem;">${items.join("")}</ul>`
    : `<p style="margin:0;color:#b5b5b5;">No entries yet.</p>`;

const renderShell = (eyebrow: string, title: string, description: string, sections: string[]) => `
  <div data-prerendered="true" style="min-height:100vh;background:#0b0b0f;color:#f5f5f5;font-family:Inter,system-ui,sans-serif;">
    <main style="max-width:1040px;margin:0 auto;padding:32px 20px 64px;line-height:1.6;">
      <header style="padding:20px 0 32px;border-bottom:1px solid rgba(212,175,55,.18);margin-bottom:32px;">
        <p style="margin:0 0 12px;color:#d4af37;letter-spacing:.28em;text-transform:uppercase;font-size:.75rem;">${escapeHtml(eyebrow)}</p>
        <h1 style="margin:0 0 12px;font-size:clamp(2rem,6vw,4rem);font-family:'Playfair Display',serif;color:#f4d57b;">${escapeHtml(title)}</h1>
        <p style="margin:0;max-width:760px;color:#d7d7d7;font-size:1.05rem;">${escapeHtml(description)}</p>
      </header>
      <nav aria-label="Primary" style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:32px;">
        <a href="/" style="color:#f4d57b;text-decoration:none;">Home</a>
        <a href="/about" style="color:#f4d57b;text-decoration:none;">About</a>
        <a href="/network" style="color:#f4d57b;text-decoration:none;">Network</a>
      </nav>
      <section style="display:grid;gap:24px;">${sections.join("")}</section>
    </main>
  </div>`;

const renderCard = (title: string, content: string) => `
  <section style="background:linear-gradient(145deg,#111,#0d0d12);border:1px solid rgba(212,175,55,.14);border-radius:20px;padding:24px;box-shadow:0 18px 50px rgba(0,0,0,.35);">
    <h2 style="margin:0 0 14px;font-size:1.35rem;font-family:'Playfair Display',serif;color:#f1d38d;">${escapeHtml(title)}</h2>
    ${content}
  </section>`;

async function fetchTable<T>(endpoint: string): Promise<T[]> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
  }

  const data: unknown = await response.json();
  return Array.isArray(data) ? data : [];
}

async function fetchSingle<T>(endpoint: string): Promise<T | null> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data: unknown = await response.json();
  if (Array.isArray(data)) {
    return ((data[0] as T | undefined) ?? null);
  }

  return (data as T) ?? null;
}

async function fetchSupabaseData() {
  const [websites, socials, profile, achievements] = await Promise.all([
    fetchTable<WebsiteRecord>("websites?select=name,url,owner_name,updated_at&order=created_at"),
    fetchTable<SocialRecord>("social_media?select=platform_name,profile_url,owner_name,updated_at&order=created_at"),
    fetchSingle<AboutProfileRecord>("about_profile?select=full_name,tagline,email,contact_number,address,is_verified&limit=1"),
    fetchTable<AchievementRecord>("about_achievements?select=title,description&order=sort_order"),
  ]);

  return {
    websites,
    socials,
    profile,
    achievements,
  };
}

function setTagContent(html: string, tagRegex: RegExp, replacement: string) {
  return tagRegex.test(html) ? html.replace(tagRegex, replacement) : html;
}

function upsertMeta(html: string, key: string, value: string, attr: "name" | "property" = "name") {
  const safeValue = escapeHtml(value);
  const tag = `<meta ${attr}="${key}" content="${safeValue}" />`;
  const regex = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*\\/?>(?:</meta>)?`, "i");
  return regex.test(html) ? html.replace(regex, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function upsertCanonical(html: string, value: string) {
  const tag = `<link rel="canonical" href="${escapeHtml(value)}" />`;
  const regex = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
  return regex.test(html) ? html.replace(regex, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function injectSchemas(html: string, schemas: Array<Record<string, unknown>>) {
  const scripts = schemas
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join("\n    ");

  const cleaned = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");
  return cleaned.replace("</head>", scripts ? `    ${scripts}\n  </head>` : "</head>");
}

function buildPage(template: string, page: SeoPage) {
  let html = template;

  html = setTagContent(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  html = upsertMeta(html, "description", page.description);
  html = upsertMeta(html, "robots", "index, follow");
  html = upsertMeta(html, "googlebot", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
  html = upsertMeta(html, "og:title", page.title, "property");
  html = upsertMeta(html, "og:description", page.description, "property");
  html = upsertMeta(html, "og:url", page.canonical, "property");
  html = upsertMeta(html, "twitter:title", page.title);
  html = upsertMeta(html, "twitter:description", page.description);
  html = upsertCanonical(html, page.canonical);
  html = injectSchemas(html, page.schemas);
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${page.body}</div>`);
  html = html.replace(/\s*<noscript>[\s\S]*?<\/noscript>/i, "");

  return html;
}

function getCommonSchemas(data: Awaited<ReturnType<typeof fetchSupabaseData>>) {
  const personName = data.profile?.full_name || "Xini Rox";
  const tagline = data.profile?.tagline || "Business Manager & Digital Entrepreneur";
  const personId = `${BASE_URL}/#person`;
  const orgId = `${BASE_URL}/#organization`;
  const siteId = `${BASE_URL}/#website`;

  // Single @graph that unifies Person + Organization + WebSite + every venture
  // so Google/AI treat them as ONE connected entity, not isolated nodes.
  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "ImageObject",
      "@id": `${BASE_URL}/#primaryimage`,
      url: PRIMARY_IMAGE,
      contentUrl: PRIMARY_IMAGE,
      caption: `${CANONICAL_NAME} — official primary photo`,
      name: "xini-rox-aanand-maurya.jpg",
      creator: { "@id": personId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: "Aanand Maurya",
      alternateName: ["Xini Rox", "XiniRox", "Aanand Kumar Maurya"],
      url: BASE_URL,
      mainEntityOfPage: { "@id": `${BASE_URL}/about-aanand-maurya` },
      image: { "@id": `${BASE_URL}/#primaryimage` },
      jobTitle: tagline,
      worksFor: { "@id": orgId },
      sameAs: Array.from(new Set([INSTAGRAM_VERIFIED, ...data.socials.map((i) => i.profile_url)])),
      knowsAbout: ["Business", "Digital Marketing", "Entrepreneurship", "Technology"],
      identifier: [
        { "@type": "PropertyValue", propertyID: "Instagram Verified Account (Blue Tick)", value: "@xini_rox" },
        { "@type": "PropertyValue", propertyID: "MSME Udyam Registration", value: UDYAM_ID },
      ],
      hasCredential: [
        { "@type": "EducationalOccupationalCredential", name: "Instagram Verified Account", credentialCategory: "Verified Identity", url: INSTAGRAM_VERIFIED },
        { "@type": "EducationalOccupationalCredential", name: "MSME Udyam Registration", credentialCategory: "Government-issued Business Registration", identifier: UDYAM_ID, recognizedBy: { "@type": "GovernmentOrganization", name: "Ministry of MSME, Government of India" } },
      ],
      ...(data.profile?.email ? { email: data.profile.email } : {}),
      ...(data.profile?.contact_number ? { telephone: data.profile.contact_number } : {}),
      ...(data.profile?.address ? { address: data.profile.address } : {}),
    },
    {
      "@type": "Organization",
      "@id": orgId,
      name: "Xini Rox",
      alternateName: "Xini Rox Super Hub",
      url: BASE_URL,
      logo: PRIMARY_LOGO,
      image: { "@id": `${BASE_URL}/#primaryimage` },
      founder: { "@id": personId },
      employee: { "@id": personId },
      taxID: UDYAM_ID,
      identifier: [{ "@type": "PropertyValue", propertyID: "MSME Udyam Registration", value: UDYAM_ID }],
      sameAs: Array.from(new Set([INSTAGRAM_VERIFIED, ...data.socials.map((i) => i.profile_url)])),
      subOrganization: data.websites.map((site) => ({
        "@type": "Organization",
        name: site.name.trim(),
        url: site.url,
      })),
    },
    {
      "@type": "WebSite",
      "@id": siteId,
      name: "Xini Rox Super Hub",
      url: BASE_URL,
      publisher: { "@id": orgId },
      about: { "@id": personId },
      potentialAction: {
        "@type": "SearchAction",
        target: `${BASE_URL}/network?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    ...data.websites.map((site) => ({
      "@type": "Organization",
      "@id": `${BASE_URL}/site/${slugify(site.name)}#org`,
      name: site.name.trim(),
      url: site.url,
      parentOrganization: { "@id": orgId },
      employee: { "@id": personId },
    })),
    ...data.socials.map((social) => ({
      "@type": "ProfilePage",
      "@id": `${BASE_URL}/profile/${slugify(`${social.platform_name}-${social.owner_name}`)}#profile`,
      name: `${social.platform_name.trim()} – ${social.owner_name.trim()}`,
      url: social.profile_url,
      about: { "@id": personId },
    })),
  ];

  return [
    {
      "@context": "https://schema.org",
      "@graph": graph,
    },
  ];
}

function createHomePage(data: Awaited<ReturnType<typeof fetchSupabaseData>>): SeoPage {
  const profileName = data.profile?.full_name || "Xini Rox";
  const tagline = data.profile?.tagline || "Business Manager & Digital Entrepreneur";

  return {
    title: `${profileName} – Official Digital Identity Hub`,
    description: `${profileName} official hub connecting websites, businesses, and social profiles in one Google-readable network.`,
    canonical: `${BASE_URL}/`,
    body: renderShell(
      "Central Identity Hub",
      profileName,
      `${tagline}. Explore the full business and social identity graph of Xini Rox in one crawlable place.`,
      [
        renderCard(
          "Websites & Businesses",
          renderLinkList(
            data.websites.map(
              (site) => `<li><strong>${escapeHtml(site.name)}</strong> — ${escapeHtml(site.owner_name)} — <a href="${escapeHtml(site.url)}" style="color:#f4d57b;">${escapeHtml(site.url)}</a> — <a href="/site/${slugify(site.name)}" style="color:#f4d57b;">View details</a></li>`,
            ),
          ),
        ),
        renderCard(
          "Social Profiles",
          renderLinkList(
            data.socials.map(
              (social) => `<li><strong>${escapeHtml(social.platform_name)}</strong> — ${escapeHtml(social.owner_name)} — <a href="${escapeHtml(social.profile_url)}" style="color:#f4d57b;">${escapeHtml(social.profile_url)}</a> — <a href="/profile/${slugify(`${social.platform_name}-${social.owner_name}`)}" style="color:#f4d57b;">View details</a></li>`,
            ),
          ),
        ),
      ],
    ),
    schemas: getCommonSchemas(data),
  };
}

function createAboutPage(data: Awaited<ReturnType<typeof fetchSupabaseData>>): SeoPage {
  const profileName = data.profile?.full_name || "Xini Rox";
  const tagline = data.profile?.tagline || "Business Manager & Digital Entrepreneur";

  return {
    title: `About ${profileName} – Digital Identity & Authority`,
    description: `Learn about ${profileName}, the person behind Xini Rox Super Hub, including professional identity, achievements, and contact details.`,
    canonical: `${BASE_URL}/about`,
    body: renderShell(
      "About",
      `About ${profileName}`,
      `${profileName} is the central identity behind Xini Rox Super Hub. This page establishes the person entity and business authority signals.`,
      [
        renderCard(
          "Professional Identity",
          `<p style="margin:0 0 12px;color:#e7e7e7;">${escapeHtml(tagline)}</p>
           <ul style="margin:0;padding-left:1.2rem;color:#d7d7d7;display:grid;gap:.55rem;">
             <li>Name: ${escapeHtml(profileName)}</li>
             <li>Verified: ${data.profile?.is_verified ? "Yes" : "No"}</li>
             ${data.profile?.email ? `<li>Email: <a href="mailto:${escapeHtml(data.profile.email)}" style="color:#f4d57b;">${escapeHtml(data.profile.email)}</a></li>` : ""}
             ${data.profile?.contact_number ? `<li>Contact: ${escapeHtml(data.profile.contact_number)}</li>` : ""}
             ${data.profile?.address ? `<li>Address: ${escapeHtml(data.profile.address)}</li>` : ""}
           </ul>`,
        ),
        renderCard(
          "Achievements",
          renderLinkList(
            data.achievements.map(
              (achievement) => `<li><strong>${escapeHtml(achievement.title)}</strong>${achievement.description ? ` — ${escapeHtml(achievement.description)}` : ""}</li>`,
            ),
          ),
        ),
      ],
    ),
    schemas: getCommonSchemas(data),
  };
}

function createNetworkPage(data: Awaited<ReturnType<typeof fetchSupabaseData>>): SeoPage {
  const itemList = [
    ...data.websites.map((site, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE_URL}/site/${slugify(site.name)}`,
      name: site.name,
    })),
    ...data.socials.map((social, index) => ({
      "@type": "ListItem",
      position: data.websites.length + index + 1,
      url: `${BASE_URL}/profile/${slugify(`${social.platform_name}-${social.owner_name}`)}`,
      name: `${social.platform_name} ${social.owner_name}`,
    })),
  ];

  return {
    title: "Xini Rox Network – All Websites and Social Profiles",
    description: "Browse the full crawlable directory of businesses, websites, and social profiles connected to Xini Rox.",
    canonical: `${BASE_URL}/network`,
    body: renderShell(
      "Network Directory",
      "Xini Rox Network",
      "A searchable authority directory connecting every business website and social profile linked to Xini Rox.",
      [
        renderCard(
          "Websites",
          renderLinkList(
            data.websites.map(
              (site) => `<li><strong>${escapeHtml(site.name)}</strong> — Owner: ${escapeHtml(site.owner_name)} — <a href="${escapeHtml(site.url)}" style="color:#f4d57b;">${escapeHtml(site.url)}</a> — <a href="/site/${slugify(site.name)}" style="color:#f4d57b;">View details</a></li>`,
            ),
          ),
        ),
        renderCard(
          "Social Media",
          renderLinkList(
            data.socials.map(
              (social) => `<li><strong>${escapeHtml(social.platform_name)}</strong> — Owner: ${escapeHtml(social.owner_name)} — <a href="${escapeHtml(social.profile_url)}" style="color:#f4d57b;">${escapeHtml(social.profile_url)}</a> — <a href="/profile/${slugify(`${social.platform_name}-${social.owner_name}`)}" style="color:#f4d57b;">View details</a></li>`,
            ),
          ),
        ),
      ],
    ),
    schemas: [
      ...getCommonSchemas(data),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Xini Rox Network",
        url: `${BASE_URL}/network`,
        hasPart: itemList,
      },
    ],
  };
}

function createWebsitePage(site: WebsiteRecord, data: Awaited<ReturnType<typeof fetchSupabaseData>>): SeoPage {
  const slug = slugify(site.name);
  return {
    title: `${site.name} – Official Website in Xini Rox Network`,
    description: `${site.name} is connected to Xini Rox and managed by ${site.owner_name}. Visit the official website and explore related entities.`,
    canonical: `${BASE_URL}/site/${slug}`,
    body: renderShell(
      "Website Entity",
      site.name,
      `${site.name} is part of the Xini Rox digital network and connects the entity graph through real internal and external links.`,
      [
        renderCard(
          "Entity Details",
          `<ul style="margin:0;padding-left:1.2rem;color:#d7d7d7;display:grid;gap:.6rem;">
             <li>Owner: ${escapeHtml(site.owner_name)}</li>
             <li>Official URL: <a href="${escapeHtml(site.url)}" style="color:#f4d57b;">${escapeHtml(site.url)}</a></li>
             <li>Directory Page: <a href="/network" style="color:#f4d57b;">View network directory</a></li>
           </ul>`,
        ),
        renderCard(
          "Related Links",
          renderLinkList(
            data.websites
              .filter((item) => item.name !== site.name)
              .slice(0, 4)
              .map((item) => `<li><a href="/site/${slugify(item.name)}" style="color:#f4d57b;">${escapeHtml(item.name)}</a></li>`),
          ),
        ),
      ],
    ),
    schemas: [
      ...getCommonSchemas(data),
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: site.name,
        url: `${BASE_URL}/site/${slug}`,
        mainEntity: {
          "@type": "Organization",
          name: site.name,
          url: site.url,
          employee: {
            "@type": "Person",
            name: data.profile?.full_name || "Xini Rox",
          },
        },
      },
    ],
  };
}

function createSocialPage(social: SocialRecord, data: Awaited<ReturnType<typeof fetchSupabaseData>>): SeoPage {
  const slug = slugify(`${social.platform_name}-${social.owner_name}`);
  return {
    title: `${social.platform_name} – ${social.owner_name} Profile | Xini Rox Network`,
    description: `Official ${social.platform_name} profile for ${social.owner_name} inside the Xini Rox entity network.`,
    canonical: `${BASE_URL}/profile/${slug}`,
    body: renderShell(
      "Social Entity",
      `${social.platform_name} Profile`,
      `${social.platform_name} profile for ${social.owner_name}, connected to the Xini Rox identity graph through sameAs and internal linking signals.`,
      [
        renderCard(
          "Profile Details",
          `<ul style="margin:0;padding-left:1.2rem;color:#d7d7d7;display:grid;gap:.6rem;">
             <li>Platform: ${escapeHtml(social.platform_name)}</li>
             <li>Owner: ${escapeHtml(social.owner_name)}</li>
             <li>Profile URL: <a href="${escapeHtml(social.profile_url)}" style="color:#f4d57b;">${escapeHtml(social.profile_url)}</a></li>
             <li>Directory Page: <a href="/network" style="color:#f4d57b;">View network directory</a></li>
           </ul>`,
        ),
        renderCard(
          "Other Profiles",
          renderLinkList(
            data.socials
              .filter((item) => item.profile_url !== social.profile_url)
              .slice(0, 4)
              .map((item) => `<li><a href="/profile/${slugify(`${item.platform_name}-${item.owner_name}`)}" style="color:#f4d57b;">${escapeHtml(item.platform_name)} — ${escapeHtml(item.owner_name)}</a></li>`),
          ),
        ),
      ],
    ),
    schemas: [
      ...getCommonSchemas(data),
      {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        name: `${social.platform_name} – ${social.owner_name}`,
        url: `${BASE_URL}/profile/${slug}`,
        mainEntity: {
          "@type": "Person",
          name: social.owner_name,
          sameAs: [social.profile_url],
        },
      },
    ],
  };
}

function createArticlesIndexPage(data: Awaited<ReturnType<typeof fetchSupabaseData>>): SeoPage {
  return {
    title: "Xini Rox Articles — Bio, Network & Authority Content",
    description:
      "Authoritative articles about Xini Rox (Aanand Maurya): biography, business network, and the story behind Xini Rox Super Hub.",
    canonical: `${BASE_URL}/articles`,
    body: renderShell(
      "Authority Library",
      "Articles about Xini Rox",
      "Long-form, Google-readable content establishing the Xini Rox identity, network, and story.",
      [
        renderCard(
          "All Articles",
          renderLinkList(
            ARTICLES.map(
              (a) =>
                `<li><a href="/articles/${a.slug}" style="color:#f4d57b;"><strong>${escapeHtml(a.title)}</strong></a><br/><span style="color:#b5b5b5;">${escapeHtml(a.description)}</span></li>`,
            ),
          ),
        ),
      ],
    ),
    schemas: [
      ...getCommonSchemas(data),
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Xini Rox Articles",
        url: `${BASE_URL}/articles`,
        author: { "@type": "Person", name: data.profile?.full_name || "Xini Rox" },
        blogPost: ARTICLES.map((a) => ({
          "@type": "BlogPosting",
          headline: a.title,
          url: `${BASE_URL}/articles/${a.slug}`,
          datePublished: a.publishedAt,
        })),
      },
    ],
  };
}

function createArticlePage(article: Article, data: Awaited<ReturnType<typeof fetchSupabaseData>>): SeoPage {
  const url = `${BASE_URL}/articles/${article.slug}`;
  const personName = data.profile?.full_name || "Xini Rox";

  const bodySections = article.sections
    .map(
      (s) =>
        `<section><h2 style="margin:0 0 10px;font-size:1.4rem;font-family:'Playfair Display',serif;color:#f1d38d;">${escapeHtml(
          s.heading,
        )}</h2>${s.paragraphs
          .map((p) => `<p style="margin:0 0 12px;color:#e7e7e7;">${escapeHtml(p)}</p>`)
          .join("")}</section>`,
    )
    .join("");

  const faqSection = article.faqs.length
    ? `<section><h2 style="margin:24px 0 10px;font-size:1.4rem;font-family:'Playfair Display',serif;color:#f1d38d;">Frequently Asked Questions</h2>${article.faqs
        .map(
          (f) =>
            `<div style="margin-bottom:14px;"><h3 style="margin:0 0 4px;color:#f4d57b;">${escapeHtml(
              f.q,
            )}</h3><p style="margin:0;color:#d7d7d7;">${escapeHtml(f.a)}</p></div>`,
        )
        .join("")}</section>`
    : "";

  const related = ARTICLES.filter((a) => a.slug !== article.slug)
    .map((a) => `<li><a href="/articles/${a.slug}" style="color:#f4d57b;">${escapeHtml(a.title)}</a></li>`)
    .join("");

  return {
    title: `${article.title} | Xini Rox`,
    description: article.description,
    canonical: url,
    body: renderShell("Article", article.title, article.description, [
      renderCard("Article", bodySections + faqSection),
      renderCard(
        "Continue Exploring",
        `<ul style="margin:0;padding-left:1.2rem;color:#e7e7e7;display:grid;gap:.55rem;">
           <li><a href="/about" style="color:#f4d57b;">About ${escapeHtml(personName)}</a></li>
           <li><a href="/websites" style="color:#f4d57b;">All Websites</a></li>
           <li><a href="/network" style="color:#f4d57b;">Full Network Directory</a></li>
         </ul>
         <h3 style="margin:18px 0 8px;color:#f4d57b;">Related Articles</h3>
         <ul style="margin:0;padding-left:1.2rem;color:#e7e7e7;display:grid;gap:.45rem;">${related}</ul>`,
      ),
    ]),
    schemas: [
      ...getCommonSchemas(data),
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.description,
        url,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        keywords: article.keywords.join(", "),
        author: { "@type": "Person", name: personName, url: `${BASE_URL}/about` },
        publisher: {
          "@type": "Organization",
          name: "Xini Rox Super Hub",
          url: BASE_URL,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Articles", item: `${BASE_URL}/articles` },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
      ...(article.faqs.length
        ? [
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: article.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };
}

function createIdentityPage(data: Awaited<ReturnType<typeof fetchSupabaseData>>): SeoPage {
  const personName = data.profile?.full_name || "Aanand Maurya";
  return {
    title: `${CANONICAL_NAME} — Official Verified Identity & Founder Profile`,
    description: `${CANONICAL_NAME} — verified founder of Xini Rox Super Hub. Instagram blue-tick verified, MSME Udyam registered (${UDYAM_ID}). Full biography, projects, social profiles and primary image in one canonical source.`,
    canonical: `${BASE_URL}/about-aanand-maurya`,
    body: renderShell(
      "Verified Identity",
      CANONICAL_NAME,
      `Official source-of-truth profile for ${CANONICAL_NAME}. Verified person, verified business, full project network — all linked from this canonical page.`,
      [
        renderCard(
          "Primary Image",
          `<img src="${PRIMARY_IMAGE}" alt="${escapeHtml(CANONICAL_NAME)} — official portrait" title="${escapeHtml(CANONICAL_NAME)}" loading="eager" style="max-width:240px;border-radius:16px;border:1px solid rgba(212,175,55,.3);" />
           <p style="margin:12px 0 0;color:#d7d7d7;">Caption: ${escapeHtml(CANONICAL_NAME)} — Founder, Xini Rox Super Hub.</p>`,
        ),
        renderCard(
          "Verified Identity",
          `<ul style="margin:0;padding-left:1.2rem;color:#e7e7e7;display:grid;gap:.55rem;">
             <li><strong>Full Name:</strong> Aanand Maurya (also: Aanand Kumar Maurya)</li>
             <li><strong>Public Brand:</strong> Xini Rox</li>
             <li><strong>Instagram (Verified – Blue Tick):</strong> <a href="${INSTAGRAM_VERIFIED}" style="color:#f4d57b;">@xini_rox</a></li>
             <li><strong>MSME Udyam Registration:</strong> ${UDYAM_ID} (Government of India)</li>
             <li><strong>Official Hub:</strong> <a href="${BASE_URL}" style="color:#f4d57b;">${BASE_URL}</a></li>
             <li><strong>Machine-readable data:</strong> <a href="${BASE_URL}/data.json" style="color:#f4d57b;">${BASE_URL}/data.json</a></li>
           </ul>`,
        ),
        renderCard(
          "Biography",
          `<p style="margin:0 0 10px;color:#e7e7e7;">${escapeHtml(personName)}, professionally known as <strong>Xini Rox</strong>, is a verified digital entrepreneur, content creator and system builder from Khajni, Gorakhpur, Uttar Pradesh, India. He is the founder of <strong>Xini Rox Super Hub</strong> — a centralized digital identity network connecting 10+ ventures and 16+ social profiles.</p>
           <p style="margin:0;color:#e7e7e7;">His identity is verified by Instagram (blue tick on @xini_rox) and his business is verified by the Government of India through MSME Udyam Registration ${UDYAM_ID}.</p>`,
        ),
        renderCard(
          "All Projects in the Network",
          renderLinkList(
            data.websites.map(
              (site) => `<li><strong>${escapeHtml(site.name)}</strong> — <a href="${escapeHtml(site.url)}" style="color:#f4d57b;">${escapeHtml(site.url)}</a> — <a href="/site/${slugify(site.name)}" style="color:#f4d57b;">Details</a></li>`,
            ),
          ),
        ),
        renderCard(
          "All Verified Social Profiles",
          renderLinkList(
            data.socials.map(
              (social) => `<li><strong>${escapeHtml(social.platform_name)}</strong> — <a href="${escapeHtml(social.profile_url)}" style="color:#f4d57b;">${escapeHtml(social.profile_url)}</a></li>`,
            ),
          ),
        ),
        renderCard(
          "Authority Articles about ${CANONICAL_NAME}",
          renderLinkList(
            ARTICLES.map(
              (a) => `<li><a href="/articles/${a.slug}" style="color:#f4d57b;"><strong>${escapeHtml(a.title)}</strong></a></li>`,
            ),
          ),
        ),
      ],
    ),
    schemas: [
      ...getCommonSchemas(data),
      {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        url: `${BASE_URL}/about-aanand-maurya`,
        name: `${CANONICAL_NAME} — Verified Identity`,
        primaryImageOfPage: { "@id": `${BASE_URL}/#primaryimage` },
        mainEntity: { "@id": `${BASE_URL}/#person` },
        about: { "@id": `${BASE_URL}/#person` },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "About Aanand Maurya (Xini Rox)", item: `${BASE_URL}/about-aanand-maurya` },
        ],
      },
    ],
  };
}

function createImageSitemap(data: Awaited<ReturnType<typeof fetchSupabaseData>>) {
  const images = [
    {
      page: `${BASE_URL}/about-aanand-maurya`,
      loc: PRIMARY_IMAGE,
      title: `${CANONICAL_NAME} — Official Portrait`,
      caption: `${CANONICAL_NAME}, founder of Xini Rox Super Hub. Verified person, MSME Udyam ${UDYAM_ID}.`,
    },
    {
      page: `${BASE_URL}/`,
      loc: PRIMARY_LOGO,
      title: "Xini Rox Super Hub — Logo",
      caption: "Official logo of Xini Rox Super Hub, founded by Aanand Maurya.",
    },
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images
  .map(
    (img) => `  <url>\n    <loc>${img.page}</loc>\n    <image:image>\n      <image:loc>${img.loc}</image:loc>\n      <image:title>${escapeHtml(img.title)}</image:title>\n      <image:caption>${escapeHtml(img.caption)}</image:caption>\n    </image:image>\n  </url>`,
  )
  .join("\n")}
</urlset>`;
}

function createSitemap(data: Awaited<ReturnType<typeof fetchSupabaseData>>) {
  const urls = [
    { loc: `${BASE_URL}/`, lastmod: TODAY, priority: "1.0" },
    { loc: `${BASE_URL}/about-aanand-maurya`, lastmod: TODAY, priority: "1.0" },
    { loc: `${BASE_URL}/websites`, lastmod: TODAY, priority: "0.9" },
    { loc: `${BASE_URL}/social`, lastmod: TODAY, priority: "0.9" },
    { loc: `${BASE_URL}/about`, lastmod: TODAY, priority: "0.9" },
    { loc: `${BASE_URL}/network`, lastmod: TODAY, priority: "0.9" },
    { loc: `${BASE_URL}/articles`, lastmod: TODAY, priority: "0.9" },
    ...ARTICLES.map((a) => ({
      loc: `${BASE_URL}/articles/${a.slug}`,
      lastmod: a.publishedAt,
      priority: "0.8",
    })),
    ...data.websites.map((site) => ({
      loc: `${BASE_URL}/site/${slugify(site.name)}`,
      lastmod: formatDate(site.updated_at),
      priority: "0.8",
    })),
    ...data.socials.map((social) => ({
      loc: `${BASE_URL}/profile/${slugify(`${social.platform_name}-${social.owner_name}`)}`,
      lastmod: formatDate(social.updated_at),
      priority: "0.7",
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>\n    <loc>${url.loc}</loc>\n    <lastmod>${url.lastmod}</lastmod>\n    <priority>${url.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>`;
}

function createDataJson(data: Awaited<ReturnType<typeof fetchSupabaseData>>) {
  return JSON.stringify(
    {
      "@context": "https://xinirox.lovable.app/data.json",
      generatedAt: new Date().toISOString(),
      person: {
        name: "Aanand Maurya",
        canonicalName: CANONICAL_NAME,
        alias: ["Xini Rox", "XiniRox", "Aanand Kumar Maurya"],
        image: PRIMARY_IMAGE,
        verified: true,
        verification: {
          instagram: { handle: "@xini_rox", url: INSTAGRAM_VERIFIED, blueTick: true },
          udyam: { id: UDYAM_ID, issuer: "Ministry of MSME, Government of India" },
        },
        sameAs: Array.from(new Set([INSTAGRAM_VERIFIED, ...data.socials.map((s) => s.profile_url)])),
        identityPage: `${BASE_URL}/about-aanand-maurya`,
        email: data.profile?.email || null,
        phone: data.profile?.contact_number || null,
        address: data.profile?.address || null,
      },
      brand: {
        name: "Xini Rox",
        type: "Digital Ecosystem",
        url: BASE_URL,
        logo: PRIMARY_LOGO,
        founder: "Aanand Maurya",
        registration: UDYAM_ID,
      },
      projects: data.websites.map((s) => ({
        name: s.name.trim(),
        owner: s.owner_name,
        url: s.url,
        detail: `${BASE_URL}/site/${slugify(s.name)}`,
      })),
      socials: data.socials.map((s) => ({
        platform: s.platform_name.trim(),
        owner: s.owner_name,
        url: s.profile_url,
        detail: `${BASE_URL}/profile/${slugify(`${s.platform_name}-${s.owner_name}`)}`,
      })),
      achievements: data.achievements.map((a) => ({ title: a.title, description: a.description || "" })),
      articles: ARTICLES.map((a) => ({
        title: a.title,
        url: `${BASE_URL}/articles/${a.slug}`,
        description: a.description,
      })),
      endpoints: {
        sitemap: `${BASE_URL}/sitemap.xml`,
        imageSitemap: `${BASE_URL}/image-sitemap.xml`,
        llms: `${BASE_URL}/llms.txt`,
        data: `${BASE_URL}/data.json`,
      },
    },
    null,
    2,
  );
}

function createLlmsTxt(data: Awaited<ReturnType<typeof fetchSupabaseData>>) {
  const name = data.profile?.full_name || "Xini Rox";
  const tagline = data.profile?.tagline || "Business Manager & Digital Entrepreneur";
  const lines: string[] = [
    `# ${name} (Xini Rox)`,
    "",
    `> ${tagline}. Central digital identity hub connecting all websites, businesses, and social profiles of Xini Rox (Aanand Maurya).`,
    "",
    "## About",
    `- Full Name: ${name}`,
    `- Also Known As: Xini Rox, XiniRox, Aanand Maurya`,
    `- Role: ${tagline}`,
    data.profile?.email ? `- Email: ${data.profile.email}` : "",
    data.profile?.contact_number ? `- Phone: ${data.profile.contact_number}` : "",
    data.profile?.address ? `- Address: ${data.profile.address}` : "",
    `- Official Hub: ${BASE_URL}`,
    `- Machine-readable data: ${BASE_URL}/data.json`,
    "",
    "## Websites & Businesses",
    ...data.websites.map((s) => `- [${s.name.trim()}](${s.url}) — Owner: ${s.owner_name}`),
    "",
    "## Social Profiles",
    ...data.socials.map((s) => `- [${s.platform_name.trim()} — ${s.owner_name}](${s.profile_url})`),
    "",
    "## Authority Articles",
    ...ARTICLES.map((a) => `- [${a.title}](${BASE_URL}/articles/${a.slug}) — ${a.description}`),
    "",
    "## Key Pages",
    `- Home: ${BASE_URL}/`,
    `- About: ${BASE_URL}/about`,
    `- Network Directory: ${BASE_URL}/network`,
    `- All Websites: ${BASE_URL}/websites`,
    `- Social Hub: ${BASE_URL}/social`,
    `- Articles: ${BASE_URL}/articles`,
    `- Sitemap: ${BASE_URL}/sitemap.xml`,
  ].filter(Boolean);
  return lines.join("\n");
}

function createRobotsTxt() {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    "# AI crawlers explicitly welcomed",
    "User-agent: GPTBot",
    "Allow: /",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "User-agent: OAI-SearchBot",
    "Allow: /",
    "User-agent: PerplexityBot",
    "Allow: /",
    "User-agent: Perplexity-User",
    "Allow: /",
    "User-agent: ClaudeBot",
    "Allow: /",
    "User-agent: Claude-Web",
    "Allow: /",
    "User-agent: anthropic-ai",
    "Allow: /",
    "User-agent: Google-Extended",
    "Allow: /",
    "User-agent: CCBot",
    "Allow: /",
    "User-agent: Bytespider",
    "Allow: /",
    "User-agent: Applebot-Extended",
    "Allow: /",
    "",
    `Sitemap: ${BASE_URL}/sitemap.xml`,
    `# Machine-readable site data: ${BASE_URL}/data.json`,
    `# LLM index: ${BASE_URL}/llms.txt`,
  ].join("\n");
}

function seoStaticPagesPlugin(): Plugin {
  return {
    name: "seo-static-pages",
    async transformIndexHtml(html) {
      try {
        const data = await fetchSupabaseData();
        return buildPage(html, createHomePage(data));
      } catch (error) {
        console.warn("SEO transform failed:", error);
        return html;
      }
    },
    async closeBundle() {
      try {
        const data = await fetchSupabaseData();
        const templatePath = path.resolve(__dirname, "dist/index.html");
        if (!fs.existsSync(templatePath)) return;

        const template = fs.readFileSync(templatePath, "utf8");
        const writePage = (relativePath: string, page: SeoPage) => {
          const filePath = path.resolve(__dirname, "dist", relativePath);
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
          fs.writeFileSync(filePath, buildPage(template, page));
        };

        writePage("index.html", createHomePage(data));
        writePage("websites/index.html", createHomePage(data));
        writePage("social/index.html", createHomePage(data));
        writePage("about/index.html", createAboutPage(data));
        writePage("network/index.html", createNetworkPage(data));
        writePage("articles/index.html", createArticlesIndexPage(data));
        writePage("about-aanand-maurya/index.html", createIdentityPage(data));

        for (const article of ARTICLES) {
          writePage(`articles/${article.slug}/index.html`, createArticlePage(article, data));
        }

        for (const site of data.websites) {
          writePage(`site/${slugify(site.name)}/index.html`, createWebsitePage(site, data));
        }

        for (const social of data.socials) {
          writePage(
            `profile/${slugify(`${social.platform_name}-${social.owner_name}`)}/index.html`,
            createSocialPage(social, data),
          );
        }

        fs.writeFileSync(path.resolve(__dirname, "dist/sitemap.xml"), createSitemap(data));
        fs.writeFileSync(path.resolve(__dirname, "dist/image-sitemap.xml"), createImageSitemap(data));
        fs.writeFileSync(path.resolve(__dirname, "dist/data.json"), createDataJson(data));
        fs.writeFileSync(path.resolve(__dirname, "dist/llms.txt"), createLlmsTxt(data));
        fs.writeFileSync(path.resolve(__dirname, "dist/robots.txt"), createRobotsTxt());
        console.log(`✅ SEO static pages + identity + image-sitemap + data.json + llms.txt generated`);
      } catch (error) {
        console.warn("SEO static generation failed:", error);
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
    seoStaticPagesPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
