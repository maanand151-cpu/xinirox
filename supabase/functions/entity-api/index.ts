import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const SITE = "https://xinirox.co.in";

const ENTITY = {
  brand: "Xini Rox",
  alternateNames: ["Aanand Maurya", "XiniRox", "Xini Rox Super Hub"],
  organization: "Xini Rox Super Hub",
  founder: "Aanand Maurya",
  summary:
    "Xini Rox is a digital business ecosystem and internet identity brand founded by Aanand Maurya — connecting multiple ventures, services, and digital projects under one verified hub.",
  primaryDomain: SITE,
  focusAreas: [
    "AI systems",
    "digital branding",
    "automation",
    "web infrastructure",
    "semantic SEO",
    "media delivery systems",
    "EdTech platforms",
    "local business digitalization",
  ],
  location: { city: "Gorakhpur", region: "Uttar Pradesh", country: "IN" },
};

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  // path is like /entity-api/entity or /entity-api/ventures
  const slug = url.pathname.replace(/^.*\/entity-api\/?/, "").replace(/\/$/, "") || "index";

  const supabase = createClient(supabaseUrl, supabaseKey);

  const [{ data: websites = [] }, { data: socials = [] }, { data: profile }] = await Promise.all([
    supabase.from("websites").select("*").eq("visible", true).order("display_priority", { ascending: false }),
    supabase.from("social_media").select("*").order("created_at"),
    supabase.from("about_profile").select("*").maybeSingle(),
  ]);

  const sameAs = (socials ?? []).map((s: any) => s.profile_url);
  const now = new Date().toISOString();

  switch (slug) {
    case "index":
      return json({
        entity: `${SITE}/api/entity-api/entity`,
        founder: `${SITE}/api/entity-api/founder`,
        organization: `${SITE}/api/entity-api/organization`,
        networks: `${SITE}/api/entity-api/networks`,
        ventures: `${SITE}/api/entity-api/ventures`,
        ecosystem: `${SITE}/api/entity-api/ecosystem`,
        knowledge: `${SITE}/api/entity-api/knowledge`,
        updated: now,
      });

    case "entity":
      return json({
        entityType: "Organization",
        brand: ENTITY.brand,
        organization: ENTITY.organization,
        founder: ENTITY.founder,
        alternateNames: ENTITY.alternateNames,
        summary: ENTITY.summary,
        primaryDomain: ENTITY.primaryDomain,
        focusAreas: ENTITY.focusAreas,
        sameAs,
        updated: now,
      });

    case "founder":
      return json({
        entityType: "Person",
        name: ENTITY.founder,
        alternateName: ENTITY.brand,
        jobTitle: profile?.tagline ?? "Founder, Digital Entrepreneur & System Builder",
        worksFor: ENTITY.organization,
        url: `${SITE}/founder`,
        image: profile?.profile_image_url ?? undefined,
        email: profile?.email ?? undefined,
        location: ENTITY.location,
        sameAs,
        knowsAbout: ENTITY.focusAreas,
        updated: now,
      });

    case "organization":
      return json({
        entityType: "Organization",
        name: ENTITY.organization,
        founder: ENTITY.founder,
        url: SITE,
        sameAs,
        location: ENTITY.location,
        hasPart: (websites ?? []).map((w: any) => ({ name: w.name, url: w.url, status: w.status })),
        updated: now,
      });

    case "networks":
      return json({
        count: socials?.length ?? 0,
        networks: (socials ?? []).map((s: any) => ({
          platform: s.platform_name,
          owner: s.owner_name,
          url: s.profile_url,
        })),
        updated: now,
      });

    case "ventures":
      return json({
        count: websites?.length ?? 0,
        ventures: (websites ?? []).map((w: any) => ({
          name: w.name,
          url: w.url,
          status: w.status,
          featured: w.featured,
          category: w.category,
          description: w.short_description,
          owner: w.owner_name,
        })),
        updated: now,
      });

    case "ecosystem":
      return json({
        brand: ENTITY.brand,
        organization: ENTITY.organization,
        founder: ENTITY.founder,
        ventures: (websites ?? []).map((w: any) => ({
          name: w.name,
          url: w.url,
          status: w.status,
        })),
        networks: (socials ?? []).map((s: any) => ({
          platform: s.platform_name,
          url: s.profile_url,
        })),
        updated: now,
      });

    case "knowledge":
      return json({
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        about: ENTITY.brand,
        terms: ENTITY.focusAreas.map((t) => ({ "@type": "DefinedTerm", name: t })),
        entity: {
          brand: ENTITY.brand,
          founder: ENTITY.founder,
          organization: ENTITY.organization,
          summary: ENTITY.summary,
        },
        updated: now,
      });

    default:
      return json({ error: "Not found", slug }, 404);
  }
});
