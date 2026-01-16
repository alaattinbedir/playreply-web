import { createClient } from "@/lib/supabase/client";

export interface DashboardStats {
  totalReviews: number;
  pendingReplies: number;
  sentThisMonth: number;
  avgResponseTime: string;
}

export interface PlanUsage {
  name: string;
  repliesUsed: number;
  repliesLimit: number;
  appsUsed: number;
  appsLimit: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();

  // Get total reviews
  const { count: totalReviews } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });

  // Get pending replies
  const { count: pendingReplies } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // Get sent this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: sentThisMonth } = await supabase
    .from("replies")
    .select("*", { count: "exact", head: true })
    .eq("send_status", "sent")
    .gte("sent_at", startOfMonth.toISOString());

  // Calculate average response time
  const { data: responseTimeData } = await supabase
    .from("replies")
    .select("created_at, sent_at")
    .eq("send_status", "sent")
    .not("sent_at", "is", null)
    .limit(100);

  let avgResponseTime = "-";
  if (responseTimeData && responseTimeData.length > 0) {
    const totalMinutes = responseTimeData.reduce((sum, reply) => {
      if (reply.created_at && reply.sent_at) {
        const created = new Date(reply.created_at).getTime();
        const sent = new Date(reply.sent_at).getTime();
        return sum + (sent - created) / (1000 * 60); // minutes
      }
      return sum;
    }, 0);

    const avgMinutes = totalMinutes / responseTimeData.length;

    if (avgMinutes < 60) {
      avgResponseTime = `${Math.round(avgMinutes)}m`;
    } else if (avgMinutes < 1440) {
      avgResponseTime = `${Math.round(avgMinutes / 60)}h`;
    } else {
      avgResponseTime = `${Math.round(avgMinutes / 1440)}d`;
    }
  }

  return {
    totalReviews: totalReviews || 0,
    pendingReplies: pendingReplies || 0,
    sentThisMonth: sentThisMonth || 0,
    avgResponseTime,
  };
}

export async function getPlanUsage(): Promise<PlanUsage> {
  const supabase = createClient();

  // Get apps count
  const { count: appsUsed } = await supabase
    .from("apps")
    .select("*", { count: "exact", head: true });

  // Get replies sent this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: repliesUsed } = await supabase
    .from("replies")
    .select("*", { count: "exact", head: true })
    .eq("send_status", "sent")
    .gte("sent_at", startOfMonth.toISOString());

  // TODO: Get actual plan from user's subscription
  // For now, return free plan limits
  return {
    name: "Free",
    repliesUsed: repliesUsed || 0,
    repliesLimit: 50,
    appsUsed: appsUsed || 0,
    appsLimit: 1,
  };
}

export interface RecentActivity {
  id: string;
  type: "reply_sent" | "review_received" | "app_added";
  title: string;
  description: string;
  timestamp: string;
  appName?: string;
}

// Analytics interfaces
export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface ReviewTrendPoint {
  date: string;
  reviews: number;
  replied: number;
}

export interface ResponseStats {
  totalReplied: number;
  totalIgnored: number;
  responseRate: number;
  avgRating: number;
  ratingChange: number; // compared to last month
}

export interface AppPerformance {
  appId: string;
  appName: string;
  totalReviews: number;
  avgRating: number;
  responseRate: number;
}

export async function getRatingDistribution(): Promise<RatingDistribution[]> {
  const supabase = createClient();

  const distribution: RatingDistribution[] = [];
  let totalCount = 0;

  // Get count for each rating
  for (let rating = 1; rating <= 5; rating++) {
    const { count } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("rating", rating);

    distribution.push({
      rating,
      count: count || 0,
      percentage: 0, // Will calculate after getting total
    });
    totalCount += count || 0;
  }

  // Calculate percentages
  if (totalCount > 0) {
    distribution.forEach((item) => {
      item.percentage = Math.round((item.count / totalCount) * 100);
    });
  }

  return distribution;
}

export async function getReviewTrend(days = 30): Promise<ReviewTrendPoint[]> {
  const supabase = createClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  // Get all reviews in the period
  const { data: reviews } = await supabase
    .from("reviews")
    .select("created_at, status")
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true });

  // Group by date
  const trendMap = new Map<string, { reviews: number; replied: number }>();

  // Initialize all days with 0
  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    trendMap.set(dateStr, { reviews: 0, replied: 0 });
  }

  // Count reviews per day
  (reviews || []).forEach((review) => {
    if (review.created_at) {
      const dateStr = new Date(review.created_at).toISOString().split("T")[0];
      const existing = trendMap.get(dateStr) || { reviews: 0, replied: 0 };
      existing.reviews++;
      if (review.status === "replied") {
        existing.replied++;
      }
      trendMap.set(dateStr, existing);
    }
  });

  // Convert to array
  return Array.from(trendMap.entries()).map(([date, data]) => ({
    date,
    reviews: data.reviews,
    replied: data.replied,
  }));
}

