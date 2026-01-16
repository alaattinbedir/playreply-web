import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Star,
  Zap,
  CheckCircle2,
  Sparkles,
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

  // Plan info
  const plan = {
    name: "Free",
    repliesUsed: 0,
    repliesLimit: 50,
    appsUsed: 0,
    appsLimit: 1,
  };

  const usagePercentage = (plan.repliesUsed / plan.repliesLimit) * 100;

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Welcome header with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                {plan.name} Plan
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {firstName}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s what&apos;s happening with your app reviews
            </p>
          </div>
          <Link href="/apps">
            <Button size="lg" className="shadow-lg shadow-primary/25">
              <Plus className="mr-2 h-4 w-4" />
              Add App
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats cards with modern design */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all your apps
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Replies</CardTitle>
            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingReplies}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Waiting for approval
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent This Month</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Send className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.sentThisMonth}</div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={usagePercentage} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground">
                {plan.repliesUsed}/{plan.repliesLimit}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Time to send reply
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plan usage card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Plan Usage</CardTitle>
                <CardDescription>Your current {plan.name} plan usage</CardDescription>
              </div>
            </div>
            <Link href="/settings">
              <Button variant="outline" size="sm">
                Upgrade Plan
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">AI Replies</span>
                <span className="font-medium">{plan.repliesUsed} / {plan.repliesLimit}</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {plan.repliesLimit - plan.repliesUsed} replies remaining this month
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Connected Apps</span>
                <span className="font-medium">{plan.appsUsed} / {plan.appsLimit}</span>
              </div>
              <Progress value={(plan.appsUsed / plan.appsLimit) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {plan.appsLimit - plan.appsUsed} app slot{plan.appsLimit - plan.appsUsed !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting started / Quick actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Complete these steps to start responding to reviews
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 p-4 border rounded-xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium shrink-0">
                1
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium">Connect your Google Play Console</h4>
                <p className="text-sm text-muted-foreground truncate">
                  Add your app to start fetching reviews
                </p>
              </div>
              <Link href="/apps">
                <Button size="sm" className="shrink-0">
                  Add App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-xl opacity-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium shrink-0">
                2
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium">Review AI-generated replies</h4>
                <p className="text-sm text-muted-foreground truncate">
                  Approve or edit replies before sending
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-xl opacity-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium shrink-0">
                3
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium">Set up auto-approval rules</h4>
                <p className="text-sm text-muted-foreground truncate">
                  Automatically send replies for positive reviews
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest review replies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium">No activity yet</h4>
              <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
                Add an app to start seeing your review activity here
              </p>
              <Link href="/apps" className="mt-4">
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First App
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick tips */}
      <Card className="bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 border-green-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h4 className="font-medium">Pro tip: Respond to negative reviews quickly</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Studies show that responding to negative reviews within 24 hours can improve your app rating by up to 0.5 stars.
                PlayReply helps you respond faster with AI-generated replies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
