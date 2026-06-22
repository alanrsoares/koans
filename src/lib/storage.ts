import { unwrapOr } from "@onrails/maybe";
import { fromResult } from "@onrails/maybe/interop";
import { trySync } from "@onrails/result";
import { z } from "zod";
import type { AnswersState, ProgressState } from "../types.ts";

export const STORAGE_KEY = "zen_koans_progress_v2";

// Shape of the persisted blob: lang → category → koan flags / answers.
const savedSchema = z.object({
  progress: z.record(z.string(), z.record(z.string(), z.array(z.boolean()))).optional(),
  answers: z
    .record(z.string(), z.record(z.string(), z.record(z.string(), z.array(z.string()))))
    .optional(),
});

// JSON.parse and schema validation both throw, so parsing is a Result. Any
// failure (malformed JSON or wrong shape) means "no saved state": Err → None.
const parseSaved = trySync(
  (raw: string) => savedSchema.parse(JSON.parse(raw)),
  (e) => {
    console.error("Failed to parse saved state from localStorage:", e);
    return e;
  }
);

export function loadSaved(): { progress: ProgressState; answers: AnswersState } {
  const saved = unwrapOr(fromResult(parseSaved(localStorage.getItem(STORAGE_KEY) ?? "{}")), {});
  return { progress: saved.progress ?? {}, answers: saved.answers ?? {} };
}

export function persist(progress: ProgressState, answers: AnswersState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress, answers }));
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}
