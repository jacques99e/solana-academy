"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { missions } from "@/lib/missions";
import { getMissionStatus } from "@/lib/progress";
import useWalletProgress from "@/components/progress/useWalletProgress";

type MissionAccessGuardProps = {
  missionId: number;
  children: ReactNode;
};

export default function MissionAccessGuard({
  missionId,
  children,
}: MissionAccessGuardProps) {
  const {
    completedMissions,
    isReady,
    progressError,
    walletAddress,
  } = useWalletProgress();
  const status = getMissionStatus(missionId, completedMissions);

  if (!isReady) {
    return (
      <section
        role="status"
        aria-busy="true"
        className="mt-6 rounded-md border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400"
      >
        Chargement de ta progression...
      </section>
    );
  }

  if (status === "locked") {
    const mission = missions.find(({ id }) => id === missionId);
    const previousMission = missions.find(({ id }) => id === missionId - 1);

    return (
      <section className="mt-6 space-y-4 rounded-md border border-amber-300/20 bg-slate-900/70 p-6 sm:p-8">
        {progressError && (
          <p role="alert" className="text-sm text-rose-300">
            {progressError}
          </p>
        )}
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-amber-200">
          Mission verrouillée
        </p>
        <h1 className="text-xl font-semibold text-white">
          Termine {previousMission ? `la mission ${previousMission.id}` : "les étapes précédentes"}
          {mission ? ` pour débloquer « ${mission.title} ».` : "."}
        </h1>
        <div className="flex flex-wrap gap-3">
          {previousMission && (
            <Link
              href={`/missions/${previousMission.id}`}
              className="rounded-md bg-gradient-to-r from-violet-500 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
            >
              Continuer le parcours
            </Link>
          )}
          <Link
            href="/"
            className="rounded-md border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-200 transition hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
          >
            Voir les missions
          </Link>
        </div>
      </section>
    );
  }

  return (
    <Fragment key={walletAddress ?? "guest"}>
      {progressError && (
        <p role="alert" className="mt-4 text-sm text-rose-300">
          {progressError}
        </p>
      )}
      {children}
    </Fragment>
  );
}
