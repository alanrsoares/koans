import { type CompilerAdapter, loadGlobal, runJavaScript } from "../core.ts";

const loadCivet = (): Promise<CivetCompiler> =>
  loadGlobal("Civet", "https://cdn.jsdelivr.net/npm/@danielx/civet/dist/browser.js", "Civet");

export const civet: CompilerAdapter = {
  language: "civet",
  evaluate: async (code) => {
    const civet = await loadCivet();
    return runJavaScript(await civet.compile(code, { js: true }));
  },
};
