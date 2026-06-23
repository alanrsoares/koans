import { type CompilerAdapter, loadGlobal } from "../core.ts";
import { runInSandbox } from "../sandbox.ts";

const loadCivet = (): Promise<CivetCompiler> =>
  loadGlobal("Civet", "https://cdn.jsdelivr.net/npm/@danielx/civet/dist/browser.js", "Civet");

export const civet: CompilerAdapter = {
  language: "civet",
  evaluate: async (code) => {
    const civet = await loadCivet();
    const compiled = await civet.compile(code, { js: true });
    return runInSandbox({ code: compiled, language: "civet" });
  },
};
