import { NextResponse } from "next/server";

const N8N_WEBHOOK_BASE_URL = process.env.N8N_WEBHOOK_BASE_URL || "https://mobixo.app.n8n.cloud/webhook";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { app_id, bucket_id, package_name, year } = body;

    if (!app_id) {
      return NextResponse.json(
        { error: "app_id is required" },
        { status: 400 }
      );
    }

    if (!bucket_id) {
      return NextResponse.json(
        { error: "bucket_id is required" },
        { status: 400 }
      );
    }

    if (!package_name) {
      return NextResponse.json(
        { error: "package_name is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${N8N_WEBHOOK_BASE_URL}/fetch-historical-reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id,
        bucket_id,
        package_name,
        year: year || new Date().getFullYear().toString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("n8n webhook error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch historical reviews from Cloud Storage" },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling n8n fetch-historical-reviews webhook:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical reviews" },
      { status: 500 }
    );
  }
}
