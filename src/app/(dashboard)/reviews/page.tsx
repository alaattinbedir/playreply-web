"use client";

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Review {
  id: string;
  appId: string;
  appName: string;
  authorName: string;
  rating: number;
  text: string;
  language: string;
  createdAt: string;
  status: "new" | "pending" | "replied" | "ignored";
  reply?: {
    id: string;
    suggestedText: string;
    finalText?: string;
    sendStatus: "draft" | "approved" | "sent" | "error";
    sentAt?: string;
  };
}

// Mock data
const mockReviews: Review[] = [];

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
function ReplyStatusBadge({ status }: { status: NonNullable<Review["reply"]>["sendStatus"] }) {
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

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [editedReply, setEditedReply] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [filterApp, setFilterApp] = useState<string>("all");
  const [isSending, setIsSending] = useState(false);

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    if (filterStatus !== "all" && review.status !== filterStatus) return false;
    if (filterRating !== "all" && review.rating !== parseInt(filterRating)) return false;
    if (filterApp !== "all" && review.appId !== filterApp) return false;
    return true;
  });

  // Get unique apps for filter
  const uniqueApps = [...new Set(reviews.map((r) => ({ id: r.appId, name: r.appName })))];

  const handleOpenReview = (review: Review) => {
    setSelectedReview(review);
    setEditedReply(review.reply?.finalText || review.reply?.suggestedText || "");
  };

  const handleApproveReply = async () => {
    if (!selectedReview) return;

    setReviews(reviews.map((r) =>
      r.id === selectedReview.id
        ? {
            ...r,
            status: "pending" as const,
            reply: r.reply
              ? { ...r.reply, finalText: editedReply, sendStatus: "approved" as const }
              : undefined,
          }
        : r
    ));
    setSelectedReview(null);
  };

  const handleSendReply = async () => {
    if (!selectedReview) return;

    setIsSending(true);
    // TODO: Call API to send reply
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setReviews(reviews.map((r) =>
      r.id === selectedReview.id
        ? {
            ...r,
            status: "replied" as const,
            reply: r.reply
              ? { ...r.reply, sendStatus: "sent" as const, sentAt: new Date().toISOString() }
              : undefined,
          }
        : r
    ));
    setIsSending(false);
    setSelectedReview(null);
  };

  const handleIgnoreReview = () => {
    if (!selectedReview) return;

    setReviews(reviews.map((r) =>
      r.id === selectedReview.id
        ? { ...r, status: "ignored" as const }
        : r
    ));
    setSelectedReview(null);
  };

  const handleRegenerateReply = async () => {
    if (!selectedReview) return;

    // TODO: Call API to regenerate reply
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Mock regenerated text
    setEditedReply("Thank you for your feedback! We appreciate you taking the time to share your thoughts.");
  };

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
              {filteredReviews.length} reviews
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

              {uniqueApps.length > 0 && (
                <Select value={filterApp} onValueChange={setFilterApp}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="App" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Apps</SelectItem>
                    {uniqueApps.map((app) => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.name}
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

        {/* Reviews list */}
        {filteredReviews.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Inbox className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {reviews.length === 0 ? "No reviews yet" : "No reviews match filters"}
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                {reviews.length === 0
                  ? "Connect an app to start receiving and responding to reviews."
                  : "Try adjusting your filters to see more reviews."}
              </p>
              {reviews.length === 0 && (
                <Button className="mt-6" asChild>
                  <a href="/apps">Add an App</a>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <Card
                key={review.id}
                className="hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleOpenReview(review)}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {review.authorName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-medium">{review.authorName}</span>
                        <StarRating rating={review.rating} />
                        <StatusBadge status={review.status} />
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.text}
                      </p>

                      {review.reply && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Sparkles className="h-3 w-3" />
                            AI Reply
                          </div>
                          <ReplyStatusBadge status={review.reply.sendStatus} />
                        </div>
                      )}
                    </div>

                    {/* App name */}
                    <Badge variant="secondary" className="shrink-0 hidden md:flex">
                      {review.appName}
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
                        {selectedReview.authorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <DialogTitle className="text-left">
                        {selectedReview.authorName}
                      </DialogTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={selectedReview.rating} />
                        <span className="text-xs text-muted-foreground">
                          {new Date(selectedReview.createdAt).toLocaleDateString()}
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
                      <p className="text-sm">{selectedReview.text}</p>
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
                            onClick={handleRegenerateReply}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Regenerate
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Generate a new AI reply</TooltipContent>
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
        {reviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {reviews.filter((r) => r.status === "new").length}
                </div>
                <div className="text-xs text-muted-foreground">New Reviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {reviews.filter((r) => r.status === "pending").length}
                </div>
                <div className="text-xs text-muted-foreground">Pending Approval</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {reviews.filter((r) => r.status === "replied").length}
                </div>
                <div className="text-xs text-muted-foreground">Replied</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {(
                    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0
                  ).toFixed(1)}
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
