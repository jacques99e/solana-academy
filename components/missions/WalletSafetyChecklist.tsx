"use client";

import { useState } from "react";
import { markMissionCompleted } from "@/lib/progress";

const safetyRules = [
  "Je ne partage jamais ma phrase secrète ni ma clé privée.",
  "Je télécharge mon wallet uniquement depuis son site officiel.",
  "Je vérifie le réseau et les détails avant de signer une transaction.",
];

type WalletSafetyChecklistProps = {
  completed: boolean;
};

export default function WalletSafetyChecklist({
  completed,
}: WalletSafetyChecklistProps) {
  const [checkedRules, setCheckedRules] = useState<boolean[]>(
    () => safetyRules.map(() => completed),
  );
  const [isValidated, setIsValidated] = useState(completed);
  const [error, setError] = useState<string | null>(null);
  const canValidate = checkedRules.every(Boolean);

  function toggleRule(index: number) {
    setCheckedRules((current) =>
      current.map((checked, ruleIndex) =>
        ruleIndex === index ? !checked : checked,
      ),
    );
  }

  function validateChecklist() {
    if (!canValidate) return;

    setError(null);
    try {
      markMissionCompleted(4);
      setIsValidated(true);
    } catch (validationError) {
      setError(
        validationError instanceof Error
          ? validationError.message
          : "Impossible d'enregistrer la progression.",
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {safetyRules.map((rule, index) => (
          <label
            key={rule}
            className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-800 bg-slate-950/60 p-4 text-sm leading-5 text-slate-300 transition hover:border-violet-400/30"
          >
            <input
              type="checkbox"
              checked={checkedRules[index]}
              onChange={() => toggleRule(index)}
              disabled={isValidated}
              className="mt-0.5 size-4 accent-emerald-400"
            />
            <span>{rule}</span>
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm text-rose-300">
          {error}
        </p>
      )}
      {isValidated ? (
        <p role="status" className="text-sm text-emerald-300">
          Mission validée. Garde toujours ces règles en tête lorsque tu utilises un wallet.
        </p>
      ) : (
        <button
          type="button"
          onClick={validateChecklist}
          disabled={!canValidate}
          className="rounded-md bg-gradient-to-r from-violet-500 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Valider les règles de sécurité
        </button>
      )}
    </div>
  );
}
