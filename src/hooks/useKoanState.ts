import { useState } from "react";
import { KOANS } from "../koans.ts";
import { loadSaved, persist } from "../lib/storage.ts";
import type { AnswersState, ProgressState } from "../types.ts";

// Ensure every language/category has an entry, filling new koans with defaults.
function seedProgress(loaded: ProgressState): ProgressState {
  for (const lang of Object.keys(KOANS)) {
    if (!loaded[lang]) loaded[lang] = {};
    for (const cat of KOANS[lang]?.categories ?? []) {
      if (!loaded[lang][cat.name]) {
        loaded[lang][cat.name] = new Array(cat.exercises.length).fill(false);
      }
    }
  }
  return loaded;
}

function seedAnswers(loaded: AnswersState): AnswersState {
  for (const lang of Object.keys(KOANS)) {
    if (!loaded[lang]) loaded[lang] = {};
    for (const cat of KOANS[lang]?.categories ?? []) {
      if (!loaded[lang][cat.name]) loaded[lang][cat.name] = {};
    }
  }
  return loaded;
}

// Owns the persisted progress + answers; saveState writes through to localStorage.
export function useKoanState() {
  const [progress, setProgress] = useState<ProgressState>(() => seedProgress(loadSaved().progress));
  const [answers, setAnswers] = useState<AnswersState>(() => seedAnswers(loadSaved().answers));

  const saveState = (nextProgress: ProgressState, nextAnswers: AnswersState) => {
    setProgress(nextProgress);
    setAnswers(nextAnswers);
    persist(nextProgress, nextAnswers);
  };

  return { progress, answers, saveState };
}
