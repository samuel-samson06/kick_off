import { NextResponse } from "next/server";
import { processNotifications } from "@/lib/services/notificationEngine";

export async function GET(req: Request) {
  try {
    const key = new URL(req.url).searchParams.get("key");
    if (key !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await processNotifications();
    return NextResponse.json({
      sent: result.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron/notifications]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}