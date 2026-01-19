import Link from "next/link";
import { MessageSquare } from "lucide-react";

export const metadata = {
  title: "Terms of Service - PlayReply",
  description: "Terms of Service for PlayReply - AI-powered review responses for Google Play & App Store",
};

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 16, 2025</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using PlayReply (&quot;Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our Service. PlayReply is operated by
              PlayReply (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              PlayReply is a SaaS platform that uses artificial intelligence (Claude AI) to automatically
              generate professional responses to Google Play Store and iOS App Store reviews. Our service helps mobile
              app developers save time by creating personalized, multi-language replies to user reviews.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
            <p className="text-muted-foreground leading-relaxed">
              To use our Service, you must create an account and provide accurate information. You are
              responsible for maintaining the security of your account credentials and for all activities
              that occur under your account. You must notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payments</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              PlayReply offers various subscription plans with different features and usage limits:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Free Plan: Limited features, 50 AI replies per month</li>
              <li>Starter Plan ($29/month): 6 apps, 1,500 AI replies per month</li>
              <li>Pro Plan ($99/month): 20 apps, 10,000 AI replies per month, team features</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Payments are processed securely through Paddle. Subscriptions automatically renew unless
              cancelled before the renewal date. Prices are subject to change with 30 days notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Refund Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We offer a 14-day money-back guarantee for new subscriptions. If you are not satisfied
              with our Service within the first 14 days, contact us for a full refund. After 14 days,
              refunds are provided at our discretion. Refunds are processed through Paddle within 5-10
              business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree not to use our Service to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Generate spam, misleading, or fraudulent review responses</li>
              <li>Attempt to manipulate app ratings or reviews</li>
              <li>Infringe on intellectual property rights</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Access accounts or data belonging to others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. AI-Generated Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Service uses AI (Claude by Anthropic) to generate review responses. While we strive
              for accuracy and professionalism, AI-generated content may occasionally contain errors.
              You are responsible for reviewing and approving all responses before they are sent. We
              recommend using our manual approval feature for important communications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Platform Integrations</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Service integrates with Google Play Console API and Apple App Store Connect API.
              You must have proper authorization to manage the apps you connect to PlayReply.
              You are responsible for complying with Google Play Developer policies and Apple App Store
              Review Guidelines when using our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service, including its original content, features, and functionality, is owned by
              PlayReply and is protected by international copyright, trademark, and other intellectual
              property laws. You retain ownership of your data and content submitted to our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, PlayReply shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including loss of profits, data,
              or business opportunities, arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Service Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted access to the
              Service. We may perform maintenance or updates that temporarily affect availability.
              We will provide notice when possible for scheduled maintenance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account at any time for violations of these Terms.
              You may cancel your subscription at any time through your account settings. Upon
              termination, your right to use the Service will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of
              significant changes via email or through the Service. Continued use after changes
              constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-muted-foreground mt-2">
              Email: <a href="mailto:support@playreply.com" className="text-primary hover:underline">support@playreply.com</a>
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
