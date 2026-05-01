/**
 * Upload a file via the admin-upload edge function.
 */
export async function adminUpload(file: File, path: string): Promise<string> {
  const password = sessionStorage.getItem("admin_password");
  if (!password) {
    throw new Error("Not authenticated as admin");
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const formData = new FormData();
  formData.append("password", password);
  formData.append("file", file);
  formData.append("path", path);

  const response = await fetch(`${supabaseUrl}/functions/v1/admin-upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error || "Upload failed");
  }

  return data.url;
}
