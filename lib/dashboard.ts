export function findTeamName(
  id: string,
  teams: { id: string; name: string }[],
) {
  return teams.find((t) => t.id === id)?.name ?? id;
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

export function getCountdown(kickoff: string) {
  const diff = new Date(kickoff).getTime() - Date.now();
  if (diff <= 0) return { days: "00", hours: "00", minutes: "00" };
  const totalMinutes = Math.floor(diff / 60_000);
  return {
    days: String(Math.floor(totalMinutes / 1440)).padStart(2, "0"),
    hours: String(Math.floor((totalMinutes % 1440) / 60)).padStart(2, "0"),
    minutes: String(totalMinutes % 60).padStart(2, "0"),
  };
}

export function selectNextUpcomingMatch<T extends { kickoff: string; status: string }>(
  matches: T[],
  nowMs: number,
) {
  // Only future, non-finished matches can be promoted to MainMatch.
  return matches
    .filter((match) => match.status !== "finished" && new Date(match.kickoff).getTime() > nowMs)
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime())[0] ?? null;
}
