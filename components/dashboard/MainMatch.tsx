import { LuBellRing, LuMapPin, LuShieldCheck } from "react-icons/lu";
import { mainMatchData } from "@/lib/dashboard";

export default function MainMatch() {
  return (
    <div className="rounded-[28px] border border-lime-400/20 bg-[radial-gradient(circle_at_top_right,rgba(163,230,53,0.16),transparent_35%),linear-gradient(180deg,rgba(24,24,27,0.98),rgba(15,15,15,0.98))] p-5 shadow-[0_0_0_1px_rgba(163,230,53,0.05)] sm:p-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
                <div className="inline-flex rounded-md bg-lime-400/10 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.28em] text-lime-300">
                    {mainMatchData.competition}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
                    <LuMapPin className="h-4 w-4 text-zinc-400" />
                    <span>{mainMatchData.venue}</span>
                </div>
            </div>

            <div className="sm:inline-flex hidden items-center gap-2 rounded-full bg-lime-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-950">
                <LuBellRing className="h-4 w-4" />
                {mainMatchData.status}
            </div>
      </div>

      <div className="mt-12 flex items-center justify-center gap-4 sm:gap-8">
        <TeamBadge name={mainMatchData.homeTeam} />
        <div className="text-2xl font-black tracking-tight text-zinc-500 sm:text-3xl">VS</div>
        <TeamBadge name={mainMatchData.awayTeam} />
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center md:items-end justify-between gap-4">
            <div>
            <p className="text-sm sm:text-xs max-sm:text-center font-semibold uppercase tracking-[0.32em] text-zinc-400">
                Kickoff in
            </p>
            <div className="mt-2 flex  items-end gap-1 sm:gap-2 md:gap-3 font-black text-white">
                <TimeBlock value={mainMatchData.kickoffIn.days} label="Days" />
                <Separator />
                <TimeBlock value={mainMatchData.kickoffIn.hours} label="Hrs" />
                <Separator />
                <TimeBlock value={mainMatchData.kickoffIn.minutes} label="Mins" />
            </div>
            </div>

            <div className="sm:text-right">
                <div className="text-2xl md:text-3xl font-bold text-white sm:text-[1.9rem]">{mainMatchData.date}</div>
                <div className="mt-1 text-sm max-sm:text-center text-zinc-300">{mainMatchData.time}</div>
            </div>
      </div>
    </div>
  );
}

function TeamBadge({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 sm:h-28 sm:w-28">
        <LuShieldCheck className="h-10 w-10 sm:h-12 sm:w-12" />
      </div>
      <div className="text-center text-sm sm:text-base  font-bold text-zinc-100 md:text-xl">{name}</div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className=" tracking-tight text-white text-4xl md:text-5xl">{value}</span>
      <span className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-zinc-400">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return <span className="pb-4 text-3xl font-black text-lime-400">:</span>;
}
