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
