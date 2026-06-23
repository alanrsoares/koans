import { isErr } from "@onrails/result";
import type React from "react";
import { useCallback } from "react";
import { flushSync } from "react-dom";
import { evaluateKoan } from "../../compiler/index.ts";
import { KOANS } from "../../koans.ts";
import { triggerCanvasConfetti } from "../../lib/confetti.ts";
import { blankCount, fillBlanks } from "../../lib/fillBlanks.ts";
import type { AnswersState, ProgressState } from "../../types.ts";
import { firstIncompleteCategory, isLangSolved } from "./useKoanNavigation.ts";

interface ViewTransition {
  finished: Promise<void>;
}

interface DocumentWithTransition {
  startViewTransition?: (cb: () => void) => ViewTransition;
}

const startTransition = (cb: () => void) => {
  if (typeof document !== "undefined") {
    const doc = document as unknown as DocumentWithTransition;
    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        flushSync(cb);
      });
      return;
    }
  }
  cb();
};

// Every required blank is present and non-whitespace.
const allBlanksFilled = (userAnswers: string[], requiredBlanks: number): boolean =>
  userAnswers.length >= requiredBlanks &&
  userAnswers.slice(0, requiredBlanks).every((val) => val.trim() !== "");

interface UseKoanVerificationProps {
  currentLanguage: string;
  currentCategoryIndex: number;
  progress: ProgressState;
  saveState: (nextProgress: ProgressState, nextAnswers: AnswersState) => void;
  selectCategory: (index: number) => void;
  setActiveExerciseIndex: React.Dispatch<React.SetStateAction<number>>;
  playProgressChime: (lessonComplete: boolean, pathComplete: boolean) => void;

  // Lifted dialog states
  setActiveError: React.Dispatch<React.SetStateAction<string | null>>;
  setShowCelebration: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useKoanVerification({
  currentLanguage,
  currentCategoryIndex,
  progress,
  saveState,
  selectCategory,
  setActiveExerciseIndex,
  playProgressChime,
  setActiveError,
  setShowCelebration,
}: UseKoanVerificationProps) {
  const celebrateOrAdvance = useCallback(
    (progressList: boolean[], lessonComplete: boolean, pathComplete: boolean) => {
      if (!lessonComplete) {
        const nextIncomplete = progressList.indexOf(false);
        if (nextIncomplete !== -1) {
          setTimeout(() => {
            startTransition(() => {
              setActiveExerciseIndex(nextIncomplete);
            });
          }, 800);
        }
        return;
      }
      setShowCelebration(true);
      if (!pathComplete) triggerCanvasConfetti();
    },
    [setActiveExerciseIndex, setShowCelebration]
  );

  const verifyKoan = useCallback(
    async (koanIndex: number, activeAnswers: AnswersState, forceVerify: boolean) => {
      const lang = currentLanguage;
      const category = KOANS[lang]?.categories[currentCategoryIndex];
      if (!category) return;

      const exercise = category.exercises[koanIndex];
      if (!exercise) return;
      const { template } = exercise;
      const userAnswers = activeAnswers[lang]?.[category.name]?.[koanIndex] || [];

      if (!allBlanksFilled(userAnswers, blankCount(template)) && !forceVerify) {
        setActiveError(null);
        return;
      }

      const evaluation = await evaluateKoan(lang, fillBlanks(template, userAnswers));
      if (isErr(evaluation)) {
        setActiveError(evaluation.error.message);
        return;
      }

      const updatedProgress = JSON.parse(JSON.stringify(progress)) as ProgressState;
      const progressLang = (updatedProgress[lang] ??= {});
      const progressCat = (progressLang[category.name] ??= []);
      progressCat[koanIndex] = true;
      saveState(updatedProgress, activeAnswers);
      setActiveError(null);

      const progressList = updatedProgress[lang]?.[category.name];
      const lessonComplete = progressList ? progressList.every(Boolean) : false;
      const pathComplete = lessonComplete && isLangSolved(lang, updatedProgress);

      playProgressChime(lessonComplete, pathComplete);
      celebrateOrAdvance(progressList ?? [], lessonComplete, pathComplete);
    },
    [
      currentLanguage,
      currentCategoryIndex,
      progress,
      saveState,
      playProgressChime,
      celebrateOrAdvance,
      setActiveError,
    ]
  );

  const proceedFromCelebration = useCallback(() => {
    setShowCelebration(false);

    // Everything solved → the leaves finale stays; nowhere to go.
    if (Object.keys(KOANS).every((l) => isLangSolved(l, progress))) return;

    // Advance to the next unsolved lesson in this track.
    const next = firstIncompleteCategory(currentLanguage, progress);
    if (next !== -1) selectCategory(next);
  }, [currentLanguage, progress, selectCategory, setShowCelebration]);

  return {
    verifyKoan,
    proceedFromCelebration,
  };
}
