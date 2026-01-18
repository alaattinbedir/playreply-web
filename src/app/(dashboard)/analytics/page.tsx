"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Star,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  getRatingDistribution,
  getReviewTrend,
  getResponseStats,
  getAppPerformance,
  type RatingDistribution,
  type ReviewTrendPoint,
  type ResponseStats,
  type AppPerformance,
} from "@/lib/api/stats";

const COLORS = {
  1: "#ef4444", // red
  2: "#f97316", // orange
  3: "#eab308", // yellow
  4: "#22c55e", // green
  5: "#16a34a", // dark green
};

const PIE_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];

function PlatformIcon({ platform }: { platform: "android" | "ios" | null }) {
  if (!platform) return null;

  if (platform === "ios") {
    return (
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-gray-100 dark:bg-gray-800">
              <svg
                className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>iOS App Store</p>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <UITooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-green-100 dark:bg-green-900">
            <svg
              className="h-3.5 w-3.5 text-green-700 dark:text-green-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.523 15.341c-.5 0-.961-.173-1.345-.516l-3.069-2.744c-.077-.067-.168-.1-.273-.1h-1.672c-.104 0-.196.033-.273.1l-3.07 2.744a1.906 1.906 0 0 1-1.344.516A1.906 1.906 0 0 1 4.571 13.4c0-.5.173-.961.516-1.345l2.744-3.07a.396.396 0 0 0 .1-.272v-1.672a.396.396 0 0 0-.1-.273l-2.744-3.07a1.906 1.906 0 0 1-.516-1.344c0-.545.173-1.009.516-1.345a1.906 1.906 0 0 1 1.345-.516c.5 0 .961.173 1.345.516l3.069 2.744c.077.067.169.1.273.1h1.672c.104 0 .196-.033.273-.1l3.07-2.744A1.906 1.906 0 0 1 17.477.493c.545 0 1.009.173 1.345.516.343.336.516.8.516 1.345 0 .5-.173.961-.516 1.345l-2.744 3.069a.396.396 0 0 0-.1.273v1.672c0 .104.033.196.1.273l2.744 3.069c.343.384.516.845.516 1.345 0 .545-.173 1.009-.516 1.345a1.86 1.86 0 0 1-1.299.596zM6.477 17.571a1.906 1.906 0 0 1 1.345.516l3.069 2.744c.077.067.169.1.273.1h1.672c.104 0 .196-.033.273-.1l3.07-2.744a1.906 1.906 0 0 1 1.344-.516c.545 0 1.009.173 1.345.516.343.336.516.8.516 1.345 0 .5-.173.961-.516 1.345l-2.744 3.069a.396.396 0 0 0-.1.273v.672a.396.396 0 0 0 .1.273c.077.067.169.1.273.1h.672c.545 0 1.009.173 1.345.516.343.336.516.8.516 1.345 0 .545-.173 1.009-.516 1.345a1.906 1.906 0 0 1-1.345.516h-.672a.396.396 0 0 0-.273.1.396.396 0 0 0-.1.273v.672c0 .545-.173 1.009-.516 1.345a1.906 1.906 0 0 1-1.345.516 1.906 1.906 0 0 1-1.345-.516 1.906 1.906 0 0 1-.516-1.345v-.672a.396.396 0 0 0-.1-.273.396.396 0 0 0-.273-.1h-.672a1.906 1.906 0 0 1-1.345-.516 1.906 1.906 0 0 1-.516-1.345c0-.545.173-1.009.516-1.345a1.906 1.906 0 0 1 1.345-.516h.672c.104 0 .196-.033.273-.1a.396.396 0 0 0 .1-.273v-.672c0-.104-.033-.196-.1-.273l-2.744-3.069a1.906 1.906 0 0 1-.516-1.345c0-.545.173-1.009.516-1.345a1.906 1.906 0 0 1 1.299-.596z" />
            </svg>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Google Play</p>
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [ratingDist, setRatingDist] = useState<RatingDistribution[]>([]);
  const [reviewTrend, setReviewTrend] = useState<ReviewTrendPoint[]>([]);
  const [responseStats, setResponseStats] = useState<ResponseStats>({
    totalReplied: 0,
    totalIgnored: 0,
    responseRate: 0,
    avgRating: 0,
    ratingChange: 0,
  });
  const [appPerformance, setAppPerformance] = useState<AppPerformance[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [distData, trendData, statsData, perfData] = await Promise.all([
          getRatingDistribution(),
          getReviewTrend(30),
          getResponseStats(),
          getAppPerformance(),
        ]);

        setRatingDist(distData);
        setReviewTrend(trendData);
        setResponseStats(statsData);
        setAppPerformance(perfData);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-8">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Format date for tooltip
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Prepare pie chart data
  const pieData = ratingDist.map((item) => ({
    name: `${item.rating} Stars`,
    value: item.count,
    rating: item.rating,
  }));

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            <BarChart3 className="h-3 w-3 mr-1" />
            Analytics
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">Review Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your review performance and response metrics
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{responseStats.avgRating}</div>
            <div className="flex items-center gap-1 mt-1">
              {responseStats.ratingChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : responseStats.ratingChange < 0 ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
              <span
                className={`text-xs ${
                  responseStats.ratingChange > 0
                    ? "text-green-500"
                    : responseStats.ratingChange < 0
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {responseStats.ratingChange > 0 ? "+" : ""}
                {responseStats.ratingChange} vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{responseStats.responseRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Of processed reviews
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replied</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{responseStats.totalReplied}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total replies sent
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ignored</CardTitle>
            <div className="h-10 w-10 rounded-full bg-gray-500/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{responseStats.totalIgnored}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Reviews skipped
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Rating Distribution Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Rating Distribution
            </CardTitle>
            <CardDescription>Breakdown of reviews by star rating</CardDescription>
          </CardHeader>
          <CardContent>
            {ratingDist.every((d) => d.count === 0) ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingDist} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="rating"
                      type="category"
                      tickFormatter={(value) => `${value} ★`}
                      width={50}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as RatingDistribution;
                          return (
                            <div className="bg-background border rounded-lg shadow-lg p-3">
                              <p className="font-medium">{data.rating} Stars</p>
                              <p className="text-sm text-muted-foreground">
                                {data.count} reviews ({data.percentage}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="count"
                      radius={[0, 4, 4, 0]}
                      fill="currentColor"
                      className="fill-primary"
                    >
                      {ratingDist.map((entry) => (
                        <Cell
                          key={`cell-${entry.rating}`}
                          fill={COLORS[entry.rating as keyof typeof COLORS]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rating Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Rating Breakdown
            </CardTitle>
            <CardDescription>Percentage of each rating</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.every((d) => d.value === 0) ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData.filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${String(name || "").split(" ")[0]} (${((percent || 0) * 100).toFixed(0)}%)`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[entry.rating - 1]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg shadow-lg p-3">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {data.value} reviews
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Review Trend (Last 30 Days)
          </CardTitle>
          <CardDescription>Daily reviews received and replied</CardDescription>
        </CardHeader>
        <CardContent>
          {reviewTrend.every((d) => d.reviews === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No reviews in the last 30 days</p>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reviewTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{formatDate(String(label))}</p>
                            <p className="text-sm text-blue-500">
                              {payload[0].value} reviews received
                            </p>
                            <p className="text-sm text-green-500">
                              {payload[1].value} replied
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reviews"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="Reviews"
                  />
                  <Line
                    type="monotone"
                    dataKey="replied"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                    name="Replied"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-muted-foreground">Reviews Received</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Replied</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Performance Table */}
      {appPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              App Performance
            </CardTitle>
            <CardDescription>Review metrics per app</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      App
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                      Reviews
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                      Avg Rating
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                      Response Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appPerformance.map((app) => (
                    <tr
                      key={app.appId}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          <PlatformIcon platform={app.platform} />
                          {app.appName}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">{app.totalReviews}</td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span>{app.avgRating}</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge
                          variant={
                            app.responseRate >= 80
                              ? "default"
                              : app.responseRate >= 50
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {app.responseRate}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
