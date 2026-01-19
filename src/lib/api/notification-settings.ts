import { createClient } from "@/lib/supabase/client";

export interface UserNotificationSettings {
  user_id: string;
  email_notifications: boolean;
  new_review_alerts: boolean;
  weekly_reports: boolean;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_NOTIFICATION_SETTINGS: Omit<UserNotificationSettings, "user_id"> = {
  email_notifications: true,
  new_review_alerts: true,
  weekly_reports: true,
};

export async function getNotificationSettings(): Promise<UserNotificationSettings | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_notification_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching notification settings:", error);
    return null;
  }

  // Return defaults if no settings exist
  if (!data) {
    return {
      user_id: user.id,
      ...DEFAULT_NOTIFICATION_SETTINGS,
    };
  }

  return data;
}

export async function saveNotificationSettings(
  settings: Omit<UserNotificationSettings, "user_id" | "created_at" | "updated_at">
): Promise<boolean> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Upsert: insert if not exists, update if exists
  const { error } = await supabase
    .from("user_notification_settings")
    .upsert(
      {
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

  if (error) {
    console.error("Error saving notification settings:", error);
    return false;
  }

  return true;
}
