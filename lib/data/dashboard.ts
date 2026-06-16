import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

type TeamRow = { id: string; name: string; code: string };
type MatchRow = {
  id: string;
  home_team_id: string;
  away_team_id: string;
  kickoff_time: string;
  competition: string | null;
  status: string | null;
};

export type DashboardTeam = TeamRow;

export type DashboardMatch = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  competition: string;
  status: string;
};

const cacheTeams = unstable_cache(
  async (): Promise<DashboardTeam[]> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("teams").select("id, name, code");

    if (error) {
      console.error("Failed to load teams:", error);
      return [];
    }

    return data ?? [];
  },
  ["dashboard-teams"],
  { revalidate: 300 },
);

const cacheMatches = unstable_cache(
  async (): Promise<DashboardMatch[]> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("matches")
      .select("id, home_team_id, away_team_id, kickoff_time, competition, status")
      .order("kickoff_time", { ascending: true });

    if (error) {
      console.error("Failed to load matches:", error);
      return [];
    }

    return (data ?? []).map((match: MatchRow) => ({
      id: match.id,
      homeTeam: match.home_team_id,
      awayTeam: match.away_team_id,
      kickoff: match.kickoff_time,
      competition: match.competition ?? "Match",
      status: match.status ?? "scheduled",
    }));
  },
  ["dashboard-matches"],
  { revalidate: 60 },
);

export async function getDashboardTeams() {
  return cacheTeams();
}

export async function getDashboardMatches() {
  return cacheMatches();
}

