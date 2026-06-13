import { NextResponse } from "next/server";
import { sendReminderEmail } from "@/lib/email/sendReminderEmail";

export async function GET() {
  await sendReminderEmail({
    userId: "test-user",
    email: "a.samuelsamson123@gmail.com",
    matchId: "match_test",
    notificationType: "1h",
    homeTeam: "Brazil",
    awayTeam: "Morocco",
    kickoffTime: "2026-06-13T22:00:00.000Z",
  });

  return NextResponse.json({
    success: true,
  });
}