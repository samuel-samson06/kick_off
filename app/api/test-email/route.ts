import { NextResponse } from "next/server";
import { sendReminderEmail } from "@/lib/email/sendReminderEmail";

export async function GET(req: Request) {
  const to = new URL(req.url).searchParams.get("to");

  if (!to) {
    return NextResponse.json({ error: "Missing recipient" }, { status: 400 });
  }

  await sendReminderEmail({
    userId: "test-user",
    email: to,
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
