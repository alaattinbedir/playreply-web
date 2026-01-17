import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://playreply.com";

  return {
    rules: [
      {
        // Default: Allow all search engines
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/callback"],
      },
      {
        // ChatGPT Search - Allow indexing
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      {
        // ChatGPT real-time user requests - Allow
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        // Perplexity AI - Allow
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        // Google AI Overview - Allow
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        // OpenAI model training - Block (optional: don't want content used for training)
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        // Anthropic training - Block
        userAgent: "anthropic-ai",
        disallow: "/",
      },
      {
        // Google AI training - Block
        userAgent: "Google-Extended",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
