import { match } from "@onrails/pattern";
import { errAsync, ResultAsync } from "@onrails/result/compat/neverthrow";

type Assert = {
  equal: (actual: unknown, expected: unknown) => void;
  notEqual: (actual: unknown, expected: unknown) => void;
  isTrue: (value: unknown) => void;
  isFalse: (value: unknown) => void;
  deepEqual: (actual: unknown, expected: unknown) => void;
};

type CompilerError =
  | { kind: "unsupported"; message: string }
  | { kind: "failed"; message: string; cause: unknown };

type Language = "javascript" | "typescript" | "clojurescript" | "coffeescript" | "gleam";
type CompilerPort = { evaluate: (code: string) => Promise<void> };

const GLEAM_CDN =
  "https://cdn.jsdelivr.net/gh/live-codes/gleam-precompiled@main/build/dev/javascript";

const assert: Assert = {
  equal: (actual, expected) =>
    expect(actual === expected, `Expected ${expected} but got ${actual}`),
  notEqual: (actual, expected) =>
    expect(actual !== expected, `Expected actual to not equal ${expected}`),
  isTrue: (value) => expect(value === true, `Expected true but got ${value}`),
  isFalse: (value) => expect(value === false, `Expected false but got ${value}`),
  deepEqual: (actual, expected) => {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    expect(a === e, `Expected ${e} but got ${a}`);
  },
};

const runJavaScript = async (jsCode: string): Promise<void> => {
  new Function("assert", jsCode)(assert);
};

const compilers = {
  javascript: { evaluate: runJavaScript },
  typescript: { evaluate: runTypeScript },
  clojurescript: { evaluate: runClojureScript },
  coffeescript: { evaluate: runCoffeeScript },
  gleam: { evaluate: runGleam },
} satisfies Record<Language, CompilerPort>;

export function evaluateKoan(lang: string, userCode: string): ResultAsync<boolean, Error> {
  const compiler = compilerFor(lang);
  const evaluation = compiler
    ? ResultAsync.fromPromise(compiler.evaluate(userCode), toCompilerError)
    : unsupported(lang);
  return evaluation.map(() => true).mapErr(toError);
}

const compilerFor = (lang: string): CompilerPort | undefined =>
  match(lang)
    .returnType<CompilerPort | undefined>()
    .with("javascript", () => compilers.javascript)
    .with("typescript", () => compilers.typescript)
    .with("clojurescript", () => compilers.clojurescript)
    .with("coffeescript", () => compilers.coffeescript)
    .with("gleam", () => compilers.gleam)
    .otherwise(() => undefined);

const unsupported = (lang: string): ResultAsync<never, CompilerError> =>
  errAsync({
    kind: "unsupported",
    message: `Unsupported language: ${lang}`,
  });

async function runTypeScript(code: string): Promise<void> {
  const ts = await loadTypeScript();
  return runJavaScript(
    ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.None,
      },
    }).outputText
  );
}

async function runClojureScript(code: string): Promise<void> {
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
}

async function runCoffeeScript(code: string): Promise<void> {
  const coffee = await loadCoffeeScript();
  return runJavaScript(coffee.compile(code, { bare: true }));
}

async function runGleam(code: string): Promise<void> {
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
}

async function loadTypeScript(): Promise<TypeScriptCompiler> {
  if (!window.ts) {
    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/typescript/5.4.5/typescript.min.js",
      "TypeScript"
    );
  }
  return required(window.ts, "TypeScript compiler was not loaded successfully.");
}

async function loadCoffeeScript(): Promise<CoffeeScriptCompiler> {
  if (!window.CoffeeScript) {
    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/coffeescript/2.7.0/coffeescript.min.js",
      "CoffeeScript"
    );
  }
  return required(window.CoffeeScript, "CoffeeScript compiler was not loaded successfully.");
}

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

async function loadScript(src: string, tool: string): Promise<void> {
  try {
    return await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  } catch (cause) {
    throw new Error(`Failed to load ${tool} compiler from CDN.`, { cause });
  }
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

const stripSquintExports = (jsCode: string): string =>
  jsCode.replace(/^\s*export\s*\{[^}]*\}\s*;?\s*$/gm, "").replace(/^\s*export\s+/gm, "");

const resolveGleamImports = (jsCode: string): string =>
  jsCode
    .replace(/from\s+["'][./]*gleam\.mjs["']/g, `from "${GLEAM_CDN}/prelude.mjs"`)
    .replace(/from\s+["']\.\.\/([^"']+)["']/g, (_, path: string) => `from "${GLEAM_CDN}/${path}"`);

function requireTrue(result: unknown): void {
  expect(result === true, `Expression evaluated to false or non-truthy value: ${result}`);
}

function expect(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function required<T>(value: T | undefined, message: string): T {
  if (value === undefined) throw new Error(message);
  return value;
}

const toCompilerError = (cause: unknown): CompilerError => ({
  kind: "failed",
  message: messageOf(cause),
  cause,
});

const toError = (error: CompilerError): Error =>
  match(error)
    .with({ kind: "failed" }, (e) => new Error(e.message, { cause: e.cause }))
    .with({ kind: "unsupported" }, (e) => new Error(e.message))
    .exhaustive();

const messageOf = (cause: unknown): string =>
  cause instanceof Error ? cause.message : String(cause);
