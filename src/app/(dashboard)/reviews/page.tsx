"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MessageCircle,
  Star,
  Check,
  X,
  Send,
  RefreshCw,
  Filter,
  Clock,
  Sparkles,
  ChevronDown,
  Edit3,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Inbox,
  Loader2,
  CheckSquare,
  Square,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getReviews,
  getReviewStats,
  updateReviewStatus,
  approveReply,
  sendReply,
  generateReply,
  regenerateReply,
  type Review,
} from "@/lib/api/reviews";
import { getApps, type App } from "@/lib/api/apps";
import { toast } from "sonner";

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating
              ? "text-amber-500 fill-amber-500"
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

// Status badge component
function StatusBadge({ status }: { status: Review["status"] }) {
  const variants = {
    new: { label: "New", className: "bg-blue-100 text-blue-700 border-blue-200" },
    pending: { label: "Pending", className: "bg-amber-100 text-amber-700 border-amber-200" },
    replied: { label: "Replied", className: "bg-green-100 text-green-700 border-green-200" },
    ignored: { label: "Ignored", className: "bg-gray-100 text-gray-700 border-gray-200" },
  };

  const variant = variants[status];

  return (
    <Badge variant="outline" className={cn("text-xs", variant.className)}>
      {variant.label}
    </Badge>
  );
}

// Reply status badge
function ReplyStatusBadge({ status }: { status: "draft" | "approved" | "sent" | "error" }) {
  const variants = {
    draft: { label: "Draft", icon: Edit3, className: "text-muted-foreground" },
    approved: { label: "Approved", icon: Check, className: "text-blue-600" },
    sent: { label: "Sent", icon: Send, className: "text-green-600" },
    error: { label: "Error", icon: AlertCircle, className: "text-red-600" },
  };

  const variant = variants[status];
  const Icon = variant.icon;

  return (
    <div className={cn("flex items-center gap-1 text-xs", variant.className)}>
      <Icon className="h-3 w-3" />
      {variant.label}
    </div>
  );
}

