import { ResultAsync } from "@onrails/result/compat/neverthrow";

interface Assert {
  equal: (actual: unknown, expected: unknown) => void;
  notEqual: (actual: unknown, expected: unknown) => void;
  isTrue: (value: unknown) => void;
  isFalse: (value: unknown) => void;
  deepEqual: (actual: unknown, expected: unknown) => void;
}

export function evaluateKoan(lang: string, userCode: string): ResultAsync<boolean, Error> {
  return ResultAsync.fromPromise(
    (async () => {
      const assert: Assert = {
        equal: (actual, expected) => {
          if (actual !== expected) {
            throw new Error(`Expected ${expected} but got ${actual}`);
          }
        },
        notEqual: (actual, expected) => {
          if (actual === expected) {
            throw new Error(`Expected actual to not equal ${expected}`);
          }
        },
        isTrue: (value) => {
          if (value !== true) {
            throw new Error(`Expected true but got ${value}`);
          }
        },
        isFalse: (value) => {
          if (value !== false) {
            throw new Error(`Expected false but got ${value}`);
          }
        },
        deepEqual: (actual, expected) => {
          const a = JSON.stringify(actual);
          const e = JSON.stringify(expected);
          if (a !== e) {
            throw new Error(`Expected ${e} but got ${a}`);
          }
        },
      };

      if (lang === "javascript") {
        const runner = new Function("assert", userCode);
        runner(assert);
        return true;
      }

      if (lang === "typescript") {
        if (!window.ts) {
          await loadTypeScript();
        }
        if (!window.ts) {
          throw new Error("TypeScript compiler was not loaded successfully.");
        }
        const jsCode = window.ts.transpileModule(userCode, {
          compilerOptions: {
            target: window.ts.ScriptTarget.ES2020,
            module: window.ts.ModuleKind.None,
          },
        }).outputText;

        const runner = new Function("assert", jsCode);
        runner(assert);
        return true;
      }

      if (lang === "clojurescript") {
        if (!window.squint_compiler) {
          const squintUrl = "https://cdn.jsdelivr.net/npm/squint-cljs/+esm";
          const squintCoreUrl = "https://cdn.jsdelivr.net/npm/squint-cljs/core.js/+esm";
          const squintModule = await import(/* @vite-ignore */ squintUrl);
          const coreModule = await import(/* @vite-ignore */ squintCoreUrl);
          window.squint_compiler = squintModule;
          window.squint_core = coreModule;
        }
        if (!window.squint_compiler) {
          throw new Error("ClojureScript compiler was not loaded successfully.");
        }

        const jsCode = window.squint_compiler.compileString(userCode, {
          "elide-imports": true,
          context: "expr",
        });

        const result = (0, eval)(jsCode);
        if (result !== true) {
          throw new Error(`Expression evaluated to false or non-truthy value: ${result}`);
        }
        return true;
      }

      if (lang === "coffeescript") {
        if (!window.CoffeeScript) {
          await loadCoffeeScript();
        }
        if (!window.CoffeeScript) {
          throw new Error("CoffeeScript compiler was not loaded successfully.");
        }
        const jsCode = window.CoffeeScript.compile(userCode, { bare: true });
        const runner = new Function("assert", jsCode);
        runner(assert);
        return true;
      }

      if (lang === "gleam") {
        if (!window.gleam_compiler) {
          await loadGleam();
        }
        if (!window.gleam_compiler) {
          throw new Error("Gleam compiler was not loaded successfully.");
        }
        window.gleam_compiler.reset_filesystem(1);
        window.gleam_compiler.write_module(1, "main", userCode);

        try {
          window.gleam_compiler.compile_package(1, "javascript");
        } catch (compileErr) {
          const warningMsgs: string[] = [];
          let warn: string | undefined;
          while (window.gleam_compiler && (warn = window.gleam_compiler.pop_warning(1))) {
            warningMsgs.push(warn);
          }
          const details = warningMsgs.join("\n");
          const errMessage = compileErr instanceof Error ? compileErr.message : String(compileErr);
          throw new Error(`Gleam Compilation Error:\n${errMessage}\n${details}`, {
            cause: compileErr,
          });
        }

        const jsCode = window.gleam_compiler.read_compiled_javascript(1, "main");
        if (!jsCode) {
          throw new Error("Compilation failed: could not generate JavaScript.");
        }

        const resolvedJs = jsCode.replace(
          /from\s+["']\.\.\/([^"']+)["']/g,
          (_, pathVal: string) => {
            return `from "https://cdn.jsdelivr.net/gh/live-codes/gleam-precompiled@main/build/dev/javascript/${pathVal}"`;
          }
        );

        const blob = new Blob([resolvedJs], { type: "application/javascript" });
        const url = URL.createObjectURL(blob);
        try {
          const module = await import(/* @vite-ignore */ url);
          if (typeof module.exercise !== "function") {
            throw new Error(
              "Function 'exercise' was not exported. Ensure your template contains 'pub fn exercise()'."
            );
          }
          const result = module.exercise();
          if (result !== true) {
            throw new Error(`Expression evaluated to false or non-truthy value: ${result}`);
          }
          return true;
        } finally {
          URL.revokeObjectURL(url);
        }
      }

      throw new Error(`Unsupported language: ${lang}`);
    })(),
    (err: unknown) => (err instanceof Error ? err : new Error(String(err), { cause: err }))
  );
}

function loadTypeScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/typescript/5.4.5/typescript.min.js";
    script.onload = () => resolve();
    script.onerror = (e) =>
      reject(
        new Error(
          "Failed to load TypeScript compiler from CDN. Please check your internet connection.",
          { cause: e }
        )
      );
    document.head.appendChild(script);
  });
}

function loadCoffeeScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/coffeescript/2.7.0/coffeescript.min.js";
    script.onload = () => resolve();
    script.onerror = (e) =>
      reject(
        new Error(
          "Failed to load CoffeeScript compiler from CDN. Please check your internet connection.",
          { cause: e }
        )
      );
    document.head.appendChild(script);
  });
}

async function loadGleam(): Promise<void> {
  try {
    const compilerUrl =
      "https://cdn.jsdelivr.net/gh/live-codes/gleam-precompiled@main/compiler/v1.3.0/gleam_wasm.js";
    const wasmUrl =
      "https://cdn.jsdelivr.net/gh/live-codes/gleam-precompiled@main/compiler/v1.3.0/gleam_wasm_bg.wasm";
    const module = await import(/* @vite-ignore */ compilerUrl);
    await module.default(wasmUrl);
    window.gleam_compiler = module;
  } catch (err) {
    throw new Error("Failed to load Gleam WASM compiler. Please check your internet connection.", {
      cause: err,
    });
  }
}
