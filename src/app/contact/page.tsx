import Link from "next/link";
import { MessageSquare, Mail, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact - PlayReply",
  description: "Get in touch with PlayReply - We're here to help with your app review management needs",
};

export default function ContactPage() {
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
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Have questions? We&apos;re here to help. Reach out to us through any of the channels below.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    For general inquiries and support
                  </p>
                  <a
                    href="mailto:support@mobixo.ai"
                    className="text-primary hover:underline font-medium"
                  >
                    support@mobixo.ai
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Response Time</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    We typically respond within
                  </p>
                  <p className="font-medium">24 hours on business days</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Location</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    We&apos;re a remote-first company
                  </p>
                  <p className="font-medium">Operating globally</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">How do I get started?</h4>
                <p className="text-sm text-muted-foreground">
                  Sign up for a free account at{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    playreply.com/signup
                  </Link>
                  . You&apos;ll get 50 free AI replies per month.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Do you offer refunds?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, we offer a 14-day money-back guarantee for all paid plans.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Which platforms are supported?</h4>
                <p className="text-sm text-muted-foreground">
                  PlayReply supports both Google Play Store and Apple App Store.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Can I cancel anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel your subscription at any time from your account settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Other Ways to Reach Us</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong>Social Media:</strong> Follow us on{" "}
                <a
                  href="https://twitter.com/playreply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Twitter/X
                </a>{" "}
                for updates and announcements.
              </p>
              <p>
                <strong>Feature Requests:</strong> Have an idea for PlayReply? We&apos;d love to hear it!
                Send your suggestions to{" "}
                <a href="mailto:support@mobixo.ai" className="text-primary hover:underline">
                  support@mobixo.ai
                </a>
              </p>
              <p>
                <strong>Bug Reports:</strong> Found a bug? Please email us with details and we&apos;ll
                investigate as soon as possible.
              </p>
            </div>
          </section>
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
