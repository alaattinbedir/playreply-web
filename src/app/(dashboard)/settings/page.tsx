"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  CreditCard,
  Bell,
  Sparkles,
  Shield,
  Trash2,
  Check,
  Crown,
  Zap,
  AlertTriangle,
  ExternalLink,
  Loader2,
  Key,
  Upload,
  CheckCircle2,
  Eye,
  EyeOff,
  Smartphone,
  Copy,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useCheckout } from "@/components/paddle-provider";
import { getPlanUsage, type PlanUsage } from "@/lib/api/stats";
import {
  getIOSCredentials,
  saveIOSCredentials,
  deleteIOSCredentials,
  type IOSCredentialsSummary,
} from "@/lib/api/ios-credentials";
import {
  getReplySettings,
  saveReplySettings,
  POSITIVE_TONE_OPTIONS,
  NEUTRAL_TONE_OPTIONS,
  NEGATIVE_TONE_OPTIONS,
  DEFAULT_REPLY_SETTINGS,
  type UserReplySettings,
} from "@/lib/api/reply-settings";
import {
  getNotificationSettings,
  saveNotificationSettings,
  DEFAULT_NOTIFICATION_SETTINGS,
} from "@/lib/api/notification-settings";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { BillingInterval, PLANS, YEARLY_DISCOUNT_MESSAGE } from "@/lib/paddle/config";

