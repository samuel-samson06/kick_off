import { NextResponse } from "next/server";
import { getReminderCandidates } from "@/lib/services/notificationEngine";

export async function GET() {
  const candidates = await getReminderCandidates();
  return NextResponse.json({
    count: candidates.length,
    candidates,
    timestamp: new Date().toISOString(),
  });
}
