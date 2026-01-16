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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCheckout } from "@/components/paddle-provider";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function SettingsPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { startCheckout, isLoading: isCheckoutLoading } = useCheckout();

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [newReviewAlerts, setNewReviewAlerts] = useState(true);
  const [replyTone, setReplyTone] = useState("professional");
  const [replyLanguage, setReplyLanguage] = useState("auto");

  // Mock plan data - will come from database
  const plan = {
    name: "Free",
    isPro: false,
    repliesUsed: 12,
    repliesLimit: 50,
    appsUsed: 0,
    appsLimit: 1,
    nextBillingDate: null as string | null,
  };

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // TODO: Save profile to database
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleUpgrade = async (planType: "starter" | "pro") => {
    try {
      await startCheckout(planType);
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const usagePercentage = (plan.repliesUsed / plan.repliesLimit) * 100;

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
              <h4 className="text-sm font-medium">Upgrade Your Plan</h4>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Starter Plan */}
                <div className="rounded-lg border p-4 space-y-3 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Starter</h5>
                    <span className="text-2xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> 3 apps
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> 500 AI replies/month
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> Auto-approval rules
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleUpgrade("starter")}
                    disabled={isCheckoutLoading}
                  >
                    {isCheckoutLoading ? "Loading..." : "Upgrade to Starter"}
                  </Button>
                </div>

                {/* Pro Plan */}
                <div className="rounded-lg border border-primary p-4 space-y-3 bg-primary/5 relative">
                  <Badge className="absolute -top-2 left-4">Popular</Badge>
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Pro</h5>
                    <span className="text-2xl font-bold">$99<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> 10 apps
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> 2,000 AI replies/month
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> Team members (3 seats)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-primary" /> Advanced analytics
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade("pro")}
                    disabled={isCheckoutLoading}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {isCheckoutLoading ? "Loading..." : "Upgrade to Pro"}
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
      </Card>

      {/* AI Reply Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Reply Settings</CardTitle>
          </div>
          <CardDescription>
            Customize how AI generates your replies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Reply Tone</Label>
            <Select value={replyTone} onValueChange={setReplyTone}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This affects the writing style of AI-generated replies
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Reply Language</Label>
            <Select value={replyLanguage} onValueChange={setReplyLanguage}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect (match review language)</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="tr">Turkish</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Language used for generating replies. Auto-detect will match the review language.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveProfile} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Preferences"}
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
                Change your password
              </p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>

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
