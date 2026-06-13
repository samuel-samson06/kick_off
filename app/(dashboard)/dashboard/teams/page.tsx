"use client";

import { useState, useEffect } from "react";
import { LuCheck, LuSearch, LuUsers } from "react-icons/lu";
import Header from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/client";
import { getSubscriptions, addSubscription, removeSubscription } from "@/lib/services/subscriptions";
import LoadingSpinner from "@/components/ui/LoadingSpinner";


export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribedTeamIds, setSubscribedTeamIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [teams, setTeams] = useState<{ id: string; name: string; code: string }[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setPageLoading(false);
        return;
      }
      setUserId(data.user.id);
      const [ids, teamsRes] = await Promise.all([
        getSubscriptions(data.user.id),
        fetch("/api/teams"),
      ]);
      const allTeams = await teamsRes.json();
      setSubscribedTeamIds(ids);
      setTeams(allTeams);
      setPageLoading(false);
    }
    load();
  }, []);

  const query = searchQuery.toLowerCase().trim();

  const filteredTeams = teams.filter(
    (team) => !query || team.name.toLowerCase().includes(query),
  );

  const noResults = query && filteredTeams.length === 0;

  const selectedTeams = teams.filter((t) => subscribedTeamIds.includes(t.id));

  const handleTeamClick = async (teamId: string) => {
    if (!userId) return;

    const isSelected = subscribedTeamIds.includes(teamId);

    if (isSelected) {
      setSubscribedTeamIds((prev) => prev.filter((id) => id !== teamId));
      try {
        await removeSubscription(userId, teamId);
      } catch {
        setSubscribedTeamIds((prev) => [...prev, teamId]);
      }
    } else {
      if (subscribedTeamIds.length >= 5) return;

      setSubscribedTeamIds((prev) => [...prev, teamId]);
      try {
        await addSubscription(userId, teamId);
      } catch {
        setSubscribedTeamIds((prev) => prev.filter((id) => id !== teamId));
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <div className="mb-6 space-y-3 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-lime-400" />
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Choose up to 5 teams
            </h1>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
            Follow the clubs and national teams you care about so match reminders land on time.
          </p>
        </div>

        <section className="space-y-5">
          <div className="rounded-[28px] border border-lime-400/15 bg-zinc-900/75 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-5">
            <label className="flex items-center gap-3 rounded-2xl border border-lime-400/20 bg-zinc-950 px-4 py-4 text-zinc-300 transition-colors focus-within:border-lime-400">
              <LuSearch className="h-5 w-5 shrink-0 text-zinc-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for teams, leagues, or countries..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500 sm:text-base"
              />
            </label>
          </div>

          <SectionHeading title="Selected Teams" action={`${selectedTeams.length} / 5 selected`} />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {selectedTeams.length ? (
              selectedTeams.map((team) => (
                <SelectedTeamCard key={team.id} name={team.name} />
              ))
            ) : (
              pageLoading ? <LoadingSpinner size="sm" /> : <EmptyState message="No teams selected yet. Pick up to five teams to start receiving reminders." />
            )}
          </div>

          {pageLoading ? null : noResults ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <p className="text-base text-zinc-400">
                No teams match <span className="text-white">&ldquo;{searchQuery}&rdquo;</span>
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Try a different search term.
              </p>
            </div>
          ) : (
            <div className="pt-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">National Teams</h2>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {filteredTeams.map((team) => (
                  <NationalTeamCard
                    key={team.id}
                    name={team.name}
                    selected={subscribedTeamIds.includes(team.id)}
                    onClick={() => handleTeamClick(team.id)}
                    disabled={!subscribedTeamIds.includes(team.id) && subscribedTeamIds.length >= 5}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="sticky bottom-20 z-10 mt-4 border-t border-white/10 bg-zinc-950/90 pt-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-lime-400">
              <LuUsers className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-[0.22em]">
                {selectedTeams.length} / 5 selected
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeading({ title, action }: { title: string; action: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
      <button className="text-xs font-bold uppercase tracking-[0.24em] text-lime-400 sm:text-sm">
        {action}
      </button>
    </div>
  );
}

function SelectedTeamCard({ name }: { name: string }) {
  return (
    <article className="rounded-[28px] border border-lime-400/20 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.14),transparent_42%),linear-gradient(180deg,rgba(24,24,27,0.98),rgba(18,18,18,0.98))] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-400">National Team</div>
          <div className="text-2xl font-black text-white">{name}</div>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-lime-400 text-zinc-950">
          <LuCheck className="h-5 w-5" />
        </span>
      </div>
    </article>
  );
}

function NationalTeamCard({
  name,
  selected,
  onClick,
  disabled,
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled && !selected}
      className={[
        "flex items-center justify-between rounded-2xl border px-4 py-4 transition-colors",
        selected
          ? "border-lime-400/60 bg-lime-400/10"
          : "border-white/10 bg-zinc-900/70 hover:border-white/20 hover:bg-white/5",
        disabled ? "opacity-40 cursor-not-allowed" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-200">
          <Shield />
        </div>
        <span className="text-base font-medium text-white">{name}</span>
      </div>
      <span className={selected ? "text-lime-400" : "text-zinc-400"}>
        {selected ? <LuCheck className="h-5 w-5" /> : <span className="text-xl">+</span>}
      </span>
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-400 sm:col-span-2 xl:col-span-3">
      {message}
    </div>
  );
}

function Shield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M12 2l7 3v6c0 5-3.2 9.4-7 11-3.8-1.6-7-6-7-11V5l7-3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
