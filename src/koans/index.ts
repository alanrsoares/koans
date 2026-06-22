import { civet } from "./civet.ts";
import { clojurescript } from "./clojurescript.ts";
import { coffeescript } from "./coffeescript.ts";
import { gleam } from "./gleam.ts";
import { javascript } from "./javascript.ts";
import type { KoanData } from "./types.ts";
import { typescript } from "./typescript.ts";

export type { Category, Exercise, KoanData, LanguagePath } from "./types.ts";

// Ordering here drives the order languages appear in the UI.
export const KOANS: KoanData = {
  javascript,
  typescript,
  clojurescript,
  coffeescript,
  gleam,
  civet,
};
