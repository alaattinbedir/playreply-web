import Link from "next/link";
import { MessageSquare, Target, Heart, Zap } from "lucide-react";

export const metadata = {
  title: "About - PlayReply",
  description: "Learn about PlayReply - AI-powered review responses for Google Play & App Store",
};

export default function AboutPage() {
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
        <h1 className="text-4xl font-bold mb-4">About PlayReply</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Helping app developers build better relationships with their users through intelligent review management.
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              At PlayReply, we believe that every app review deserves a thoughtful response. Our mission is to
              empower app developers to maintain meaningful conversations with their users at scale, without
              sacrificing quality or authenticity.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We built PlayReply because we experienced the challenge firsthand. As mobile developers ourselves,
              we know how time-consuming it is to respond to hundreds of reviews across multiple apps and platforms.
              That&apos;s why we created an AI-powered solution that generates personalized, professional responses
              in seconds.
            </p>
          </section>

          <section className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Our Vision</h3>
              <p className="text-sm text-muted-foreground">
                To become the leading platform for app review management, helping developers worldwide
                improve their app ratings and user satisfaction.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Our Values</h3>
              <p className="text-sm text-muted-foreground">
                We prioritize authenticity, user privacy, and developer success. Every feature we build
                is designed to create genuine connections between apps and users.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Our Technology</h3>
              <p className="text-sm text-muted-foreground">
                Powered by Claude AI, PlayReply generates contextual, empathetic responses that sound
                human while maintaining your brand voice.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span><strong>Dual Platform Support:</strong> Manage both Google Play and App Store reviews from one dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span><strong>AI-Powered Replies:</strong> Generate personalized responses in seconds using advanced AI</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span><strong>Multi-Language Support:</strong> Respond in 11+ languages automatically</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span><strong>Smart Automation:</strong> Auto-approve and send replies based on your preferences</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">•</span>
                <span><strong>Analytics & Insights:</strong> Track review trends and response performance</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground leading-relaxed">
              Have questions or feedback? We&apos;d love to hear from you. Reach out to us at{" "}
              <a href="mailto:support@mobixo.ai" className="text-primary hover:underline">
                support@mobixo.ai
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact page
              </Link>.
            </p>
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
