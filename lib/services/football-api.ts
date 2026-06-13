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
  const { data } = await supabase.from("teams").select("id, name, code");
  return data ?? [];
}

export async function getMatches(): Promise<Match[]> {
  const res = await fetch(`${BASE}/get/games`);
  const json = await res.json();
  const games = json.games ?? [];

  return games
    .filter(
      (g: Record<string, string>) =>
        g.home_team_id !== "0" && g.away_team_id !== "0",
    )
    .map(mapMatch);
}

export async function syncMatches(): Promise<number> {
  const res = await fetch(`${BASE}/get/games`);
  const json = await res.json();
  const games = json.games ?? [];

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
