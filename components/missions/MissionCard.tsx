import { Check } from "lucide-react";
import Link from "next/link";
import type { Mission } from "@/lib/missions";

type MissionCardProps = {
  mission: Mission;
  completed: boolean;
};

export default function MissionCard({
  mission,
  completed,
}: MissionCardProps) {
  const Icon = mission.icon;

  return (
    <article
      className={`group flex min-h-56 w-full flex-col rounded-md border bg-slate-900 p-5 transition duration-200 hover:scale-105 hover:border-slate-600 ${
        completed
          ? "border-emerald-400/70 shadow-[0_0_24px_rgba(74,222,128,0.08)]"
          : "border-slate-800"
      }`}
    >
      <div className="flex w-full items-start justify-between">
        <span className="font-mono text-xs tracking-[0.12em] text-slate-500">
          MISSION {String(mission.id).padStart(2, "0")}
        </span>
        <span
          role="img"
          aria-label={completed ? "Mission terminée" : "Mission non terminée"}
          className={`flex size-7 items-center justify-center rounded-full ${
            completed
              ? "bg-emerald-400/15 text-emerald-300"
              : "border border-slate-700 text-slate-500"
          }`}
        >
          {completed ? (
            <Check aria-hidden="true" size={15} strokeWidth={2.5} />
          ) : (
            <span className="size-1.5 rounded-full bg-current" />
          )}
        </span>
      </div>

      <Link
        href={`/missions/${mission.id}`}
        aria-label={`Ouvrir la mission ${mission.id} : ${mission.title}`}
        className="flex flex-1 flex-col rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
      >
        <div className="mt-5 flex size-11 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/15 to-emerald-300/10 text-emerald-200 ring-1 ring-white/5">
          <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
        </div>

        <div className="mt-4 flex flex-1 flex-col">
          <h3 className="text-base font-semibold text-slate-100">{mission.title}</h3>
          <p className="mt-1.5 text-sm leading-5 text-slate-400">
            {mission.description}
          </p>
        </div>

        <span
          className={`mt-4 w-fit rounded-sm border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
            mission.type === "theorie"
              ? "border-violet-400/20 bg-violet-400/5 text-violet-200"
              : "border-emerald-300/20 bg-emerald-300/5 text-emerald-200"
          }`}
        >
          {mission.type === "theorie" ? "Théorie" : "Pratique"}
        </span>
      </Link>
    </article>
  );
}