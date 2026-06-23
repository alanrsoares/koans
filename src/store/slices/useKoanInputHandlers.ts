import type React from "react";
import { useCallback } from "react";
import { KOANS } from "../../koans.ts";
import type { AnswersState, ProgressState } from "../../types.ts";

const focusInput = (inputs: HTMLInputElement[], index: number): void => {
  const target = inputs[index];
  if (target) target.focus();
};

interface UseKoanInputHandlersProps {
  currentLanguage: string;
  currentCategoryIndex: number;
  answers: AnswersState;
  progress: ProgressState;
  saveState: (nextProgress: ProgressState, nextAnswers: AnswersState) => void;
  verifyKoan: (
    koanIndex: number,
    activeAnswers: AnswersState,
    forceVerify: boolean
  ) => Promise<void>;
  navigateToExercise: (direction: "prev" | "next") => void;
}

export function useKoanInputHandlers({
  currentLanguage,
  currentCategoryIndex,
  answers,
  progress,
  saveState,
  verifyKoan,
  navigateToExercise,
}: UseKoanInputHandlersProps) {
  const handleInputChange = useCallback(
    async (koanIndex: number, inputIndex: number, value: string) => {
      const category = KOANS[currentLanguage]?.categories[currentCategoryIndex];
      if (!category) return;

      const updatedAnswers = JSON.parse(JSON.stringify(answers)) as AnswersState;
      const lang = currentLanguage;
      const answersLang = (updatedAnswers[lang] ??= {});
      const answersCat = (answersLang[category.name] ??= {});
      const answersKoan = (answersCat[koanIndex] ??= []);
      answersKoan[inputIndex] = value;

      saveState(progress, updatedAnswers);
      await verifyKoan(koanIndex, updatedAnswers, false);
    },
    [currentLanguage, currentCategoryIndex, answers, progress, saveState, verifyKoan]
  );

  const handleArrowKeyInput = useCallback(
    (input: HTMLInputElement, inputs: HTMLInputElement[], inputIndex: number, key: string) => {
      if (key === "ArrowRight" && input.selectionStart === input.value.length) {
        const isLast = inputIndex === inputs.length - 1;
        if (isLast) navigateToExercise("next");
        else focusInput(inputs, inputIndex + 1);
      } else if (key === "ArrowLeft" && input.selectionEnd === 0) {
        if (inputIndex === 0) navigateToExercise("prev");
        else focusInput(inputs, inputIndex - 1);
      }
    },
    [navigateToExercise]
  );

  const handleInputKeyDown = useCallback(
    (koanIndex: number, inputIndex: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const card = document.querySelector(".koan-card");
      if (!card) return;
      const inputs = Array.from(card.querySelectorAll<HTMLInputElement>(".koan-input"));

      if (e.key === "Enter") {
        e.preventDefault();
        const isLast = inputIndex === inputs.length - 1;
        if (isLast) {
          verifyKoan(koanIndex, answers, true);
        } else {
          focusInput(inputs, inputIndex + 1);
        }
        return;
      }

      handleArrowKeyInput(input, inputs, inputIndex, e.key);
    },
    [answers, verifyKoan, handleArrowKeyInput]
  );

  return {
    handleInputChange,
    handleInputKeyDown,
  };
}
