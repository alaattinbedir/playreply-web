import { createClient } from "@/lib/supabase/client";

export interface Review {
  id: string;
  app_id: string;
  review_id: string;
  rating: number;
  language: string | null;
  text: string | null;
  author_name: string | null;
  created_at: string | null;
  status: "new" | "pending" | "replied" | "ignored";
  category: string | null;
  platform: "android" | "ios" | null;
  app?: {
    id: string;
    display_name: string | null;
    package_name: string;
  };
  reply?: Reply;
}

export interface Reply {
  id: string;
  app_id: string;
  review_id: string;
  suggested_text: string | null;
  final_text: string | null;
  sent_at: string | null;
  send_status: "draft" | "approved" | "sent" | "error";
  error_message: string | null;
  created_at: string;
}

export interface ReviewFilters {
  status?: string;
  rating?: number;
  appId?: string;
}

export interface PaginatedReviews {
  reviews: Review[];
  total: number;
  hasMore: boolean;
}

const PAGE_SIZE = 20;

export async function getReviews(
  filters?: ReviewFilters,
  options?: { offset?: number; limit?: number }
): Promise<PaginatedReviews> {
  const supabase = createClient();
  const offset = options?.offset ?? 0;
  const limit = options?.limit ?? PAGE_SIZE;

  // First get total count with filters
  let countQuery = supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });

  if (filters?.status && filters.status !== "all") {
    countQuery = countQuery.eq("status", filters.status);
  }
  if (filters?.rating && filters.rating > 0) {
    countQuery = countQuery.eq("rating", filters.rating);
  }
  if (filters?.appId && filters.appId !== "all") {
    countQuery = countQuery.eq("app_id", filters.appId);
  }

  const { count: total } = await countQuery;

  // Fetch reviews with app info and pagination
  let query = supabase
    .from("reviews")
    .select(`
      *,
      app:apps(id, display_name, package_name)
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // Apply filters
  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters?.rating && filters.rating > 0) {
    query = query.eq("rating", filters.rating);
  }
  if (filters?.appId && filters.appId !== "all") {
    query = query.eq("app_id", filters.appId);
  }

  const { data: reviews, error: reviewsError } = await query;

  if (reviewsError) {
    console.error("Error fetching reviews:", reviewsError);
    return { reviews: [], total: 0, hasMore: false };
  }

  if (!reviews || reviews.length === 0) {
    return { reviews: [], total: total || 0, hasMore: false };
  }

  // Fetch replies separately and match by review_id
  const reviewIds = reviews.map(r => r.review_id);
  const { data: replies, error: repliesError } = await supabase
    .from("replies")
    .select("*")
    .in("review_id", reviewIds);

  if (repliesError) {
    console.error("Error fetching replies:", repliesError);
  }

  // Create a map of replies by review_id
  const repliesMap = new Map<string, Reply>();
  (replies || []).forEach(reply => {
    repliesMap.set(reply.review_id, reply);
  });

  // Transform the data to match our interface
  const transformedReviews = reviews.map((review) => ({
    ...review,
    reply: repliesMap.get(review.review_id) || null,
  }));

  return {
    reviews: transformedReviews,
    total: total || 0,
    hasMore: offset + limit < (total || 0),
  };
}

export async function getReviewById(reviewId: string): Promise<Review | null> {
  const supabase = createClient();

  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select(`
      *,
      app:apps(id, display_name, package_name)
    `)
    .eq("id", reviewId)
    .single();

  if (reviewError) {
    console.error("Error fetching review:", reviewError);
    return null;
  }

  // Fetch reply separately
  const { data: reply } = await supabase
    .from("replies")
    .select("*")
    .eq("review_id", review.review_id)
    .single();

  return {
    ...review,
    reply: reply || null,
  };
}

export async function updateReviewStatus(
  reviewId: string,
  status: Review["status"]
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", reviewId);

  if (error) {
    console.error("Error updating review status:", error);
    return false;
  }

  return true;
}

export async function approveReply(
  reviewId: string,
  finalText: string
): Promise<boolean> {
  const supabase = createClient();

  // First get the reply
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, app_id, review_id")
    .eq("id", reviewId)
    .single();

  if (!reviews) return false;

  // Update or create the reply
  const { error } = await supabase
    .from("replies")
    .upsert({
      app_id: reviews.app_id,
      review_id: reviews.review_id,
      final_text: finalText,
      send_status: "approved",
    }, {
      onConflict: "review_id",
    });

  if (error) {
    console.error("Error approving reply:", error);
    return false;
  }

  // Update review status
  await updateReviewStatus(reviewId, "pending");

  return true;
}

export async function sendReply(reviewId: string): Promise<boolean> {
  const supabase = createClient();

  // Get the review with platform info
  const { data: review } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", reviewId)
    .single();

  if (!review) {
    console.error("Review not found");
    return false;
  }

  // Get the reply separately
  const { data: reply } = await supabase
    .from("replies")
    .select("*")
    .eq("review_id", review.review_id)
    .single();

  if (!reply) {
    console.error("Reply not found");
    return false;
  }

  // Determine the correct webhook endpoint based on platform
  const webhookEndpoint = review.platform === "ios" ? "send-ios-reply" : "send-reply";
  const baseUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL || "https://n8n-production-d1805.up.railway.app/webhook";

  // Call the n8n webhook to send the reply
  try {
    const response = await fetch(
      `${baseUrl}/${webhookEndpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reply_id: reply.id,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send reply");
    }

    // Update the reply status
    await supabase
      .from("replies")
      .update({
        send_status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", reply.id);

    // Update review status
    await updateReviewStatus(reviewId, "replied");

    return true;
  } catch (error) {
    console.error("Error sending reply:", error);

    // Update the reply with error status
    await supabase
      .from("replies")
      .update({
        send_status: "error",
        error_message: error instanceof Error ? error.message : "Unknown error",
      })
      .eq("id", reply.id);

    return false;
  }
}

export async function generateReply(reviewId: string): Promise<string | null> {
  const supabase = createClient();

  // Get the review
  const { data: review } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", reviewId)
    .single();

  if (!review) return null;

  // Call the n8n webhook to generate a reply
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL || "https://n8n-production-d1805.up.railway.app/webhook"}/generate-reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review_id: review.review_id,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate reply");
    }

    // Wait a bit for n8n to process and save the reply
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Fetch the updated reply
    const { data: reply } = await supabase
      .from("replies")
      .select("suggested_text")
      .eq("review_id", review.review_id)
      .single();

    return reply?.suggested_text || null;
  } catch (error) {
    console.error("Error generating reply:", error);
    return null;
  }
}

