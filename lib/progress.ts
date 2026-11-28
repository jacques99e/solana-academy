import { missions } from "@/lib/missions";

const LEGACY_STORAGE_KEY = "solana-academy-completed-missions";
const STORAGE_KEY_PREFIX = "solana-academy-completed-missions:";
const GUEST_STORAGE_KEY = `${STORAGE_KEY_PREFIX}guest`;
const GUEST_OWNER_KEY = "solana-academy-progress-guest-owner";
const PROGRESS_EVENT = "solana-academy-progress-change";

export type MissionProgressStatus = "completed" | "available" | "locked";

// Browser progress controls the learning flow; only separate chain reads verify on-chain state.

function getWalletStorageKey(walletAddress: string): string {
  return `${STORAGE_KEY_PREFIX}${walletAddress}`;
}

function uniqueMissionIds(missionIds: number[]): number[] {
  return [...new Set(missionIds)];
}

export function parseCompletedMissions(value: string | null): number[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return uniqueMissionIds(
      parsed.filter(
        (id): id is number => Number.isInteger(id) && id >= 1 && id <= missions.length,
      ),
    );
  } catch {
    return [];
  }
}

export function getCompletedMissions(walletAddress: string | null): number[] {
  if (typeof window === "undefined") return [];

  try {
    if (walletAddress) {
      return parseCompletedMissions(
        window.localStorage.getItem(getWalletStorageKey(walletAddress)),
      );
    }

    return uniqueMissionIds([
      ...parseCompletedMissions(window.localStorage.getItem(GUEST_STORAGE_KEY)),
      ...parseCompletedMissions(window.localStorage.getItem(LEGACY_STORAGE_KEY)),
    ]);
  } catch {
    return [];
  }
}

export function getProgressSnapshot(walletAddress: string | null): string {
  return JSON.stringify(getCompletedMissions(walletAddress));
}

export function getServerProgressSnapshot(): string {
  return "[]";
}

export function getMissionStatuses(
  completedMissions: number[],
): MissionProgressStatus[] {
  const completed = new Set(completedMissions);
  const firstIncompleteIndex = missions.findIndex(({ id }) => !completed.has(id));

  if (firstIncompleteIndex === -1) {
    return missions.map(() => "completed");
  }

  return missions.map((_, index) => {
    if (index < firstIncompleteIndex) return "completed";
    if (index === firstIncompleteIndex) return "available";
    return "locked";
  });
}

export function getMissionStatus(
  missionId: number,
  completedMissions: number[],
): MissionProgressStatus {
  const missionIndex = missions.findIndex(({ id }) => id === missionId);
  if (missionIndex === -1) return "locked";

  return getMissionStatuses(completedMissions)[missionIndex] ?? "locked";
}

export function subscribeToProgress(
  walletAddress: string | null,
  onChange: () => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const activeStorageKey = walletAddress
    ? getWalletStorageKey(walletAddress)
    : GUEST_STORAGE_KEY;
  const onStorage = (event: StorageEvent) => {
    if (
      event.key === null ||
      event.key === activeStorageKey ||
      event.key === GUEST_STORAGE_KEY ||
      event.key === LEGACY_STORAGE_KEY ||
      event.key === GUEST_OWNER_KEY
    ) {
      onChange();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(PROGRESS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PROGRESS_EVENT, onChange);
  };
}

export function saveCompletedMissions(
  walletAddress: string | null,
  missionIds: number[],
): void {
  if (typeof window === "undefined") {
    throw new Error("La progression ne peut être sauvegardée que dans le navigateur.");
  }

  const storageKey = walletAddress
    ? getWalletStorageKey(walletAddress)
    : GUEST_STORAGE_KEY;

  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(uniqueMissionIds(missionIds)),
    );
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Impossible de sauvegarder la progression : ${error.message}`
        : "Impossible de sauvegarder la progression dans ce navigateur.",
    );
  }
}

export function claimGuestProgress(walletAddress: string): void {
  if (typeof window === "undefined") return;

  try {
    const guestOwner = window.localStorage.getItem(GUEST_OWNER_KEY);
    if (guestOwner && guestOwner !== walletAddress) return;

    const guestMissions = getCompletedMissions(null);
    const walletStorageKey = getWalletStorageKey(walletAddress);
    if (guestMissions.length > 0) {
      const walletMissions = parseCompletedMissions(
        window.localStorage.getItem(walletStorageKey),
      );
      window.localStorage.setItem(
        walletStorageKey,
        JSON.stringify(uniqueMissionIds([...walletMissions, ...guestMissions])),
      );
      window.localStorage.removeItem(GUEST_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    }

    if (!guestOwner) {
      window.localStorage.setItem(GUEST_OWNER_KEY, walletAddress);
    }
    if (guestMissions.length > 0 || !guestOwner) {
      window.dispatchEvent(new Event(PROGRESS_EVENT));
    }
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Impossible de restaurer la progression du wallet : ${error.message}`
        : "Impossible de restaurer la progression du wallet.",
    );
  }
}

export function markMissionCompleted(
  walletAddress: string | null,
  missionId: number,
): void {
  if (!missions.some(({ id }) => id === missionId)) {
    throw new Error("Identifiant de mission invalide.");
  }

  const completedMissions = getCompletedMissions(walletAddress);
  const status = getMissionStatus(missionId, completedMissions);

  if (status === "locked") {
    const previousMission = missions.find(({ id }) => id === missionId - 1);
    throw new Error(
      previousMission
        ? `Termine d’abord la mission ${previousMission.id} avant de valider celle-ci.`
        : "Cette mission n’est pas encore disponible.",
    );
  }

  if (status === "completed") return;

  saveCompletedMissions(walletAddress, [...completedMissions, missionId]);
}
