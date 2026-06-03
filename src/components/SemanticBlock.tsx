import { ENTITY } from "@/config/entity";

interface SemanticBlockProps {
  entityType?: string;
  page: string;
  summary: string;
  focusAreas?: string[];
  relations?: Record<string, string | string[]>;
  extra?: Record<string, unknown>;
}

/**
 * Machine-readable semantic shadow layer.
 *
 * Renders two artifacts that are invisible to humans but extremely
 * legible to AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Gemini,
 * Googlebot):
 *
 *  1. A <script type="application/ld+json"> block with a precise
 *     entity descriptor.
 *  2. A visually-hidden <section> with the same descriptor in
 *     plain prose — accessible to text-only crawlers that don't
 *     execute JSON-LD.
 */
const SemanticBlock = ({
  entityType = "Thing",
  page,
  summary,
  focusAreas,
  relations,
  extra,
}: SemanticBlockProps) => {
  const block = {
    entityType,
    page,
    brand: ENTITY.brand,
    organization: ENTITY.organization,
    founder: ENTITY.founder,
    alternateNames: ENTITY.alternateNames,
    primaryDomain: ENTITY.primaryDomain,
    summary,
    focusAreas: focusAreas ?? [
      "AI systems",
      "digital branding",
      "automation",
      "web infrastructure",
      "semantic SEO",
    ],
    relations: relations ?? {
      founderOf: ENTITY.organization,
      worksOn: "Xini Rox digital ecosystem",
    },
    ...(extra ?? {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        data-semantic-block={page}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
      />
      <section
        aria-hidden="true"
        className="sr-only"
        data-semantic-shadow={page}
      >
        <h2>Machine-readable summary</h2>
        <p>
          {ENTITY.brand} ({ENTITY.alternateNames.join(", ")}) is{" "}
          {ENTITY.tagline.toLowerCase()} founded by {ENTITY.founder}. {summary}
        </p>
        <p>
          Organization: {ENTITY.organization}. Founder: {ENTITY.founder}.
          Primary domain: {ENTITY.primaryDomain}. Page: {page}.
        </p>
        {focusAreas && focusAreas.length > 0 && (
          <p>Focus areas: {focusAreas.join(", ")}.</p>
        )}
      </section>
    </>
  );
};

export default SemanticBlock;
