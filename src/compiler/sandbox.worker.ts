// Sandboxed JavaScript runner. User-compiled code executes here, off the main
// thread: no DOM, no document.cookie, and the main thread can terminate this
// worker if the code hangs (infinite loop) instead of freezing the UI.
//
// `assert` lives here rather than being passed in — functions can't cross the
// postMessage boundary, so the worker keeps its own copy of the harness.

type Request = {
  code: string;
  language: string;
  entryPoint?: string;
};

type Response = { ok: true } | { ok: false; error: string };

function expect(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const assert = {
  equal: (actual: unknown, expected: unknown) =>
    expect(actual === expected, `Expected ${expected} but got ${actual}`),
  notEqual: (actual: unknown, expected: unknown) =>
    expect(actual !== expected, `Expected actual to not equal ${expected}`),
  isTrue: (value: unknown) => expect(value === true, `Expected true but got ${value}`),
  isFalse: (value: unknown) => expect(value === false, `Expected false but got ${value}`),
  deepEqual: (actual: unknown, expected: unknown) => {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    expect(a === e, `Expected ${e} but got ${a}`);
  },
};

interface SandboxGlobalScope {
  assert?: typeof assert;
  squint_core?: unknown;
  core?: unknown;
  eval: (code: string) => unknown;
}

const globalScope = self as unknown as SandboxGlobalScope;

// Bind assert globally inside the worker scope
globalScope.assert = assert;

async function handleMessage(event: MessageEvent<Request>) {
  const { code, language, entryPoint } = event.data;
  const reply = (response: Response) => self.postMessage(response);

  try {
    if (language === "gleam") {
      const url = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
      try {
        const module = await import(/* @vite-ignore */ url);
        const entry = entryPoint || "exercise";
        if (typeof module[entry] !== "function") {
          throw new Error(
            `Function '${entry}' was not exported. Ensure your template contains 'pub fn ${entry}()'.`
          );
        }
        const result = module[entry]();
        expect(result === true, `Expression evaluated to false or non-truthy value: ${result}`);
      } finally {
        URL.revokeObjectURL(url);
      }
    } else if (language === "clojurescript") {
      if (!globalScope.squint_core) {
        const squintUrl = "https://cdn.jsdelivr.net/npm/squint-cljs/core.js/+esm";
        const core = await import(/* @vite-ignore */ squintUrl);
        globalScope.squint_core = core;
        globalScope.core = core;
      }

      const result = globalScope.eval(code);
      expect(result === true, `Expression evaluated to false or non-truthy value: ${result}`);
    } else {
      new Function("assert", code)(assert);
    }
    reply({ ok: true });
  } catch (error) {
    reply({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

self.onmessage = (event: MessageEvent<Request>) => {
  handleMessage(event);
};
