import { createClient } from "@/lib/supabase/client";

export interface App {
  id: string;
  package_name: string;
  display_name: string | null;
  platform: "android" | "ios" | null;
  apple_id: string | null;
  bundle_id: string | null;
  created_at: string;
  user_id: string;
  settings?: AppSettings;
  stats?: AppStats;
}

export interface AppSettings {
  app_id: string;
  auto_reply_enabled: boolean;
  auto_reply_min_rating: number;
  auto_approve_min_rating: number | null;
  language_mode: string;
}

export interface AppStats {
  totalReviews: number;
  pendingReplies: number;
  sentThisMonth: number;
  avgRating: number;
}

export async function getApps(): Promise<App[]> {
  const supabase = createClient();

  // Fetch apps
  const { data: apps, error } = await supabase
    .from("apps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching apps:", error);
    return [];
  }

  if (!apps || apps.length === 0) {
    return [];
  }

  // Fetch settings for all apps in a single query
  const appIds = apps.map(app => app.id);
  const { data: allSettings } = await supabase
    .from("app_settings")
    .select("*")
    .in("app_id", appIds);

  // Create a map for quick lookup
  const settingsMap = new Map<string, AppSettings>();
  (allSettings || []).forEach(setting => {
    settingsMap.set(setting.app_id, setting);
  });

  // Fetch stats for each app and combine with settings
  const appsWithData = await Promise.all(
    apps.map(async (app) => {
      const stats = await getAppStats(app.id);
      const settings = settingsMap.get(app.id) || null;
      return {
        ...app,
        settings,
        stats,
      };
    })
  );

  return appsWithData;
}

export async function getAppStats(appId: string): Promise<AppStats> {
  const supabase = createClient();

  // Get total reviews count
  const { count: totalReviews } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("app_id", appId);

  // Get pending replies count
  const { count: pendingReplies } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("app_id", appId)
    .eq("status", "pending");

  // Get sent this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: sentThisMonth } = await supabase
    .from("replies")
    .select("*", { count: "exact", head: true })
    .eq("app_id", appId)
    .eq("send_status", "sent")
    .gte("sent_at", startOfMonth.toISOString());

  // Get average rating
  const { data: ratingData } = await supabase
    .from("reviews")
    .select("rating")
    .eq("app_id", appId);

  const avgRating = ratingData && ratingData.length > 0
    ? ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length
    : 0;

  return {
    totalReviews: totalReviews || 0,
    pendingReplies: pendingReplies || 0,
    sentThisMonth: sentThisMonth || 0,
    avgRating,
  };
}

export interface AddAppParams {
  packageName: string;
  displayName?: string;
  platform: "android" | "ios";
  appleId?: string; // Required for iOS - numeric App Store ID
}

export async function addApp(params: AddAppParams): Promise<App | null> {
  const { packageName, displayName, platform, appleId } = params;
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Insert the app
  const { data: app, error: appError } = await supabase
    .from("apps")
    .insert({
      package_name: packageName,
      display_name: displayName || packageName.split(".").pop(),
      platform,
      apple_id: platform === "ios" ? appleId : null,
      bundle_id: platform === "ios" ? packageName : null,
      user_id: user.id,
    })
    .select()
    .single();

  if (appError) {
    console.error("Error adding app:", appError);
    return null;
  }

  // Create default settings
  const { error: settingsError } = await supabase
    .from("app_settings")
    .insert({
      app_id: app.id,
      auto_reply_enabled: false,
      auto_reply_min_rating: 4,
      language_mode: "same_as_review",
    });

  if (settingsError) {
    console.error("Error creating app settings:", settingsError);
  }

  // Trigger fetch-reviews workflow immediately for the new app
  // This runs in background - don't await to avoid blocking the UI
  triggerFetchReviews(platform).catch((err) => {
    console.error("Error triggering fetch-reviews:", err);
  });

  return app;
}

/**
 * Triggers the fetch-reviews n8n workflow via webhook
 * This is called after adding a new app to immediately sync reviews
 */
async function triggerFetchReviews(platform: "android" | "ios"): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://mobixo.app.n8n.cloud/webhook";

  // Trigger the appropriate workflow based on platform
  const endpoint = platform === "ios" ? "fetch-ios-reviews" : "fetch-reviews";

  try {
    await fetch(`${webhookUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trigger: "app_added", platform }),
    });
  } catch (error) {
    // Log but don't throw - this is a background operation
    console.error(`Failed to trigger ${endpoint} webhook:`, error);
  }
}

export async function updateAppSettings(
  appId: string,
  settings: Partial<AppSettings>
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("app_settings")
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .eq("app_id", appId);

  if (error) {
    console.error("Error updating app settings:", error);
    return false;
  }

  return true;
}

export async function deleteApp(appId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("apps")
    .delete()
    .eq("id", appId);

  if (error) {
    console.error("Error deleting app:", error);
    return false;
  }

  return true;
}
