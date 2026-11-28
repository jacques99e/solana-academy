"use client";

import { useState } from "react";
import useWalletProgress from "@/components/progress/useWalletProgress";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  incorrectExplanation: string;
};

type QuizProps = {
  missionId: number;
  questions: QuizQuestion[];
};

export default function Quiz({ missionId, questions }: QuizProps) {
  const { completedMissions, markCompleted } = useWalletProgress();
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => questions.map(() => null),
  );
  const isMissionValidated = completedMissions.includes(missionId);
  const [validationError, setValidationError] = useState<string | null>(null);

  const allQuestionsCorrect =
    questions.length > 0 &&
    questions.every((question, index) => answers[index] === question.correctAnswer);

  function selectAnswer(questionIndex: number, optionIndex: number) {
    setAnswers((currentAnswers) => {
      if (currentAnswers[questionIndex] === questions[questionIndex].correctAnswer) {
        return currentAnswers;
      }

      const nextAnswers = [...currentAnswers];
      nextAnswers[questionIndex] = optionIndex;
      return nextAnswers;
    });
  }

  function validateMission() {
    if (!allQuestionsCorrect) {
      return;
    }

    setValidationError(null);
    try {
      markCompleted(missionId);
    } catch (error) {
      setValidationError(
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer la progression.",
      );
    }
  }

  return (
    <div className="space-y-7">
      {questions.map((question, questionIndex) => {
        const selectedAnswer = answers[questionIndex];
        const isCorrect = selectedAnswer === question.correctAnswer;
        const hasAnswered = selectedAnswer !== null;

        return (
          <fieldset
            key={question.question}
            className="space-y-3"
            aria-describedby={`quiz-feedback-${questionIndex}`}
          >
            <legend className="text-sm font-semibold leading-6 text-slate-100">
              <span className="mr-2 font-mono text-xs text-emerald-300">
                {String(questionIndex + 1).padStart(2, "0")}
              </span>
              {question.question}
            </legend>

            <div className="grid gap-2">
              {question.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex;
                const isCorrectOption = optionIndex === question.correctAnswer;
                const optionClassName = isSelected
                  ? isCorrect
                    ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                    : "border-rose-400/60 bg-rose-400/10 text-rose-200"
                  : hasAnswered && isCorrectOption
                    ? "border-emerald-400/40 bg-emerald-400/[0.06] text-emerald-200"
                    : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-violet-400/40 hover:bg-slate-900";

                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => selectAnswer(questionIndex, optionIndex)}
                    disabled={isCorrect}
                    className={`flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition duration-200 active:scale-[0.99] disabled:cursor-default ${optionClassName}`}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current/30 font-mono text-[10px]">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            <div
              id={`quiz-feedback-${questionIndex}`}
              aria-live="polite"
              className="min-h-5 text-xs leading-5"
            >
              {hasAnswered &&
                (isCorrect ? (
                  <p className="text-emerald-300">
                    Bonne réponse ! {question.explanation}
                  </p>
                ) : (
                  <p className="text-rose-300">
                    Pas tout à fait. {question.incorrectExplanation}
                  </p>
                ))}
            </div>
          </fieldset>
        );
      })}

      {allQuestionsCorrect && (
        <div className="border-t border-slate-800 pt-5">
          {validationError && (
            <p role="alert" className="mb-3 text-sm text-rose-300">
              {validationError}
            </p>
          )}
          <button
            type="button"
            onClick={validateMission}
            disabled={isMissionValidated}
            className="rounded-md bg-gradient-to-r from-violet-500 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-default disabled:opacity-70"
          >
            {isMissionValidated ? "Mission validée !" : "Valider la mission"}
          </button>
        </div>
      )}
    </div>
  );
}
