import Link from "next/link";
import { MessageSquare } from "lucide-react";

export const metadata = {
  title: "Cookie Policy - PlayReply",
  description: "Cookie Policy for PlayReply - Learn how we use cookies and similar technologies",
};

export default function CookiePolicyPage() {
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
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 22, 2025</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile)
              when you visit a website. They are widely used to make websites work more efficiently
              and to provide information to website owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              PlayReply uses cookies and similar technologies for several purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly, including authentication and security</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Performance Cookies:</strong> Help us improve website performance and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  These cookies are necessary for the website to function and cannot be switched off.
                  They are usually set in response to actions you take, such as logging in or filling out forms.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                  <li>Authentication cookies (Supabase)</li>
                  <li>Session management cookies</li>
                  <li>Security cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Analytics Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use analytics cookies to understand how visitors interact with our website.
                  This helps us improve our service and user experience.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                  <li>Vercel Analytics (anonymous usage data)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Payment Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you make a purchase, our payment processor (Paddle) may set cookies to
                  process your transaction securely.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Some cookies are placed by third-party services that appear on our pages:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Supabase:</strong> Authentication and database services</li>
              <li><strong>Paddle:</strong> Payment processing</li>
              <li><strong>Vercel:</strong> Website hosting and analytics</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              These third parties have their own privacy and cookie policies. We encourage you to
              review their policies for more information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can control and manage cookies in various ways:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies through their settings</li>
              <li><strong>Device Settings:</strong> Your mobile device may have settings to limit tracking</li>
              <li><strong>Opt-Out Tools:</strong> Some analytics services offer opt-out mechanisms</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Please note that blocking certain cookies may impact your experience on our website
              and limit the services we can offer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cookie Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies have varying lifespans:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-2">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain until they expire or you delete them (typically 30 days to 1 year)</li>
              <li><strong>Authentication Cookies:</strong> Valid for the duration of your login session</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices
              or for legal, operational, or regulatory reasons. We will notify you of any significant
              changes by posting the new policy on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about our use of cookies, please contact us at:
            </p>
            <p className="text-muted-foreground mt-2">
              Email: <a href="mailto:support@mobixo.ai" className="text-primary hover:underline">support@mobixo.ai</a>
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
