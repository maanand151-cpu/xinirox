/**
 * Ready-to-publish metadata pack for external platforms.
 * Copy/paste these into LinkedIn, GitHub org, Crunchbase, Product Hunt,
 * Google Business Profile, YouTube About, and Twitter/X bio.
 *
 * Consistency across platforms = stronger entity signal for AI/search.
 */

import { ENTITY, ENTITY_MEMORY_BLOCK } from "./entity";

const SITE = ENTITY.primaryDomain;
const SHORT = `${ENTITY.brand} — digital ecosystem by ${ENTITY.founder}. ${SITE}`;

export const BRAND_METADATA_PACK = {
  shortBio: SHORT,
  mediumBio: ENTITY_MEMORY_BLOCK,
  longBio: `${ENTITY.brand} (also known as ${ENTITY.founder}) is the founder and operator of ${ENTITY.organization}, a verified digital business ecosystem headquartered in ${ENTITY.location.city}, ${ENTITY.location.region}, ${ENTITY.location.country}. ${ENTITY.organization} connects multiple ventures — education, e-commerce, fitness, beauty, and creative projects — under a single MSME-registered identity. Official site: ${SITE}.`,

  platforms: {
    linkedin: {
      tagline: `Founder, ${ENTITY.organization}`,
      about: `${ENTITY_MEMORY_BLOCK}\n\nFounder of ${ENTITY.organization} — building verified digital ventures across education, commerce, fitness, and creative industries.\n\nOfficial site: ${SITE}`,
      website: SITE,
    },
    github: {
      orgName: "xini-rox",
      description: SHORT,
      website: SITE,
    },
    crunchbase: {
      legalName: ENTITY.organization,
      shortDescription: SHORT,
      fullDescription: ENTITY_MEMORY_BLOCK,
      headquarters: `${ENTITY.location.city}, ${ENTITY.location.region}, ${ENTITY.location.country}`,
      website: SITE,
      founders: [ENTITY.founder],
    },
    productHunt: {
      tagline: "A verified digital business ecosystem by Aanand Maurya",
      description: ENTITY_MEMORY_BLOCK,
      website: SITE,
    },
    googleBusiness: {
      name: ENTITY.organization,
      category: "Business management consultant",
      description: ENTITY_MEMORY_BLOCK,
      website: SITE,
      address: `${ENTITY.location.city}, ${ENTITY.location.region}, ${ENTITY.location.country}`,
    },
    youtube: {
      channelName: ENTITY.brand,
      about: `${ENTITY_MEMORY_BLOCK}\n\n► ${SITE}`,
      links: [SITE, ENTITY.social.instagram],
    },
    twitter: {
      name: ENTITY.brand,
      handle: "@xini_rox",
      bio: `${SHORT} | Founder, ${ENTITY.organization}`,
      website: SITE,
    },
  },
} as const;
