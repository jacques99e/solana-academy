import {
  Activity,
  Blocks,
  CircleDot,
  Code2,
  Compass,
  FileSignature,
  FlaskConical,
  Gift,
  Link2,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type MissionType = "theorie" | "pratique";

export type Mission = {
  id: number;
  title: string;
  description: string;
  type: MissionType;
  icon: LucideIcon;
};

export const missions: Mission[] = [
  {
    id: 1,
    title: "Blockchain",
    description: "Comprends les blocs, les transactions et les validateurs.",
    type: "theorie",
    icon: Blocks,
  },
  {
    id: 2,
    title: "Solana",
    description: "Découvre ce qui rend le réseau Solana si rapide.",
    type: "theorie",
    icon: CircleDot,
  },
  {
    id: 3,
    title: "Devnet",
    description: "Explore le terrain de jeu de développement Solana.",
    type: "theorie",
    icon: FlaskConical,
  },
  {
    id: 4,
    title: "Wallet",
    description: "Prépare ton portefeuille pour tes premières missions.",
    type: "pratique",
    icon: Wallet,
  },
  {
    id: 5,
    title: "Connect",
    description: "Connecte ton wallet au réseau Devnet.",
    type: "pratique",
    icon: Link2,
  },
  {
    id: 6,
    title: "Airdrop",
    description: "Récupère tes premiers SOL de test gratuits.",
    type: "pratique",
    icon: Gift,
  },
  {
    id: 7,
    title: "Solde",
    description: "Vérifie ton solde et suis tes ressources.",
    type: "pratique",
    icon: Activity,
  },
  {
    id: 8,
    title: "Explorer",
    description: "Inspecte les transactions sur un explorateur.",
    type: "pratique",
    icon: Compass,
  },
  {
    id: 9,
    title: "Signer",
    description: "Signe ta première transaction en toute confiance.",
    type: "pratique",
    icon: FileSignature,
  },
  {
    id: 10,
    title: "Rust",
    description: "Fais tes premiers pas dans le langage de Solana.",
    type: "theorie",
    icon: Code2,
  },
];