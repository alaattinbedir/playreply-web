import { createClient } from "@/lib/supabase/client";

// Tone options for positive reviews (4-5 stars)
export const POSITIVE_TONE_OPTIONS = [
  { value: "enthusiastic", label: "Enthusiastic", description: "Excited and grateful" },
  { value: "warm", label: "Warm", description: "Friendly and appreciative" },
  { value: "professional", label: "Professional", description: "Polite and business-like" },
  { value: "friendly", label: "Friendly", description: "Casual and approachable" },
  { value: "casual", label: "Casual", description: "Relaxed and informal" },
  { value: "formal", label: "Formal", description: "Respectful and traditional" },
] as const;

// Tone options for neutral reviews (3 stars)
export const NEUTRAL_TONE_OPTIONS = [
  { value: "understanding", label: "Understanding", description: "Acknowledging and open" },
  { value: "empathetic", label: "Empathetic", description: "Caring and considerate" },
  { value: "professional", label: "Professional", description: "Polite and business-like" },
  { value: "helpful", label: "Helpful", description: "Eager to assist" },
  { value: "supportive", label: "Supportive", description: "Encouraging and reassuring" },
] as const;

// Tone options for negative reviews (1-2 stars)
export const NEGATIVE_TONE_OPTIONS = [
  { value: "empathetic", label: "Empathetic", description: "Caring and understanding" },
  { value: "understanding", label: "Understanding", description: "Acknowledging concerns" },
  { value: "apologetic", label: "Apologetic", description: "Sincere and sorry" },
  { value: "supportive", label: "Supportive", description: "Ready to help resolve" },
  { value: "professional", label: "Professional", description: "Calm and business-like" },
  { value: "formal", label: "Formal", description: "Respectful and traditional" },
] as const;

export interface UserReplySettings {
  user_id: string;
  tone_5_star: string;
  tone_4_star: string;
  tone_3_star: string;
  tone_2_star: string;
  tone_1_star: string;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_REPLY_SETTINGS: Omit<UserReplySettings, "user_id"> = {
  tone_5_star: "enthusiastic",
  tone_4_star: "warm",
  tone_3_star: "understanding",
  tone_2_star: "empathetic",
  tone_1_star: "professional",
};

export async function getReplySettings(): Promise<UserReplySettings | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_reply_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching reply settings:", error);
    return null;
  }

  // Return defaults if no settings exist
  if (!data) {
    return {
      user_id: user.id,
      ...DEFAULT_REPLY_SETTINGS,
    };
  }

  return data;
}

export async function saveReplySettings(
  settings: Omit<UserReplySettings, "user_id" | "created_at" | "updated_at">
): Promise<boolean> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Upsert: insert if not exists, update if exists
  const { error } = await supabase
    .from("user_reply_settings")
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
    console.error("Error saving reply settings:", error);
    return false;
  }

  return true;
}