export async function regenerateReply(reviewId: string): Promise<string | null> {
  const supabase = createClient();

  // Get the review
  const { data: review } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", reviewId)
    .single();

  if (!review) return null;

  // Call the n8n webhook to regenerate the reply
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL || "https://n8n-production-d1805.up.railway.app/webhook"}/generate-reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review_id: review.review_id,
          force_regenerate: true,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to regenerate reply");
    }

    // Wait a bit for n8n to process and save the reply
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Fetch the updated reply
    const { data: reply } = await supabase
      .from("replies")
      .select("suggested_text")
      .eq("review_id", review.review_id)
      .single();

    return reply?.suggested_text || null;
  } catch (error) {
    console.error("Error regenerating reply:", error);
    return null;
  }
}

export async function getReviewStats(): Promise<{
  total: number;
  new: number;
  pending: number;
  approved: number;
  replied: number;
  ignored: number;
  avgRating: number;
}> {
  const supabase = createClient();

  const { count: total } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });

  const { count: newCount } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  // Pending Approval = replies with draft status
  const { count: pending } = await supabase
    .from("replies")
    .select("*", { count: "exact", head: true })
    .eq("send_status", "draft");

  // Ready to Send = replies with approved status
  const { count: approved } = await supabase
    .from("replies")
    .select("*", { count: "exact", head: true })
    .eq("send_status", "approved");

  const { count: replied } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("status", "replied");

  // Ignored = reviews skipped due to low rating (need manual action)
  const { count: ignored } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("status", "ignored");

  const { data: ratingData } = await supabase
    .from("reviews")
    .select("rating");

  const avgRating = ratingData && ratingData.length > 0
    ? ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length
    : 0;

  return {
    total: total || 0,
    new: newCount || 0,
    pending: pending || 0,
    approved: approved || 0,
    replied: replied || 0,
    ignored: ignored || 0,
    avgRating,
  };
}
