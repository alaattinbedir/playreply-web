import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PlayReply - AI-Powered Google Play Review Responses",
  description: "Automatically respond to Google Play reviews with AI. Save time, improve ratings, and delight your users with personalized, professional responses.",
  keywords: ["Google Play", "app reviews", "AI responses", "review management", "app store optimization"],
  authors: [{ name: "PlayReply" }],
  openGraph: {
    title: "PlayReply - AI-Powered Google Play Review Responses",
    description: "Automatically respond to Google Play reviews with AI. Save time, improve ratings, and delight your users.",
    url: "https://playreply.com",
    siteName: "PlayReply",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayReply - AI-Powered Google Play Review Responses",
    description: "Automatically respond to Google Play reviews with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
