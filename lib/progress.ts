const STORAGE_KEY = "solana-academy-completed-missions";
const PROGRESS_EVENT = "solana-academy-progress-change";

export function parseCompletedMissions(value: string | null): number[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return [...new Set(
      parsed.filter(
        (id): id is number => Number.isInteger(id) && id >= 1 && id <= 10,
      ),
    )];
  } catch {
    return [];
  }
}

export function getCompletedMissions(): number[] {
  if (typeof window === "undefined") return [];

  try {
    return parseCompletedMissions(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

export function getProgressSnapshot(): string {
  if (typeof window === "undefined") return "[]";

  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function getServerProgressSnapshot(): string {
  return "[]";
}

export function subscribeToProgress(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(PROGRESS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PROGRESS_EVENT, onChange);
  };
}

export function saveCompletedMissions(missionIds: number[]): void {
  if (typeof window === "undefined") {
    throw new Error("La progression ne peut être sauvegardée que dans le navigateur.");
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...new Set(missionIds)]),
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

export function markMissionCompleted(missionId: number): void {
  if (!Number.isInteger(missionId) || missionId < 1 || missionId > 10) {
    throw new Error("Identifiant de mission invalide.");
  }

  const completedMissions = getCompletedMissions();
  if (!completedMissions.includes(missionId)) {
    saveCompletedMissions([...completedMissions, missionId]);
  }
}