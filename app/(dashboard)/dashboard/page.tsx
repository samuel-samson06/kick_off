import Link from "next/link";
import { redirect } from "next/navigation";
import { LuArrowRight, LuBell } from "react-icons/lu";
import Header from "@/components/layout/Header";
import MainMatch from "@/components/dashboard/MainMatch";
import Teams from "@/components/dashboard/Teams";
import UpcomingMatches from "@/components/dashboard/UpcomingMatches";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptionsServer } from "@/lib/services/subscriptions";
import {
  findTeamName,
  formatDate,
  formatTime,
  getCountdown,
  selectNextUpcomingMatch,
} from "@/lib/dashboard";
import { getDashboardMatches, getDashboardTeams } from "@/lib/data/dashboard";

export default async function DashboardPage() {
  const nowMs = new Date().getTime();
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
    .filter((m) => m.status !== "finished" && new Date(m.kickoff).getTime() > nowMs)
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  const finished = userMatches
    .filter((m) => m.status === "finished")
    .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime());

  const mainMatch = selectNextUpcomingMatch(userMatches, nowMs);
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
        {subscribedTeamIds.length === 0 ? (
          <section className="mt-16 flex flex-col items-center gap-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime-400/10">
              <LuBell className="h-8 w-8 text-lime-400" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-bold text-white">No teams selected yet</h2>
              <p className="text-zinc-400">
                Pick up to 5 teams and we&apos;ll send you reminders before every match.
              </p>
            </div>
            <Link
              href="/dashboard/teams"
              className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 font-semibold text-black transition-colors hover:bg-lime-500"
            >
              Choose your teams
              <LuArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <>
            <section>
              <MainMatch matchData={matchData} />
            </section>

            <section>
              <Teams teams={teamData} />
            </section>

            <section>
              <UpcomingMatches matches={upcomingData} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
