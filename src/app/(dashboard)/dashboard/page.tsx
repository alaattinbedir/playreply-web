import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = user?.email?.split("@")[0] || "there";

  // TODO: Fetch real stats from database
  const stats = {
    totalReviews: 0,
    pendingReplies: 0,
    sentThisMonth: 0,
    avgResponseTime: "-",
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your app reviews
          </p>
        </div>
        <Link href="/apps">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add App
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              Across all your apps
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Replies</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReplies}</div>
            <p className="text-xs text-muted-foreground">
              Waiting for approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent This Month</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sentThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              50 replies available (Free plan)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              Time to send reply
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Getting started / Quick actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to start responding to reviews
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Connect your Google Play Console</h4>
                <p className="text-sm text-muted-foreground">
                  Add your app to start fetching reviews
                </p>
              </div>
              <Link href="/apps">
                <Button variant="outline" size="sm">
                  Add App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg opacity-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Review AI-generated replies</h4>
                <p className="text-sm text-muted-foreground">
                  Approve or edit replies before sending
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg opacity-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Set up auto-approval rules</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically send replies for positive reviews
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest review replies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="font-medium">No activity yet</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Add an app to start seeing your review activity here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
