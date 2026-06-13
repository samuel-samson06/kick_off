import { resend } from "./resend";
import type { ReminderCandidate } from "@/lib/services/notificationEngine";

function formatKickoff(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

const subjectMap: Record<ReminderCandidate["notificationType"], string> = {
  "24h": "⚽ Match tomorrow: %s vs %t",
  "1h": "⚽ 1 hour to kickoff: %s vs %t",
  kickoff: "🚨 Kickoff now: %s vs %t",
};

const bodyMap: Record<ReminderCandidate["notificationType"], string> = {
  "24h": "%s vs %t kicks off tomorrow at %k — don't miss it!",
  "1h": "%s vs %t kicks off in 1 hour at %k — time to tune in!",
  kickoff: "%s vs %t is kicking off now at %k!",
};

export async function sendReminderEmail(candidate: ReminderCandidate) {
  const kickoff = formatKickoff(candidate.kickoffTime);
  const sub = subjectMap[candidate.notificationType]
    .replace("%s", candidate.homeTeam)
    .replace("%t", candidate.awayTeam);
  const body = bodyMap[candidate.notificationType]
    .replace("%s", candidate.homeTeam)
    .replace("%t", candidate.awayTeam)
    .replace("%k", kickoff);

  try {
    const result = await resend.emails.send({
      from: "Match Reminder <onboarding@resend.dev>",
      to: candidate.email,
      subject: sub,
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
