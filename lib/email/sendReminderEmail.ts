import { resend } from "./resend";
import type { ReminderCandidate } from "@/lib/services/notificationEngine";

function formatKickoff(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

function buildSubject(candidate: ReminderCandidate): string {
  const match = `${candidate.homeTeamName} vs ${candidate.awayTeamName}`;
  if (candidate.notificationType === "24h") return `Match tomorrow: ${match}`;
  if (candidate.notificationType === "1h") return `1 hour to kickoff: ${match}`;
  return `Kickoff now: ${match}`;
}

function buildText(candidate: ReminderCandidate, kickoff: string): string {
  const match = `${candidate.homeTeamName} vs ${candidate.awayTeamName}`;
  if (candidate.notificationType === "24h") {
    return `${match} kicks off tomorrow at ${kickoff}.`;
  }
  if (candidate.notificationType === "1h") {
    return `${match} kicks off in 1 hour at ${kickoff}.`;
  }
  return `${match} is kicking off now at ${kickoff}.`;
}

function buildHtml(candidate: ReminderCandidate, kickoff: string): string {
  const match = `${candidate.homeTeamName} vs ${candidate.awayTeamName}`;
  const title =
    candidate.notificationType === "24h"
      ? "Match tomorrow"
      : candidate.notificationType === "1h"
        ? "1 hour to kickoff"
        : "Kickoff now";

  return `
    <html>
      <body style="margin:0;background:#09090b;font-family:Arial,Helvetica,sans-serif;color:#f4f4f5;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#09090b;padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:linear-gradient(180deg,#18181b 0%,#0f0f10 100%);border:1px solid #27272a;border-radius:24px;overflow:hidden;">
                <tr>
                  <td style="padding:32px 32px 16px 32px;">
                    <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(163,230,53,0.12);color:#bef264;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;">
                      KickOff
                    </div>
                    <h1 style="margin:20px 0 8px 0;font-size:28px;line-height:1.2;color:#ffffff;">
                      ${title}
                    </h1>
                    <p style="margin:0;color:#a1a1aa;font-size:16px;line-height:1.6;">
                      ${match}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 24px 32px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#09090b;border:1px solid #27272a;border-radius:18px;">
                      <tr>
                        <td style="padding:20px 22px;">
                          <div style="color:#a1a1aa;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:8px;">Kickoff time</div>
                          <div style="color:#ffffff;font-size:20px;font-weight:700;">${kickoff}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 32px 32px;color:#d4d4d8;font-size:15px;line-height:1.7;">
                    ${candidate.notificationType === "24h" ? "You have a full day to get ready." : candidate.notificationType === "1h" ? "It is almost time to watch." : "The match is starting now."}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function sendReminderEmail(candidate: ReminderCandidate) {
  const kickoff = formatKickoff(candidate.kickoffTime);
  const subject = buildSubject(candidate);
  const text = buildText(candidate, kickoff);
  const html = buildHtml(candidate, kickoff);

  try {
    const result = await resend.emails.send({
      from: "KickOff <onboarding@resend.dev>",
      to: candidate.email,
      subject,
      text,
      html,
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
