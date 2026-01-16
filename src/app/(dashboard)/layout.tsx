"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  LayoutDashboard,
  AppWindow,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  Sparkles,
  Crown,
  X,
  BarChart3,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Apps", href: "/apps", icon: AppWindow },
  { name: "Reviews", href: "/reviews", icon: MessageCircle },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const userEmail = user.email || "";
  const userInitials = userEmail.slice(0, 2).toUpperCase();

  // Mock plan data - will come from database later
  const plan = {
    name: "Free",
    isPro: false,
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-background">
        <div className="flex flex-col flex-1">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">PlayReply</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("mr-3 h-5 w-5", isActive && "text-primary-foreground")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade card */}
          {!plan.isPro && (
            <div className="px-3 py-4">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-4">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Upgrade to Pro</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Get 10 apps, 2000 replies/month & more
                  </p>
                  <Link href="/settings">
                    <Button size="sm" className="w-full">
                      <Sparkles className="mr-2 h-3 w-3" />
                      Upgrade
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* User menu at bottom */}
          <div className="p-3 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-2 h-auto py-2"
                >
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="truncate text-sm font-medium max-w-[140px]">
                      {userEmail.split("@")[0]}
                    </span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 mt-0.5">
                      {plan.name}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">My Account</p>
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">PlayReply</span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-16 px-4 border-b">
                  <span className="font-bold text-lg">Menu</span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href ||
                      (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                      <SheetClose key={item.name} asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>

                {/* Mobile upgrade card */}
                {!plan.isPro && (
                  <div className="px-3 py-4 border-t">
                    <div className="rounded-xl bg-gradient-to-br from-primary/10 to-background border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Upgrade to Pro</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Get 10 apps, 2000 replies/month & more
                      </p>
                      <SheetClose asChild>
                        <Link href="/settings">
                          <Button size="sm" className="w-full">
                            <Sparkles className="mr-2 h-3 w-3" />
                            Upgrade
                          </Button>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                )}

                {/* Mobile user info */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{userEmail}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {plan.name} Plan
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:pl-64">
        <div className="pt-16 md:pt-0 min-h-screen">{children}</div>
      </main>
    </div>
  );
}
