import { expect, test } from "@playwright/test";
import { KOANS } from "../src/koans/index.ts";
import type { KoanResult } from "../src/test/harness.ts";

// One test per language so failures are isolated lang-by-lang. Each test loads
// the harness, runs every koan in that language through the real adapter with
// its reference solution, and asserts they all pass their own assertions.
const LANGS = Object.keys(KOANS);

test.beforeEach(async ({ page }) => {
  await page.goto("/koan-test.html");
  await page.waitForFunction(() => typeof window.runKoanSuite === "function");
});

for (const lang of LANGS) {
  test(`${lang}: every koan passes with its reference solution`, async ({ page }) => {
    const results = (await page.evaluate((l) => window.runKoanSuite(l), lang)) as KoanResult[];

    expect(results.length, `${lang} produced no koan results`).toBeGreaterThan(0);

    const failures = results.filter((r) => !r.passed);
    const report = failures
      .map(
        (f) =>
          `  [${f.category} #${f.index}] ${f.description}\n    error: ${f.error}\n    code: ${JSON.stringify(f.code)}`
      )
      .join("\n");

    expect(failures, `\n${failures.length} ${lang} koan(s) failed:\n${report}`).toHaveLength(0);
  });
}
