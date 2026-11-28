"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  claimGuestProgress,
  getMissionStatuses,
  getProgressSnapshot,
  getServerProgressSnapshot,
  markMissionCompleted,
  parseCompletedMissions,
  subscribeToProgress,
} from "@/lib/progress";

export default function useWalletProgress() {
  const { connecting, publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() ?? null;
  const [hasHydrated, setHasHydrated] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);

  const subscribe = useCallback(
    (onChange: () => void) => subscribeToProgress(walletAddress, onChange),
    [walletAddress],
  );
  const getSnapshot = useCallback(
    () => getProgressSnapshot(walletAddress),
    [walletAddress],
  );
  const progressSnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerProgressSnapshot,
  );

  useEffect(() => {
    setHasHydrated(true);
    if (!walletAddress) return;

    try {
      claimGuestProgress(walletAddress);
      setProgressError(null);
    } catch (error) {
      setProgressError(
        error instanceof Error
          ? error.message
          : "Impossible de restaurer la progression du wallet.",
      );
    }
  }, [walletAddress]);

  const markCompleted = useCallback(
    (missionId: number) => markMissionCompleted(walletAddress, missionId),
    [walletAddress],
  );
  const completedMissions = parseCompletedMissions(progressSnapshot);
  const missionStatuses = getMissionStatuses(completedMissions);
  const completedCount = missionStatuses.filter(
    (status) => status === "completed",
  ).length;
  const isReady = hasHydrated && !connecting;

  return {
    completedMissions,
    completedCount,
    isReady,
    missionStatuses,
    progressError,
    walletAddress,
    markCompleted,
  };
}
