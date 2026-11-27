import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { missions } from "@/lib/missions";
import MissionDetails from "./MissionDetails";

export function generateStaticParams() {
  return missions.map(({ id }) => ({ id: String(id) }));
}

export default function MissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen flex-1 bg-slate-950 text-slate-100">
      <Header />
      <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <Link
          href="/"
          className="text-sm text-slate-400 transition hover:text-emerald-300"
        >
          ← Retour aux missions
        </Link>

        <Suspense fallback={<MissionDetailsFallback />}>
          <MissionDetails params={params} />
        </Suspense>
      </div>
    </main>
  );
}

function MissionDetailsFallback() {
  return (
    <section
      aria-busy="true"
      aria-label="Chargement de la mission"
      className="mt-6 rounded-md border border-slate-800 bg-slate-900/70 p-6 sm:p-8"
    >
      <p className="text-sm text-slate-400">Chargement de la mission...</p>
    </section>
  );
}
