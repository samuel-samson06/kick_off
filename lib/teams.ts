import { mockTeams } from "@/lib/mock/football-api";

export const popularClubs: { name: string; selected: boolean }[] = [];

export const nationalTeams = mockTeams.map((t) => ({
  name: t.name,
  selected: false,
}));

export const selectedTeams: { name: string; league: string }[] = [];
