import { type CompilerAdapter, loadGlobal, runJavaScript } from "../core.ts";

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
    return runJavaScript(
      ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.None,
        },
      }).outputText
    );
  },
};
