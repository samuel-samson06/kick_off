"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import MainMatch from "@/components/dashboard/MainMatch";
import Teams from "@/components/dashboard/Teams";
import UpcomingMatches from "@/components/dashboard/UpcomingMatches";
import { createClient } from "@/lib/supabase/client";
import { getSubscriptions } from "@/lib/services/subscriptions";
import { mockTeams, mockMatches } from "@/lib/mock/football-api";
import { findTeamName, formatDate, formatTime } from "@/lib/dashboard";

export default function DashboardPage() {
  const [subscribedTeamIds, setSubscribedTeamIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const ids = await getSubscriptions(data.user.id);
        setSubscribedTeamIds(ids);
      }
      setLoading(false);
    }
    load();
  }, []);

  const subscribedTeams = mockTeams.filter((t) => subscribedTeamIds.includes(t.id));

  const userMatches = mockMatches.filter(
    (m) =>
      subscribedTeamIds.includes(m.homeTeam) || subscribedTeamIds.includes(m.awayTeam),
  );

  const mainMatch = userMatches[0] ?? null;
  const restMatches = userMatches.slice(1);

  const matchData = mainMatch
    ? {
        competition: mainMatch.competition,
        venue: "TBD",
        status: "scheduled",
        homeTeam: findTeamName(mainMatch.homeTeam),
        awayTeam: findTeamName(mainMatch.awayTeam),
        kickoffIn: { days: "00", hours: "00", minutes: "00" },
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
    homeTeam: findTeamName(m.homeTeam),
    awayTeam: findTeamName(m.awayTeam),
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
