import { unwrapOr } from "@onrails/maybe";
import { fromResult } from "@onrails/maybe/interop";
import { trySync } from "@onrails/result";
import { z } from "zod";
import type { AnswersState, ProgressState } from "../types.ts";
import { KOANS } from "../koans.ts";

export const STORAGE_KEY = "zen_koans_progress_v2";

const savedSchema = z.object({
  progress: z.record(z.string(), z.record(z.string(), z.array(z.boolean()))).optional(),
  answers: z
    .record(z.string(), z.record(z.string(), z.record(z.string(), z.array(z.string()))))
    .optional(),
});

const parseSaved = trySync(
  (raw: string) => savedSchema.parse(JSON.parse(raw)),
  (e) => {
    console.error("Failed to parse saved state from localStorage:", e);
    return e;
  }
);

function seedProgress(loaded: ProgressState): ProgressState {
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

function seedAnswers(loaded: AnswersState): AnswersState {
  const seeded = { ...loaded };
  for (const lang of Object.keys(KOANS)) {
    if (!seeded[lang]) seeded[lang] = {};
    for (const cat of KOANS[lang]?.categories ?? []) {
      if (!seeded[lang][cat.name]) seeded[lang][cat.name] = {};
    }
  }
  return seeded;
}

export function loadSavedState(): { progress: ProgressState; answers: AnswersState } {
  const saved = unwrapOr(fromResult(parseSaved(localStorage.getItem(STORAGE_KEY) ?? "{}")), {});
  const progress = seedProgress(saved.progress ?? {});
  const answers = seedAnswers(saved.answers ?? {});
  return { progress, answers };
}

export function persistState(progress: ProgressState, answers: AnswersState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress, answers }));
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

const SOUND_KEY = "zen_koans_sound";

export const loadSoundEnabled = (): boolean => localStorage.getItem(SOUND_KEY) !== "0";

export const saveSoundEnabled = (enabled: boolean): void =>
  localStorage.setItem(SOUND_KEY, enabled ? "1" : "0");
