import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import MainMatch from "@/components/dashboard/MainMatch";
import Teams from "@/components/dashboard/Teams";
import UpcomingMatches from "@/components/dashboard/UpcomingMatches";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptionsServer } from "@/lib/services/subscriptions";
import { findTeamName, formatDate, formatTime, getCountdown } from "@/lib/dashboard";
import { getDashboardMatches, getDashboardTeams } from "@/lib/data/dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/email");
  }

  const [subscribedTeamIds, teams, matches] = await Promise.all([
    getSubscriptionsServer(user.id),
    getDashboardTeams(),
    getDashboardMatches(),
  ]);

  const subscribedTeams = teams.filter((t) => subscribedTeamIds.includes(t.id));

  const userMatches = matches.filter(
    (m) =>
      subscribedTeamIds.includes(m.homeTeam) || subscribedTeamIds.includes(m.awayTeam),
  );

  const upcoming = userMatches
    .filter((m) => m.status !== "finished")
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  const finished = userMatches
    .filter((m) => m.status === "finished")
    .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime());

  const mainMatch = upcoming[0] ?? null;
  const restMatches = [...upcoming.slice(1), ...finished];
  const kickoffIn = mainMatch ? getCountdown(mainMatch.kickoff) : { days: "00", hours: "00", minutes: "00" };

  const matchData = mainMatch
    ? {
        competition: mainMatch.competition,
        venue: "Fixture synced from Supabase",
        status: mainMatch.status === "finished" ? "finished" : "scheduled",
        homeTeam: findTeamName(mainMatch.homeTeam, teams),
        awayTeam: findTeamName(mainMatch.awayTeam, teams),
        kickoffIn,
        date: formatDate(mainMatch.kickoff),
        time: formatTime(mainMatch.kickoff),
      }
    : null;

  const teamData = [
    ...subscribedTeams.map((t) => ({ name: t.name, active: true })),
    ...(subscribedTeams.length < 5
      ? [{ name: "Add Team" as const, active: false as const, isAdd: true as const }]
      : []),
  ];

  const upcomingData = restMatches.map((m) => ({
    league: m.competition,
    homeTeam: findTeamName(m.homeTeam, teams),
    awayTeam: findTeamName(m.awayTeam, teams),
    time: formatTime(m.kickoff),
    date: formatDate(m.kickoff).toUpperCase(),
    reminderEnabled: false,
  }));

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <section>
          <MainMatch matchData={matchData} />
        </section>

        <section>
          <Teams teams={teamData} />
        </section>

        <section>
          <UpcomingMatches matches={upcomingData} />
        </section>
      </main>
    </div>
  );
}
