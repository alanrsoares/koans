import { type CompilerAdapter, loadGlobal } from "../core.ts";
import { runInSandbox } from "../sandbox.ts";

const loadTypeScript = (): Promise<TypeScriptCompiler> =>
  loadGlobal(
    "ts",
    "https://cdnjs.cloudflare.com/ajax/libs/typescript/5.4.5/typescript.min.js",
    "TypeScript"
  );

export const typescript: CompilerAdapter = {
  language: "typescript",
  evaluate: async (code) => {
    const ts = await loadTypeScript();
    const compiled = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.None,
      },
    }).outputText;
    return runInSandbox({ code: compiled, language: "typescript" });
  },
};
