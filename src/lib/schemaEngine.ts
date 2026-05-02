/**
 * Auto Schema Engine — Single source of truth for JSON-LD generation.
 *
 * Converts live data (websites, socials, profile, services) into a complete
 * Schema.org @graph and injects it into <head>. No manual JSON-LD editing.
 */

export interface SchemaWebsite {
  name: string;
  url: string;
  description?: string | null;
  category?: string | null;
}

export interface SchemaSocial {
  platform_name: string;
  profile_url: string;
}

export interface SchemaProfile {
  full_name: string;
  tagline?: string | null;
  email?: string | null;
  address?: string | null;
  profile_image_url?: string | null;
}

export interface SchemaService {
  name: string;
  description?: string;
}

export interface SchemaInput {
  siteUrl: string;          // e.g. https://xinirox.lovable.app
  brand: string;            // e.g. Xini Rox Super Hub
  profile: SchemaProfile | null;
  websites: SchemaWebsite[];
  socials: SchemaSocial[];
  services?: SchemaService[];
}

const DEFAULT_SERVICES: SchemaService[] = [
  { name: "Digital Strategy Consulting", description: "End-to-end digital presence and growth roadmaps." },
  { name: "Web Development & System Architecture", description: "Custom websites, micro-site networks, scalable hubs." },
  { name: "Content Creation & Management", description: "YouTube, Reels, SEO blogs, community frameworks." },
  { name: "EdTech Platform Development", description: "LMS, course builders, certification automation." },
  { name: "Local Business Digitalization", description: "Booking systems and digital tools for local businesses." },
];

/** Validate + clean inputs (no duplicate URLs, no empty entries). */
function clean<T extends { url?: string; profile_url?: string; name?: string; platform_name?: string }>(
  items: T[],
  urlKey: "url" | "profile_url",
  nameKey: "name" | "platform_name"
): T[] {
  const seen = new Set<string>();
  return items.filter((it) => {
    const url = (it as any)[urlKey]?.trim();
    const name = (it as any)[nameKey]?.trim();
    if (!url || !name) return false;
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}

export function buildSchemaGraph(input: SchemaInput): object {
  const { siteUrl, brand, profile, services = DEFAULT_SERVICES } = input;
  const websites = clean(input.websites, "url", "name");
  const socials = clean(input.socials, "profile_url", "platform_name");

  const personId = `${siteUrl}/#person`;
  const orgId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;

  const personName = profile?.full_name || "Xini Rox";
  const sameAs = socials.map((s) => s.profile_url);

  const ownedWebsites = websites.map((w) => ({
    "@type": "WebSite",
    name: w.name,
    url: w.url,
    ...(w.description ? { description: w.description } : {}),
    publisher: { "@id": personId },
  }));

  const orgParts = websites.map((w) => ({
    "@type": "Organization",
    name: w.name,
    url: w.url,
    ...(w.description ? { description: w.description } : {}),
  }));

  const offers = services.map((s) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: s.name,
      ...(s.description ? { description: s.description } : {}),
    },
    provider: { "@id": personId },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: personName,
        alternateName: ["Xini Rox", "XiniRox", "Aanand Maurya", "Aanand Kumar Maurya"],
        url: siteUrl,
        ...(profile?.profile_image_url ? { image: profile.profile_image_url } : {}),
        ...(profile?.email ? { email: `mailto:${profile.email}` } : {}),
        jobTitle: profile?.tagline || "Digital Entrepreneur & System Builder",
        worksFor: { "@id": orgId },
        owns: ownedWebsites,
        sameAs,
        makesOffer: offers,
        description: `${personName} — founder of ${brand}, a centralized digital identity network connecting ${websites.length}+ ventures and ${socials.length}+ social profiles.`,
      },
      {
        "@type": "Organization",
        "@id": orgId,
        name: brand,
        url: siteUrl,
        founder: { "@id": personId },
        sameAs,
        hasPart: orgParts,
        ...(profile?.address
          ? {
              location: {
                "@type": "Place",
                address: { "@type": "PostalAddress", addressLocality: profile.address },
              },
            }
          : {}),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: brand,
        url: siteUrl,
        publisher: { "@id": personId },
        isPartOf: { "@id": orgId },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/network?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "ProfilePage",
        url: `${siteUrl}/about`,
        name: `About ${personName} | Official Profile`,
        mainEntity: { "@id": personId },
      },
      {
        "@type": "CollectionPage",
        name: `${brand} — Projects Collection`,
        url: `${siteUrl}/websites`,
        hasPart: {
          "@type": "ItemList",
          itemListElement: websites.map((w, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: w.name,
            url: w.url,
          })),
        },
      },
    ],
  };
}

const INJECTED_ID = "auto-schema-engine";

/** Inject (or replace) the schema script in <head>. Idempotent. */
export function injectSchema(graph: object): void {
  if (typeof document === "undefined") return;
  let el = document.getElementById(INJECTED_ID) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = INJECTED_ID;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(graph);
}

/** Optional: localStorage cache for instant render on next load. */
const CACHE_KEY = "xinirox_schema_cache_v1";

export function cacheSchemaInput(input: SchemaInput): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(input));
  } catch {
    /* ignore quota errors */
  }
}

export function loadCachedSchemaInput(): SchemaInput | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as SchemaInput) : null;
  } catch {
    return null;
  }
}
