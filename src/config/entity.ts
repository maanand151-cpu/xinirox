/**
 * Centralized entity configuration — single source of truth for the
 * Xini Rox brand identity across the entire codebase.
 *
 * Use these constants in every schema, meta tag, canonical URL,
 * sitemap entry, API response, and OpenGraph tag.
 */

export const ENTITY = {
  brand: "Xini Rox",
  alternateNames: ["Aanand Maurya", "XiniRox", "Xini Rox Super Hub"],
  organization: "Xini Rox Super Hub",
  founder: "Aanand Maurya",
  tagline: "Digital business ecosystem and internet identity brand",
  summary:
    "Xini Rox is a digital business ecosystem and internet identity brand founded by Aanand Maurya — connecting multiple ventures, services, and digital projects under one verified hub.",
  shortSummary:
    "Xini Rox — digital business ecosystem founded by Aanand Maurya.",

  // Canonical (primary) domain. All SEO/schema must reference this.
  primaryDomain: "https://xinirox.co.in",

  // Other owned / reserved domains — declared as sameAs / alternates so
  // search engines consolidate signal under the canonical primaryDomain.
  alternateDomains: [
    "https://www.xinirox.co.in",
    "https://xinirox.in",
    "https://xinirox.com",
  ],

  // Temporary hosting (lovable.app). Treat as infrastructure only.
  hostingDomain: "https://xinirox.lovable.app",

  email: "contact@xinirox.co.in",
  location: {
    city: "Gorakhpur",
    region: "Uttar Pradesh",
    country: "IN",
  },

  social: {
    instagram: "https://www.instagram.com/xini_rox",
    youtube: "",
    twitter: "",
    linkedin: "",
    github: "",
  },

  verification: {
    udyamId: "UDYAM-UP-XX-XXXXXXX",
    instagramVerified: true,
  },
} as const;

/** Build an absolute URL on the primary canonical domain. */
export const canonical = (path: string = "/") =>
  `${ENTITY.primaryDomain}${path.startsWith("/") ? path : `/${path}`}`;

/** Every owned domain — useful for emitting `sameAs` arrays. */
export const allOwnedDomains = [
  ENTITY.primaryDomain,
  ...ENTITY.alternateDomains,
];

/** Reusable identity memory block — paste into pages, schema, APIs. */
export const ENTITY_MEMORY_BLOCK = ENTITY.summary;
