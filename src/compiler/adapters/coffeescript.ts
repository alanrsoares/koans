import { type CompilerAdapter, loadGlobal, runJavaScript } from "../core.ts";

const loadCoffeeScript = (): Promise<CoffeeScriptCompiler> =>
  loadGlobal(
    "CoffeeScript",
    "https://cdnjs.cloudflare.com/ajax/libs/coffeescript/2.7.0/coffeescript.min.js",
    "CoffeeScript"
  );

export const coffeescript: CompilerAdapter = {
  language: "coffeescript",
  evaluate: async (code) => {
    const coffee = await loadCoffeeScript();
    return runJavaScript(coffee.compile(code, { bare: true }));
  },
};
