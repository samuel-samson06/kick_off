import Link from "next/link";
import { LuPlus, LuStar } from "react-icons/lu";

export default function Teams({ teams }: { teams: { name: string; active: boolean; isAdd?: boolean }[] }) {
  if (teams.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold text-white">
          <LuStar className="h-5 w-5 text-lime-400" />
          <span>My Teams</span>
        </div>
        <button className="text-sm font-bold uppercase tracking-[0.22em] text-lime-400">
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {teams.map((team) => (
          <div
            key={team.name}
            className={[
              "flex min-h-[190px] flex-col items-center justify-between rounded-3xl border md:p-4",
              team.isAdd
                ? "border-dashed border-white/15 bg-white/2 text-zinc-300"
                : "border-white/10 bg-zinc-900/70 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
            ].join(" ")}
          >
            {team.isAdd ? (
              <Link
                href="/dashboard/teams"
                className="flex h-full w-full flex-col items-center justify-between"
                aria-label="Add a team"
              >
                <div className="mt-10 flex h-8 w-8 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/5 text-4xl text-zinc-300">
                  <LuPlus />
                </div>
                <div className="mb-6 text-sm font-semibold uppercase tracking-[0.28em] text-zinc-300">
                  {team.name}
                </div>
              </Link>
            ) : (
              <>
                <div className="mt-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-zinc-200">
                  <TeamMark />
                </div>
                <div className="text-center text-base md:text-lg font-semibold">{team.name}</div>
                <span
                  className={[
                    "mb-1 h-2 w-2 rounded-full",
                    team.active ? "bg-lime-400 shadow-[0_0_14px_rgba(163,230,53,0.85)]" : "bg-zinc-600",
                  ].join(" ")}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function TeamMark() {
  return <LuShield />;
}

function LuShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10">
      <path
        d="M12 2l7 3v6c0 5-3.2 9.4-7 11-3.8-1.6-7-6-7-11V5l7-3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
