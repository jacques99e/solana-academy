"use client";

import { useEffect, useState } from "react";
import type { PublicKey } from "@solana/web3.js";
import {
  getRecentTransactions,
  type RecentTransaction,
} from "@/lib/solana";
import useWalletProgress from "@/components/progress/useWalletProgress";

type TransactionExplorerProps = {
  publicKey: PublicKey | null;
};

export default function TransactionExplorer({
  publicKey,
}: TransactionExplorerProps) {
  const { completedMissions, markCompleted } = useWalletProgress();
  const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
  const [selectedSignature, setSelectedSignature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) {
      return;
    }

    let active = true;

    getRecentTransactions(publicKey)
      .then((recentTransactions) => {
        if (active) {
          setTransactions(recentTransactions);
          setSelectedSignature((current) =>
            recentTransactions.some((transaction) => transaction.signature === current)
              ? current
              : recentTransactions[0]?.signature ?? null,
          );
        }
      })
      .catch((fetchError: unknown) => {
        if (active) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Impossible de charger l'historique Devnet.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [publicKey]);

  const selectedTransaction = transactions.find(
    (transaction) => transaction.signature === selectedSignature,
  );

  function validateExploration() {
    if (!selectedTransaction) return;

    setValidationError(null);
    try {
      markCompleted(8);
    } catch (validationError) {
      setValidationError(
        validationError instanceof Error
          ? validationError.message
          : "Impossible d'enregistrer la progression.",
      );
    }
  }

  if (!publicKey) {
    return (
      <p className="rounded-md border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
        Connecte ton wallet pour explorer ses transactions Devnet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading && (
        <p role="status" className="text-sm text-slate-400">
          Chargement des transactions confirmées...
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-rose-300">
          {error}
        </p>
      )}
      {!isLoading && !error && transactions.length === 0 && (
        <p className="rounded-md border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          Aucune transaction réussie trouvée pour ce wallet. Termine d’abord
          l’airdrop de la mission 6, puis reviens ici.
        </p>
      )}
      {transactions.length > 0 && (
        <div className="space-y-3">
          <label className="block space-y-2 text-sm text-slate-300">
            <span>Choisis une transaction confirmée à examiner</span>
            <select
              value={selectedSignature ?? ""}
              onChange={(event) => setSelectedSignature(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-xs text-slate-200"
            >
              {transactions.map((transaction) => (
                <option key={transaction.signature} value={transaction.signature}>
                  {transaction.signature.slice(0, 18)}… · slot {transaction.slot}
                </option>
              ))}
            </select>
          </label>
          {selectedTransaction && (
            <div className="space-y-2 rounded-md border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">
                Slot confirmé :{" "}
                <span className="font-mono text-slate-200">
                  {selectedTransaction.slot}
                </span>
              </p>
              {selectedTransaction.blockTime !== null && (
                <p className="text-xs text-slate-400">
                  Horodatage UTC :{" "}
                  <span className="font-mono text-slate-200">
                    {new Date(selectedTransaction.blockTime * 1000).toISOString()}
                  </span>
                </p>
              )}
              <p className="break-all font-mono text-[11px] text-slate-400">
                Signature : {selectedTransaction.signature}
              </p>
              <a
                href={`https://explorer.solana.com/tx/${selectedTransaction.signature}?cluster=devnet`}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
              >
                Ouvrir cette transaction sur Solana Explorer
              </a>
            </div>
          )}
          {validationError && (
            <p role="alert" className="text-sm text-rose-300">
              {validationError}
            </p>
          )}
          {completedMissions.includes(8) ? (
            <p role="status" className="text-sm text-emerald-300">
              Mission validée : tu as sélectionné une transaction confirmée.
            </p>
          ) : (
            <button
              type="button"
              onClick={validateExploration}
              disabled={!selectedTransaction}
              className="rounded-md border border-emerald-300/25 bg-emerald-300/10 px-4 py-2.5 text-sm font-medium text-emerald-200 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Valider l’exploration
            </button>
          )}
        </div>
      )}
    </div>
  );
}
