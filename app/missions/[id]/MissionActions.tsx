"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import {
  DevnetFaucetClosedError,
  getBalance,
  getDiplomaStatus,
  registerDiploma,
  requestAirdrop,
  signMessage,
  type DiplomaStatus,
} from "@/lib/solana";
import TransactionExplorer from "@/components/missions/TransactionExplorer";
import WalletSafetyChecklist from "@/components/missions/WalletSafetyChecklist";
import useWalletProgress from "@/components/progress/useWalletProgress";

type MissionActionsProps = {
  missionId: number;
};

export default function MissionActions({ missionId }: MissionActionsProps) {
  const wallet = useWallet();
  const { connected, publicKey, sendTransaction } = wallet;
  const { completedMissions, markCompleted, walletAddress } = useWalletProgress();
  const [isRequestingAirdrop, setIsRequestingAirdrop] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(
    null,
  );
  const [airdropError, setAirdropError] = useState<string | null>(null);
  const [externalFaucetRequired, setExternalFaucetRequired] = useState(false);
  const [externalFaucetBaseline, setExternalFaucetBaseline] = useState<number | null>(
    null,
  );
  const [externalFaucetBalance, setExternalFaucetBalance] = useState<number | null>(
    null,
  );
  const [externalFaucetError, setExternalFaucetError] = useState<string | null>(
    null,
  );
  const [isReadingExternalBaseline, setIsReadingExternalBaseline] = useState(false);
  const [isVerifyingExternalAirdrop, setIsVerifyingExternalAirdrop] = useState(false);
  const [isCopyingWalletAddress, setIsCopyingWalletAddress] = useState(false);
  const [messageSignature, setMessageSignature] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [diplomaSignature, setDiplomaSignature] = useState<string | null>(null);
  const [diplomaError, setDiplomaError] = useState<string | null>(null);
  const [isRegisteringDiploma, setIsRegisteringDiploma] = useState(false);
  const [diplomaStatus, setDiplomaStatus] = useState<DiplomaStatus | null>(null);
  const [diplomaStatusWallet, setDiplomaStatusWallet] = useState<string | null>(null);
  const [diplomaStatusCheckedWallet, setDiplomaStatusCheckedWallet] = useState<
    string | null
  >(null);
  const [diplomaStatusError, setDiplomaStatusError] = useState<string | null>(null);
  const [diplomaStatusErrorWallet, setDiplomaStatusErrorWallet] = useState<string | null>(
    null,
  );
  const [progressError, setProgressError] = useState<string | null>(null);
  const activeDiplomaStatus =
    connected &&
    publicKey &&
    diplomaStatusWallet === publicKey.toBase58()
      ? diplomaStatus
      : null;
  const activeDiplomaStatusError =
    connected &&
    publicKey &&
    diplomaStatusErrorWallet === publicKey.toBase58()
      ? diplomaStatusError
      : null;
  const isCheckingDiplomaStatus =
    missionId === 10 &&
    connected &&
    publicKey &&
    diplomaStatusCheckedWallet !== publicKey.toBase58();

  function completeMission(id: number) {
    try {
      markCompleted(id);
      setProgressError(null);
    } catch (error) {
      setProgressError(
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer la progression.",
      );
    }
  }

  function validateWalletConnection() {
    if (connected && publicKey) {
      completeMission(5);
    }
  }

  useEffect(() => {
    if (missionId !== 10 || !connected || !publicKey) {
      return;
    }

    let active = true;
    const walletAddress = publicKey.toBase58();

    getDiplomaStatus(publicKey)
      .then((status) => {
        if (active) {
          setDiplomaStatus(status);
          setDiplomaStatusWallet(walletAddress);
          setDiplomaStatusCheckedWallet(walletAddress);
          setDiplomaStatusError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setDiplomaStatusError(
            error instanceof Error
              ? error.message
              : "Impossible de vérifier le diplôme sur Devnet.",
          );
          setDiplomaStatusErrorWallet(walletAddress);
          setDiplomaStatusCheckedWallet(walletAddress);
        }
      });

    return () => {
      active = false;
    };
  }, [missionId, connected, publicKey]);

  if (missionId === 4) {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-slate-400">
          Avant d’utiliser un wallet, adopte ces réflexes de sécurité. Coche chaque
          règle après l’avoir lue.
        </p>
        <WalletSafetyChecklist key={walletAddress ?? "guest"} />
      </div>
    );
  }

  async function handleSignMessage() {
    if (!wallet.signMessage || isSigningMessage) {
      return;
    }

    setIsSigningMessage(true);
    setMessageError(null);
    setMessageSignature(null);

    try {
      const signature = await signMessage(
        wallet,
        "Je certifie être un étudiant de Solana Academy",
      );
      setMessageSignature(
        Array.from(signature, (byte) => byte.toString(16).padStart(2, "0")).join(""),
      );
      completeMission(9);
    } catch (error) {
      setMessageError(
        error instanceof Error ? error.message : "La signature du message a échoué.",
      );
    } finally {
      setIsSigningMessage(false);
    }
  }

  async function handleRegisterDiploma() {
    if (!publicKey || isRegisteringDiploma) {
      return;
    }

    setIsRegisteringDiploma(true);
    setDiplomaError(null);
    setDiplomaSignature(null);

    try {
      const result = await registerDiploma(publicKey, sendTransaction);
      setDiplomaSignature(result.signature);
      setDiplomaStatus(result.status);
      setDiplomaStatusWallet(publicKey.toBase58());
      setDiplomaStatusCheckedWallet(publicKey.toBase58());
      setDiplomaStatusError(null);
      completeMission(10);
    } catch (error) {
      setDiplomaError(
        error instanceof Error
          ? error.message
          : "L'enregistrement du diplôme a échoué.",
      );
    } finally {
      setIsRegisteringDiploma(false);
    }
  }

  async function handleAirdrop() {
    if (!publicKey || isRequestingAirdrop) {
      return;
    }

    setIsRequestingAirdrop(true);
    setAirdropError(null);
    setTransactionSignature(null);

    try {
      const signature = await requestAirdrop(publicKey);
      setTransactionSignature(signature);
      completeMission(6);
    } catch (error) {
      if (error instanceof DevnetFaucetClosedError) {
        setExternalFaucetRequired(true);
        await readExternalFaucetBaseline(publicKey);
      } else {
        setAirdropError(
          error instanceof Error
            ? error.message
            : "La demande d'airdrop a échoué. Réessaie dans quelques instants.",
        );
      }
    } finally {
      setIsRequestingAirdrop(false);
    }
  }

  async function readExternalFaucetBaseline(walletPublicKey: PublicKey) {
    setIsReadingExternalBaseline(true);
    setExternalFaucetError(null);
    try {
      setExternalFaucetBaseline(await getBalance(walletPublicKey));
    } catch (error) {
      setExternalFaucetBaseline(null);
      setExternalFaucetError(
        error instanceof Error
          ? `Impossible de lire le solde de départ : ${error.message}`
          : "Impossible de lire le solde de départ sur Devnet.",
      );
    } finally {
      setIsReadingExternalBaseline(false);
    }
  }

  async function copyWalletAddress() {
    if (!publicKey) return;

    setIsCopyingWalletAddress(true);
    setExternalFaucetError(null);
    try {
      await navigator.clipboard.writeText(publicKey.toBase58());
    } catch (error) {
      setExternalFaucetError(
        error instanceof Error
          ? `Impossible de copier l’adresse : ${error.message}`
          : "Impossible de copier l’adresse du wallet.",
      );
    } finally {
      setIsCopyingWalletAddress(false);
    }
  }

  async function verifyExternalAirdrop() {
    if (!publicKey || externalFaucetBaseline === null || isVerifyingExternalAirdrop) {
      return;
    }

    setIsVerifyingExternalAirdrop(true);
    setExternalFaucetError(null);
    setExternalFaucetBalance(null);
    try {
      const currentBalance = await getBalance(publicKey);
      if (currentBalance <= externalFaucetBaseline) {
        setExternalFaucetError(
          "Aucun nouveau SOL détecté pour le moment. Attends la confirmation du faucet, puis réessaie.",
        );
        return;
      }

      setExternalFaucetBalance(currentBalance);
      completeMission(6);
    } catch (error) {
      setExternalFaucetError(
        error instanceof Error
          ? error.message
          : "Impossible de vérifier le solde sur Devnet.",
      );
    } finally {
      setIsVerifyingExternalAirdrop(false);
    }
  }

  if (missionId === 5) {
    return (
      <div className="space-y-3">
        {connected && publicKey ? (
          <div
            role="status"
            className="rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] p-4 text-sm text-emerald-200"
          >
            Wallet connecté :{" "}
            <span className="font-mono">
              {publicKey.toBase58().slice(0, 4)}…{publicKey.toBase58().slice(-4)}
            </span>
          </div>
        ) : (
          <p className="rounded-md border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
            Connecte ton wallet pour valider cette mission.
          </p>
        )}
        <button
          type="button"
          onClick={validateWalletConnection}
          disabled={!connected || !publicKey || completedMissions.includes(5)}
          className="rounded-md border border-emerald-300/25 bg-emerald-300/10 px-4 py-2.5 text-sm font-medium text-emerald-200 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {completedMissions.includes(5) ? "Mission validée" : "Valider la connexion"}
        </button>

      </div>
    );
  }

  if (missionId === 6) {
    return (
      <div className="space-y-4">
        {!connected && (
          <p className="text-sm text-slate-400">
            Connecte ton wallet avant de demander des SOL de test.
          </p>
        )}
        <button
          type="button"
          onClick={handleAirdrop}
          disabled={
            !connected ||
            !publicKey ||
            isRequestingAirdrop ||
            externalFaucetRequired
          }
          className="rounded-md border border-emerald-300/25 bg-emerald-300/10 px-4 py-2.5 text-sm font-medium text-emerald-200 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRequestingAirdrop
            ? "Demande en cours..."
            : "Demander 1 SOL (Airdrop)"}
        </button>

        {airdropError && (
          <p role="alert" className="text-sm text-rose-300">
            {airdropError}
          </p>
        )}
        {externalFaucetRequired && publicKey && (
          <div className="space-y-4 rounded-md border border-amber-300/20 bg-amber-300/[0.05] p-4">
            <div className="space-y-2 text-sm leading-6 text-slate-300">
              <p className="font-medium text-amber-200">
                Le faucet intégré au RPC Devnet est fermé (erreur 410).
              </p>
              <p>
                Utilise le faucet officiel de Solana. Colle cette adresse,
                sélectionne Devnet et demande des SOL de test. Reviens ensuite
                ici pour vérifier que ton solde a augmenté.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <code className="max-w-full break-all rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200">
                {publicKey.toBase58()}
              </code>
              <button
                type="button"
                onClick={copyWalletAddress}
                disabled={isCopyingWalletAddress}
                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
              >
                {isCopyingWalletAddress ? "Copie..." : "Copier l’adresse"}
              </button>
            </div>
            <a
              href="https://faucet.solana.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-md border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-sm font-medium text-amber-100 transition hover:bg-amber-300/15"
            >
              Ouvrir le faucet officiel
            </a>
            <button
              type="button"
              onClick={verifyExternalAirdrop}
              disabled={
                externalFaucetBaseline === null || isVerifyingExternalAirdrop
              }
              className="rounded-md border border-emerald-300/25 bg-emerald-300/10 px-4 py-2.5 text-sm font-medium text-emerald-200 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isVerifyingExternalAirdrop
                ? "Vérification..."
                : "Vérifier le solde Devnet"}
            </button>
            {externalFaucetBaseline === null && (
              <button
                type="button"
                onClick={() => void readExternalFaucetBaseline(publicKey)}
                disabled={isReadingExternalBaseline}
                className="rounded-md border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isReadingExternalBaseline
                  ? "Lecture du solde..."
                  : "Réessayer la lecture du solde"}
              </button>
            )}
            {externalFaucetError && (
              <p role="alert" className="text-sm text-rose-300">
                {externalFaucetError}
              </p>
            )}
          </div>
        )}
        {progressError && (
          <p role="alert" className="text-sm text-rose-300">
            {progressError}
          </p>
        )}

        {transactionSignature && (
          <p
            role="status"
            className="rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] p-4 text-sm text-emerald-200"
          >
            Airdrop confirmé{completedMissions.includes(6) ? " et mission validée" : ""} !{" "}
            <a
              href={`https://solscan.io/tx/${transactionSignature}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-emerald-100"
            >
              Voir la transaction sur Solscan
            </a>
          </p>
        )}
        {externalFaucetBalance !== null && (
          <p
            role="status"
            className="rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] p-4 text-sm text-emerald-200"
          >
            Nouveau solde confirmé : {externalFaucetBalance.toFixed(2)} SOL.
            Mission validée.
          </p>
        )}
      </div>
    );
  }

  if (missionId === 7) {
    return !connected || !publicKey ? (
      <p className="text-sm text-slate-400">
        Connecte ton wallet pour consulter ton solde Devnet.
      </p>
    ) : (
      <BalancePanel key={publicKey.toBase58()} publicKey={publicKey} />
    );
  }

  if (missionId === 8) {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-slate-400">
          Examine une transaction réussie de ton wallet. Les signatures et slots
          sont lus depuis Devnet; le lien ouvre sa fiche sur Solana Explorer.
        </p>
        <TransactionExplorer
          key={publicKey?.toBase58() ?? "disconnected"}
          publicKey={connected ? publicKey : null}
        />
      </div>
    );
  }

  if (missionId === 9) {
    return (
      <div className="space-y-4">
        {!connected && (
          <p className="text-sm text-slate-400">
            Connecte ton wallet pour signer le message.
          </p>
        )}
        {connected && !wallet.signMessage && (
          <p role="alert" className="text-sm text-amber-300">
            Ce wallet ne prend pas en charge la signature de messages.
          </p>
        )}
        <button
          type="button"
          onClick={handleSignMessage}
          disabled={!connected || !wallet.signMessage || isSigningMessage}
          className="rounded-md border border-violet-300/25 bg-violet-300/10 px-4 py-2.5 text-sm font-medium text-violet-200 transition hover:bg-violet-300/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSigningMessage ? "Signature en cours..." : "Signer le message"}
        </button>
        {messageError && (
          <p role="alert" className="text-sm text-rose-300">
            {messageError}
          </p>
        )}
        {progressError && (
          <p role="alert" className="text-sm text-rose-300">
            {progressError}
          </p>
        )}
        {messageSignature && (
          <div
            role="status"
            className="space-y-2 rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] p-4 text-sm text-emerald-200"
          >
            <p>
              Message signé.{" "}
              {completedMissions.includes(9)
                ? "Mission validée."
                : "La signature a été obtenue."}
            </p>
            <p className="break-all font-mono text-xs text-slate-300">
              {messageSignature}
            </p>
            <p className="text-xs text-slate-400">
              Cette signature prouve le contrôle du wallet; elle n’est pas une
              transaction on-chain.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (missionId === 10) {
    return (
      <div className="space-y-4">
        {!connected && (
          <p className="text-sm text-slate-400">
            Connecte ton wallet pour enregistrer ton diplôme sur le Devnet.
          </p>
        )}
        <button
          type="button"
          onClick={handleRegisterDiploma}
          disabled={
            !connected ||
            !publicKey ||
            isRegisteringDiploma ||
            isCheckingDiplomaStatus ||
            Boolean(
              activeDiplomaStatus?.exists &&
                activeDiplomaStatus.walletMatches &&
                activeDiplomaStatus.niveau1Valide,
            )
          }
          className="rounded-md border border-emerald-300/25 bg-emerald-300/10 px-4 py-2.5 text-sm font-medium text-emerald-200 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRegisteringDiploma
            ? "Confirmation dans le wallet..."
            : activeDiplomaStatus?.exists &&
                activeDiplomaStatus.walletMatches &&
                activeDiplomaStatus.niveau1Valide
              ? "Diplôme déjà enregistré"
              : "Enregistrer mon diplôme"}
        </button>
        {diplomaError && (
          <p role="alert" className="text-sm text-rose-300">
            {diplomaError}
          </p>
        )}
        {activeDiplomaStatusError && (
          <p role="alert" className="text-sm text-rose-300">
            Vérification on-chain impossible : {activeDiplomaStatusError}
          </p>
        )}
        {progressError && (
          <p role="alert" className="text-sm text-rose-300">
            {progressError}
          </p>
        )}
        {isCheckingDiplomaStatus && (
          <p role="status" className="text-sm text-slate-400">
            Vérification du diplôme sur Devnet...
          </p>
        )}
        {connected && activeDiplomaStatus && (
          <div
            role="status"
            className="space-y-2 rounded-md border border-slate-800 bg-slate-950/60 p-4 text-sm"
          >
            <p className="font-medium text-slate-200">
              {activeDiplomaStatus.exists &&
              activeDiplomaStatus.walletMatches &&
              activeDiplomaStatus.niveau1Valide
                ? "Diplôme vérifié sur la blockchain."
                : "Aucun diplôme validé trouvé pour ce wallet."}
            </p>
            <p className="break-all font-mono text-xs text-slate-400">
              Compte PDA : {activeDiplomaStatus.address.toBase58()}
            </p>
            <a
              href={`https://explorer.solana.com/address/${activeDiplomaStatus.address.toBase58()}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
            >
              Vérifier le compte sur Solana Explorer
            </a>
            {activeDiplomaStatus.exists &&
              activeDiplomaStatus.walletMatches &&
              activeDiplomaStatus.niveau1Valide &&
              !completedMissions.includes(10) && (
                <button
                  type="button"
                  onClick={() => completeMission(10)}
                  className="block rounded-md border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-medium text-emerald-200 transition hover:bg-emerald-300/15"
                >
                  Valider depuis la preuve on-chain
                </button>
              )}
          </div>
        )}
        {diplomaSignature && (
          <p
            role="status"
            className="rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] p-4 text-sm text-emerald-200"
          >
            Diplôme enregistré
            {completedMissions.includes(10)
              ? " et mission validée."
              : "."}{" "}
            <a
              href={`https://solscan.io/tx/${diplomaSignature}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-emerald-100"
            >
              Voir la transaction sur Solscan
            </a>
          </p>
        )}
      </div>
    );
  }

  return (
    <p className="text-sm text-slate-400">
      Cette mission n’est pas encore disponible et ne peut pas être validée pour le moment.
    </p>
  );
}

function BalancePanel({ publicKey }: { publicKey: PublicKey }) {
  const { markCompleted } = useWalletProgress();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [progressError, setProgressError] = useState<string | null>(null);

  function recordMissionCompletion() {
    try {
      markCompleted(7);
      setProgressError(null);
    } catch (error) {
      setProgressError(
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer la progression.",
      );
    }
  }

  useEffect(() => {
    let active = true;

    getBalance(publicKey)
      .then((currentBalance) => {
        if (active) {
          setBalance(currentBalance);
          recordMissionCompletion();
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setBalanceError(
            error instanceof Error
              ? error.message
              : "Impossible de récupérer le solde Devnet.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingBalance(false);
        }
      });

    return () => {
      active = false;
    };
  }, [publicKey]);

  async function refreshBalance() {
    setIsLoadingBalance(true);
    setBalanceError(null);

    try {
      setBalance(await getBalance(publicKey));
      recordMissionCompletion();
    } catch (error) {
      setBalanceError(
        error instanceof Error
          ? error.message
          : "Impossible de récupérer le solde Devnet.",
      );
    } finally {
      setIsLoadingBalance(false);
    }
  }

  return (
    <div className="space-y-4">
      <p role="status" className="text-lg font-medium text-white">
        {isLoadingBalance
          ? "Chargement du solde..."
          : balance === null
            ? "Solde indisponible."
            : `Ton solde : ${balance.toFixed(2)} SOL`}
      </p>
      <button
        type="button"
        onClick={() => void refreshBalance()}
        disabled={isLoadingBalance}
        className="rounded-md border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoadingBalance ? "Actualisation..." : "Rafraîchir"}
      </button>
      {balanceError && (
        <p role="alert" className="text-sm text-rose-300">
          {balanceError}
        </p>
      )}
      {progressError && (
        <p role="alert" className="text-sm text-rose-300">
          {progressError}
        </p>
      )}
    </div>
  );
}
