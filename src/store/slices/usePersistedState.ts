import { useState } from "react";
import { KOANS } from "../../koans.ts";
import { loadSaved, persist } from "../../lib/storage.ts";
import type { AnswersState, ProgressState } from "../../types.ts";

export function seedProgress(loaded: ProgressState): ProgressState {
  const seeded = { ...loaded };
  for (const lang of Object.keys(KOANS)) {
    if (!seeded[lang]) seeded[lang] = {};
    for (const cat of KOANS[lang]?.categories ?? []) {
      if (!seeded[lang][cat.name]) {
        seeded[lang][cat.name] = new Array(cat.exercises.length).fill(false);
      }
    }
  }
  return seeded;
}

export function seedAnswers(loaded: AnswersState): AnswersState {
  const seeded = { ...loaded };
  for (const lang of Object.keys(KOANS)) {
    if (!seeded[lang]) seeded[lang] = {};
    for (const cat of KOANS[lang]?.categories ?? []) {
      if (!seeded[lang][cat.name]) seeded[lang][cat.name] = {};
    }
  }
  return seeded;
}

export function usePersistedState() {
  const [progress, setProgress] = useState<ProgressState>(() => seedProgress(loadSaved().progress));
  const [answers, setAnswers] = useState<AnswersState>(() => seedAnswers(loadSaved().answers));

  const saveState = (nextProgress: ProgressState, nextAnswers: AnswersState) => {
    setProgress(nextProgress);
    setAnswers(nextAnswers);
    persist(nextProgress, nextAnswers);
  };

  return { progress, setProgress, answers, setAnswers, saveState };
}
