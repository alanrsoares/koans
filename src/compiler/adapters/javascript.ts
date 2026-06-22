import { type CompilerAdapter, runJavaScript } from "../core.ts";

export const javascript: CompilerAdapter = {
  language: "javascript",
  evaluate: runJavaScript,
};
