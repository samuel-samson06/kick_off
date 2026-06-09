"use client";

import { useState } from "react";
import { LuCheck, LuSearch, LuArrowRight, LuUsers } from "react-icons/lu";
import Header from "@/components/layout/Header";
import { nationalTeams, popularClubs, selectedTeams } from "@/lib/teams";

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchQuery.toLowerCase().trim();

  const filteredClubs = popularClubs.filter(
    (team) => !query || team.name.toLowerCase().includes(query),
  );

  const filteredNations = nationalTeams.filter(
    (team) => !query || team.name.toLowerCase().includes(query),
  );

  const noResults = query && filteredClubs.length === 0 && filteredNations.length === 0;

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
              selectedTeams.map((team) => <SelectedTeamCard key={team.name} {...team} />)
            ) : (
              <EmptyState message="No teams selected yet. Pick up to five teams to start receiving reminders." />
            )}
          </div>

          {noResults ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <p className="text-base text-zinc-400">
                No teams match <span className="text-white">&ldquo;{searchQuery}&rdquo;</span>
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Try a different search term.
              </p>
            </div>
          ) : (
            <>
              {filteredClubs.length > 0 && (
                <>
                  <SectionHeading title="Team Discovery" action="View All" />
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {filteredClubs.map((team) => (
                      <DiscoveryCard key={team.name} name={team.name} selected={team.selected} />
                    ))}
                  </div>
                </>
              )}

              {filteredNations.length > 0 && (
                <div className="pt-2">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">National Teams</h2>
                    <div className="flex items-center gap-2">
                      <PagerButton label="Previous" />
                      <PagerButton label="Next" />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {filteredNations.map((team) => (
                      <NationalTeamCard key={team.name} name={team.name} selected={team.selected} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="sticky bottom-20 z-10 mt-4 border-t border-white/10 bg-zinc-950/90 pt-4 backdrop-blur-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-lime-400">
                <LuUsers className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-[0.22em]">
                  {selectedTeams.length} / 5 selected
                </span>
              </div>

              <button className="inline-flex items-center justify-center gap-3 rounded-2xl bg-lime-400 px-6 py-4 text-lg font-bold text-zinc-950 transition-opacity hover:opacity-90 sm:min-w-[220px]">
                Save Teams
                <LuArrowRight className="h-5 w-5" />
              </button>
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

function SelectedTeamCard({ name, league }: { name: string; league: string }) {
  return (
    <article className="rounded-[28px] border border-lime-400/20 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.14),transparent_42%),linear-gradient(180deg,rgba(24,24,27,0.98),rgba(18,18,18,0.98))] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-400">{league}</div>
          <div className="text-2xl font-black text-white">{name}</div>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-lime-400 text-zinc-950">
          <LuCheck className="h-5 w-5" />
        </span>
      </div>
    </article>
  );
}

function DiscoveryCard({ name, selected }: { name: string; selected: boolean }) {
  return (
    <button
      className={[
        "flex items-center justify-between rounded-[24px] border px-4 py-4 text-left transition-colors",
        selected
          ? "border-lime-400/60 bg-lime-400/10"
          : "border-white/10 bg-zinc-900/70 hover:border-white/20 hover:bg-white/5",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-zinc-200">
          <ClubMark />
        </div>
        <div>
          <div className="text-base font-semibold text-white">{name}</div>
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">Club</div>
        </div>
      </div>
      <span className={selected ? "text-lime-400" : "text-zinc-400"}>
        {selected ? <LuCheck className="h-5 w-5" /> : <LuSearch className="h-5 w-5" />}
      </span>
    </button>
  );
}

function NationalTeamCard({ name, selected }: { name: string; selected: boolean }) {
  return (
    <button
      className={[
        "flex items-center justify-between rounded-2xl border px-4 py-4 transition-colors",
        selected
          ? "border-lime-400/60 bg-lime-400/10"
          : "border-white/10 bg-zinc-900/70 hover:border-white/20 hover:bg-white/5",
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

function PagerButton({ label }: { label: string }) {
  return (
    <button
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 transition-colors hover:border-lime-400/30 hover:bg-lime-400/5 hover:text-white"
    >
      <span className="text-xl leading-none">{label === "Previous" ? "‹" : "›"}</span>
    </button>
  );
}

function ClubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
      <path
        d="M12 2l7 3v6c0 5-3.2 9.4-7 11-3.8-1.6-7-6-7-11V5l7-3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
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