// Platform icon component
function PlatformIcon({ platform }: { platform: "android" | "ios" | null }) {
  if (!platform) return null;

  if (platform === "ios") {
    return (
      <TooltipProvider>
        <Tooltip>
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
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-green-100 dark:bg-green-900">
            <svg
              className="h-3.5 w-3.5 text-green-700 dark:text-green-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
            </svg>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Google Play</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    new: number;
    pending: number;
    replied: number;
    avgRating: number;
  } | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [editedReply, setEditedReply] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [filterApp, setFilterApp] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [generatingReplyId, setGeneratingReplyId] = useState<string | null>(null);

  // Fetch data function
  const fetchData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [reviewsData, appsData, statsData] = await Promise.all([
        getReviews({
          status: filterStatus !== "all" ? filterStatus : undefined,
          rating: filterRating !== "all" ? parseInt(filterRating) : undefined,
          appId: filterApp !== "all" ? filterApp : undefined,
        }),
        getApps(),
        getReviewStats(),
      ]);
      setReviews(reviewsData);
      setApps(appsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchData();
  }, [filterStatus, filterRating, filterApp]);

  // Auto-refresh every 5 seconds for 2 minutes after mount (for workflow updates)
  useEffect(() => {
    let pollCount = 0;
    const maxPolls = 24; // 24 polls * 5 seconds = 2 minutes

    const pollInterval = setInterval(() => {
      pollCount++;
      if (pollCount >= maxPolls) {
        clearInterval(pollInterval);
        return;
      }
      fetchData(false); // Refresh without showing loading spinner
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  const handleOpenReview = (review: Review) => {
    setSelectedReview(review);
    setEditedReply(review.reply?.final_text || review.reply?.suggested_text || "");
  };

  const handleApproveReply = async () => {
    if (!selectedReview || !editedReply.trim()) return;

    const success = await approveReply(selectedReview.id, editedReply);
    if (success) {
      // Update local state
      setReviews(reviews.map((r) =>
        r.id === selectedReview.id
          ? {
              ...r,
              status: "pending" as const,
              reply: r.reply
                ? { ...r.reply, final_text: editedReply, send_status: "approved" as const }
                : undefined,
            }
          : r
      ));
      setSelectedReview(null);
      toast.success("Reply approved");
    } else {
      toast.error("Failed to approve reply");
    }
  };

  const handleSendReply = async () => {
    if (!selectedReview) return;

    setIsSending(true);

    // First approve if not already approved
    if (!selectedReview.reply || selectedReview.reply.send_status === "draft") {
      await approveReply(selectedReview.id, editedReply);
    }

    const success = await sendReply(selectedReview.id);

    if (success) {
      setReviews(reviews.map((r) =>
        r.id === selectedReview.id
          ? {
              ...r,
              status: "replied" as const,
              reply: r.reply
                ? { ...r.reply, send_status: "sent" as const, sent_at: new Date().toISOString() }
                : undefined,
            }
          : r
      ));
      const storeName = selectedReview.platform === "ios" ? "App Store" : "Google Play";
      setSelectedReview(null);
      toast.success(`Reply sent to ${storeName}`);
    } else {
      toast.error("Failed to send reply");
    }
    setIsSending(false);
  };

  const handleIgnoreReview = async () => {
    if (!selectedReview) return;

    const success = await updateReviewStatus(selectedReview.id, "ignored");
    if (success) {
      setReviews(reviews.map((r) =>
        r.id === selectedReview.id
          ? { ...r, status: "ignored" as const }
          : r
      ));
      setSelectedReview(null);
      toast.success("Review ignored");
    } else {
      toast.error("Failed to ignore review");
    }
  };

  const handleGenerateOrRegenerateReply = async () => {
    if (!selectedReview) return;

    setIsRegenerating(true);
    const hasExistingReply = !!selectedReview.reply;

    // Use generateReply for new, regenerateReply for existing
    const newReply = hasExistingReply
      ? await regenerateReply(selectedReview.id)
      : await generateReply(selectedReview.id);

    if (newReply) {
      setEditedReply(newReply);
      // Update local state with the new reply
      setReviews(reviews.map((r) =>
        r.id === selectedReview.id
          ? {
              ...r,
              status: "pending" as const,
              reply: {
                id: r.reply?.id || "",
                app_id: r.app_id,
                review_id: r.review_id,
                suggested_text: newReply,
                final_text: null,
                sent_at: null,
                send_status: "draft" as const,
                error_message: null,
                created_at: new Date().toISOString(),
              },
            }
          : r
      ));
      // Also update selectedReview to reflect the new reply
      setSelectedReview({
        ...selectedReview,
        status: "pending",
        reply: {
          id: selectedReview.reply?.id || "",
          app_id: selectedReview.app_id,
          review_id: selectedReview.review_id,
          suggested_text: newReply,
          final_text: null,
          sent_at: null,
          send_status: "draft",
          error_message: null,
          created_at: new Date().toISOString(),
        },
      });
      toast.success(hasExistingReply ? "New reply generated" : "AI reply generated");
    } else {
      toast.error(hasExistingReply ? "Failed to regenerate reply" : "Failed to generate reply");
    }
    setIsRegenerating(false);
  };

  // Generate reply from card (for reviews without replies)
  const handleGenerateReplyFromCard = async (reviewId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGeneratingReplyId(reviewId);

    const review = reviews.find((r) => r.id === reviewId);
    if (!review) {
      setGeneratingReplyId(null);
      return;
    }

    const newReply = await generateReply(reviewId);
    if (newReply) {
      // Update local state with the new reply
      setReviews(reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              status: "pending" as const,
              reply: {
                id: "",
                app_id: r.app_id,
                review_id: r.review_id,
                suggested_text: newReply,
                final_text: null,
                sent_at: null,
                send_status: "draft" as const,
                error_message: null,
                created_at: new Date().toISOString(),
              },
            }
          : r
      ));
      toast.success("AI reply generated");
    } else {
      toast.error("Failed to generate reply");
    }
    setGeneratingReplyId(null);
  };

  // Bulk operations
  const toggleSelectReview = (reviewId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(reviewId)) {
      newSelected.delete(reviewId);
    } else {
      newSelected.add(reviewId);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === reviews.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(reviews.map((r) => r.id)));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;

    setIsBulkProcessing(true);
    let successCount = 0;
    let failCount = 0;

    for (const reviewId of selectedIds) {
      const review = reviews.find((r) => r.id === reviewId);
      if (review && review.reply?.suggested_text) {
        const success = await approveReply(reviewId, review.reply.final_text || review.reply.suggested_text);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      }
    }

    // Refresh reviews
    const [reviewsData, statsData] = await Promise.all([
      getReviews({
        status: filterStatus !== "all" ? filterStatus : undefined,
        rating: filterRating !== "all" ? parseInt(filterRating) : undefined,
        appId: filterApp !== "all" ? filterApp : undefined,
      }),
      getReviewStats(),
    ]);
    setReviews(reviewsData);
    setStats(statsData);
    setSelectedIds(new Set());
    setIsBulkProcessing(false);

    if (successCount > 0) {
      toast.success(`${successCount} review${successCount > 1 ? "s" : ""} approved`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} review${failCount > 1 ? "s" : ""} failed to approve`);
    }
  };

  const handleBulkIgnore = async () => {
    if (selectedIds.size === 0) return;

    setIsBulkProcessing(true);
    let successCount = 0;
    let failCount = 0;

    for (const reviewId of selectedIds) {
      const success = await updateReviewStatus(reviewId, "ignored");
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    // Refresh reviews
    const [reviewsData, statsData] = await Promise.all([
      getReviews({
        status: filterStatus !== "all" ? filterStatus : undefined,
        rating: filterRating !== "all" ? parseInt(filterRating) : undefined,
        appId: filterApp !== "all" ? filterApp : undefined,
      }),
      getReviewStats(),
    ]);
    setReviews(reviewsData);
    setStats(statsData);
    setSelectedIds(new Set());
    setIsBulkProcessing(false);

    if (successCount > 0) {
      toast.success(`${successCount} review${successCount > 1 ? "s" : ""} ignored`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} review${failCount > 1 ? "s" : ""} failed to ignore`);
    }
  };

  const handleBulkSend = async () => {
    if (selectedIds.size === 0) return;

    setIsBulkProcessing(true);
    let successCount = 0;
    let failCount = 0;

    for (const reviewId of selectedIds) {
      const review = reviews.find((r) => r.id === reviewId);
      if (review && review.reply) {
        // Approve first if needed
        if (review.reply.send_status === "draft") {
          await approveReply(reviewId, review.reply.final_text || review.reply.suggested_text || "");
        }
        const success = await sendReply(reviewId);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      }
    }

    // Refresh reviews
    const [reviewsData, statsData] = await Promise.all([
      getReviews({
        status: filterStatus !== "all" ? filterStatus : undefined,
        rating: filterRating !== "all" ? parseInt(filterRating) : undefined,
        appId: filterApp !== "all" ? filterApp : undefined,
      }),
      getReviewStats(),
    ]);
    setReviews(reviewsData);
    setStats(statsData);
    setSelectedIds(new Set());
    setIsBulkProcessing(false);

    if (successCount > 0) {
      toast.success(`${successCount} repl${successCount > 1 ? "ies" : "y"} sent`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} repl${failCount > 1 ? "ies" : "y"} failed to send`);
    }
  };

  // Clear selection when filters change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [filterStatus, filterRating, filterApp]);

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Reviews</h1>
            <p className="text-muted-foreground mt-1">
              Manage and respond to your app reviews
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm py-1 px-3">
              {reviews.length} reviews
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="ignored">Ignored</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              {apps.length > 0 && (
                <Select value={filterApp} onValueChange={setFilterApp}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="App" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Apps</SelectItem>
                    {apps.map((app) => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.display_name || app.package_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {(filterStatus !== "all" || filterRating !== "all" || filterApp !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterStatus("all");
                    setFilterRating("all");
                    setFilterApp("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Action Bar */}
        {selectedIds.size > 0 && (
          <Card className="sticky top-16 md:top-0 z-40 border-primary/50 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedIds(new Set())}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <span className="text-sm font-medium">
                    {selectedIds.size} review{selectedIds.size > 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkIgnore}
                    disabled={isBulkProcessing}
                  >
                    {isBulkProcessing ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <X className="h-4 w-4 mr-1" />
                    )}
                    Ignore All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkApprove}
                    disabled={isBulkProcessing}
                  >
                    {isBulkProcessing ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    Approve All
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleBulkSend}
                    disabled={isBulkProcessing}
                  >
                    {isBulkProcessing ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-1" />
                    )}
                    Send All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Inbox className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {stats?.total === 0 ? "No reviews yet" : "No reviews match filters"}
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                {stats?.total === 0
                  ? "Connect an app to start receiving and responding to reviews."
                  : "Try adjusting your filters to see more reviews."}
              </p>
              {stats?.total === 0 && (
                <Button className="mt-6" asChild>
                  <a href="/apps">Add an App</a>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Select all header */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 px-2">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {selectedIds.size === reviews.length ? (
                    <CheckSquare className="h-5 w-5 text-primary" />
                  ) : selectedIds.size > 0 ? (
                    <Minus className="h-5 w-5 text-primary" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                  {selectedIds.size === reviews.length
                    ? "Deselect all"
                    : `Select all (${reviews.length})`}
                </button>
              </div>
            )}

            {reviews.map((review) => (
              <Card
                key={review.id}
                className={cn(
                  "hover:shadow-md transition-all cursor-pointer",
                  selectedIds.has(review.id) && "border-primary bg-primary/5"
                )}
                onClick={() => handleOpenReview(review)}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={(e) => toggleSelectReview(review.id, e)}
                      className="shrink-0 mt-1"
                    >
                      {selectedIds.has(review.id) ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>

                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {(review.author_name || "A").charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-medium">{review.author_name || "Anonymous"}</span>
                        <StarRating rating={review.rating} />
                        <StatusBadge status={review.status} />
                        <span className="text-xs text-muted-foreground">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.text || "No review text"}
                      </p>

                      {review.reply ? (
                        <div className="flex items-center gap-2 mt-2">
                          <PlatformIcon platform={review.platform} />
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Sparkles className="h-3 w-3" />
                            AI Reply
                          </div>
                          <ReplyStatusBadge status={review.reply.send_status} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-2">
                          <PlatformIcon platform={review.platform} />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={(e) => handleGenerateReplyFromCard(review.id, e)}
                            disabled={generatingReplyId === review.id}
                          >
                            {generatingReplyId === review.id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3 mr-1" />
                                Generate Reply
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* App name */}
                    <Badge variant="secondary" className="shrink-0 hidden md:flex">
                      {review.app?.display_name || review.app?.package_name || "Unknown App"}
                    </Badge>

                    {/* Action indicator */}
                    <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 rotate-[-90deg]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review detail dialog */}
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedReview && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary">
                        {(selectedReview.author_name || "A").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <DialogTitle className="text-left flex items-center gap-2">
                        <PlatformIcon platform={selectedReview.platform} />
                        {selectedReview.author_name || "Anonymous"}
                      </DialogTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={selectedReview.rating} />
                        <span className="text-xs text-muted-foreground">
                          {selectedReview.created_at ? new Date(selectedReview.created_at).toLocaleDateString() : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Review text */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Review</h4>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm">{selectedReview.text || "No review text"}</p>
                    </div>
                  </div>

                  {/* AI Reply */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-medium">AI-Generated Reply</h4>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleGenerateOrRegenerateReply}
                            disabled={isRegenerating}
                          >
                            {selectedReview.reply ? (
                              <>
                                <RefreshCw className={cn("h-4 w-4 mr-1", isRegenerating && "animate-spin")} />
                                {isRegenerating ? "Regenerating..." : "Regenerate"}
                              </>
                            ) : (
                              <>
                                {isRegenerating ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <Sparkles className="h-4 w-4 mr-1" />
                                )}
                                {isRegenerating ? "Generating..." : "Generate Reply"}
                              </>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {selectedReview.reply ? "Generate a new AI reply" : "Generate an AI reply for this review"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Textarea
                      value={editedReply}
                      onChange={(e) => setEditedReply(e.target.value)}
                      placeholder="AI-generated reply will appear here..."
                      className="min-h-[120px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Edit the reply above before approving or sending.
                    </p>
                  </div>

                  {/* Quick feedback */}
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <span className="text-sm">Was this reply helpful?</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Yes
                      </Button>
                      <Button variant="outline" size="sm">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        No
                      </Button>
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={handleIgnoreReview}
                    className="w-full sm:w-auto"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Ignore
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleApproveReply}
                    disabled={!editedReply.trim()}
                    className="w-full sm:w-auto"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    onClick={handleSendReply}
                    disabled={!editedReply.trim() || isSending}
                    className="w-full sm:w-auto"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Quick stats */}
        {stats && stats.total > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {stats.new}
                </div>
                <div className="text-xs text-muted-foreground">New Reviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {stats.pending}
                </div>
                <div className="text-xs text-muted-foreground">Pending Approval</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {stats.replied}
                </div>
                <div className="text-xs text-muted-foreground">Replied</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {stats.avgRating.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Avg. Rating</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
