import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PaddleProvider } from "@/components/paddle-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PlayReply - AI-Powered App Review Responses for Google Play & App Store",
  description: "Automatically respond to Google Play and iOS App Store reviews with AI. Save time, improve ratings, and delight your users with personalized, professional responses.",
  keywords: [
    "Google Play",
    "App Store",
    "iOS",
    "app reviews",
    "AI responses",
    "review management",
    "app store optimization",
    "ASO",
    "customer feedback",
    "review reply",
    "automated responses",
  ],
  authors: [{ name: "PlayReply" }],
  creator: "PlayReply",
  publisher: "PlayReply",
  metadataBase: new URL("https://playreply.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PlayReply - AI-Powered App Review Responses",
    description: "Automatically respond to Google Play and App Store reviews with AI. Save time, improve ratings, and delight your users.",
    url: "https://playreply.com",
    siteName: "PlayReply",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayReply - AI-Powered App Review Responses",
    description: "Automatically respond to app reviews with AI. Google Play & App Store supported.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Structured Data (Schema.org JSON-LD)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PlayReply",
  description:
    "AI-powered review response platform for Google Play and iOS App Store. Automatically generate personalized replies to user reviews.",
  url: "https://playreply.com",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: [
    {
      "@type": "Offer",
      name: "Free Plan",
      price: "0",
      priceCurrency: "USD",
      description: "2 apps, 50 AI replies/month, manual approval only",
    },
    {
      "@type": "Offer",
      name: "Starter Plan",
      price: "9",
      priceCurrency: "USD",
      description: "3 apps, 300 AI replies/month, 4-5 star auto-reply",
    },
    {
      "@type": "Offer",
      name: "Pro Plan",
      price: "29",
      priceCurrency: "USD",
      description: "10 apps, 2,000 AI replies/month, all ratings auto-reply, basic analytics",
    },
    {
      "@type": "Offer",
      name: "Studio Plan",
      price: "79",
      priceCurrency: "USD",
      description: "30+ apps, 10,000 AI replies/month, unlimited team, advanced analytics, priority support",
    },
  ],
  featureList: [
    "AI-powered review responses",
    "Google Play integration",
    "iOS App Store integration",
    "Multi-language support",
    "Customizable tone settings",
    "Auto-approval rules",
    "Team collaboration",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "50",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Structured Data - JSON-LD (safe: static content, not user input) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <PaddleProvider>
          {children}
          <Toaster />
        </PaddleProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
