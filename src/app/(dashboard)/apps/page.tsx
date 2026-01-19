"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Upload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getApps, addApp, updateAppSettings, deleteApp, fetchAndUpdateAppIcon, type App } from "@/lib/api/apps";
import { getPlanUsage } from "@/lib/api/stats";
import { hasIOSCredentials } from "@/lib/api/ios-credentials";
import { toast } from "sonner";
import Link from "next/link";
import { CSVUploadDialog } from "@/components/csv-upload-dialog";

// Platform Icon Component
function PlatformIcon({ platform }: { platform: "android" | "ios" | null }) {
  if (!platform) return null;

  if (platform === "ios") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-gray-100 dark:bg-gray-800">
            <svg className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>iOS App Store</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-green-100 dark:bg-green-900/30">
          <svg className="h-3.5 w-3.5 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
          </svg>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Google Play Store</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios">("android");
  const [packageName, setPackageName] = useState("");
  const [appleId, setAppleId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [syncingAppId, setSyncingAppId] = useState<string | null>(null);
  const [settingsDialogApp, setSettingsDialogApp] = useState<App | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [iosCredentialsConfigured, setIosCredentialsConfigured] = useState(false);
  const [csvUploadApp, setCsvUploadApp] = useState<App | null>(null);

  // Auto-sync state
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialSyncDoneRef = useRef(false);

  // Plan info
  const [plan, setPlan] = useState({
    name: "Free",
    appsUsed: 0,
    appsLimit: 2,
  });

  // Auto-sync all apps
  const autoSyncAllApps = useCallback(async (showToast = false) => {
    if (isAutoSyncing) return;

    setIsAutoSyncing(true);
    try {
      const currentApps = await getApps();
      if (currentApps.length === 0) {
        setIsAutoSyncing(false);
        return;
      }

      // Sync all apps in parallel
      const syncPromises = currentApps.map(async (app) => {
        // Skip iOS apps without credentials
        if (app.platform === "ios" && !iosCredentialsConfigured) {
          return null;
        }

        try {
          const response = await fetch("/api/n8n/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ package_name: app.package_name, platform: app.platform }),
          });
          return response.ok;
        } catch {
          return false;
        }
      });

      await Promise.all(syncPromises);

      // Reload data after sync
      await loadData();
      setLastSyncTime(new Date());

      if (showToast) {
        toast.success("Reviews synced");
      }
    } catch (error) {
      console.error("Auto-sync error:", error);
      if (showToast) {
        toast.error("Sync failed");
      }
    } finally {
      setIsAutoSyncing(false);
    }
  }, [isAutoSyncing, iosCredentialsConfigured]);

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Auto-sync on page load (after initial data load)
  useEffect(() => {
    if (!loading && apps.length > 0 && !initialSyncDoneRef.current) {
      initialSyncDoneRef.current = true;
      autoSyncAllApps(false);
    }
  }, [loading, apps.length, autoSyncAllApps]);

  // Polling: sync every 5 minutes while page is open
  useEffect(() => {
    const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

    syncIntervalRef.current = setInterval(() => {
      if (!isAutoSyncing && apps.length > 0) {
        autoSyncAllApps(false);
      }
    }, POLL_INTERVAL);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [apps.length, isAutoSyncing, autoSyncAllApps]);

  // Fetch icons for apps that don't have one
  useEffect(() => {
    const fetchMissingIcons = async () => {
      const appsWithoutIcons = apps.filter(app => !app.icon_url && app.platform);

      for (const app of appsWithoutIcons) {
        const iconUrl = await fetchAndUpdateAppIcon(app);
        if (iconUrl) {
          // Update local state with the new icon
          setApps(prevApps =>
            prevApps.map(a =>
              a.id === app.id ? { ...a, icon_url: iconUrl } : a
            )
          );
        }
      }
    };

    if (apps.length > 0) {
      fetchMissingIcons();
    }
  }, [apps.length]); // Only run when apps count changes

  const loadData = async () => {
    try {
      const [appsData, planData, hasIosCreds] = await Promise.all([
        getApps(),
        getPlanUsage(),
        hasIOSCredentials(),
      ]);
      setApps(appsData);
      setIosCredentialsConfigured(hasIosCreds);
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
              sync_interval_minutes: app.settings?.sync_interval_minutes ?? 15,
              auto_send_interval_minutes: app.settings?.auto_send_interval_minutes ?? 15,
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
                sync_interval_minutes: app.settings?.sync_interval_minutes ?? 15,
                auto_send_interval_minutes: app.settings?.auto_send_interval_minutes ?? 15,
              }
            }
          : app
      ));
      toast.error("Failed to update settings");
    }
  };

  const handleAddApp = async () => {
    if (!packageName.trim()) return;

    // Validate Apple ID for iOS
    if (platform === "ios" && !appleId.trim()) {
      toast.error("Apple ID is required for iOS apps");
      return;
    }

    setIsAdding(true);
    const newApp = await addApp({
      packageName: packageName.trim(),
      displayName: displayName.trim() || undefined,
      platform,
      appleId: platform === "ios" ? appleId.trim() : undefined,
    });

    if (newApp) {
      await loadData(); // Reload to get full app data with settings
      setPackageName("");
      setAppleId("");
      setDisplayName("");
      setPlatform("android");
      setIsAddDialogOpen(false);
      toast.success("App added! Syncing reviews...");

      // Poll for review updates (fetch-reviews runs in background)
      const pollForReviews = async (attempts = 0) => {
        if (attempts >= 10) return; // Max 10 attempts (30 seconds)

        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
        const updatedApps = await getApps();
        const updatedApp = updatedApps.find(a => a.id === newApp.id);

        if (updatedApp && updatedApp.stats && updatedApp.stats.totalReviews > 0) {
          setApps(updatedApps);
          toast.success(`${updatedApp.stats.totalReviews} reviews synced!`);
        } else {
          pollForReviews(attempts + 1);
        }
      };

      pollForReviews();
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
        const initialReviewCount = app.stats?.totalReviews || 0;

        const response = await fetch("/api/n8n/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ package_name: app.package_name, platform: app.platform }),
        });

        if (!response.ok) {
          throw new Error("Sync failed");
        }

        // Reload data after sync
        await loadData();
        toast.success("Sync started! Fetching reviews...");

        // Poll for review updates
        const pollForReviews = async (attempts = 0) => {
          if (attempts >= 10) return; // Max 10 attempts (30 seconds)

          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
          const updatedApps = await getApps();
          const updatedApp = updatedApps.find(a => a.id === appId);

          if (updatedApp && updatedApp.stats) {
            const newReviewCount = updatedApp.stats.totalReviews;
            if (newReviewCount > initialReviewCount) {
              setApps(updatedApps);
              toast.success(`${newReviewCount - initialReviewCount} new reviews synced!`);
              return;
            }
          }
          pollForReviews(attempts + 1);
        };

        pollForReviews();
      }
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
      sync_interval_minutes: number;
      auto_send_interval_minutes: number;
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
              Manage your connected Android and iOS apps
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Sync Status Indicator */}
            {apps.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {isAutoSyncing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                        <span className="hidden sm:inline">Syncing...</span>
                      </>
                    ) : lastSyncTime ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="hidden sm:inline">
                          Synced {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </>
                    ) : null}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Auto-syncs every 5 minutes</p>
                  {lastSyncTime && (
                    <p className="text-xs text-muted-foreground">
                      Last sync: {lastSyncTime.toLocaleTimeString()}
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            )}
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
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>Add New App</DialogTitle>
                  <DialogDescription>
                    Connect your Android or iOS app to start managing reviews.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Platform Selector */}
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Tabs value={platform} onValueChange={(v) => setPlatform(v as "android" | "ios")} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="android" className="flex items-center gap-2">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                          </svg>
                          Android
                        </TabsTrigger>
                        <TabsTrigger value="ios" className="flex items-center gap-2">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                          </svg>
                          iOS
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Package Name / Bundle ID */}
                  <div className="space-y-2">
                    <Label htmlFor="packageName">
                      {platform === "ios" ? "Bundle ID" : "Package Name"}
                    </Label>
                    <Input
                      id="packageName"
                      placeholder="com.example.myapp"
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {platform === "ios"
                        ? "Find this in App Store Connect under App Information"
                        : "Find this in Google Play Console under App Dashboard"
                      }
                    </p>
                  </div>

                  {/* Apple ID - iOS only */}
                  {platform === "ios" && (
                    <div className="space-y-2">
                      <Label htmlFor="appleId">Apple ID (App Store ID)</Label>
                      <Input
                        id="appleId"
                        placeholder="123456789"
                        value={appleId}
                        onChange={(e) => setAppleId(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        The numeric ID from your App Store URL (e.g., apps.apple.com/app/id<strong>123456789</strong>)
                      </p>
                    </div>
                  )}

                  {/* Display Name */}
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name (optional)</Label>
                    <Input
                      id="displayName"
                      placeholder="My App"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>

                  {/* iOS Credentials Warning */}
                  {platform === "ios" && !iosCredentialsConfigured && (
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        Setup Required
                      </div>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        iOS apps require App Store Connect API credentials to sync reviews.
                        You can add the app now and configure credentials later.
                      </p>
                      <Link
                        href="/settings"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                      >
                        Configure in Settings →
                      </Link>
                    </div>
                  )}

                  {/* iOS Credentials Configured */}
                  {platform === "ios" && iosCredentialsConfigured && (
                    <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        iOS Credentials Configured
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Your App Store Connect API is ready. Reviews will sync automatically.
                      </p>
                    </div>
                  )}

                  {/* Android API Access Info */}
                  {platform === "android" && (
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-200">
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                        Grant PlayReply Access
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Add PlayReply&apos;s service account to your Google Play Console with &quot;Reply to reviews&quot; permission.
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-2 py-1.5 bg-white dark:bg-blue-950 rounded text-xs font-mono text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 truncate">
                          playreplyservice@playreply.iam.gserviceaccount.com
                        </code>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 shrink-0 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900"
                          onClick={() => {
                            navigator.clipboard.writeText("playreplyservice@playreply.iam.gserviceaccount.com");
                            toast.success("Email copied to clipboard");
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddApp}
                    disabled={!packageName.trim() || (platform === "ios" && !appleId.trim()) || isAdding}
                  >
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
                Connect your first Android or iOS app to start receiving AI-generated
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
                    {app.icon_url ? (
                      <img
                        src={app.icon_url}
                        alt={app.display_name || app.package_name}
                        className="h-14 w-14 rounded-xl object-cover shrink-0 shadow-sm"
                        onError={(e) => {
                          // Fallback to placeholder on error
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 ${app.icon_url ? 'hidden' : ''}`}>
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
                            ) : app.platform === "ios" && !iosCredentialsConfigured ? (
                              <Badge variant="outline" className="text-xs text-amber-600 border-amber-200 bg-amber-50">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Setup Required
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <PlatformIcon platform={app.platform} />
                            <p className="text-sm text-muted-foreground">{app.package_name}</p>
                          </div>
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
                            {app.platform === "android" && (
                              <DropdownMenuItem onClick={() => setCsvUploadApp(app)}>
                                <Upload className="mr-2 h-4 w-4" />
                                Import Historical Reviews
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                              <a
                                href={app.platform === "ios"
                                  ? `https://apps.apple.com/app/id${app.apple_id}`
                                  : `https://play.google.com/store/apps/details?id=${app.package_name}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                {app.platform === "ios" ? "View on App Store" : "View on Play Store"}
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

                      {/* iOS Setup Required Banner */}
                      {app.platform === "ios" && !iosCredentialsConfigured && (
                        <div className="flex items-center justify-between gap-2 mt-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                          <p className="text-xs text-amber-700 dark:text-amber-300">
                            Configure iOS credentials in Settings to sync reviews
                          </p>
                          <Link href="/settings">
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              Configure
                            </Button>
                          </Link>
                        </div>
                      )}

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
              Follow these steps to connect your app store account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="android" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="android" className="flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                  </svg>
                  Android
                </TabsTrigger>
                <TabsTrigger value="ios" className="flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  iOS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="android" className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0 text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Copy PlayReply Service Account Email</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      PlayReply uses a shared service account to access your reviews.
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                        playreplyservice@playreply.iam.gserviceaccount.com
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => {
                          navigator.clipboard.writeText("playreplyservice@playreply.iam.gserviceaccount.com");
                          toast.success("Email copied to clipboard");
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0 text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Grant Access in Play Console</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Go to <a href="https://play.google.com/console" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Play Console</a> → Users and Permissions → Invite new users.
                      Add the service account email above with <strong>&quot;Reply to reviews&quot;</strong> permission for your app.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0 text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Add Your App</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter your app&apos;s package name above and PlayReply will start syncing reviews automatically.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ios" className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Create an App Store Connect API Key</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Go to App Store Connect → Users and Access → Keys → App Store Connect API and generate a new key with Admin or App Manager role.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Download Your Private Key</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Download the .p8 private key file and note your Key ID and Issuer ID. The key can only be downloaded once.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Add Your App</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter your app&apos;s bundle ID above and PlayReply will start syncing reviews from the App Store.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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

        {/* CSV Upload Dialog */}
        {csvUploadApp && (
          <CSVUploadDialog
            open={!!csvUploadApp}
            onOpenChange={(open) => !open && setCsvUploadApp(null)}
            appId={csvUploadApp.id}
            appName={csvUploadApp.display_name || csvUploadApp.package_name}
            packageName={csvUploadApp.package_name}
            platform={csvUploadApp.platform || "android"}
            onSuccess={(count) => {
              toast.success(`${count} reviews imported! AI replies will be generated.`);
              loadData(); // Refresh data
            }}
          />
        )}
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
    sync_interval_minutes: number;
    auto_send_interval_minutes: number;
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
  const [syncInterval, setSyncInterval] = useState(
    app.settings?.sync_interval_minutes?.toString() || "15"
  );
  const [autoSendInterval, setAutoSendInterval] = useState(
    app.settings?.auto_send_interval_minutes?.toString() || "15"
  );

  const handleSubmit = () => {
    onSave(app.id, {
      auto_reply_enabled: autoReplyEnabled,
      auto_reply_min_rating: parseInt(autoReplyMinRating),
      auto_approve_min_rating: autoApproveMinRating === "none" ? null : parseInt(autoApproveMinRating),
      sync_interval_minutes: parseInt(syncInterval),
      auto_send_interval_minutes: parseInt(autoSendInterval),
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
                every {autoSendInterval} minutes without your approval.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t" />

      {/* Sync & Timing Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <Label className="text-base font-medium">
              Sync & Timing
            </Label>
            <p className="text-sm text-muted-foreground">
              Control how often reviews are synced and replies are sent
            </p>
          </div>
        </div>

        <div className="ml-[52px] space-y-4">
          {/* Sync Interval */}
          <div className="space-y-2">
            <Label htmlFor="sync-interval" className="text-sm">
              Review Sync Interval
            </Label>
            <Select value={syncInterval} onValueChange={setSyncInterval}>
              <SelectTrigger id="sync-interval" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Every 5 minutes (Fastest)</SelectItem>
                <SelectItem value="15">Every 15 minutes (Recommended)</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every 1 hour</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How often to check for new reviews from the app store
            </p>
          </div>

          {/* Auto-Send Interval */}
          <div className="space-y-2">
            <Label htmlFor="auto-send-interval" className="text-sm">
              Auto-Send Interval
            </Label>
            <Select value={autoSendInterval} onValueChange={setAutoSendInterval}>
              <SelectTrigger id="auto-send-interval" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Every 5 minutes (Fastest)</SelectItem>
                <SelectItem value="15">Every 15 minutes (Recommended)</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every 1 hour</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How often to send approved replies to the app store
            </p>
          </div>
        </div>
      </div>

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
