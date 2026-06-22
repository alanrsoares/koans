import { fromNullable, map, unwrapOr } from "@onrails/maybe";
import type { AnswersState, ProgressState } from "../types.ts";

export const STORAGE_KEY = "zen_koans_progress_v2";

// Read + parse saved state once; both progress and answers seed from it.
export function loadSaved(): { progress: ProgressState; answers: AnswersState } {
  const parsed = unwrapOr(
    map(fromNullable(localStorage.getItem(STORAGE_KEY)), (raw) => {
      try {
        return JSON.parse(raw) as { progress?: ProgressState; answers?: AnswersState };
      } catch (e) {
        console.error("Failed to parse saved state from localStorage:", e);
        return {};
      }
    }),
    {}
  );
  return { progress: parsed.progress ?? {}, answers: parsed.answers ?? {} };
}

export function persist(progress: ProgressState, answers: AnswersState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress, answers }));
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}
