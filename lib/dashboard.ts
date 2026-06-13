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
