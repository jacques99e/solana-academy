# Solana Academy

## Le Duolingo du Web3 sur Solana

Solana Academy est un parcours interactif qui aide les débutants à comprendre Solana en pratiquant. En dix missions progressives, les apprenants découvrent les concepts, connectent un wallet de test, explorent Devnet et terminent par une interaction vérifiable avec un programme Rust/Anchor.

> **Projet hackathon Dev3pack** · Application et démonstrations sur **Solana Devnet**. Les SOL de test n'ont aucune valeur réelle.

| Ressource | Lien |
| --- | --- |
| Application en ligne | [URL Vercel]() |
| Vidéo de démonstration | [Lien vers la démo]() |
| Program ID · Devnet | `[PROGRAM_ID]` |

Remplace les liens et `[PROGRAM_ID]` par les valeurs de livraison avant la soumission.

## Pourquoi Solana Academy ?

Le Web3 peut être difficile à aborder : nouveaux concepts, wallets, réseaux et transactions sont souvent présentés sans parcours guidé. Solana Academy décompose l'apprentissage en objectifs simples, explications, défis et manipulations sur Devnet. Chaque étape prépare la suivante et permet de vérifier ce qui a été appris.

## Parcours en 10 missions

1. **Blockchain** — Comprendre les blocs, les transactions et les validateurs.
2. **Solana** — Découvrir les mécanismes du réseau et le rôle de SOL.
3. **Devnet** — Apprendre à tester sans risquer de fonds Mainnet.
4. **Wallet** — Adopter les réflexes essentiels de sécurité.
5. **Connexion** — Relier un wallet et vérifier l'adresse publique.
6. **Airdrop** — Obtenir et vérifier des SOL de test.
7. **Solde** — Lire le solde d'un compte sur Devnet.
8. **Explorer** — Retrouver et examiner une transaction confirmée.
9. **Signer** — Signer un message et comprendre la preuve produite.
10. **Anchor** — Appeler un programme Rust et vérifier un compte PDA.

Les missions 1 à 3 proposent des quiz de validation. Les missions suivantes associent des mini-défis de compréhension à une activité pratique : checklist de sécurité, connexion du wallet, lecture de données ou action sur Devnet.

## Fonctionnalités

- **Dix missions progressives** avec objectifs, cours, compétences visées et liens vers l'étape suivante.
- **Quiz et mini-défis interactifs** avec explications après les réponses.
- **Progression sauvegardée localement** et reprise à la prochaine mission.
- **Connexion Phantom ou Solflare** avec l'adaptateur wallet Solana.
- **Pratique sur Devnet** : demande de SOL de test, lecture de solde et exploration de transactions confirmées.
- **Signature de message** pour comprendre une preuve de contrôle du wallet, distincte d'une transaction on-chain.
- **Mission finale Rust/Anchor** : envoi d'une instruction, confirmation de la transaction et vérification du PDA et du statut du diplôme.
- **Preuves consultables** avec liens vers Solana Explorer ou Solscan.

## Stack technique

| Domaine | Technologies |
| --- | --- |
| Interface et routes | Next.js 16, React 19, TypeScript |
| Styles | Tailwind CSS 4 |
| Wallets | Solana Wallet Adapter, Phantom, Solflare |
| Réseau et transactions | `@solana/web3.js` |
| Programme on-chain | Rust, Anchor 0.32.1 |
| Réseau de démonstration | Solana Devnet |

## Démarrer en local

### Prérequis

- Node.js et npm
- Un wallet compatible Solana (Phantom ou Solflare) pour les missions pratiques
- Des SOL Devnet pour envoyer des transactions de test

### Installation

```bash
git clone <URL_DU_DEPOT>
cd solana-academy
npm install
```

Crée un fichier `.env.local` à la racine et configure le Program ID Devnet :

```env
NEXT_PUBLIC_SOLANA_ACADEMY_PROGRAM_ID=[PROGRAM_ID]
```

Cette variable est nécessaire à la mission Anchor. Les autres missions peuvent être explorées sans elle. Ne mets jamais de clé privée ou de phrase de récupération dans un fichier du projet.

Lance l'application :

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

### Vérifications

```bash
npm run lint
npm run build
```

## Programme Anchor

Le code Rust se trouve dans [`anchor/programs/solana_academy/src/lib.rs`](./anchor/programs/solana_academy/src/lib.rs). Il expose `enregistrer_diplome` et crée, au besoin, un compte PDA associé au wallet signataire.

La mission 10 est configurée avec `NEXT_PUBLIC_SOLANA_ACADEMY_PROGRAM_ID`. Après une transaction confirmée, le frontend relit le compte et vérifie que le wallet correspond et que `niveau_1_valide` est vrai avant d'enregistrer la réussite.

Le programme doit être déployé sur **Devnet**. Pour le compiler dans le navigateur, suivre le [guide officiel Anchor pour Solana Playground](https://www.anchor-lang.com/docs/quickstart/solpg). Le wallet connecté dans l'application doit également disposer de SOL Devnet pour payer les frais de la transaction.

## Sécurité

- Utilise Devnet pour les exercices : ses tokens sont fictifs et sans valeur.
- Ne partage jamais une phrase de récupération ou une clé privée.
- Vérifie le réseau et le contenu avant d'approuver une demande dans ton wallet.
- `.env.local` est ignoré par Git ; le Program ID, lui, est une adresse publique.

## Démo hackathon

Le script minuté de la vidéo (durée cible : **2 min 55 s**) est disponible dans [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md).

