import type { Language } from "./core.ts";

export interface SandboxOptions {
  code: string;
  language: Language;
  entryPoint?: string;
}

export function runInSandbox(options: SandboxOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./sandbox.worker.ts", import.meta.url), {
      type: "module",
    });

    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error("Evaluation timed out — check for an infinite loop."));
    }, 4000);

    const finish = (cleanup: () => void) => {
      clearTimeout(timer);
      worker.terminate();
      cleanup();
    };

    worker.onmessage = ({ data }) => {
      finish(() => {
        if (data.ok) resolve();
        else reject(new Error(data.error));
      });
    };

    worker.onerror = (event) => {
      finish(() => {
        reject(new Error(event.message || "Sandbox worker failed."));
      });
    };

    worker.postMessage({
      code: options.code,
      language: options.language,
      entryPoint: options.entryPoint,
    });
  });
}
