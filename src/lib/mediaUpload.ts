/**
 * Branded media upload — generates SEO-friendly URLs like
 *   https://xinirox.co.in/media/<slug>.jpg
 * instead of raw storage URLs.
 */

export const MEDIA_DOMAIN = "https://xinirox.co.in";

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface MediaUploadResult {
  slug: string;
  /** Branded SEO URL (xinirox.co.in/media/...) — use this in UI/schema */
  seoUrl: string;
  /** Raw supabase public URL — fallback only */
  previewUrl: string;
  storagePath: string;
}

export async function mediaUpload(
  file: File,
  customName: string,
  opts: { title?: string; alt?: string; isPrimary?: boolean } = {}
): Promise<MediaUploadResult> {
  const password = sessionStorage.getItem("admin_password");
  if (!password) throw new Error("Not authenticated as admin");

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const fd = new FormData();
  fd.append("password", password);
  fd.append("file", file);
  fd.append("customName", customName);
  if (opts.title) fd.append("title", opts.title);
  if (opts.alt) fd.append("alt", opts.alt);
  if (opts.isPrimary) fd.append("isPrimary", "true");

  const res = await fetch(`${supabaseUrl}/functions/v1/media-upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
    body: fd,
  });

  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || "Upload failed");
  return data as MediaUploadResult;
}

/** Build the canonical branded URL for a media slug. */
export function getMediaUrl(slug: string, ext: string = "jpg"): string {
  return `${MEDIA_DOMAIN}/media/${slug}.${ext}`;
}
