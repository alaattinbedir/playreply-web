"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
                      <td className="py-3 px-4 font-medium">{app.appName}</td>
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