export async function getResponseStats(): Promise<ResponseStats> {
  const supabase = createClient();

  // Get total counts
  const { count: totalReplied } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("status", "replied");

  const { count: totalIgnored } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("status", "ignored");

  const { count: totalReviews } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });

  // Calculate response rate (replied / (replied + ignored))
  const respondedTotal = (totalReplied || 0) + (totalIgnored || 0);
  const responseRate = respondedTotal > 0
    ? Math.round(((totalReplied || 0) / respondedTotal) * 100)
    : 0;

  // Get average rating
  const { data: ratingData } = await supabase
    .from("reviews")
    .select("rating");

  const avgRating = ratingData && ratingData.length > 0
    ? ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length
    : 0;

  // Get rating change (this month vs last month)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startOfLastMonth = new Date(startOfMonth);
  startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

  const { data: thisMonthRatings } = await supabase
    .from("reviews")
    .select("rating")
    .gte("created_at", startOfMonth.toISOString());

  const { data: lastMonthRatings } = await supabase
    .from("reviews")
    .select("rating")
    .gte("created_at", startOfLastMonth.toISOString())
    .lt("created_at", startOfMonth.toISOString());

  const thisMonthAvg = thisMonthRatings && thisMonthRatings.length > 0
    ? thisMonthRatings.reduce((sum, r) => sum + r.rating, 0) / thisMonthRatings.length
    : 0;

  const lastMonthAvg = lastMonthRatings && lastMonthRatings.length > 0
    ? lastMonthRatings.reduce((sum, r) => sum + r.rating, 0) / lastMonthRatings.length
    : 0;

  const ratingChange = thisMonthAvg - lastMonthAvg;

  return {
    totalReplied: totalReplied || 0,
    totalIgnored: totalIgnored || 0,
    responseRate,
    avgRating: Math.round(avgRating * 10) / 10,
    ratingChange: Math.round(ratingChange * 10) / 10,
  };
}

export async function getAppPerformance(): Promise<AppPerformance[]> {
  const supabase = createClient();

  // Get all apps
  const { data: apps } = await supabase
    .from("apps")
    .select("id, display_name, package_name");

  if (!apps) return [];

  const performance: AppPerformance[] = [];

  for (const app of apps) {
    // Get reviews for this app
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating, status")
      .eq("app_id", app.id);

    if (!reviews || reviews.length === 0) {
      performance.push({
        appId: app.id,
        appName: app.display_name || app.package_name,
        totalReviews: 0,
        avgRating: 0,
        responseRate: 0,
      });
      continue;
    }

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const replied = reviews.filter((r) => r.status === "replied").length;
    const ignored = reviews.filter((r) => r.status === "ignored").length;
    const respondedTotal = replied + ignored;
    const responseRate = respondedTotal > 0 ? Math.round((replied / respondedTotal) * 100) : 0;

    performance.push({
      appId: app.id,
      appName: app.display_name || app.package_name,
      totalReviews: reviews.length,
      avgRating: Math.round(avgRating * 10) / 10,
      responseRate,
    });
  }

  return performance;
}

export async function getRecentActivity(limit = 5): Promise<RecentActivity[]> {
  const supabase = createClient();

  // Get recent sent replies
  const { data: recentReplies } = await supabase
    .from("replies")
    .select(`
      id,
      sent_at,
      review_id,
      app:apps(display_name, package_name)
    `)
    .eq("send_status", "sent")
    .not("sent_at", "is", null)
    .order("sent_at", { ascending: false })
    .limit(limit);

  // Get recent reviews
  const { data: recentReviews } = await supabase
    .from("reviews")
    .select(`
      id,
      created_at,
      author_name,
      rating,
      app:apps(display_name, package_name)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  const activities: RecentActivity[] = [];

  // Add replies
  (recentReplies || []).forEach((reply) => {
    // Supabase returns relations as arrays or single objects depending on the relation type
    const appData = reply.app;
    const app = Array.isArray(appData) ? appData[0] : appData;
    activities.push({
      id: `reply-${reply.id}`,
      type: "reply_sent",
      title: "Reply sent",
      description: `Reply sent for ${app?.display_name || app?.package_name || "Unknown app"}`,
      timestamp: reply.sent_at!,
      appName: app?.display_name || app?.package_name || undefined,
    });
  });

  // Add reviews
  (recentReviews || []).forEach((review) => {
    // Supabase returns relations as arrays or single objects depending on the relation type
    const appData = review.app;
    const app = Array.isArray(appData) ? appData[0] : appData;
    activities.push({
      id: `review-${review.id}`,
      type: "review_received",
      title: `${review.rating}-star review`,
      description: `From ${review.author_name || "Anonymous"}`,
      timestamp: review.created_at!,
      appName: app?.display_name || app?.package_name || undefined,
    });
  });

  // Sort by timestamp and limit
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}
