import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Apps", href: "/apps", icon: AppWindow },
  { name: "Reviews", href: "/reviews", icon: MessageCircle },
  { name: "Settings", href: "/settings", icon: Settings },
];

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userEmail = user.email || "";
  const userInitials = userEmail.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-muted/30">
        <div className="flex flex-col flex-1">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">PlayReply</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User menu at bottom */}
          <div className="p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-2"
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm">{userEmail}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={signOut}>
                  <DropdownMenuItem asChild>
                    <button type="submit" className="w-full cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">PlayReply</span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col space-y-1 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-4 left-4 right-4">
                <form action={signOut}>
                  <Button variant="outline" className="w-full" type="submit">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:pl-64">
        <div className="pt-16 md:pt-0">{children}</div>
      </main>
    </div>
  );
}
