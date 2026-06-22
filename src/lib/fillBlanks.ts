// Splice answers back into a koan template's `__` blanks, in order.
// Shared by the runtime store and the test harness so they can never drift.
export function fillBlanks(template: string, answers: readonly string[]): string {
  const parts = template.split("__");
  return parts.reduce(
    (acc, part, i) => acc + part + (i < parts.length - 1 ? (answers[i] ?? "") : ""),
    ""
  );
}

// Number of `__` blanks a template expects.
export function blankCount(template: string): number {
  return template.split("__").length - 1;
}
