"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import MainMatch from "@/components/dashboard/MainMatch";
import Teams from "@/components/dashboard/Teams";
import UpcomingMatches from "@/components/dashboard/UpcomingMatches";
import { createClient } from "@/lib/supabase/client";
import { getSubscriptions } from "@/lib/services/subscriptions";
import { getMatches } from "@/lib/services/football";
import { findTeamName, formatDate, formatTime, getCountdown } from "@/lib/dashboard";

export default function DashboardPage() {
  const [subscribedTeamIds, setSubscribedTeamIds] = useState<string[]>([]);
  const [teams, setTeams] = useState<{ id: string; name: string; code: string }[]>([]);
  const [matches, setMatches] = useState<
    { id: string; homeTeam: string; awayTeam: string; kickoff: string; competition: string; status: string }[]
  >([]);
  const [kickoffIn, setKickoffIn] = useState({ days: "00", hours: "00", minutes: "00" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const [ids, teamsRes, allMatches] = await Promise.all([
          getSubscriptions(data.user.id),
          fetch("/api/teams"),
          getMatches(),
        ]);
        const allTeams = await teamsRes.json();
        setSubscribedTeamIds(ids);
        setTeams(allTeams);
        setMatches(allMatches);
      }
      setLoading(false);
    }
    load();
  }, []);

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

  const mainMatch = upcoming[0] ?? finished[0] ?? null;
  const restMatches = [...upcoming.slice(1), ...finished];

  useEffect(() => {
    function update() {
      if (mainMatch) setKickoffIn(getCountdown(mainMatch.kickoff));
    }
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [mainMatch]);

  const matchData = mainMatch
    ? {
        competition: mainMatch.competition,
        venue: "TBD",
        status: "scheduled",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Header />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-28 pt-4 sm:px-6 lg:px-8">
          <p className="text-zinc-400">Loading your dashboard...</p>
        </main>
      </div>
    );
  }

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
