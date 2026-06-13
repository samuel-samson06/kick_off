import { createAdminClient } from "@/lib/supabase/admin";
import { getMatches } from "@/lib/services/football";
import { sendReminderEmail } from "@/lib/email/sendReminderEmail";

export type ReminderCandidate = {
  userId: string;
  email: string;
  matchId: string;
  notificationType: "24h" | "1h" | "kickoff";
  homeTeam: string;
  awayTeam: string;
  kickoffTime: string;
};

export async function getReminderCandidates(): Promise<ReminderCandidate[]> {
  const supabase = createAdminClient();

  const [profilesRes, subsRes, prefsRes] = await Promise.all([
    supabase.from("profiles").select("id, email"),
    supabase.from("subscriptions").select("user_id, team_api_id"),
    supabase.from("notification_preferences").select("*"),
  ]);

  const profiles = profilesRes.data ?? [];
  const subscriptions = subsRes.data ?? [];
  const preferences = prefsRes.data ?? [];

  const userTeams: Record<string, string[]> = {};
  for (const sub of subscriptions) {
    (userTeams[sub.user_id] ??= []).push(String(sub.team_api_id));
  }

  const userPrefs: Record<string, Record<string, boolean>> = {};
  for (const p of preferences) {
    userPrefs[p.user_id] = {
      notify_24h: p.notify_24h,
      notify_1h: p.notify_1h,
      notify_kickoff: p.notify_kickoff,
    };
  }

  const profileByUserId: Record<string, string> = {};
  for (const p of profiles) {
    profileByUserId[p.id] = p.email;
  }

  const matches = await getMatches();
  const now = Date.now();
  const candidates: ReminderCandidate[] = [];

  for (const match of matches) {
    const diffMinutes = (new Date(match.kickoff).getTime() - now) / 60_000;

    const types: { type: "24h" | "1h" | "kickoff"; prefKey: string }[] = [];

    if (diffMinutes <= 1440 && diffMinutes > 1425) {
      types.push({ type: "24h", prefKey: "notify_24h" });
    } else if (diffMinutes <= 60 && diffMinutes > 45) {
      types.push({ type: "1h", prefKey: "notify_1h" });
    } else if (diffMinutes <= 5 && diffMinutes >= 0) {
      types.push({ type: "kickoff", prefKey: "notify_kickoff" });
    }

    if (types.length === 0) continue;

    for (const [uid, teams] of Object.entries(userTeams)) {
      const isInterested =
        teams.includes(match.homeTeam) || teams.includes(match.awayTeam);
      if (!isInterested) continue;

      const email = profileByUserId[uid];
      const prefs = userPrefs[uid];
      if (!email || !prefs) continue;

      for (const { type, prefKey } of types) {
        if (!prefs[prefKey]) continue;

        candidates.push({
          userId: uid,
          email,
          matchId: match.id,
          notificationType: type,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          kickoffTime: match.kickoff,
        });
      }
    }
  }

  return candidates;
}

export async function filterAlreadySent(
  candidates: ReminderCandidate[],
): Promise<ReminderCandidate[]> {
  const supabase = createAdminClient();
  const { data: logs } = await supabase
    .from("notification_logs")
    .select("user_id, match_id, notification_type");

  const sentLogs = new Set(
    (logs ?? []).map(
      (l) => `${l.user_id}:${l.match_id}:${l.notification_type}`,
    ),
  );

  return candidates.filter(
    (c) => !sentLogs.has(`${c.userId}:${c.matchId}:${c.notificationType}`),
  );
}

export async function createNotificationLog(
  candidate: ReminderCandidate,
): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("notification_logs").insert({
    user_id: candidate.userId,
    match_id: candidate.matchId,
    notification_type: candidate.notificationType,
  });
}

export async function processNotifications(): Promise<ReminderCandidate[]> {
  const candidates = await getReminderCandidates();
  const pending = await filterAlreadySent(candidates);

  for (const candidate of pending) {
    try {
      await sendReminderEmail(candidate);
      await createNotificationLog(candidate);
    } catch (err) {
      console.error(
        `[notificationEngine] Failed to send ${candidate.notificationType} reminder for match ${candidate.matchId} to ${candidate.email}:`,
        err,
      );
    }
  }

  return pending;
}
