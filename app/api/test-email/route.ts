import { NextResponse } from "next/server";
import { sendReminderEmail } from "@/lib/email/sendReminderEmail";

export async function GET() {
  await sendReminderEmail({
    userId: "test-user",
    email: "some_random_dude@yopmail.com",
    matchId: "match_test",
    notificationType: "1h",
  });

  return NextResponse.json({
    success: true,
  });
}