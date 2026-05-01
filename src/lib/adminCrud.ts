import { supabase } from "@/integrations/supabase/client";

/**
 * Perform an admin CRUD operation via the secure edge function.
 * The admin password is retrieved from sessionStorage.
 */
export async function adminCrud(params: {
  action: "insert" | "update" | "delete" | "upsert";
  table: string;
  data?: Record<string, unknown>;
  id?: string;
}) {
  const password = sessionStorage.getItem("admin_password");
  if (!password) {
    throw new Error("Not authenticated as admin");
  }

  const { data, error } = await supabase.functions.invoke("admin-crud", {
    body: {
      password,
      action: params.action,
      table: params.table,
      data: params.data,
      id: params.id,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}
