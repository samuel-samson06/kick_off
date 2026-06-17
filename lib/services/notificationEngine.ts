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
  homeTeamName: string;
  awayTeamName: string;
  kickoffTime: string;
};

export type NotificationDiagnostics = {
  success: boolean;
  matchesChecked: number;
  subscriptionsChecked: number;
  candidatesFound: number;
  emailsAttempted: number;
  emailsSent: number;
  logsCreated: number;
  errors: string[];
};

export async function getReminderCandidates(): Promise<{
  candidates: ReminderCandidate[];
  matchesChecked: number;
  subscriptionsChecked: number;
}> {
  const supabase = createAdminClient();

  const [profilesRes, subsRes, prefsRes, teamsRes] = await Promise.all([
    supabase.from("profiles").select("id, email"),
    supabase.from("subscriptions").select("user_id, team_api_id"),
    supabase.from("notification_preferences").select("*"),
    supabase.from("teams").select("id, name"),
  ]);

  const profiles = profilesRes.data ?? [];
  const subscriptions = subsRes.data ?? [];
  const preferences = prefsRes.data ?? [];
  const teams = teamsRes.data ?? [];

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

  const teamNameById: Record<string, string> = {};
  for (const team of teams) {
    teamNameById[String(team.id)] = String(team.name);
  }

  const matches = await getMatches();
  const now = Date.now();
  const candidates: ReminderCandidate[] = [];

  for (const match of matches) {
    const diffMinutes = (new Date(match.kickoff).getTime() - now) / 60_000;

    const types: { type: "24h" | "1h" | "kickoff"; prefKey: string }[] = [];

    if (diffMinutes <= 1470 && diffMinutes > 1380) {
      types.push({ type: "24h", prefKey: "notify_24h" });
    } else if (diffMinutes <= 75 && diffMinutes > 30) {
      types.push({ type: "1h", prefKey: "notify_1h" });
    } else if (diffMinutes <= 10 && diffMinutes >= 0) {
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
          homeTeamName: teamNameById[match.homeTeam] ?? match.homeTeam,
          awayTeamName: teamNameById[match.awayTeam] ?? match.awayTeam,
          kickoffTime: match.kickoff,
        });
      }
    }
  }

  return {
    candidates,
    matchesChecked: matches.length,
    subscriptionsChecked: subscriptions.length,
  };
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

  const result = candidates.filter(
    (c) => !sentLogs.has(`${c.userId}:${c.matchId}:${c.notificationType}`),
  );

  console.log(
    `[CRON] Filtered ${candidates.length} candidates against sent logs, ${result.length} remaining`,
  );

  return result;
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

export async function processNotifications(): Promise<NotificationDiagnostics> {
  console.log("[CRON] Started");

  const { candidates, matchesChecked, subscriptionsChecked } =
    await getReminderCandidates();
  console.log(
    `[CRON] Checking ${matchesChecked} matches against ${subscriptionsChecked} subscriptions`,
  );
  console.log(`[CRON] Candidates found: ${candidates.length}`);

  const pending = await filterAlreadySent(candidates);

  const diagnostics: NotificationDiagnostics = {
    success: true,
    matchesChecked,
    subscriptionsChecked,
    candidatesFound: candidates.length,
    emailsAttempted: pending.length,
    emailsSent: 0,
    logsCreated: 0,
    errors: [],
  };

  for (const candidate of pending) {
    try {
      console.log(
        `[EMAIL] Sending ${candidate.notificationType} reminder to ${candidate.email} for ${candidate.homeTeamName} vs ${candidate.awayTeamName}`,
      );
      await sendReminderEmail(candidate);
      console.log("[EMAIL] Sent successfully");
      diagnostics.emailsSent++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[ERROR] Failed to send email: ${msg}`);
      diagnostics.errors.push(`Email to ${candidate.email}: ${msg}`);
      continue;
    }

    try {
      await createNotificationLog(candidate);
      console.log("[LOG] Created notification log");
      diagnostics.logsCreated++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[ERROR] Failed to create log: ${msg}`);
      diagnostics.errors.push(`Log for match ${candidate.matchId}: ${msg}`);
    }
  }

  diagnostics.success = diagnostics.errors.length === 0;

  return diagnostics;
}
