import type { CompilerAdapter } from "../core.ts";
import { runInSandbox } from "../sandbox.ts";

export const javascript: CompilerAdapter = {
  language: "javascript",
  evaluate: (code) => runInSandbox({ code, language: "javascript" }),
};
