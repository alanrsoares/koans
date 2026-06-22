import { match } from "@onrails/pattern";
import { errAsync, ResultAsync } from "@onrails/result";

import { type CompilerAdapter, type Language, messageOf } from "./core.ts";
import { clojurescript } from "./adapters/clojurescript.ts";
import { coffeescript } from "./adapters/coffeescript.ts";
import { gleam } from "./adapters/gleam.ts";
import { javascript } from "./adapters/javascript.ts";
import { typescript } from "./adapters/typescript.ts";

// To add a language: write src/compiler/adapters/<lang>.ts, then list it here.
const adapters: CompilerAdapter[] = [
  javascript,
  typescript,
  clojurescript,
  coffeescript,
  gleam,
];

const registry = new Map<Language, CompilerAdapter>(adapters.map((a) => [a.language, a]));

type CompilerError =
  | { kind: "unsupported"; message: string }
  | { kind: "failed"; message: string; cause: unknown };

export function evaluateKoan(lang: string, userCode: string): ResultAsync<boolean, Error> {
  const adapter = registry.get(lang as Language);
  const evaluation = adapter
    ? ResultAsync.fromPromise(adapter.evaluate(userCode), toCompilerError)
    : unsupported(lang);
  return evaluation.map(() => true).mapErr(toError);
}

const unsupported = (lang: string): ResultAsync<never, CompilerError> =>
  errAsync({
    kind: "unsupported",
    message: `Unsupported language: ${lang}`,
  });

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
