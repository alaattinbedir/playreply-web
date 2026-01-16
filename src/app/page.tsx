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
  Sparkles
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">PlayReply</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
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
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32 space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <Badge variant="secondary" className="px-4 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Claude AI
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
              Respond to Google Play Reviews with{" "}
              <span className="text-primary">AI Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Save hours every week. PlayReply automatically generates personalized,
              professional responses to your app reviews in 11+ languages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline">
                  See Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              No credit card required • 50 free replies/month
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Reviews Replied</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">11</div>
              <div className="text-sm text-muted-foreground">Languages Supported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">&lt;2min</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.8★</div>
              <div className="text-sm text-muted-foreground">User Satisfaction</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-24 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need to Manage Reviews
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From automatic reply generation to analytics, PlayReply handles it all.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI-Powered Replies</CardTitle>
                <CardDescription>
                  Claude AI generates contextual, empathetic responses based on review content,
                  rating, and sentiment.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Multi-Language Support</CardTitle>
                <CardDescription>
                  Automatically detect and respond in 11+ languages including English, Turkish,
                  German, Spanish, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Smart Moderation</CardTitle>
                <CardDescription>
                  Built-in policy guard ensures responses are professional, avoiding
                  rating manipulation requests.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Review Analytics</CardTitle>
                <CardDescription>
                  Track response times, rating trends, and sentiment distribution
                  across all your apps.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Auto-Approval</CardTitle>
                <CardDescription>
                  Set rules to automatically approve and send replies for positive reviews,
                  saving even more time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Review Classification</CardTitle>
                <CardDescription>
                  Automatically categorize reviews as bugs, feature requests, praise,
                  or complaints for better insights.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container py-24 space-y-12 bg-muted/50">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for trying out</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>1 app</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>50 AI replies/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Manual approval only</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Basic analytics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/signup" className="w-full">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Starter Plan */}
            <Card className="border-primary relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>For growing apps</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>3 apps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>500 AI replies/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Auto-approval rules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Review classification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Email support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/signup?plan=starter" className="w-full">
                  <Button className="w-full">Start Free Trial</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For teams & agencies</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>10 apps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>2,000 AI replies/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Team members (3 seats)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/signup?plan=pro" className="w-full">
                  <Button variant="outline" className="w-full">Start Free Trial</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">
              Need more? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for Enterprise pricing.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-24">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex flex-col items-center text-center py-12 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Save Hours on Review Replies?
              </h2>
              <p className="text-lg opacity-90 max-w-xl">
                Join developers who use PlayReply to respond faster,
                improve ratings, and keep users happy.
              </p>
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Your Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center space-x-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">PlayReply</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                AI-powered review responses for Google Play developers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/changelog" className="hover:text-foreground">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} PlayReply. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
