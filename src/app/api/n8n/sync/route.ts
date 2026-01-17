import { NextResponse } from "next/server";

const N8N_WEBHOOK_BASE_URL = process.env.N8N_WEBHOOK_BASE_URL || "https://mobixo.app.n8n.cloud/webhook";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { package_name, platform } = body;

    if (!package_name) {
      return NextResponse.json(
        { error: "package_name is required" },
        { status: 400 }
      );
    }

    // Use correct workflow based on platform
    const endpoint = platform === "ios" ? "fetch-ios-reviews" : "fetch-reviews";

    const response = await fetch(`${N8N_WEBHOOK_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ package_name, platform }),
    });

    const data = await response.text();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error calling n8n webhook:", error);
    return NextResponse.json(
      { error: "Failed to sync reviews" },
      { status: 500 }
    );
  }
}
