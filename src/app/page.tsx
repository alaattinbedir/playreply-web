import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Zap,
  Globe,
  Shield,
  BarChart3,
  Clock,
  Check,
  Star,
  ArrowRight,
  Sparkles,
  Play,
  ChevronRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg group-hover:bg-primary/30 transition-colors" />
              <MessageSquare className="h-7 w-7 text-primary relative" />
            </div>
            <span className="font-bold text-xl">PlayReply</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                Get Started
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

          <div className="container relative py-24 md:py-32 lg:py-40 space-y-8">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Animated Badge */}
              <Badge variant="secondary" className="px-4 py-2 text-sm border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-default animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Sparkles className="h-4 w-4 mr-2 text-primary animate-pulse" />
                Powered by Claude AI
                <ArrowRight className="h-3 w-3 ml-2" />
              </Badge>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
                Respond to Google Play Reviews with{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                    AI Intelligence
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 150 4 298 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/30"/>
                  </svg>
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                Save hours every week. PlayReply automatically generates personalized,
                professional responses to your app reviews in 11+ languages.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8 text-base gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base gap-2 hover:bg-muted/50 group">
                    <Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <p className="text-sm text-muted-foreground pt-2 flex items-center gap-4 animate-in fade-in duration-700 delay-700">
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  50 free replies/month
                </span>
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
              {[
                { value: "10K+", label: "Reviews Replied", icon: MessageSquare },
                { value: "11", label: "Languages Supported", icon: Globe },
                { value: "<2min", label: "Avg Response Time", icon: Clock },
                { value: "4.8", label: "User Satisfaction", icon: Star },
              ].map((stat, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative text-center p-6 rounded-2xl border bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                    <stat.icon className="h-5 w-5 text-primary mx-auto mb-2 opacity-60" />
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {stat.value}{stat.label === "User Satisfaction" && <span className="text-primary">★</span>}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

          <div className="container relative space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4">Features</Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Everything You Need to{" "}
                <span className="text-primary">Manage Reviews</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                From automatic reply generation to analytics, PlayReply handles it all
                so you can focus on building great apps.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: "AI-Powered Replies",
                  description: "Claude AI generates contextual, empathetic responses based on review content, rating, and sentiment.",
                  gradient: "from-yellow-500/20 to-orange-500/20"
                },
                {
                  icon: Globe,
                  title: "Multi-Language Support",
                  description: "Automatically detect and respond in 11+ languages including English, Turkish, German, Spanish, and more.",
                  gradient: "from-blue-500/20 to-cyan-500/20"
                },
                {
                  icon: Shield,
                  title: "Smart Moderation",
                  description: "Built-in policy guard ensures responses are professional, avoiding rating manipulation requests.",
                  gradient: "from-green-500/20 to-emerald-500/20"
                },
                {
                  icon: BarChart3,
                  title: "Review Analytics",
                  description: "Track response times, rating trends, and sentiment distribution across all your apps.",
                  gradient: "from-purple-500/20 to-pink-500/20"
                },
                {
                  icon: Clock,
                  title: "Auto-Approval",
                  description: "Set rules to automatically approve and send replies for positive reviews, saving even more time.",
                  gradient: "from-red-500/20 to-rose-500/20"
                },
                {
                  icon: Star,
                  title: "Review Classification",
                  description: "Automatically categorize reviews as bugs, feature requests, praise, or complaints for better insights.",
                  gradient: "from-indigo-500/20 to-violet-500/20"
                }
              ].map((feature, index) => (
                <Card key={index} className="group relative overflow-hidden border-muted/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <CardHeader className="relative">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

          <div className="container relative space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4">Pricing</Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Simple, <span className="text-primary">Transparent</span> Pricing
              </h2>
              <p className="text-lg text-muted-foreground">
                Start free, upgrade when you need more. No hidden fees, cancel anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {/* Free Plan */}
              <Card className="relative hover:border-muted-foreground/30 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-8">
                  <CardTitle className="text-xl">Free</CardTitle>
                  <CardDescription>Perfect for trying out</CardDescription>
                  <div className="pt-4">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {["1 app", "50 AI replies/month", "Manual approval only", "Basic analytics", "Community support"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/signup" className="w-full">
                    <Button variant="outline" className="w-full h-11">Get Started</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Starter Plan - Popular */}
              <Card className="relative border-primary shadow-xl shadow-primary/10 scale-105 z-10">
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="px-4 py-1 shadow-lg">Most Popular</Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-lg" />
                <CardHeader className="relative pb-8">
                  <CardTitle className="text-xl">Starter</CardTitle>
                  <CardDescription>For growing apps</CardDescription>
                  <div className="pt-4">
                    <span className="text-5xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <ul className="space-y-3">
                    {["3 apps", "500 AI replies/month", "Auto-approval rules", "Review classification", "Email support", "Priority queue"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="relative">
                  <Link href="/signup?plan=starter" className="w-full">
                    <Button className="w-full h-11 shadow-lg shadow-primary/25">Start Free Trial</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className="relative hover:border-muted-foreground/30 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-8">
                  <CardTitle className="text-xl">Pro</CardTitle>
                  <CardDescription>For teams & agencies</CardDescription>
                  <div className="pt-4">
                    <span className="text-5xl font-bold">$99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {["10 apps", "2,000 AI replies/month", "Team members (3 seats)", "Advanced analytics", "Priority support", "Custom templates"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/signup?plan=pro" className="w-full">
                    <Button variant="outline" className="w-full h-11">Start Free Trial</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground">
                Need more? <Link href="/contact" className="text-primary hover:underline font-medium">Contact us</Link> for Enterprise pricing.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-24">
          <Card className="relative overflow-hidden border-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
            <CardContent className="relative flex flex-col items-center text-center py-16 md:py-20 space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground max-w-2xl">
                Ready to Save Hours on Review Replies?
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-xl">
                Join thousands of developers who use PlayReply to respond faster,
                improve ratings, and keep users happy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="h-12 px-8 text-base gap-2 shadow-xl hover:scale-105 transition-transform">
                    Start Your Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button size="lg" variant="ghost" className="h-12 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">PlayReply</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                AI-powered review responses for Google Play developers. Save time, improve ratings.
              </p>
              <div className="flex gap-4 mt-6">
                <Link href="https://twitter.com/playreply" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </Link>
                <Link href="https://github.com/playreply" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/changelog" className="hover:text-foreground transition-colors">Changelog</Link></li>
                <li><Link href="/roadmap" className="hover:text-foreground transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PlayReply. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with <span className="text-red-500">♥</span> for app developers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
