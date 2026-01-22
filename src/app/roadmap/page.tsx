import Link from "next/link";
import { MessageSquare, CheckCircle2, Clock, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Roadmap - PlayReply",
  description: "See what's coming next for PlayReply - Our product roadmap and upcoming features",
};

const roadmapItems = [
  {
    status: "completed",
    quarter: "Q1 2025",
    title: "Foundation",
    items: [
      { text: "Google Play Console integration", done: true },
      { text: "AI-powered reply generation", done: true },
      { text: "Multi-language support", done: true },
      { text: "iOS App Store support", done: true },
      { text: "Paddle payment integration", done: true },
    ],
  },
  {
    status: "in-progress",
    quarter: "Q1-Q2 2025",
    title: "Enhanced Analytics",
    items: [
      { text: "Advanced sentiment analysis", done: false },
      { text: "Rating trend charts", done: false },
      { text: "Response time metrics", done: false },
      { text: "Export reports to PDF/CSV", done: false },
    ],
  },
  {
    status: "planned",
    quarter: "Q2 2025",
    title: "Team Collaboration",
    items: [
      { text: "Team member invitations", done: false },
      { text: "Role-based permissions", done: false },
      { text: "Review assignment", done: false },
      { text: "Activity logs", done: false },
    ],
  },
  {
    status: "planned",
    quarter: "Q3 2025",
    title: "Advanced Automation",
    items: [
      { text: "Custom reply templates", done: false },
      { text: "Scheduled replies", done: false },
      { text: "Webhook integrations", done: false },
      { text: "Slack/Discord notifications", done: false },
    ],
  },
  {
    status: "considering",
    quarter: "Future",
    title: "Under Consideration",
    items: [
      { text: "API access for developers", done: false },
      { text: "White-label solution", done: false },
      { text: "Mobile app", done: false },
      { text: "Browser extension", done: false },
    ],
  },
];

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  completed: {
    icon: CheckCircle2,
    color: "text-green-600 bg-green-500/10 border-green-500/20",
    label: "Completed",
  },
  "in-progress": {
    icon: Clock,
    color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    label: "In Progress",
  },
  planned: {
    icon: Clock,
    color: "text-orange-600 bg-orange-500/10 border-orange-500/20",
    label: "Planned",
  },
  considering: {
    icon: Lightbulb,
    color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    label: "Considering",
  },
};

export default function RoadmapPage() {
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
        <h1 className="text-4xl font-bold mb-4">Product Roadmap</h1>
        <p className="text-xl text-muted-foreground mb-8">
          See what we&apos;re working on and what&apos;s coming next.
        </p>

        <div className="flex flex-wrap gap-3 mb-12">
          {Object.entries(statusConfig).map(([key, config]) => (
            <Badge key={key} variant="outline" className={config.color}>
              <config.icon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          ))}
        </div>

        <div className="space-y-6">
          {roadmapItems.map((section, index) => {
            const config = statusConfig[section.status];
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <CardDescription>{section.quarter}</CardDescription>
                    </div>
                    <Badge variant="outline" className={config.color}>
                      <config.icon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-3">
                        {item.done ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted flex-shrink-0" />
                        )}
                        <span className={item.done ? "text-muted-foreground" : ""}>
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-lg border bg-muted/30">
          <h2 className="text-lg font-semibold mb-2">Have a feature request?</h2>
          <p className="text-muted-foreground">
            We&apos;d love to hear your ideas! Send us an email at{" "}
            <a href="mailto:support@mobixo.ai" className="text-primary hover:underline">
              support@mobixo.ai
            </a>{" "}
            with your suggestions.
          </p>
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
