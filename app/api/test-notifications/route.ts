import { NextResponse } from "next/server";
import { processNotifications } from "@/lib/services/notificationEngine";

export async function GET() {
  const candidates = await processNotifications();
  return NextResponse.json({
    count: candidates.length,
    candidates,
    timestamp: new Date().toISOString(),
  });
}
