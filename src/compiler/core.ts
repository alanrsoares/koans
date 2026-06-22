export type Language =
  | "javascript"
  | "typescript"
  | "clojurescript"
  | "coffeescript"
  | "civet"
  | "gleam";

export type CompilerAdapter = {
  language: Language;
  evaluate: (code: string) => Promise<void>;
};

// Hard cap on user-code execution. Koan logic runs in microseconds; anything
// approaching this is a runaway loop, so we terminate the worker and surface it.
const EVAL_TIMEOUT_MS = 4000;

type WorkerResponse = { ok: true } | { ok: false; error: string };

// Run compiled JS in a throwaway Web Worker: sandboxed from the DOM and
// terminable if it hangs. Resolves on success, rejects with the assertion or
// runtime error message (or a timeout) on failure. Used by every language that
// compiles to plain JS (JavaScript, TypeScript, CoffeeScript, Civet).
export function runJavaScript(jsCode: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./sandbox.worker.ts", import.meta.url), {
      type: "module",
    });

    const finish = (fn: () => void) => {
      clearTimeout(timer);
      worker.terminate();
      fn();
    };

    const timer = setTimeout(
      () => finish(() => reject(new Error("Evaluation timed out — check for an infinite loop."))),
      EVAL_TIMEOUT_MS
    );

    worker.onmessage = ({ data }: MessageEvent<WorkerResponse>) =>
      finish(() => (data.ok ? resolve() : reject(new Error(data.error))));
    worker.onerror = (event) =>
      finish(() => reject(new Error(event.message || "Sandbox worker failed.")));

    worker.postMessage({ code: jsCode });
  });
}

export function requireTrue(result: unknown): void {
  expect(result === true, `Expression evaluated to false or non-truthy value: ${result}`);
}

export function expect(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

export function required<T>(value: T | undefined, message: string): T {
  if (value === undefined) throw new Error(message);
  return value;
}

export const messageOf = (cause: unknown): string =>
  cause instanceof Error ? cause.message : String(cause);

export async function loadScript(src: string, tool: string): Promise<void> {
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

export async function loadGlobal<K extends keyof Window>(
  key: K,
  src: string,
  tool: string
): Promise<NonNullable<Window[K]>> {
  if (!window[key]) await loadScript(src, tool);
  return required(window[key], `${tool} compiler was not loaded successfully.`);
}
