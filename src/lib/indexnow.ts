import { supabase } from "@/integrations/supabase/client";

/**
 * Fire-and-forget IndexNow submission. Pings Bing/Yandex via our
 * edge function whenever entity content changes. Failures are
 * swallowed — IndexNow is best-effort.
 */
export function pingIndexNow(paths: string[]) {
  if (!paths.length) return;
  try {
    supabase.functions.invoke("indexnow", { body: { paths } }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export const ENTITY_PATHS = [
  "/",
  "/about",
  "/identity",
  "/founder",
  "/founder-story",
  "/ecosystem",
  "/entity",
  "/brand",
  "/knowledge",
  "/projects",
  "/services",
  "/network",
  "/websites",
  "/social",
  "/articles",
];
