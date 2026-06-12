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

  const [profilesRes, subsRes, prefsRes] = await Promise.all([
    supabase.from("profiles").select("id, email"),
    supabase.from("subscriptions").select("user_id, team_id"),
    supabase.from("notification_preferences").select("*"),
  ]);

  const profiles = profilesRes.data ?? [];
  const subscriptions = subsRes.data ?? [];
  const preferences = prefsRes.data ?? [];

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

  const profileByUserId: Record<string, string> = {};
  for (const p of profiles) {
    profileByUserId[p.id] = p.email;
  }

  const now = Date.now();
  const candidates: ReminderCandidate[] = [];

  for (const match of mockMatches) {
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
    sent_at: new Date().toISOString(),
  });
}

export async function processNotifications(): Promise<ReminderCandidate[]> {
  const candidates = await getReminderCandidates();
  const pending = await filterAlreadySent(candidates);

  for (const candidate of pending) {
    await createNotificationLog(candidate);
  }

  return pending;
}

// Future: export async function sendReminderEmail(candidate: ReminderCandidate): Promise<void>



// # Optimize Subscription Lookup for Scalability

// ## Goal

// Refactor subscription lookup logic to improve performance for large datasets.

// Current implementation checks every user and verifies if they are subscribed to a match team.

// This does not scale efficiently for large user bases.

// ---

// ## Current Pattern (inefficient at scale)

// ```ts id="c1"
// for each user:
//   check if user is subscribed to match team
// ```

// ---

// ## Required Pattern (optimized)

// Invert the lookup model:

// ```text id="c2"
// team → list of subscribed users
// ```

// ---

// ## Implementation Steps

// ### 1. Build team index

// Create in-memory map:

// ```ts id="c3"
// Record<string, string[]>
// ```

// Where:

// ```text id="c4"
// key = team_id
// value = array of user_ids
// ```

// ---

// ### 2. Process matches first

// For each match:

// * get users subscribed to home team
// * get users subscribed to away team
// * merge user lists

// ---

// ### 3. Continue normal processing

// After users are identified:

// * apply notification preferences
// * apply notification windows
// * apply deduplication via notification_logs

// ---

// ## Do NOT

// * Do NOT change database schema
// * Do NOT introduce caching systems yet
// * Do NOT optimize prematurely beyond this change

// ---

// ## Success Criteria

// * Same output as before
// * Reduced user iteration complexity
// * No change in notification correctness
