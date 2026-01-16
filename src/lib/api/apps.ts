import { createClient } from "@/lib/supabase/client";

export interface App {
  id: string;
  package_name: string;
  display_name: string | null;
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

  const { data: apps, error } = await supabase
    .from("apps")
    .select(`
      *,
      settings:app_settings(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching apps:", error);
    return [];
  }

  // Fetch stats for each app
  const appsWithStats = await Promise.all(
    (apps || []).map(async (app) => {
      const stats = await getAppStats(app.id);
      return {
        ...app,
        settings: app.settings?.[0] || null,
        stats,
      };
    })
  );

  return appsWithStats;
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

export async function addApp(packageName: string, displayName?: string): Promise<App | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Insert the app
  const { data: app, error: appError } = await supabase
    .from("apps")
    .insert({
      package_name: packageName,
      display_name: displayName || packageName.split(".").pop(),
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

  return app;
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
