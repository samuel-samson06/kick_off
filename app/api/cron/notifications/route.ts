import { NextResponse } from "next/server";
import { processNotifications } from "@/lib/services/notificationEngine";

export async function GET(req: Request) {
  try {
    const key = req.headers.get("x-cron-secret");
    if (key !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const diagnostics = await processNotifications();
    return NextResponse.json({
      ...diagnostics,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron/notifications]", err);
    return NextResponse.json(
      {
        success: false,
        matchesChecked: 0,
        subscriptionsChecked: 0,
        candidatesFound: 0,
        emailsAttempted: 0,
        emailsSent: 0,
        logsCreated: 0,
        errors: [err instanceof Error ? err.message : "Unknown error"],
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
