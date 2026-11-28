import { Check, LockKeyhole } from "lucide-react";
import Link from "next/link";
import type { Mission } from "@/lib/missions";
import type { MissionProgressStatus } from "@/lib/progress";

type MissionCardProps = {
  mission: Mission;
  status: MissionProgressStatus;
};

export default function MissionCard({ mission, status }: MissionCardProps) {
  const Icon = mission.icon;
  const isCompleted = status === "completed";
  const isLocked = status === "locked";
  const statusLabel = isCompleted
    ? "Terminée"
    : isLocked
      ? "Verrouillée"
      : "Disponible";
  const cardContent = (
    <>
      <div className="mt-5 flex size-11 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/15 to-emerald-300/10 text-emerald-200 ring-1 ring-white/5">
        <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="text-base font-semibold text-slate-100">{mission.title}</h3>
        <p className="mt-1.5 text-sm leading-5 text-slate-400">
          {mission.description}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`w-fit rounded-sm border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
            mission.type === "theorie"
              ? "border-violet-400/20 bg-violet-400/5 text-violet-200"
              : "border-emerald-300/20 bg-emerald-300/5 text-emerald-200"
          }`}
        >
          {mission.type === "theorie" ? "Théorie" : "Pratique"}
        </span>
        <span
          className={`text-[10px] font-medium uppercase tracking-[0.1em] ${
            isCompleted
              ? "text-emerald-300"
              : isLocked
                ? "text-slate-500"
                : "text-violet-200"
          }`}
        >
          {statusLabel}
        </span>
      </div>
    </>
  );

  return (
    <article
      className={`group flex min-h-56 w-full flex-col rounded-md border bg-slate-900 p-5 transition duration-200 ${
        isCompleted
          ? "border-emerald-400/70 shadow-[0_0_24px_rgba(74,222,128,0.08)]"
          : isLocked
            ? "cursor-not-allowed border-slate-800 opacity-60"
            : "border-slate-800 hover:scale-105 hover:border-slate-600"
      }`}
    >
      <div className="flex w-full items-start justify-between">
        <span className="font-mono text-xs tracking-[0.12em] text-slate-500">
          MISSION {String(mission.id).padStart(2, "0")}
        </span>
        <span
          role="img"
          aria-label={`Mission ${statusLabel.toLowerCase()}`}
          className={`flex size-7 items-center justify-center rounded-full ${
            isCompleted
              ? "bg-emerald-400/15 text-emerald-300"
              : isLocked
                ? "border border-slate-700 text-slate-500"
                : "border border-violet-400/30 text-violet-200"
          }`}
        >
          {isCompleted ? (
            <Check aria-hidden="true" size={15} strokeWidth={2.5} />
          ) : isLocked ? (
            <LockKeyhole aria-hidden="true" size={13} />
          ) : (
            <span className="size-1.5 rounded-full bg-current" />
          )}
        </span>
      </div>

      {isLocked ? (
        <div aria-disabled="true" className="flex flex-1 flex-col">
          {cardContent}
        </div>
      ) : (
        <Link
          href={`/missions/${mission.id}`}
          aria-label={`Ouvrir la mission ${mission.id} : ${mission.title}`}
          className="flex flex-1 flex-col rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
        >
          {cardContent}
        </Link>
      )}
    </article>
  );
}
