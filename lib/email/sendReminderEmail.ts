import { resend } from "./resend";
import type { ReminderCandidate } from "@/lib/services/notificationEngine";

const subjectMap: Record<ReminderCandidate["notificationType"], string> = {
  "24h": "⚽ Match tomorrow reminder",
  "1h": "⚽ Match starting in 1 hour",
  kickoff: "🚨 Kickoff starting now",
};

const bodyMap: Record<ReminderCandidate["notificationType"], string> = {
  "24h": "Your selected match (ID: %s) starts in 24 hours.",
  "1h": "Your selected match (ID: %s) starts in 1 hour.",
  kickoff: "Your selected match (ID: %s) is kicking off now.",
};

export async function sendReminderEmail(candidate: ReminderCandidate) {
  const body = bodyMap[candidate.notificationType].replace(
    "%s",
    candidate.matchId,
  );

  try {
    const result = await resend.emails.send({
      from: "Match Reminder <onboarding@resend.dev>",
      to: candidate.email,
      subject: subjectMap[candidate.notificationType],
      text: body,
    });

    console.log(result);
  } catch (err) {
    console.error(
      `[sendReminderEmail] Failed to send ${candidate.notificationType} reminder to ${candidate.email}:`,
      err,
    );
    throw err;
  }
}
