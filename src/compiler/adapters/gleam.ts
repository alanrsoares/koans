import { type CompilerAdapter, messageOf, requireTrue } from "../core.ts";

const GLEAM_CDN =
  "https://cdn.jsdelivr.net/gh/live-codes/gleam-precompiled@main/build/dev/javascript";

async function loadGleam(): Promise<GleamCompiler> {
  if (window.gleam_compiler) return window.gleam_compiler;

  const compilerUrl =
    "https://cdn.jsdelivr.net/gh/live-codes/gleam-precompiled@main/compiler/v1.3.0/gleam_wasm.js";
  const wasmUrl =
    "https://cdn.jsdelivr.net/gh/live-codes/gleam-precompiled@main/compiler/v1.3.0/gleam_wasm_bg.wasm";
  const module = (await import(/* @vite-ignore */ compilerUrl)) as GleamCompiler;
  await module.default(wasmUrl);
  window.gleam_compiler = module;
  return module;
}

function compileGleam(gleam: GleamCompiler): void {
  try {
    gleam.compile_package(1, "javascript");
  } catch (cause) {
    const warnings = drainGleamWarnings(gleam).join("\n");
    throw new Error(`Gleam Compilation Error:\n${messageOf(cause)}\n${warnings}`, { cause });
  }
}

function drainGleamWarnings(gleam: GleamCompiler): string[] {
  const warnings: string[] = [];
  for (let warning = gleam.pop_warning(1); warning; warning = gleam.pop_warning(1)) {
    warnings.push(warning);
  }
  return warnings;
}

const resolveGleamImports = (jsCode: string): string =>
  jsCode
    .replace(/from\s+["'][./]*gleam\.mjs["']/g, `from "${GLEAM_CDN}/prelude.mjs"`)
    .replace(/from\s+["']\.\.\/([^"']+)["']/g, (_, path: string) => `from "${GLEAM_CDN}/${path}"`);

export const gleam: CompilerAdapter = {
  language: "gleam",
  evaluate: async (code) => {
    const gleam = await loadGleam();
    gleam.reset_filesystem(1);
    gleam.write_module(1, "main", code);
    compileGleam(gleam);

    const jsCode = gleam.read_compiled_javascript(1, "main");
    if (!jsCode) throw new Error("Compilation failed: could not generate JavaScript.");

    const url = URL.createObjectURL(
      new Blob([resolveGleamImports(jsCode)], { type: "text/javascript" })
    );
    try {
      const module = await import(/* @vite-ignore */ url);
      if (typeof module.exercise !== "function") {
        throw new Error(
          "Function 'exercise' was not exported. Ensure your template contains 'pub fn exercise()'."
        );
      }
      requireTrue(module.exercise());
    } finally {
      URL.revokeObjectURL(url);
    }
  },
};
