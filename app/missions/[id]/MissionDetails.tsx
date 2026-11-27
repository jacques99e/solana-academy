import { notFound } from "next/navigation";
import { BookOpen, CheckCircle2 } from "lucide-react";
import Quiz, { type QuizQuestion } from "@/components/quiz/Quiz";
import { missions } from "@/lib/missions";
import MissionActions from "./MissionActions";

type LessonSection = {
  title: string;
  content: string;
};

type MissionCourse = {
  objective: string;
  introduction: string;
  sections: LessonSection[];
  takeaway: string;
};

const missionCourses: Record<number, MissionCourse> = {
  1: {
    objective: "Comprendre comment un registre partagé garde la trace des transactions.",
    introduction:
      "Imagine un cahier de comptes dont plusieurs personnes possèdent une copie. Lorsqu’une nouvelle opération est acceptée, chacun met à jour son exemplaire selon les mêmes règles. Une blockchain fonctionne sur cette idée, mais sous forme numérique.",
    sections: [
      {
        title: "1. Des transactions aux blocs",
        content:
          "Une transaction est une opération proposée au réseau, par exemple envoyer des tokens d’une adresse à une autre. Les transactions validées sont regroupées dans des blocs. Chaque bloc contient des données sur les opérations ainsi qu’une référence au bloc précédent.",
      },
      {
        title: "2. Un registre partagé",
        content:
          "Des ordinateurs indépendants, appelés nœuds, conservent et vérifient les données de la blockchain. Il n’existe donc pas un seul serveur dont la panne ou la décision pourrait, à elle seule, réécrire le registre.",
      },
      {
        title: "3. Pourquoi l’historique est difficile à modifier",
        content:
          "Les blocs sont liés par des empreintes cryptographiques et le réseau applique un protocole de consensus pour s’accorder sur les données valides. Modifier une ancienne opération impliquerait de refaire accepter une nouvelle version par le réseau : une modification devient ainsi détectable et coûteuse.",
      },
    ],
    takeaway:
      "Une blockchain est un registre distribué de transactions, organisé en blocs liés et vérifié par un réseau de participants.",
  },
  2: {
    objective: "Identifier le rôle de Proof of History, des validateurs et du token SOL.",
    introduction:
      "Solana est un réseau blockchain public. Ses applications peuvent échanger des données et des tokens, tandis que des validateurs exécutent le protocole et contribuent à confirmer les transactions.",
    sections: [
      {
        title: "1. Les validateurs et le consensus",
        content:
          "Un validateur participe au fonctionnement du réseau en traitant les transactions et en contribuant au consensus. Le consensus permet aux participants de s’accorder sur l’ordre et la validité des opérations, sans serveur central qui décide seul.",
      },
      {
        title: "2. À quoi sert Proof of History ?",
        content:
          "Proof of History (PoH) est une séquence cryptographique vérifiable qui fournit une référence temporelle et aide à ordonner les événements. PoH n’est pas, à lui seul, le mécanisme de consensus : il travaille avec les autres mécanismes de Solana pour aider le réseau à traiter les opérations.",
      },
      {
        title: "3. Le token SOL",
        content:
          "SOL est le token natif de Solana. Il sert notamment à payer les frais des transactions. Sur Devnet, les SOL distribués par airdrop sont uniquement des tokens de test : ils ne représentent pas des SOL ayant une valeur réelle.",
      },
    ],
    takeaway:
      "Solana s’appuie sur des validateurs et combine plusieurs mécanismes; PoH aide à ordonner les événements et SOL sert notamment aux frais.",
  },
  3: {
    objective: "Distinguer Devnet de Mainnet et comprendre l’usage des SOL de test.",
    introduction:
      "Avant de publier une application blockchain, il est utile de pouvoir l’essayer sans risquer de vrais fonds. Devnet est le réseau public de test de Solana, conçu précisément pour ces expérimentations.",
    sections: [
      {
        title: "1. Devnet et Mainnet",
        content:
          "Devnet est séparé de Mainnet, le réseau principal utilisé pour les opérations réelles. Un wallet et un solde sur Devnet sont propres à ce réseau : ils ne donnent pas accès au solde du même wallet sur Mainnet.",
      },
      {
        title: "2. Les SOL de test et les airdrops",
        content:
          "Les SOL de Devnet sont distribués gratuitement via un faucet ou un airdrop. Ils servent à payer les frais de test et à essayer des applications. Ils n’ont pas de valeur réelle et ne peuvent pas être convertis en SOL Mainnet.",
      },
      {
        title: "3. Tester sans risquer de vrais fonds",
        content:
          "Sur Devnet, tu peux connecter ton wallet, demander des SOL de test, envoyer des transactions et expérimenter avec des programmes. Vérifie toujours le réseau affiché par ton wallet avant de signer : une transaction Devnet et une transaction Mainnet n’ont pas les mêmes conséquences.",
      },
    ],
    takeaway:
      "Devnet est un réseau public de test isolé de Mainnet; ses tokens servent à expérimenter et n’ont pas de valeur réelle.",
  },
};

