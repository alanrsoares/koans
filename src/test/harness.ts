// Browser-only test harness. Loaded by /koan-test.html and driven by Playwright.
// For each koan it fills the blanks with the reference solution, runs the REAL
// compiler adapter via evaluateKoan, and records whether the koan passes its own
// assertions. This is the only place koans are exercised through shipped code.
import { isErr } from "@onrails/result";
import { evaluateKoan } from "../compiler/index.ts";
import { KOANS } from "../koans/index.ts";
import { SOLUTIONS } from "../koans/solutions.ts";
import { blankCount, fillBlanks } from "../lib/fillBlanks.ts";

export type KoanResult = {
  lang: string;
  category: string;
  index: number;
  description: string;
  code: string;
  passed: boolean;
  error: string | null;
  // Structural problems detected before evaluation:
  missingSolution: boolean;
  blankMismatch: boolean;
};

async function runLang(lang: string): Promise<KoanResult[]> {
  const path = KOANS[lang];
  const results: KoanResult[] = [];
  if (!path) return results;

  for (const category of path.categories) {
    const categorySolutions = SOLUTIONS[lang]?.[category.name];
    for (let index = 0; index < category.exercises.length; index++) {
      const { template, description } = category.exercises[index];
      const answers = categorySolutions?.[index];
      const expectedBlanks = blankCount(template);

      const base = {
        lang,
        category: category.name,
        index,
        description,
      };

      if (!answers) {
        results.push({
          ...base,
          code: template,
          passed: false,
          error: "No reference solution defined for this koan.",
          missingSolution: true,
          blankMismatch: false,
        });
        continue;
      }

      if (answers.length !== expectedBlanks) {
        results.push({
          ...base,
          code: template,
          passed: false,
          error: `Solution has ${answers.length} answer(s) but template has ${expectedBlanks} blank(s).`,
          missingSolution: false,
          blankMismatch: true,
        });
        continue;
      }

      const code = fillBlanks(template, answers);
      const evaluation = await evaluateKoan(lang, code);
      results.push({
        ...base,
        code,
        passed: !isErr(evaluation),
        error: isErr(evaluation) ? evaluation.error.message : null,
        missingSolution: false,
        blankMismatch: false,
      });
    }
  }

  return results;
}

declare global {
  interface Window {
    runKoanSuite: (lang: string) => Promise<KoanResult[]>;
    KOAN_LANGS: string[];
  }
}

window.runKoanSuite = runLang;
window.KOAN_LANGS = Object.keys(KOANS);
