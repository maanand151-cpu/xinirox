import { useEffect } from "react";
import type { Tables } from "@/integrations/supabase/types";

type Website = Tables<"websites">;
type SocialMedia = Tables<"social_media">;

interface JsonLdSchemaProps {
  websites: Website[];
  socials: SocialMedia[];
}

const JsonLdSchema = ({ websites, socials }: JsonLdSchemaProps) => {
  useEffect(() => {
    // Remove old dynamic schemas
    document.querySelectorAll('script[data-seo-dynamic]').forEach(el => el.remove());

    const socialUrls = socials.map(s => s.profile_url);

    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Xini Rox",
      "alternateName": "Aanand Maurya",
      "mainEntityOfPage": "https://xinirox.lovable.app",
      "jobTitle": "Business Manager & Entrepreneur",
      "sameAs": socialUrls,
      "knowsAbout": ["Business", "Digital Marketing", "Entrepreneurship", "Technology"],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Business Manager"
      }
    };

    const orgSchemas = websites.map(site => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": site.name,
      "url": site.url,
      "employee": {
        "@type": "Person",
        "name": "Xini Rox"
      }
    }));

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Xini Rox Super Hub",
      "url": "https://xinirox.lovable.app",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://xinirox.lovable.app/network?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    const allSchemas = [personSchema, websiteSchema, ...orgSchemas];

    allSchemas.forEach(schema => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-dynamic", "true");
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll('script[data-seo-dynamic]').forEach(el => el.remove());
    };
  }, [websites, socials]);

  return null;
};

export default JsonLdSchema;
