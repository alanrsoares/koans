import { describe, expect, test } from "bun:test";
import { tokenize } from "./tokenizer.ts";

describe("tokenizer", () => {
  test("tokenizes js code correctly", () => {
    const code = "const a = 1;";
    const tokens = tokenize(code, "javascript");
    expect(tokens).toEqual([
      { type: "keyword", value: "const" },
      { type: "punctuation", value: " " },
      { type: "text", value: "a" },
      { type: "punctuation", value: " " },
      { type: "punctuation", value: "=" },
      { type: "punctuation", value: " " },
      { type: "number", value: "1" },
      { type: "punctuation", value: ";" },
    ]);
  });
});
