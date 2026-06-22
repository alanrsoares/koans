import { type CompilerAdapter, requireTrue } from "../core.ts";

async function loadSquint(): Promise<SquintCompiler> {
  if (window.squint_compiler) return window.squint_compiler;

  const squintUrl = "https://cdn.jsdelivr.net/npm/squint-cljs/+esm";
  const coreUrl = "https://cdn.jsdelivr.net/npm/squint-cljs/core.js/+esm";
  const [squint, core] = await Promise.all([
    import(/* @vite-ignore */ squintUrl),
    import(/* @vite-ignore */ coreUrl),
  ]);
  window.squint_compiler = squint as SquintCompiler;
  window.squint_core = core;
  return window.squint_compiler;
}

const stripSquintExports = (jsCode: string): string =>
  jsCode.replace(/^\s*export\s*\{[^}]*\}\s*;?\s*$/gm, "").replace(/^\s*export\s+/gm, "");

export const clojurescript: CompilerAdapter = {
  language: "clojurescript",
  evaluate: async (code) => {
    const squint = await loadSquint();
    requireTrue(
      globalThis.eval(
        stripSquintExports(
          squint.compileString(code, {
            "elide-imports": true,
            context: "expr",
          })
        )
      )
    );
  },
};
