import { type CompilerAdapter, loadGlobal } from "../core.ts";
import { runInSandbox } from "../sandbox.ts";

const loadCoffeeScript = (): Promise<CoffeeScriptCompiler> =>
  loadGlobal(
    "CoffeeScript",
    "https://cdn.jsdelivr.net/npm/coffeescript@2.7.0/lib/coffeescript-browser-compiler-legacy/coffeescript.js",
    "CoffeeScript"
  );

export const coffeescript: CompilerAdapter = {
  language: "coffeescript",
  evaluate: async (code) => {
    const coffee = await loadCoffeeScript();
    const compiled = coffee.compile(code, { bare: true });
    return runInSandbox({ code: compiled, language: "coffeescript" });
  },
};