const quizQuestions: Record<number, QuizQuestion[]> = {
  1: [
    {
      question: "Qu'est-ce qu'une blockchain ?",
      options: [
        "Un registre distribué et sécurisé",
        "Un serveur centralisé",
        "Un site web",
      ],
      correctAnswer: 0,
      explanation:
        "Les transactions sont enregistrées dans des blocs liés et partagés entre les participants du réseau.",
      incorrectExplanation:
        "Une blockchain n'est ni un serveur unique ni un site web : c'est un registre partagé entre plusieurs participants.",
    },
    {
      question: "Qui contrôle une blockchain décentralisée ?",
      options: [
        "Une banque",
        "Personne seule : le réseau est maintenu par ses participants",
        "Le gouvernement",
      ],
      correctAnswer: 1,
      explanation:
        "Les règles du réseau sont appliquées collectivement par ses participants, plutôt que par une autorité centrale.",
      incorrectExplanation:
        "Une blockchain décentralisée n'est pas contrôlée par une banque ou un gouvernement unique.",
    },
  ],
  2: [
    {
      question: "Pourquoi Solana peut-elle traiter les transactions rapidement ?",
      options: [
        "Grâce à Proof of History, combiné au mécanisme de consensus du réseau",
        "Parce qu'elle utilise un seul serveur",
        "Parce qu'elle est centralisée",
      ],
      correctAnswer: 0,
      explanation:
        "Proof of History fournit une référence temporelle vérifiable qui aide les validateurs à ordonner efficacement les événements.",
      incorrectExplanation:
        "La rapidité de Solana ne vient pas d'un serveur unique ni de la centralisation; elle repose sur des mécanismes distribués.",
    },
    {
      question: "Quel est le nom de la monnaie native de Solana ?",
      options: ["SOL", "ETH", "BTC"],
      correctAnswer: 0,
      explanation:
        "SOL est le token natif utilisé notamment pour payer les frais de transaction sur Solana.",
      incorrectExplanation:
        "ETH est associé à Ethereum et BTC à Bitcoin; le token natif de Solana est SOL.",
    },
  ],
  3: [
    {
      question: "Qu'est-ce que le Devnet ?",
      options: [
        "Le réseau principal où l'argent est réel",
        "Un réseau de test avec des SOL sans valeur réelle",
        "Un réseau privé réservé à une seule personne",
      ],
      correctAnswer: 1,
      explanation:
        "Devnet est un réseau public de test où les développeurs peuvent expérimenter avec des SOL de test.",
      incorrectExplanation:
        "Devnet est public et distinct du réseau principal; ses SOL servent aux essais et n'ont pas de valeur réelle.",
    },
    {
      question: "À quoi servent les SOL obtenus par airdrop sur Devnet ?",
      options: [
        "À payer des essais et des frais de transaction sur le réseau de test",
        "À acheter des biens dans le monde réel",
        "À être convertis automatiquement en SOL du réseau principal",
      ],
      correctAnswer: 0,
      explanation:
        "Les SOL de test servent à expérimenter et à payer les frais sur Devnet, sans valeur sur le réseau principal.",
      incorrectExplanation:
        "Les SOL Devnet n'ont pas de valeur réelle et ne sont pas convertis en SOL Mainnet.",
    },
  ],
};

export default async function MissionDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mission = missions.find((item) => item.id === Number(id));

  if (!mission || !/^\d+$/.test(id)) {
    notFound();
  }

  const Icon = mission.icon;

  return (
    <section className="mt-6 rounded-md border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-emerald-300/15 bg-emerald-300/[0.06] text-emerald-200">
          <Icon aria-hidden="true" size={22} />
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
            Mission {String(mission.id).padStart(2, "0")} ·{" "}
            {mission.type === "pratique" ? "Pratique" : "Théorie"}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            {mission.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {mission.description}
          </p>
        </div>
      </div>

      {missionCourses[mission.id] && (
        <section
          aria-labelledby="course-heading"
          className="mt-8 rounded-md border border-violet-400/15 bg-slate-950/60 p-5 sm:p-7"
        >
          <div className="flex items-center gap-2 text-violet-200">
            <BookOpen aria-hidden="true" size={17} />
            <h2 id="course-heading" className="text-lg font-semibold text-white">
              Le cours
            </h2>
          </div>
          <div className="mt-4 rounded-md border border-slate-800 bg-slate-900/60 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
              Objectif du cours
            </p>
            <p className="mt-1 text-sm font-medium text-emerald-200">
              {missionCourses[mission.id].objective}
            </p>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-300">
            {missionCourses[mission.id].introduction}
          </p>
          <div className="mt-6 space-y-4">
            {missionCourses[mission.id].sections.map((section) => (
              <article
                key={section.title}
                className="rounded-md border border-slate-800/80 bg-slate-900/40 p-4 sm:p-5"
              >
                <h3 className="text-sm font-semibold text-slate-100">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {section.content}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-5 flex gap-2.5 border-t border-slate-800 pt-4 text-sm leading-6 text-emerald-200">
            <CheckCircle2
              aria-hidden="true"
              className="mt-1 shrink-0"
              size={16}
            />
            <span>
              <span className="font-semibold">À retenir : </span>
              {missionCourses[mission.id].takeaway}
            </span>
          </p>
        </section>
      )}

      <div className="mt-8 border-t border-slate-800 pt-6">
        {quizQuestions[mission.id] ? (
          <>
            <div className="mb-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                Deuxième étape
              </p>
              <h2 className="mt-1 text-lg font-semibold text-white">
                Quiz de validation
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-400">
                Réponds aux questions pour vérifier ce que tu as appris dans le cours.
              </p>
            </div>
            <Quiz missionId={mission.id} questions={quizQuestions[mission.id]} />
          </>
        ) : (
          <MissionActions missionId={mission.id} />
        )}
      </div>
    </section>
  );
}
