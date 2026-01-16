"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  AppWindow,
  MessageCircle,
  RefreshCw,
  MoreVertical,
  Trash2,
  ExternalLink,
  Zap,
  Clock,
  Star,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Settings,
  Bot,
  Send,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getApps, addApp, updateAppSettings, deleteApp, type App } from "@/lib/api/apps";
import { getPlanUsage } from "@/lib/api/stats";
import { toast } from "sonner";

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [packageName, setPackageName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [syncingAppId, setSyncingAppId] = useState<string | null>(null);
  const [settingsDialogApp, setSettingsDialogApp] = useState<App | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Plan info
  const [plan, setPlan] = useState({
    name: "Free",
    appsUsed: 0,
    appsLimit: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appsData, planData] = await Promise.all([
        getApps(),
        getPlanUsage(),
      ]);
      setApps(appsData);
      setPlan({
        name: planData.name,
        appsUsed: planData.appsUsed,
        appsLimit: planData.appsLimit,
      });
    } catch (error) {
      console.error("Error loading apps:", error);
    } finally {
      setLoading(false);
    }
  };

  const canAddApp = plan.appsUsed < plan.appsLimit;

  const handleToggleAutoReply = async (appId: string, enabled: boolean) => {
    // Optimistic update - create settings object if it doesn't exist
    setApps(apps.map(app =>
      app.id === appId
        ? {
            ...app,
            settings: {
              app_id: appId,
              auto_reply_enabled: enabled,
              auto_reply_min_rating: app.settings?.auto_reply_min_rating ?? 4,
              auto_approve_min_rating: app.settings?.auto_approve_min_rating ?? null,
              language_mode: app.settings?.language_mode ?? 'same',
            }
          }
        : app
    ));

    const success = await updateAppSettings(appId, { auto_reply_enabled: enabled });
    if (success) {
      toast.success(enabled ? "Auto-reply enabled" : "Auto-reply disabled");
    } else {
      // Revert on failure
      setApps(apps.map(app =>
        app.id === appId
          ? {
              ...app,
              settings: {
                app_id: appId,
                auto_reply_enabled: !enabled,
                auto_reply_min_rating: app.settings?.auto_reply_min_rating ?? 4,
                auto_approve_min_rating: app.settings?.auto_approve_min_rating ?? null,
                language_mode: app.settings?.language_mode ?? 'same',
              }
            }
          : app
      ));
      toast.error("Failed to update settings");
    }
  };

  const handleAddApp = async () => {
    if (!packageName.trim()) return;

    setIsAdding(true);
    const newApp = await addApp(packageName.trim(), displayName.trim() || undefined);

    if (newApp) {
      await loadData(); // Reload to get full app data with settings
      setPackageName("");
      setDisplayName("");
      setIsAddDialogOpen(false);
      toast.success("App added successfully");
    } else {
      toast.error("Failed to add app");
    }
    setIsAdding(false);
  };

  const handleDeleteApp = async (appId: string) => {
    const success = await deleteApp(appId);
    if (success) {
      setApps(apps.filter(app => app.id !== appId));
      setPlan(prev => ({ ...prev, appsUsed: prev.appsUsed - 1 }));
      toast.success("App deleted");
    } else {
      toast.error("Failed to delete app");
    }
  };

  const handleSyncApp = async (appId: string) => {
    setSyncingAppId(appId);

    try {
      const app = apps.find(a => a.id === appId);
      if (app) {
        const response = await fetch("/api/n8n/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ package_name: app.package_name }),
        });

        if (!response.ok) {
          throw new Error("Sync failed");
        }
      }
      // Reload data after sync
      await loadData();
      toast.success("Sync started! Reviews will be fetched shortly.");
    } catch (error) {
      console.error("Error syncing app:", error);
      toast.error("Failed to sync reviews");
    } finally {
      setSyncingAppId(null);
    }
  };

  const handleSaveAutomationSettings = async (
    appId: string,
    settings: {
      auto_reply_enabled: boolean;
      auto_reply_min_rating: number;
      auto_approve_min_rating: number | null;
    }
  ) => {
    setIsSavingSettings(true);
    const success = await updateAppSettings(appId, settings);

    if (success) {
      // Update local state
      setApps(apps.map(app =>
        app.id === appId
          ? { ...app, settings: app.settings ? { ...app.settings, ...settings } : undefined }
          : app
      ));
      toast.success("Automation settings saved");
      setSettingsDialogApp(null);
    } else {
      toast.error("Failed to save settings");
    }
    setIsSavingSettings(false);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Apps</h1>
            <p className="text-muted-foreground mt-1">
              Manage your connected Google Play apps
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm py-1 px-3">
              {plan.appsUsed} / {plan.appsLimit} apps
            </Badge>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={!canAddApp}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add App
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New App</DialogTitle>
                  <DialogDescription>
                    Enter your app&apos;s package name to connect it to PlayReply.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="packageName">Package Name</Label>
                    <Input
                      id="packageName"
                      placeholder="com.example.myapp"
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Find this in your Google Play Console under App Dashboard
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name (optional)</Label>
                    <Input
                      id="displayName"
                      placeholder="My App"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Service Account Required
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You&apos;ll need to set up a Google Cloud Service Account and grant it
                      access to your app in Google Play Console.
                      <a href="#" className="text-primary hover:underline ml-1">
                        View setup guide
                      </a>
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddApp} disabled={!packageName.trim() || isAdding}>
                    {isAdding ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add App"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Apps list */}
        {apps.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <AppWindow className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No apps connected yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Connect your first Google Play app to start receiving AI-generated
                responses to your user reviews.
              </p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="shadow-lg shadow-primary/25">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Your First App
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {apps.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* App icon */}
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                      <AppWindow className="h-7 w-7 text-primary" />
                    </div>

                    {/* App info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                              {app.display_name || app.package_name.split(".").pop()}
                            </h3>
                            {syncingAppId === app.id ? (
                              <Badge variant="secondary" className="text-xs">
                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                Syncing
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{app.package_name}</p>
                        </div>

                        {/* Actions dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSettingsDialogApp(app)}>
                              <Settings className="mr-2 h-4 w-4" />
                              Automation Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleSyncApp(app.id)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Sync Now
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a
                                href={`https://play.google.com/store/apps/details?id=${app.package_name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View on Play Store
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteApp(app.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove App
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{app.stats?.totalReviews || 0}</span>
                          <span className="text-muted-foreground">reviews</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{app.stats?.pendingReplies || 0}</span>
                          <span className="text-muted-foreground">pending</span>
                        </div>
                        {(app.stats?.avgRating || 0) > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-medium">{app.stats?.avgRating.toFixed(1)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <RefreshCw className="h-3 w-3" />
                          <span>Added {new Date(app.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Auto-reply toggle */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="text-muted-foreground hover:text-foreground">
                              <HelpCircle className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-[200px]">
                            <p>
                              When enabled, AI-generated replies for 4-5 star reviews
                              will be sent automatically without manual approval.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                        <Label htmlFor={`auto-reply-${app.id}`} className="text-sm cursor-pointer">
                          Auto-reply
                        </Label>
                      </div>
                      <Switch
                        id={`auto-reply-${app.id}`}
                        checked={app.settings?.auto_reply_enabled || false}
                        onCheckedChange={(checked) => handleToggleAutoReply(app.id, checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upgrade prompt if at limit */}
        {!canAddApp && (
          <Card className="bg-gradient-to-br from-primary/5 via-primary/5 to-transparent border-primary/20">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Need more apps?</h4>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Starter for 3 apps or Pro for 10 apps.
                </p>
              </div>
              <Button asChild>
                <a href="/settings">Upgrade Plan</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Setup guide card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Setup Guide</CardTitle>
            <CardDescription>
              Follow these steps to connect your Google Play Console
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Create a Google Cloud Service Account</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Go to Google Cloud Console and create a new service account with JSON key.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Grant Access in Play Console</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Add the service account email to your Google Play Console with &quot;Reply to reviews&quot; permission.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Add Your App</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your app&apos;s package name above and PlayReply will start syncing reviews.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automation Settings Dialog */}
        <Dialog open={!!settingsDialogApp} onOpenChange={(open) => !open && setSettingsDialogApp(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Automation Settings
              </DialogTitle>
              <DialogDescription>
                Configure automation rules for {settingsDialogApp?.display_name || settingsDialogApp?.package_name}
              </DialogDescription>
            </DialogHeader>
            {settingsDialogApp && (
              <AutomationSettingsForm
                app={settingsDialogApp}
                onSave={handleSaveAutomationSettings}
                isSaving={isSavingSettings}
                onCancel={() => setSettingsDialogApp(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

// Automation Settings Form Component
function AutomationSettingsForm({
  app,
  onSave,
  isSaving,
  onCancel,
}: {
  app: App;
  onSave: (appId: string, settings: {
    auto_reply_enabled: boolean;
    auto_reply_min_rating: number;
    auto_approve_min_rating: number | null;
  }) => void;
  isSaving: boolean;
  onCancel: () => void;
}) {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(
    app.settings?.auto_reply_enabled || false
  );
  const [autoReplyMinRating, setAutoReplyMinRating] = useState(
    app.settings?.auto_reply_min_rating?.toString() || "4"
  );
  const [autoApproveMinRating, setAutoApproveMinRating] = useState(
    app.settings?.auto_approve_min_rating?.toString() || "none"
  );

  const handleSubmit = () => {
    onSave(app.id, {
      auto_reply_enabled: autoReplyEnabled,
      auto_reply_min_rating: parseInt(autoReplyMinRating),
      auto_approve_min_rating: autoApproveMinRating === "none" ? null : parseInt(autoApproveMinRating),
    });
  };

  return (
    <div className="space-y-6 py-4">
      {/* Auto-Reply Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="auto-reply" className="text-base font-medium">
                Auto-Reply
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically generate AI replies for reviews
              </p>
            </div>
          </div>
          <Switch
            id="auto-reply"
            checked={autoReplyEnabled}
            onCheckedChange={setAutoReplyEnabled}
          />
        </div>

        {autoReplyEnabled && (
          <div className="ml-[52px] space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <Label htmlFor="min-rating" className="text-sm">
                Minimum Rating for Auto-Reply
              </Label>
              <Select value={autoReplyMinRating} onValueChange={setAutoReplyMinRating}>
                <SelectTrigger id="min-rating" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">All reviews (1-5 stars)</SelectItem>
                  <SelectItem value="2">2+ stars</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                  <SelectItem value="4">4+ stars (Recommended)</SelectItem>
                  <SelectItem value="5">Only 5 stars</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                AI will generate replies for reviews with this rating or higher
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t" />

      {/* Auto-Approve Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <Label className="text-base font-medium">
              Auto-Approve
            </Label>
            <p className="text-sm text-muted-foreground">
              Skip manual approval for certain reviews
            </p>
          </div>
        </div>

        <div className="ml-[52px] space-y-2">
          <Label htmlFor="auto-approve-rating" className="text-sm">
            Auto-Approve Threshold
          </Label>
          <Select value={autoApproveMinRating} onValueChange={setAutoApproveMinRating}>
            <SelectTrigger id="auto-approve-rating" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Manual approval for all</SelectItem>
              <SelectItem value="5">Only 5 stars</SelectItem>
              <SelectItem value="4">4+ stars (Recommended)</SelectItem>
              <SelectItem value="3">3+ stars</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Reviews meeting this threshold will be auto-approved and sent without manual review
          </p>
        </div>
      </div>

      {/* Auto-Send Info */}
      {autoApproveMinRating !== "none" && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-4 animate-in fade-in">
          <div className="flex gap-3">
            <Send className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Automatic Sending Enabled
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Replies for {autoApproveMinRating}+ star reviews will be sent automatically
                every hour without your approval.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <DialogFooter className="pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}
