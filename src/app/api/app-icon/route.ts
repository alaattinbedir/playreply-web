import { NextRequest, NextResponse } from "next/server";

interface AppIconResult {
  iconUrl: string | null;
  error?: string;
}

/**
 * Fetch app icon from iOS App Store using iTunes Search API
 */
async function fetchIOSIcon(bundleId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(bundleId)}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!response.ok) {
      console.error("iTunes API error:", response.status);
      return null;
    }

    const data = await response.json();

    if (data.resultCount > 0 && data.results[0]?.artworkUrl512) {
      return data.results[0].artworkUrl512;
    }

    // Fallback to smaller icon
    if (data.resultCount > 0 && data.results[0]?.artworkUrl100) {
      return data.results[0].artworkUrl100;
    }

    return null;
  } catch (error) {
    console.error("Error fetching iOS icon:", error);
    return null;
  }
}

/**
 * Fetch app icon from Google Play Store
 * Uses the Google Play Store page to extract the icon
 */
async function fetchAndroidIcon(packageName: string): Promise<string | null> {
  try {
    // Method 1: Try Google Play Store direct image URL pattern
    // This uses a known pattern for Google Play icons
    const directUrl = `https://play-lh.googleusercontent.com/`;

    // Method 2: Scrape from Google Play Store page
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageName)}&hl=en`;

    const response = await fetch(playStoreUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      console.error("Google Play page error:", response.status);
      return null;
    }

    const html = await response.text();

    // Look for the app icon in the HTML
    // Pattern 1: og:image meta tag
    const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (ogImageMatch && ogImageMatch[1]) {
      let iconUrl = ogImageMatch[1];
      // Ensure we get a larger version of the icon
      iconUrl = iconUrl.replace(/=w\d+-h\d+/, "=w512-h512");
      return iconUrl;
    }

    // Pattern 2: Look for play-lh.googleusercontent.com URLs
    const playLhMatch = html.match(/https:\/\/play-lh\.googleusercontent\.com\/[^"'\s]+/);
    if (playLhMatch) {
      let iconUrl = playLhMatch[0];
      // Clean up and resize
      iconUrl = iconUrl.split("=")[0] + "=w512-h512";
      return iconUrl;
    }

    return null;
  } catch (error) {
    console.error("Error fetching Android icon:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const packageName = searchParams.get("packageName");
  const platform = searchParams.get("platform") as "android" | "ios" | null;

  if (!packageName) {
    return NextResponse.json(
      { iconUrl: null, error: "packageName is required" },
      { status: 400 }
    );
  }

  if (!platform || !["android", "ios"].includes(platform)) {
    return NextResponse.json(
      { iconUrl: null, error: "platform must be 'android' or 'ios'" },
      { status: 400 }
    );
  }

  let iconUrl: string | null = null;

  if (platform === "ios") {
    iconUrl = await fetchIOSIcon(packageName);
  } else {
    iconUrl = await fetchAndroidIcon(packageName);
  }

  const result: AppIconResult = {
    iconUrl,
    error: iconUrl ? undefined : "Icon not found",
  };

  return NextResponse.json(result);
}