export default function SettingsPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [planUsage, setPlanUsage] = useState<PlanUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { startCheckout, isLoading: isCheckoutLoading } = useCheckout();

  // Billing interval state
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');

  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(DEFAULT_NOTIFICATION_SETTINGS.email_notifications);
  const [weeklyReports, setWeeklyReports] = useState(DEFAULT_NOTIFICATION_SETTINGS.weekly_reports);
  const [newReviewAlerts, setNewReviewAlerts] = useState(DEFAULT_NOTIFICATION_SETTINGS.new_review_alerts);
  const [isSavingNotificationSettings, setIsSavingNotificationSettings] = useState(false);

  // 5-tier tone settings
  const [tone5Star, setTone5Star] = useState(DEFAULT_REPLY_SETTINGS.tone_5_star);
  const [tone4Star, setTone4Star] = useState(DEFAULT_REPLY_SETTINGS.tone_4_star);
  const [tone3Star, setTone3Star] = useState(DEFAULT_REPLY_SETTINGS.tone_3_star);
  const [tone2Star, setTone2Star] = useState(DEFAULT_REPLY_SETTINGS.tone_2_star);
  const [tone1Star, setTone1Star] = useState(DEFAULT_REPLY_SETTINGS.tone_1_star);
  const [isSavingToneSettings, setIsSavingToneSettings] = useState(false);

  // iOS Credentials state
  const [iosCredentials, setIosCredentials] = useState<IOSCredentialsSummary | null>(null);
  const [isIOSCredentialsDialogOpen, setIsIOSCredentialsDialogOpen] = useState(false);
  const [isSavingIOSCredentials, setIsSavingIOSCredentials] = useState(false);
  const [isDeletingIOSCredentials, setIsDeletingIOSCredentials] = useState(false);
  const [iosIssuerId, setIosIssuerId] = useState("");
  const [iosKeyId, setIosKeyId] = useState("");
  const [iosPrivateKey, setIosPrivateKey] = useState("");

  // Password change state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const [authProvider, setAuthProvider] = useState<string | null>(null);

  // 2FA state
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [totpSecret, setTotpSecret] = useState("");
  const [totpQRCode, setTotpQRCode] = useState("");
  const [totpFactorId, setTotpFactorId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEnrolling2FA, setIsEnrolling2FA] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<"setup" | "verify">("setup");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const [{ data: { user } }, usage, iosCreds, replySettings, notificationSettings] = await Promise.all([
          supabase.auth.getUser(),
          getPlanUsage(),
          getIOSCredentials(),
          getReplySettings(),
          getNotificationSettings(),
        ]);
        setUser(user);
        setPlanUsage(usage);
        setIosCredentials(iosCreds);

        // Check if user logged in with OAuth (Google, GitHub, etc.)
        if (user) {
          const provider = user.app_metadata?.provider;
          if (provider && provider !== "email") {
            setIsOAuthUser(true);
            setAuthProvider(provider);
          }
        }

        // Set tone settings from database or defaults
        if (replySettings) {
          setTone5Star(replySettings.tone_5_star);
          setTone4Star(replySettings.tone_4_star);
          setTone3Star(replySettings.tone_3_star);
          setTone2Star(replySettings.tone_2_star);
          setTone1Star(replySettings.tone_1_star);
        }

        // Set notification settings from database or defaults
        if (notificationSettings) {
          setEmailNotifications(notificationSettings.email_notifications);
          setNewReviewAlerts(notificationSettings.new_review_alerts);
          setWeeklyReports(notificationSettings.weekly_reports);
        }

        // Check 2FA status
        const { data: factorsData } = await supabase.auth.mfa.listFactors();
        if (factorsData?.totp && factorsData.totp.length > 0) {
          const verifiedFactor = factorsData.totp.find(f => f.status === "verified");
          if (verifiedFactor) {
            setIs2FAEnabled(true);
            setTotpFactorId(verifiedFactor.id);
          }
        }
      } catch (error) {
        console.error("Error fetching settings data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenIOSCredentialsDialog = () => {
    // Pre-fill if credentials exist
    if (iosCredentials) {
      setIosIssuerId(iosCredentials.issuer_id);
      setIosKeyId(iosCredentials.key_id);
      setIosPrivateKey(""); // Don't pre-fill private key for security
    } else {
      setIosIssuerId("");
      setIosKeyId("");
      setIosPrivateKey("");
    }
    setIsIOSCredentialsDialogOpen(true);
  };

  const handleSaveIOSCredentials = async () => {
    if (!iosIssuerId.trim() || !iosKeyId.trim() || !iosPrivateKey.trim()) {
      toast.error("All fields are required");
      return;
    }

    setIsSavingIOSCredentials(true);
    const success = await saveIOSCredentials({
      issuer_id: iosIssuerId.trim(),
      key_id: iosKeyId.trim(),
      private_key: iosPrivateKey.trim(),
    });

    if (success) {
      const updatedCreds = await getIOSCredentials();
      setIosCredentials(updatedCreds);
      setIsIOSCredentialsDialogOpen(false);
      setIosPrivateKey(""); // Clear private key from state
      toast.success("iOS credentials saved successfully");
    } else {
      toast.error("Failed to save iOS credentials");
    }
    setIsSavingIOSCredentials(false);
  };

  const handleDeleteIOSCredentials = async () => {
    setIsDeletingIOSCredentials(true);
    const success = await deleteIOSCredentials();

    if (success) {
      setIosCredentials(null);
      toast.success("iOS credentials deleted");
    } else {
      toast.error("Failed to delete iOS credentials");
    }
    setIsDeletingIOSCredentials(false);
  };

  const handlePrivateKeyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".p8")) {
      toast.error("Please upload a .p8 file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setIosPrivateKey(content);
      toast.success("Private key file loaded");
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);
  };

  // Password change handler
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully");
        setIsPasswordDialogOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 2FA enrollment handler
  const handleEnroll2FA = async () => {
    setIsEnrolling2FA(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "PlayReply Authenticator",
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data) {
        setTotpSecret(data.totp.secret);
        setTotpQRCode(data.totp.qr_code);
        setTotpFactorId(data.id);
        setTwoFAStep("verify");
      }
    } catch (error) {
      toast.error("Failed to set up 2FA");
    } finally {
      setIsEnrolling2FA(false);
    }
  };

  // 2FA verification handler
  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setIsVerifying2FA(true);
    try {
      const supabase = createClient();

      // Create a challenge
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactorId,
      });

      if (challengeError) {
        toast.error(challengeError.message);
        return;
      }

      // Verify the challenge
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactorId,
        challengeId: challengeData.id,
        code: verificationCode,
      });

      if (verifyError) {
        toast.error("Invalid verification code");
        return;
      }

      toast.success("Two-factor authentication enabled!");
      setIs2FAEnabled(true);
      setIs2FADialogOpen(false);
      setVerificationCode("");
      setTwoFAStep("setup");
    } catch (error) {
      toast.error("Failed to verify 2FA");
    } finally {
      setIsVerifying2FA(false);
    }
  };

  // 2FA disable handler
  const handleDisable2FA = async () => {
    setIsDisabling2FA(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: totpFactorId,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Two-factor authentication disabled");
      setIs2FAEnabled(false);
      setTotpFactorId("");
    } catch (error) {
      toast.error("Failed to disable 2FA");
    } finally {
      setIsDisabling2FA(false);
    }
  };

  // Copy to clipboard handler
  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(totpSecret);
      toast.success("Secret copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Save notification settings
  const handleSaveNotificationSettings = async () => {
    setIsSavingNotificationSettings(true);
    const success = await saveNotificationSettings({
      email_notifications: emailNotifications,
      new_review_alerts: newReviewAlerts,
      weekly_reports: weeklyReports,
    });

    if (success) {
      toast.success("Notification settings saved");
    } else {
      toast.error("Failed to save notification settings");
    }
    setIsSavingNotificationSettings(false);
  };

  // Save tone settings
  const handleSaveToneSettings = async () => {
    setIsSavingToneSettings(true);
    const success = await saveReplySettings({
      tone_5_star: tone5Star,
      tone_4_star: tone4Star,
      tone_3_star: tone3Star,
      tone_2_star: tone2Star,
      tone_1_star: tone1Star,
    });

    if (success) {
      toast.success("AI reply settings saved");
    } else {
      toast.error("Failed to save AI reply settings");
    }
    setIsSavingToneSettings(false);
  };

  // Plan data from real usage
  const plan = {
    name: planUsage?.name || "Free",
    isPro: planUsage?.name === "Pro",
    repliesUsed: planUsage?.repliesUsed || 0,
    repliesLimit: planUsage?.repliesLimit || 50,
    appsUsed: planUsage?.appsUsed || 0,
    appsLimit: planUsage?.appsLimit || 2,
    nextBillingDate: null as string | null,
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // TODO: Save profile to database
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Settings saved");
  };

  const handleUpgrade = async (planType: "starter" | "pro" | "studio") => {
    try {
      await startCheckout(planType, user?.email, billingInterval);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout");
    }
  };

  const usagePercentage = (plan.repliesUsed / plan.repliesLimit) * 100;

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Account Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Account</CardTitle>
          </div>
          <CardDescription>
            Your personal account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2">
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="max-w-md"
              />
              <Badge variant="secondary">
                <Check className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              defaultValue={user?.email?.split("@")[0]}
              className="max-w-md"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveProfile} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      {/* Subscription Section */}
      <Card className={plan.isPro ? "border-primary/50" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle>Subscription</CardTitle>
            </div>
            <Badge variant={plan.isPro ? "default" : "secondary"}>
              {plan.isPro ? (
                <>
                  <Crown className="h-3 w-3 mr-1" />
                  Pro
                </>
              ) : (
                plan.name
              )}
            </Badge>
          </div>
          <CardDescription>
            Manage your subscription and billing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Usage */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Current Usage</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Replies</span>
                  <span className="font-medium">{plan.repliesUsed} / {plan.repliesLimit}</span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Connected Apps</span>
                  <span className="font-medium">{plan.appsUsed} / {plan.appsLimit}</span>
                </div>
                <Progress value={(plan.appsUsed / plan.appsLimit) * 100} className="h-2" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Plan comparison / upgrade */}
          {!plan.isPro && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Upgrade Your Plan</h4>
                {/* Billing interval toggle */}
                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setBillingInterval('monthly')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      billingInterval === 'monthly'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingInterval('yearly')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                      billingInterval === 'yearly'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Yearly
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      {YEARLY_DISCOUNT_MESSAGE}
                    </Badge>
                  </button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {/* Starter Plan - Popular */}
                <div className="rounded-lg border border-primary p-4 space-y-3 bg-primary/5 relative">
                  <Badge className="absolute -top-2 left-4">Popular</Badge>
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Starter</h5>
                    <div className="text-right">
                      {billingInterval === 'yearly' ? (
                        <>
                          <span className="text-2xl font-bold">${PLANS.starter.pricing.yearly.monthlyEquivalent.toFixed(0)}<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                          <p className="text-xs text-muted-foreground">billed ${PLANS.starter.pricing.yearly.price}/yr</p>
                        </>
                      ) : (
                        <span className="text-2xl font-bold">${PLANS.starter.pricing.monthly.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                      )}
                    </div>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> 4 apps
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> 500 AI replies/month
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> iOS + Android
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> Auto-reply
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade("starter")}
                    disabled={isCheckoutLoading}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {isCheckoutLoading ? "Loading..." : "Upgrade to Starter"}
                  </Button>
                </div>

                {/* Pro Plan */}
                <div className="rounded-lg border p-4 space-y-3 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Pro</h5>
                    <div className="text-right">
                      {billingInterval === 'yearly' ? (
                        <>
                          <span className="text-2xl font-bold">${PLANS.pro.pricing.yearly.monthlyEquivalent.toFixed(0)}<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                          <p className="text-xs text-muted-foreground">billed ${PLANS.pro.pricing.yearly.price}/yr</p>
                        </>
                      ) : (
                        <span className="text-2xl font-bold">${PLANS.pro.pricing.monthly.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                      )}
                    </div>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> 12 apps
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> 3,000 AI replies/month
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> iOS + Android
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> Auto-reply
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleUpgrade("pro")}
                    disabled={isCheckoutLoading}
                  >
                    {isCheckoutLoading ? "Loading..." : "Upgrade to Pro"}
                  </Button>
                </div>

                {/* Studio Plan */}
                <div className="rounded-lg border p-4 space-y-3 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Studio</h5>
                    <div className="text-right">
                      {billingInterval === 'yearly' ? (
                        <>
                          <span className="text-2xl font-bold">${PLANS.studio.pricing.yearly.monthlyEquivalent.toFixed(0)}<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                          <p className="text-xs text-muted-foreground">billed ${PLANS.studio.pricing.yearly.price}/yr</p>
                        </>
                      ) : (
                        <span className="text-2xl font-bold">${PLANS.studio.pricing.monthly.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                      )}
                    </div>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> 30+ apps
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> 10,000 AI replies/month
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> iOS + Android
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> Auto-reply
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> Priority support
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleUpgrade("studio")}
                    disabled={isCheckoutLoading}
                  >
                    {isCheckoutLoading ? "Loading..." : "Upgrade to Studio"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {plan.isPro && plan.nextBillingDate && (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Next billing date</p>
                <p className="text-sm text-muted-foreground">{plan.nextBillingDate}</p>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure how you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your account
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Review Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new reviews come in
              </p>
            </div>
            <Switch
              checked={newReviewAlerts}
              onCheckedChange={setNewReviewAlerts}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">
                Receive weekly summary of your review activity
              </p>
            </div>
            <Switch
              checked={weeklyReports}
              onCheckedChange={setWeeklyReports}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button onClick={handleSaveNotificationSettings} disabled={isSavingNotificationSettings}>
            {isSavingNotificationSettings ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Notification Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* AI Reply Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Reply Settings</CardTitle>
          </div>
          <CardDescription>
            Configure the tone of AI-generated replies based on review rating.
            Different tones work better for different types of reviews.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info box */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>How it works:</strong> The AI adapts its response style based on the review&apos;s star rating.
              Positive reviews get an appreciative tone, while negative reviews get an empathetic, problem-solving approach.
            </p>
          </div>

          {/* Reply Language - Static info */}
          <div className="flex items-center gap-3 py-3 border-b">
            <span className="text-lg">🌐</span>
            <div>
              <p className="font-medium text-sm">Reply Language</p>
              <p className="text-sm text-muted-foreground">
                Auto-detect — Replies are generated in the same language as the review
              </p>
            </div>
          </div>

          {/* 5-Star */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="tone-5" className="flex items-center gap-2">
                <span className="text-yellow-500">★★★★★</span>
                <span>5-Star Reviews</span>
              </Label>
            </div>
            <Select value={tone5Star} onValueChange={setTone5Star}>
              <SelectTrigger className="max-w-md" id="tone-5">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {POSITIVE_TONE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4-Star */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="tone-4" className="flex items-center gap-2">
                <span className="text-yellow-500">★★★★</span>
                <span className="text-muted-foreground">☆</span>
                <span>4-Star Reviews</span>
              </Label>
            </div>
            <Select value={tone4Star} onValueChange={setTone4Star}>
              <SelectTrigger className="max-w-md" id="tone-4">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {POSITIVE_TONE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3-Star */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="tone-3" className="flex items-center gap-2">
                <span className="text-yellow-500">★★★</span>
                <span className="text-muted-foreground">☆☆</span>
                <span>3-Star Reviews</span>
              </Label>
            </div>
            <Select value={tone3Star} onValueChange={setTone3Star}>
              <SelectTrigger className="max-w-md" id="tone-3">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {NEUTRAL_TONE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2-Star */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="tone-2" className="flex items-center gap-2">
                <span className="text-yellow-500">★★</span>
                <span className="text-muted-foreground">☆☆☆</span>
                <span>2-Star Reviews</span>
              </Label>
            </div>
            <Select value={tone2Star} onValueChange={setTone2Star}>
              <SelectTrigger className="max-w-md" id="tone-2">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {NEGATIVE_TONE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 1-Star */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="tone-1" className="flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                <span className="text-muted-foreground">☆☆☆☆</span>
                <span>1-Star Reviews</span>
              </Label>
            </div>
            <Select value={tone1Star} onValueChange={setTone1Star}>
              <SelectTrigger className="max-w-md" id="tone-1">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {NEGATIVE_TONE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveToneSettings} disabled={isSavingToneSettings}>
            {isSavingToneSettings ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Tone Settings"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">
                {isOAuthUser
                  ? `Signed in with ${authProvider === "google" ? "Google" : authProvider}`
                  : "Change your password"
                }
              </p>
            </div>
            {isOAuthUser ? (
              <Badge variant="secondary">
                {authProvider === "google" && (
                  <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                No password
              </Badge>
            ) : (
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
                Change Password
              </Button>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                {is2FAEnabled
                  ? "Your account is protected with 2FA"
                  : "Add an extra layer of security"
                }
              </p>
            </div>
            {is2FAEnabled ? (
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisable2FA}
                  disabled={isDisabling2FA}
                >
                  {isDisabling2FA ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Disable"
                  )}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIs2FADialogOpen(true)}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Enable 2FA
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your new password below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 6 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPasswordDialogOpen(false);
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={!newPassword || !confirmPassword || isChangingPassword}
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Setup Dialog */}
      <Dialog open={is2FADialogOpen} onOpenChange={(open) => {
        setIs2FADialogOpen(open);
        if (!open) {
          setTwoFAStep("setup");
          setVerificationCode("");
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Two-Factor Authentication
            </DialogTitle>
            <DialogDescription>
              {twoFAStep === "setup"
                ? "Scan the QR code with your authenticator app"
                : "Enter the 6-digit code from your authenticator app"
              }
            </DialogDescription>
          </DialogHeader>

          {twoFAStep === "setup" && !totpQRCode && (
            <div className="py-8 flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground text-center">
                Use an authenticator app like Google Authenticator, Authy, or 1Password to add an extra layer of security.
              </p>
              <Button onClick={handleEnroll2FA} disabled={isEnrolling2FA}>
                {isEnrolling2FA ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Set Up 2FA"
                )}
              </Button>
            </div>
          )}

          {twoFAStep === "verify" && totpQRCode && (
            <div className="space-y-4 py-4">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={totpQRCode}
                    alt="2FA QR Code"
                    className="w-48 h-48"
                  />
                </div>
              </div>

              {/* Manual entry option */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">
                  Can&apos;t scan? Enter this code manually:
                </p>
                <div className="flex items-center gap-2 justify-center">
                  <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    {totpSecret}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopySecret}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Verification code input */}
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-lg tracking-widest font-mono"
                  maxLength={6}
                />
              </div>
            </div>
          )}

          {twoFAStep === "verify" && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIs2FADialogOpen(false);
                  setTwoFAStep("setup");
                  setVerificationCode("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleVerify2FA}
                disabled={verificationCode.length !== 6 || isVerifying2FA}
              >
                {isVerifying2FA ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Enable"
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* iOS Credentials Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle>iOS App Store Connect</CardTitle>
          </div>
          <CardDescription>
            Configure your App Store Connect API credentials for iOS app review management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {iosCredentials ? (
            // Credentials configured
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Credentials Configured
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your iOS apps can sync reviews from the App Store
                  </p>
                </div>
              </div>

              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Issuer ID</span>
                  <code className="px-2 py-0.5 rounded bg-muted font-mono text-xs">
                    {iosCredentials.issuer_id}
                  </code>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Key ID</span>
                  <code className="px-2 py-0.5 rounded bg-muted font-mono text-xs">
                    {iosCredentials.key_id}
                  </code>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Private Key</span>
                  <Badge variant="secondary">
                    <Check className="h-3 w-3 mr-1" />
                    Encrypted
                  </Badge>
                </div>
              </div>

              {/* Security info for configured credentials */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-200">
                  <Shield className="h-4 w-4" />
                  Security Information
                </div>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Your private key is encrypted at rest and never shared</li>
                  <li>• Used only to fetch reviews and post replies to App Store</li>
                  <li>• You can revoke this key anytime from App Store Connect</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={handleOpenIOSCredentialsDialog}>
                  Update Credentials
                </Button>
                <Button
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDeleteIOSCredentials}
                  disabled={isDeletingIOSCredentials}
                >
                  {isDeletingIOSCredentials ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Remove
                </Button>
              </div>

              {/* Revoke instructions */}
              <p className="text-xs text-muted-foreground">
                To revoke access: Go to{" "}
                <a
                  href="https://appstoreconnect.apple.com/access/integrations/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  App Store Connect → API Keys
                </a>
                {" "}and click &quot;Revoke&quot; next to your key.
              </p>
            </div>
          ) : (
            // No credentials configured
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Not Configured
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Add your App Store Connect API credentials to sync iOS app reviews
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                <h4 className="font-medium text-sm">How to get your credentials:</h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>
                    Go to{" "}
                    <a
                      href="https://appstoreconnect.apple.com/access/integrations/api"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      App Store Connect → Users and Access → Integrations
                    </a>
                  </li>
                  <li>Select &quot;App Store Connect API&quot; → &quot;Team Keys&quot;</li>
                  <li>Click &quot;+&quot; to generate a new key with <strong>App Manager</strong> role (minimum required)</li>
                  <li>Download the .p8 private key file (can only be downloaded once!)</li>
                  <li>Note your Issuer ID and Key ID</li>
                </ol>
              </div>

              {/* Security explanation */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-200">
                  <Shield className="h-4 w-4" />
                  How We Protect Your Credentials
                </div>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 mt-0.5 shrink-0" />
                    <span><strong>Encrypted storage:</strong> Your private key is encrypted at rest using industry-standard encryption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 mt-0.5 shrink-0" />
                    <span><strong>Secure transmission:</strong> All data is transmitted over TLS/SSL encrypted connections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 mt-0.5 shrink-0" />
                    <span><strong>Limited use:</strong> Credentials are only used to fetch reviews and post your approved replies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 mt-0.5 shrink-0" />
                    <span><strong>You stay in control:</strong> Revoke access anytime from App Store Connect</span>
                  </li>
                </ul>
              </div>

              <Button onClick={handleOpenIOSCredentialsDialog}>
                <Key className="h-4 w-4 mr-2" />
                Add Credentials
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* iOS Credentials Dialog */}
      <Dialog open={isIOSCredentialsDialogOpen} onOpenChange={setIsIOSCredentialsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              App Store Connect API Credentials
            </DialogTitle>
            <DialogDescription>
              {iosCredentials
                ? "Update your App Store Connect API credentials"
                : "Enter your App Store Connect API credentials to enable iOS review sync"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="issuer-id">Issuer ID</Label>
              <Input
                id="issuer-id"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={iosIssuerId}
                onChange={(e) => setIosIssuerId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Found at the top of the API Keys page in App Store Connect
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="key-id">Key ID</Label>
              <Input
                id="key-id"
                placeholder="XXXXXXXXXX"
                value={iosKeyId}
                onChange={(e) => setIosKeyId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The 10-character identifier for your API key
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="private-key">Private Key (.p8 file)</Label>
              {iosPrivateKey ? (
                // Private key loaded - show compact success state
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900">
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                      <Check className="h-4 w-4" />
                      <span>Private key loaded ({iosPrivateKey.length} characters)</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => setIosPrivateKey("")}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              ) : (
                // No private key - show upload button and textarea
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("p8-file-input")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload .p8 File
                  </Button>
                  <input
                    id="p8-file-input"
                    type="file"
                    accept=".p8"
                    className="hidden"
                    onChange={handlePrivateKeyFileUpload}
                  />
                  <div className="relative">
                    <p className="text-xs text-muted-foreground text-center py-1">or paste manually</p>
                    <Textarea
                      id="private-key"
                      placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                      value={iosPrivateKey}
                      onChange={(e) => setIosPrivateKey(e.target.value)}
                      className="min-h-[80px] font-mono text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Security info in dialog */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-blue-800 dark:text-blue-200">
                <Shield className="h-3.5 w-3.5" />
                Your Credentials Are Safe
              </div>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Encrypted at rest, transmitted over TLS/SSL</li>
                <li>• Only used to sync reviews and post replies</li>
                <li>• Revoke anytime from App Store Connect</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsIOSCredentialsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveIOSCredentials}
              disabled={!iosIssuerId.trim() || !iosKeyId.trim() || !iosPrivateKey.trim() || isSavingIOSCredentials}
            >
              {isSavingIOSCredentials ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Credentials"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
