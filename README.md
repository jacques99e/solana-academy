This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Mission 10: Anchor sur Devnet

Le programme Anchor se trouve dans `anchor/`. Sous Windows, utilisez WSL2 avec Rust, la Solana CLI et Anchor CLI 0.32.1. Avant `anchor build`, générez la clé du programme et remplacez l'adresse d'exemple dans `anchor/Anchor.toml` et `anchor/programs/solana_academy/src/lib.rs` par son adresse publique. Après `anchor deploy`, définissez cette adresse comme `NEXT_PUBLIC_SOLANA_ACADEMY_PROGRAM_ID` dans `.env.local`, puis redémarrez Next.js.

Sur la Mission 10, le frontend attend la confirmation de la transaction puis relit le compte PDA sur Devnet. Il ne valide la mission qu'après avoir vérifié que le compte appartient au wallet connecté et que `niveau_1_valide` est vrai. L'adresse du PDA et un lien vers Solana Explorer sont affichés comme preuve.

Gardez les fichiers de clés du programme et du wallet de déploiement privés. Le dossier `anchor/target/` est ignoré par Git.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
