import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  buildSchemaGraph,
  injectSchema,
  cacheSchemaInput,
  loadCachedSchemaInput,
  type SchemaInput,
} from "@/lib/schemaEngine";

const SITE_URL =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? `${window.location.protocol}//${window.location.hostname}`
    : "https://xinirox.lovable.app";
const BRAND = "Xini Rox Super Hub";

/**
 * Mount once at the app root. Fetches live data, regenerates the JSON-LD graph
 * on every change, and injects it into <head>. Uses a localStorage cache so
 * the schema is present instantly on first paint.
 */
const AutoSchema = () => {
  // Hydrate from cache immediately on mount.
  useEffect(() => {
    const cached = loadCachedSchemaInput();
    if (cached) injectSchema(buildSchemaGraph(cached));
  }, []);

  const { data: websites = [] } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const { data, error } = await supabase.from("websites").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const { data: socials = [] } = useQuery({
    queryKey: ["social_media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("social_media").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const { data: profile = null } = useQuery({
    queryKey: ["about_profile_single"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_profile").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const input: SchemaInput = {
      siteUrl: SITE_URL,
      brand: BRAND,
      profile: profile
        ? {
            full_name: profile.full_name,
            tagline: profile.tagline,
            email: profile.email,
            address: profile.address,
            profile_image_url: profile.profile_image_url,
          }
        : null,
      websites: websites.map((w) => ({
        name: w.name,
        url: w.url,
        category: w.category,
      })),
      socials: socials.map((s) => ({
        platform_name: s.platform_name,
        profile_url: s.profile_url,
      })),
    };
    injectSchema(buildSchemaGraph(input));
    cacheSchemaInput(input);
  }, [websites, socials, profile]);

  return null;
};

export default AutoSchema;
