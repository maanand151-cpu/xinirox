/**
 * Canonical catalog of supported social / entity networks.
 *
 * Used by the admin SocialMediaForm (suggestions), the entity API,
 * and AutoSchema sameAs propagation. Adding a new network here
 * makes it instantly discoverable across the system.
 */

export interface NetworkPreset {
  id: string;
  label: string;
  category: "social" | "professional" | "code" | "business" | "media" | "community" | "custom";
  urlHint: string;
}

export const NETWORK_CATALOG: NetworkPreset[] = [
  { id: "instagram",   label: "Instagram",    category: "social",       urlHint: "https://www.instagram.com/<handle>" },
  { id: "youtube",     label: "YouTube",      category: "media",        urlHint: "https://www.youtube.com/@<handle>" },
  { id: "linkedin",    label: "LinkedIn",     category: "professional", urlHint: "https://www.linkedin.com/in/<handle>" },
  { id: "github",      label: "GitHub",       category: "code",         urlHint: "https://github.com/<handle>" },
  { id: "twitter",     label: "Twitter / X",  category: "social",       urlHint: "https://x.com/<handle>" },
  { id: "facebook",    label: "Facebook",     category: "social",       urlHint: "https://www.facebook.com/<handle>" },
  { id: "threads",     label: "Threads",      category: "social",       urlHint: "https://www.threads.net/@<handle>" },
  { id: "reddit",      label: "Reddit",       category: "community",    urlHint: "https://www.reddit.com/user/<handle>" },
  { id: "medium",      label: "Medium",       category: "media",        urlHint: "https://medium.com/@<handle>" },
  { id: "producthunt", label: "Product Hunt", category: "business",     urlHint: "https://www.producthunt.com/@<handle>" },
  { id: "crunchbase",  label: "Crunchbase",   category: "business",     urlHint: "https://www.crunchbase.com/organization/<handle>" },
  { id: "wikidata",    label: "Wikidata",     category: "business",     urlHint: "https://www.wikidata.org/wiki/Q<id>" },
];

export const NETWORK_LABELS = NETWORK_CATALOG.map((n) => n.label);
