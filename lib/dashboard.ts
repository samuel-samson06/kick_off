import { mockTeams, mockMatches } from "@/lib/mock/football-api";

export function findTeamName(id: string) {
  return mockTeams.find((t) => t.id === id)?.name ?? id;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const main = mockMatches[0];

export const mainMatchData = {
  competition: main.competition,
  venue: "TBD",
  status: "scheduled",
  homeTeam: findTeamName(main.homeTeam),
  awayTeam: findTeamName(main.awayTeam),
  kickoffIn: {
    days: "00",
    hours: "00",
    minutes: "00",
  },
  date: formatDate(main.kickoff),
  time: formatTime(main.kickoff),
};

type TeamItem = {
  name: string;
  active: boolean;
  isAdd?: boolean;
};

export const teamData: TeamItem[] = [
  ...mockTeams.slice(0, 3).map((t, i) => ({
    name: t.name,
    active: i < 2,
  })),
  { name: "Add Team", active: false, isAdd: true },
];

export const upcomingMatchesData = mockMatches.slice(1).map((m) => ({
  league: m.competition,
  homeTeam: findTeamName(m.homeTeam),
  awayTeam: findTeamName(m.awayTeam),
  time: formatTime(m.kickoff),
  date: formatDate(m.kickoff).toUpperCase(),
  reminderEnabled: false,
}));
