"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { missions } from "@/lib/missions";
import {
  getProgressSnapshot,
  getServerProgressSnapshot,
  parseCompletedMissions,
  subscribeToProgress,
} from "@/lib/progress";

type NextMissionButtonProps = {
  missionId: number;
};

export default function NextMissionButton({ missionId }: NextMissionButtonProps) {
  const progressSnapshot = useSyncExternalStore(
    subscribeToProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  );
  const missionCompleted = parseCompletedMissions(progressSnapshot).includes(
    missionId,
  );

  if (!missionCompleted) return null;

  const nextMission = missions.find((mission) => mission.id === missionId + 1);

  return (
    <div
      aria-live="polite"
      className="mt-6 flex justify-end border-t border-slate-800 pt-5"
    >
      <Link
        href={nextMission ? `/missions/${nextMission.id}` : "/"}
        aria-label={
          nextMission
            ? `Passer a la mission ${nextMission.id} : ${nextMission.title}`
            : "Retourner aux missions"
        }
        className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-violet-500 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 active:scale-[0.98]"
      >
        {nextMission ? "Suivant" : "Retour aux missions"}
        <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </div>
  );
}
