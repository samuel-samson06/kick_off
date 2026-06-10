import { mockTeams, mockMatches } from "@/lib/mock/football-api";

export async function getTeams() {
  return mockTeams;
}

export async function getMatches() {
  return mockMatches;
}
