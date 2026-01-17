import { createClient } from "@/lib/supabase/client";

export interface IOSCredentials {
  id: string;
  user_id: string;
  issuer_id: string;
  key_id: string;
  private_key: string;
  created_at: string;
  updated_at: string;
}

// Only return non-sensitive info for display
export interface IOSCredentialsSummary {
  id: string;
  issuer_id: string;
  key_id: string;
  has_private_key: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get iOS credentials for the current user
 * Returns summary (without private key) for security
 */
export async function getIOSCredentials(): Promise<IOSCredentialsSummary | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("ios_credentials")
    .select("id, issuer_id, key_id, private_key, created_at, updated_at")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    if (error?.code !== "PGRST116") { // PGRST116 = no rows returned
      console.error("Error fetching iOS credentials:", error);
    }
    return null;
  }

  return {
    id: data.id,
    issuer_id: data.issuer_id,
    key_id: data.key_id,
    has_private_key: !!data.private_key,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/**
 * Check if iOS credentials exist for the current user
 */
export async function hasIOSCredentials(): Promise<boolean> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { count, error } = await supabase
    .from("ios_credentials")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error checking iOS credentials:", error);
    return false;
  }

  return (count ?? 0) > 0;
}

export interface SaveIOSCredentialsParams {
  issuer_id: string;
  key_id: string;
  private_key: string;
}

/**
 * Save or update iOS credentials for the current user
 */
export async function saveIOSCredentials(
  params: SaveIOSCredentialsParams
): Promise<boolean> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Check if credentials already exist
  const existing = await getIOSCredentials();

  if (existing) {
    // Update existing credentials
    const { error } = await supabase
      .from("ios_credentials")
      .update({
        issuer_id: params.issuer_id,
        key_id: params.key_id,
        private_key: params.private_key,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating iOS credentials:", error);
      return false;
    }
  } else {
    // Insert new credentials
    const { error } = await supabase
      .from("ios_credentials")
      .insert({
        user_id: user.id,
        issuer_id: params.issuer_id,
        key_id: params.key_id,
        private_key: params.private_key,
      });

    if (error) {
      console.error("Error saving iOS credentials:", error);
      return false;
    }
  }

  return true;
}

/**
 * Delete iOS credentials for the current user
 */
export async function deleteIOSCredentials(): Promise<boolean> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("ios_credentials")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting iOS credentials:", error);
    return false;
  }

  return true;
}
