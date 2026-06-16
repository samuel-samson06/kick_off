import { createAdminClient } from "@/lib/supabase/admin";
import { localDateToUTC } from "./stadium-timezone";

type Team = { id: string; name: string; code: string };

type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  competition: string;
  status: string;
};

const BASE = "https://worldcup26.ir";

function matchApiIdToUuid(apiMatchId: string): string {
  const hex = parseInt(apiMatchId).toString(16).padStart(12, "0");
  return `00000000-0000-0000-0000-${hex.slice(0, 4)}-${hex.slice(4, 16)}`;
}

export async function getTeams(): Promise<Team[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("teams").select("id, name, code");
  if (error) {
    console.error("[football-api] Failed to load teams:", error);
    return [];
  }
  return data ?? [];
}

export async function getMatches(): Promise<Match[]> {
  try {
    const res = await fetch(`${BASE}/get/games`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") ?? "";
    if (!res.ok) {
      throw new Error(`Upstream returned ${res.status} ${res.statusText}`);
    }
    if (!contentType.includes("application/json")) {
      const preview = (await res.text()).slice(0, 200);
      throw new Error(`Upstream returned non-JSON content: ${preview}`);
    }

    const json = await res.json();
    const games = Array.isArray(json.games) ? json.games : [];

    return games
      .filter(
        (g: Record<string, string>) =>
          g.home_team_id !== "0" && g.away_team_id !== "0",
      )
      .map(mapMatch);
  } catch (err) {
    console.error(
      "[football-api] API fetch failed, falling back to DB:",
      err,
    );
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("matches")
      .select("id, home_team_id, away_team_id, kickoff_time, competition, status");

    if (error) {
      console.error("[football-api] DB fallback failed:", error);
      return [];
    }

    return (data ?? []).map(dbRowToMatch);
  }
}

export async function syncMatches(): Promise<number> {
  try {
    const res = await fetch(`${BASE}/get/games`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") ?? "";
    if (!res.ok) {
      throw new Error(`Upstream returned ${res.status} ${res.statusText}`);
    }
    if (!contentType.includes("application/json")) {
      const preview = (await res.text()).slice(0, 200);
      throw new Error(`Upstream returned non-JSON content: ${preview}`);
    }

    const json = await res.json();
    const games = Array.isArray(json.games) ? json.games : [];

    const validGames = games.filter(
      (g: Record<string, string>) =>
        g.home_team_id !== "0" && g.away_team_id !== "0",
    );

    if (games.length !== validGames.length) {
      console.log(
        `[football-api] Skipped ${games.length - validGames.length} games with TBD team IDs`,
      );
    }

    const supabase = createAdminClient();
    const rows = validGames.map((g: Record<string, string>) => ({
      id: matchApiIdToUuid(g.id),
      external_match_id: g.id,
      home_team_id: g.home_team_id,
      away_team_id: g.away_team_id,
      kickoff_time: localDateToUTC(g.local_date, g.stadium_id),
      competition: "World Cup",
      status: g.finished === "TRUE" ? "finished" : "scheduled",
    }));

    const { error } = await supabase.from("matches").upsert(rows, {
      onConflict: "id",
    });

    if (error) {
      console.error("[football-api] Failed to sync matches:", JSON.stringify(error));
      return 0;
    }

    return rows.length;
  } catch (err) {
    console.error("[football-api] syncMatches failed:", err);
    return 0;
  }
}

function dbRowToMatch(row: Record<string, unknown>): Match {
  return {
    id: String(row.id),
    homeTeam: String(row.home_team_id),
    awayTeam: String(row.away_team_id),
    kickoff: String(row.kickoff_time),
    competition: String(row.competition ?? "World Cup"),
    status: String(row.status ?? "scheduled"),
  };
}

function mapMatch(g: Record<string, string>): Match {
  return {
    id: matchApiIdToUuid(g.id),
    homeTeam: g.home_team_id,
    awayTeam: g.away_team_id,
    kickoff: localDateToUTC(g.local_date, g.stadium_id),
    competition: "World Cup",
    status: g.finished === "TRUE" ? "finished" : "scheduled",
  };
}
