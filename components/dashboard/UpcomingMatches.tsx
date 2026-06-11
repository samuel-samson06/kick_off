import { LuBell } from "react-icons/lu";

type Match = {
  league: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  date: string;
  reminderEnabled: boolean;
};

export default function UpcomingMatches({ matches }: { matches: Match[] }) {
  if (matches.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-xl font-bold text-white">
        <LuBell className="h-5 w-5 text-lime-400" />
        <span>Upcoming Matches</span>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {matches.map((match) => (
          <article
            key={`${match.league}-${match.homeTeam}-${match.awayTeam}`}
            className="rounded-3xl border border-white/10 bg-zinc-900/75 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-semibold tracking-[0.2em] text-zinc-300">{match.league}</p>
              <div className={match.reminderEnabled ? "text-lime-400" : "text-zinc-400"}>
                <LuBell className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <Club name={match.homeTeam} />
              <div>
                <div className="text-2xl font-bold text-white">{match.time}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-400">
                  {match.date}
                </div>
              </div>
              <Club name={match.awayTeam} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Club({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-zinc-200">
        <Shield />
      </div>
      <div className="text-sm font-semibold text-zinc-100">{name}</div>
    </div>
  );
}

function Shield() {
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
