// Sandboxed JavaScript runner. User-compiled code executes here, off the main
// thread: no DOM, no document.cookie, and the main thread can terminate this
// worker if the code hangs (infinite loop) instead of freezing the UI.
//
// `assert` lives here rather than being passed in — functions can't cross the
// postMessage boundary, so the worker keeps its own copy of the harness.

type Request = { code: string };
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

self.onmessage = (event: MessageEvent<Request>) => {
  const reply = (response: Response) => self.postMessage(response);
  try {
    new Function("assert", event.data.code)(assert);
    reply({ ok: true });
  } catch (error) {
    reply({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};
