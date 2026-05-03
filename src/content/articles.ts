/**
 * Authority Content — Long-form articles establishing the Xini Rox entity.
 * Single source of truth used by both the React app AND the SSG prerender
 * inside vite.config.ts. Keep paragraphs short and keyword-rich.
 */

export interface ArticleFAQ {
  q: string;
  a: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string; // ISO date
  /** Sections rendered as <h2> + paragraphs. */
  sections: { heading: string; paragraphs: string[] }[];
  faqs: ArticleFAQ[];
}

const TODAY = "2026-05-03";

export const ARTICLES: Article[] = [
  {
    slug: "who-is-xini-rox",
    title: "Who is Xini Rox? The Story of Aanand Maurya, Digital Entrepreneur from Gorakhpur",
    description:
      "Xini Rox is the digital identity of Aanand Maurya — a digital entrepreneur and founder of Xini Rox Super Hub. Learn about his ventures, mission, and network.",
    keywords: [
      "Xini Rox",
      "Aanand Maurya",
      "who is Xini Rox",
      "Xini Rox biography",
      "digital entrepreneur Gorakhpur",
      "Xini Rox Super Hub",
    ],
    publishedAt: TODAY,
    sections: [
      {
        heading: "The Person Behind the Brand",
        paragraphs: [
          "Xini Rox is the digital identity and creator handle of Aanand Maurya (also written as Aanand Kumar Maurya), a young digital entrepreneur from Khajni, Gorakhpur, Uttar Pradesh, India. The name Xini Rox represents not just a person but an entire digital ecosystem — a connected hub of websites, businesses, communities, and creative projects built and managed under one consistent identity.",
          "From a small town in eastern Uttar Pradesh, Aanand built a presence that quietly spans multiple industries: education technology, local business digitalization, content creation, fitness, retail, and developer tooling. Each venture lives at its own domain but is unified through one parent network — Xini Rox Super Hub.",
        ],
      },
      {
        heading: "What Xini Rox Stands For",
        paragraphs: [
          "Xini Rox is built around three principles: identity, authority, and authenticity. The goal is to make sure every project, every piece of content, and every social profile points back to one verified source — so that humans and search engines never get confused about who is behind the work.",
          "This is why Xini Rox Super Hub exists. It is the official directory and identity layer connecting every website, every social account, and every business under the Xini Rox name. If you have ever searched for Xini Rox on Google, this hub is the intended primary destination.",
        ],
      },
      {
        heading: "Ventures and Projects in the Xini Rox Network",
        paragraphs: [
          "The Xini Rox network includes ventures such as Aaradhya Multi Shop, Ram Classes, Infinity Gym, Laxmi Beauty Parlour, U.P.S.D.D.I College AI tools, and several other Lovable-built micro-sites. Each site is independently useful, and together they form a recognizable entity graph that Google can crawl, understand, and credit to the same founder.",
          "The Super Hub also tracks the social presence of Xini Rox across YouTube, Instagram, GitHub, LinkedIn, Quora, Medium, and other platforms — so anyone (or any bot) verifying the identity can confirm consistency across the open web.",
        ],
      },
    ],
    faqs: [
      {
        q: "Who is Xini Rox?",
        a: "Xini Rox is the digital identity of Aanand Maurya, a digital entrepreneur from Gorakhpur, India, and the founder of Xini Rox Super Hub.",
      },
      {
        q: "Is Xini Rox a real person?",
        a: "Yes. Xini Rox is the public creator and brand name used by Aanand Kumar Maurya across his websites, businesses, and social media accounts.",
      },
      {
        q: "Where is Xini Rox from?",
        a: "Xini Rox (Aanand Maurya) is from Khajni, Gorakhpur, Uttar Pradesh, India.",
      },
    ],
  },
  {
    slug: "xini-rox-biography",
    title: "Xini Rox Biography — Background, Education and Journey of Aanand Maurya",
    description:
      "Detailed biography of Xini Rox (Aanand Maurya): early life in Gorakhpur, education, entry into digital entrepreneurship, and the building of Xini Rox Super Hub.",
    keywords: [
      "Xini Rox biography",
      "Aanand Maurya bio",
      "Xini Rox age",
      "Xini Rox career",
      "Aanand Kumar Maurya",
    ],
    publishedAt: TODAY,
    sections: [
      {
        heading: "Early Life and Background",
        paragraphs: [
          "Aanand Maurya, known online as Xini Rox, grew up in Khajni, a town in the Gorakhpur district of Uttar Pradesh. His early years were shaped by a typical small-town Indian environment — strong family values, a focus on education, and the everyday realities of running and supporting local businesses. These influences would later become the foundation for his work in digitalizing local commerce and education.",
        ],
      },
      {
        heading: "Education",
        paragraphs: [
          "Aanand pursued his higher education in the Gorakhpur region, including coursework relevant to computer applications and modern web technology. Most of his practical knowledge, however, comes from self-teaching: building real products with real users, learning from each launch, and improving iteratively.",
        ],
      },
      {
        heading: "Entry into Digital Entrepreneurship",
        paragraphs: [
          "His first real digital projects were tools and websites built for people he already knew — small shops, a gym, a parlour, a coaching institute. The pattern was simple: see a real-world problem, ship a small site that solves it, then connect it back to a central identity. That central identity eventually became Xini Rox Super Hub.",
          "Today the Xini Rox network spans education technology, retail, fitness, beauty services, and developer-focused experiments. Every project is documented, linked, and verified through the central hub.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the real name of Xini Rox?",
        a: "The real name of Xini Rox is Aanand Maurya (full name: Aanand Kumar Maurya).",
      },
      {
        q: "What does Xini Rox do?",
        a: "Xini Rox builds and manages a network of digital businesses, micro-websites, AI tools, and content channels under the Xini Rox Super Hub brand.",
      },
    ],
  },
  {
    slug: "xini-rox-business-network",
    title: "The Xini Rox Business Network — Every Venture Under Xini Rox Super Hub",
    description:
      "A complete guide to the Xini Rox business network: education, retail, fitness, beauty, AI tools, and the Super Hub that connects them all.",
    keywords: [
      "Xini Rox business network",
      "Xini Rox Super Hub",
      "Xini Rox projects",
      "Xini Rox websites",
      "Aanand Maurya businesses",
    ],
    publishedAt: TODAY,
    sections: [
      {
        heading: "What is the Xini Rox Network?",
        paragraphs: [
          "The Xini Rox network is the collection of websites, businesses, and digital products owned, built, or managed by Xini Rox (Aanand Maurya). Each one is its own entity, but all of them are linked through a single authoritative directory — Xini Rox Super Hub — so search engines can clearly see one founder behind many ventures.",
        ],
      },
      {
        heading: "Categories of Ventures",
        paragraphs: [
          "Education: tools and micro-sites for institutions like U.P.S.D.D.I College and Ram Classes, focused on AI-assisted learning and digital coursework.",
          "Local Business: websites like Aaradhya Multi Shop and Laxmi Beauty Parlour that bring offline neighbourhood businesses online with booking, contact, and discovery features.",
          "Fitness and Lifestyle: Infinity Gym and related health-focused properties.",
          "Developer and Identity Tools: the Super Hub itself, the auto-schema engine, indexing console, and other internal systems built to keep the entire network discoverable.",
        ],
      },
      {
        heading: "Why Group Them in One Hub?",
        paragraphs: [
          "Search engines, especially Google, build their understanding of a person or brand from signals across the web. When the same founder is referenced consistently — same name, same image, same links, same schema — the entity becomes strong enough to qualify for things like Knowledge Panels and direct brand search results. Xini Rox Super Hub exists to make those signals as clean and consistent as possible.",
        ],
      },
    ],
    faqs: [
      {
        q: "How many businesses are part of the Xini Rox network?",
        a: "The network currently includes 10+ active websites and businesses across education, retail, fitness, and AI tooling, all linked through Xini Rox Super Hub.",
      },
      {
        q: "What is Xini Rox Super Hub?",
        a: "Xini Rox Super Hub is the central digital identity hub that connects every website, social profile, and business owned or managed by Xini Rox (Aanand Maurya).",
      },
    ],
  },
  {
    slug: "digital-entrepreneur-from-gorakhpur",
    title: "A Digital Entrepreneur from Gorakhpur — How Xini Rox Built a Network from a Small Town",
    description:
      "How Xini Rox (Aanand Maurya) built a digital network of websites, businesses, and AI tools from Gorakhpur, Uttar Pradesh — and what it means for small-town India.",
    keywords: [
      "digital entrepreneur Gorakhpur",
      "Xini Rox Gorakhpur",
      "small town entrepreneur India",
      "Aanand Maurya Gorakhpur",
    ],
    publishedAt: TODAY,
    sections: [
      {
        heading: "Building from a Small Town",
        paragraphs: [
          "Most of the digital-entrepreneur stories online come out of Bangalore, Delhi, or Mumbai. Xini Rox is deliberately a counter-example. Aanand Maurya operates from Khajni in Gorakhpur district, building products that are useful both locally and globally, without ever needing to relocate.",
        ],
      },
      {
        heading: "The Method: Many Small Sites, One Identity",
        paragraphs: [
          "Instead of betting everything on one big platform, Xini Rox launches focused micro-sites for individual problems — a shop catalogue, a gym schedule, a coaching site, an AI helper for a college — and then links each of them back into a single Super Hub. The hub aggregates the network so each new launch strengthens the parent entity instead of fragmenting it.",
          "This structure also means every new project carries SEO weight from day one: it is linked from a known hub, listed in the central sitemap, and described in structured data alongside its founder.",
        ],
      },
      {
        heading: "Why It Matters",
        paragraphs: [
          "Small-town digital entrepreneurship is mostly invisible online because the work is scattered. Xini Rox Super Hub is an attempt to fix that for one person — and to serve as a working template for anyone else who wants their full body of work to be visible, verified, and credited correctly by search engines.",
        ],
      },
    ],
    faqs: [
      {
        q: "Where does Xini Rox operate from?",
        a: "Xini Rox operates primarily from Khajni, Gorakhpur, Uttar Pradesh, India.",
      },
      {
        q: "Can I work with or contact Xini Rox?",
        a: "Yes — contact details and verified social profiles are listed on Xini Rox Super Hub at https://xinirox.lovable.app.",
      },
    ],
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
