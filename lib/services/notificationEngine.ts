import { createAdminClient } from "@/lib/supabase/admin";
import { mockMatches } from "@/lib/mock/football-api";

export type ReminderCandidate = {
  userId: string;
  email: string;
  matchId: string;
  notificationType: "24h" | "1h" | "kickoff";
};

export async function getReminderCandidates(): Promise<ReminderCandidate[]> {
  const supabase = createAdminClient();

  const [profilesRes, subsRes, prefsRes, logsRes] = await Promise.all([
    supabase.from("profiles").select("id, email"),
    supabase.from("subscriptions").select("user_id, team_id"),
    supabase.from("notification_preferences").select("*"),
    supabase.from("notification_logs").select("user_id, match_id, notification_type"),
  ]);

  const profiles = profilesRes.data ?? [];
  const subscriptions = subsRes.data ?? [];
  const preferences = prefsRes.data ?? [];
  const logs = logsRes.data ?? [];

  const userTeams: Record<string, string[]> = {};
  for (const sub of subscriptions) {
    (userTeams[sub.user_id] ??= []).push(sub.team_id);
  }

  const userPrefs: Record<string, Record<string, boolean>> = {};
  for (const p of preferences) {
    userPrefs[p.user_id] = {
      notify_24h: p.notify_24h,
      notify_1h: p.notify_1h,
      notify_kickoff: p.notify_kickoff,
    };
  }

  const sentLogs = new Set(
    logs.map((l) => `${l.user_id}:${l.match_id}:${l.notification_type}`),
  );

  const profileByUserId: Record<string, string> = {};
  for (const p of profiles) {
    profileByUserId[p.id] = p.email;
  }

  const now = Date.now();
  const candidates: ReminderCandidate[] = [];

  for (const match of mockMatches) {
    const diffHours = (new Date(match.kickoff).getTime() - now) / 3_600_000;

    const types: { type: "24h" | "1h" | "kickoff"; prefKey: string }[] = [];

    if (diffHours >= 23 && diffHours <= 25) {
      types.push({ type: "24h", prefKey: "notify_24h" });
    } else if (diffHours >= 0.5 && diffHours <= 1.5) {
      types.push({ type: "1h", prefKey: "notify_1h" });
    } else if (diffHours >= -0.05 && diffHours <= 0.1) {
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

        const dedupKey = `${uid}:${match.id}:${type}`;
        if (sentLogs.has(dedupKey)) continue;

        candidates.push({
          userId: uid,
          email,
          matchId: match.id,
          notificationType: type,
        });
      }
    }
  }

  return candidates;
}
