"use client";

import {
  ArrowUpRight,
  Coins,
  Image as ImageIcon,
  Landmark,
  Sparkles,
} from "lucide-react";
import MissionCard from "@/components/missions/MissionCard";
import Header from "@/components/layout/Header";
import ProgressBar from "@/components/layout/ProgressBar";
import { missions } from "@/lib/missions";
import useWalletProgress from "@/components/progress/useWalletProgress";

const upcomingMissions = [
  { title: "Token SPL", description: "Crée et gère des tokens.", icon: Coins },
  { title: "NFT", description: "Découvre les actifs numériques.", icon: ImageIcon },
  { title: "Staking", description: "Mets tes SOL au travail.", icon: Landmark },
];

export default function Home() {
  const {
    completedCount,
    missionStatuses,
    progressError,
  } = useWalletProgress();

  return (
    <main className="min-h-screen flex-1 bg-[#080b11] text-slate-100">
      <Header />
      <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
        <section id="top" className="pb-10 pt-14 sm:pb-12 sm:pt-20">
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-emerald-300">
              <Sparkles aria-hidden="true" size={14} />
              Ton premier parcours on-chain
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
              Solana{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-emerald-300 bg-clip-text text-transparent">
                Academy
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              Apprends les fondamentaux, passe à la pratique et construis tes premiers
              repères sur Solana.
            </p>
          </div>
        </section>

        <section
          aria-label="Ta progression"
          className="mb-10 rounded-md border border-slate-800/90 bg-slate-900/70 p-5 sm:mb-12 sm:p-6"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.13em] text-slate-500">
                Niveau 1
              </p>
              <h2 className="mt-1 text-lg font-semibold text-white">Les fondamentaux</h2>
            </div>
            <span className="rounded-sm border border-slate-700 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
              10 missions
            </span>
          </div>
          <ProgressBar completed={completedCount} total={missions.length} />
          {progressError && (
            <p role="alert" className="mt-3 text-sm text-rose-300">
              {progressError}
            </p>
          )}
        </section>

        <section aria-labelledby="missions-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                À toi de jouer
              </p>
              <h2 id="missions-heading" className="mt-1 text-xl font-semibold text-white">
                Missions
              </h2>
            </div>
            <span className="hidden text-xs text-slate-500 sm:block">
              {completedCount} terminées sur {missions.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {missions.map((mission, index) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                status={missionStatuses[index] ?? "locked"}
              />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="level-two-heading"
          className="mt-16 border-t border-white/[0.07] pt-8"
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                La suite du parcours
              </p>
              <h2 id="level-two-heading" className="mt-1 text-xl font-semibold text-slate-300">
                Niveau 2 <span className="font-normal text-slate-500">- Coming Soon</span>
              </h2>
            </div>
            <span className="rounded-sm border border-slate-800 bg-slate-900 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Bientôt disponible
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {upcomingMissions.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                aria-disabled="true"
                className="flex min-h-24 items-center gap-4 rounded-md border border-slate-800/70 bg-slate-900/40 px-5 py-4 opacity-55 grayscale"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-slate-700/70 bg-slate-800/60 text-slate-400">
                  <Icon aria-hidden="true" size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-slate-300">{title}</span>
                  <span className="mt-1 block text-xs text-slate-500">{description}</span>
                </span>
                <ArrowUpRight aria-hidden="true" className="shrink-0 text-slate-600" size={15} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
