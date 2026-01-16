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
