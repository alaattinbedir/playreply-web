import { NextResponse } from "next/server";

const N8N_WEBHOOK_BASE_URL = process.env.N8N_WEBHOOK_BASE_URL || "https://n8n-production-d1805.up.railway.app/webhook";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { app_id, csv_content, platform } = body;

    if (!app_id) {
      return NextResponse.json(
        { error: "app_id is required" },
        { status: 400 }
      );
    }

    if (!csv_content) {
      return NextResponse.json(
        { error: "csv_content is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${N8N_WEBHOOK_BASE_URL}/import-reviews-csv`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id,
        csv_content,
        platform: platform || "android",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("n8n webhook error:", errorText);
      return NextResponse.json(
        { error: "Failed to import reviews" },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling n8n import-csv webhook:", error);
    return NextResponse.json(
      { error: "Failed to import reviews" },
      { status: 500 }
    );
  }
}
