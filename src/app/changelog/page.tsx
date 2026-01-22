import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Changelog - PlayReply",
  description: "See what's new in PlayReply - Latest updates, features, and improvements",
};

const changelog = [
  {
    version: "1.2.0",
    date: "January 22, 2025",
    title: "Paddle Payment Integration",
    changes: [
      { type: "feature", text: "Added Paddle subscription payments" },
      { type: "feature", text: "New pricing plans: Starter ($9), Pro ($29), Studio ($79)" },
      { type: "feature", text: "14-day free trial for all paid plans" },
      { type: "improvement", text: "Updated Settings page with subscription management" },
    ],
  },
  {
    version: "1.1.0",
    date: "January 18, 2025",
    title: "iOS App Store Support",
    changes: [
      { type: "feature", text: "Added App Store Connect integration" },
      { type: "feature", text: "Fetch and reply to iOS app reviews" },
      { type: "feature", text: "Unified dashboard for both platforms" },
      { type: "improvement", text: "Platform badges on review cards" },
    ],
  },
  {
    version: "1.0.0",
    date: "January 12, 2025",
    title: "Initial Release",
    changes: [
      { type: "feature", text: "Google Play Console integration" },
      { type: "feature", text: "AI-powered reply generation with Claude" },
      { type: "feature", text: "Multi-language support (11+ languages)" },
      { type: "feature", text: "Auto-reply functionality" },
      { type: "feature", text: "Review categorization (bug, feature request, praise, complaint)" },
      { type: "feature", text: "Dashboard with analytics" },
    ],
  },
];

const typeColors: Record<string, string> = {
  feature: "bg-green-500/10 text-green-600 border-green-500/20",
  improvement: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  fix: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  security: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">PlayReply</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Changelog</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Stay up to date with the latest features, improvements, and fixes.
        </p>

        <div className="space-y-12">
          {changelog.map((release, index) => (
            <div key={index} className="relative pl-8 border-l-2 border-muted">
              <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary" />

              <div className="mb-4">
                <div className="flex items-center gap-3 mb-1">
                  <Badge variant="outline" className="font-mono">
                    v{release.version}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{release.date}</span>
                </div>
                <h2 className="text-2xl font-semibold">{release.title}</h2>
              </div>

              <ul className="space-y-2">
                {release.changes.map((change, changeIndex) => (
                  <li key={changeIndex} className="flex items-start gap-3">
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${typeColors[change.type]}`}
                    >
                      {change.type}
                    </Badge>
                    <span className="text-muted-foreground">{change.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PlayReply. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
