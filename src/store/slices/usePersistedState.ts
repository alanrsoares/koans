import { useState } from "react";
import { loadSavedState, persistState } from "../../lib/storage.ts";
import type { AnswersState, ProgressState } from "../../types.ts";

export function usePersistedState() {
  const [progress, setProgress] = useState<ProgressState>(() => loadSavedState().progress);
  const [answers, setAnswers] = useState<AnswersState>(() => loadSavedState().answers);

  const saveState = (nextProgress: ProgressState, nextAnswers: AnswersState) => {
    setProgress(nextProgress);
    setAnswers(nextAnswers);
    persistState(nextProgress, nextAnswers);
  };

  return { progress, setProgress, answers, setAnswers, saveState };
}
