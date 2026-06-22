import { match } from "@onrails/pattern";
import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";
import type { Exercise } from "../koans.ts";
import { type Token, tokenize } from "../tokenizer.ts";
import type { AnswersState } from "../types.ts";

interface ExerciseCardProps {
  exercise: Exercise;
  activeExerciseIndex: number;
  currentLanguage: string;
  categoryName: string;
  answers: AnswersState;
  activeError: string | null;
  isPassed: boolean;
  onInputChange: (koanIndex: number, inputIndex: number, value: string) => void;
  onInputKeyDown: (
    koanIndex: number,
    inputIndex: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => void;
}

export function ExerciseCard({
  exercise,
  activeExerciseIndex,
  currentLanguage,
  categoryName,
  answers,
  activeError,
  isPassed,
  onInputChange,
  onInputKeyDown,
}: ExerciseCardProps) {
  // Ligatures on by default; reader can opt into plain operators if the tokenizer's
  // per-char spans make ligated glyphs (===, =>) overlap.
  const [disableLigatures, setDisableLigatures] = useState(false);

  // Tailwind class for a token's syntax color.
  function colorFor(token: Token): string {
    return match(token.type)
      .with("keyword", () => "text-syntax-keyword font-bold")
      .with("string", () => "text-syntax-string")
      .with("comment", () => "text-syntax-comment italic")
      .with("builtin", () => "text-syntax-builtin font-semibold")
      .with("number", () => "text-syntax-number")
      .with("symbol", () => "text-syntax-symbol")
      .with("punctuation", () =>
        token.value === "(" || token.value === ")"
          ? "text-syntax-accent font-bold"
          : "text-syntax-punct"
      )
      .otherwise(() => "text-syntax-text");
  }

  // Render the template, coalescing adjacent same-color tokens into one span so
  // operator glyphs (===, =>) stay in a single text run and ligate correctly
  // instead of overlapping. Blanks break the run and become inputs.
  function renderCodeTokenized() {
    const tokens = tokenize(exercise.template, currentLanguage);
    const nodes: React.ReactNode[] = [];
    let blankCounter = 0;
    let run: { className: string; text: string } | null = null;

    const flush = (key: string) => {
      if (run) {
        nodes.push(
          <span key={key} className={run.className}>
            {run.text}
          </span>
        );
        run = null;
      }
    };

    tokens.forEach((token, idx) => {
      if (token.type === "blank") {
        flush(`run-${idx}`);
        const currentBlankIndex = blankCounter++;
        const val =
          answers[currentLanguage]?.[categoryName]?.[activeExerciseIndex]?.[currentBlankIndex] ||
          "";

        nodes.push(
          <input
            key={idx}
            type="text"
            name={`blank-${currentBlankIndex}`}
            aria-label={`Blank ${currentBlankIndex + 1}`}
            className={cn(
              "font-mono text-base align-middle box-content mx-1 rounded-md px-2 py-0.5 text-center font-bold text-ink koan-input transition-[border-color,background-color,box-shadow] duration-200 focus-visible:outline-none min-w-[3ch]",
              isPassed
                ? "border border-solid border-stone bg-[oklch(0.93_0.012_74)] pointer-events-none"
                : "border border-dashed border-stone bg-[oklch(0.96_0.01_74)] focus-visible:border-maple focus-visible:bg-white focus-visible:shadow-[0_0_0_3px_oklch(0.52_0.16_32/0.14)]"
            )}
            style={{ width: `${Math.max(3, val.length)}ch` }}
            value={val}
            disabled={isPassed}
            onChange={(e) => onInputChange(activeExerciseIndex, currentBlankIndex, e.target.value)}
            onKeyDown={(e) => onInputKeyDown(activeExerciseIndex, currentBlankIndex, e)}
            data-koan-index={activeExerciseIndex}
            data-input-index={currentBlankIndex}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        );
        return;
      }

      const className = colorFor(token);
      if (run && run.className === className) {
        run.text += token.value;
      } else {
        flush(`run-${idx}`);
        run = { className, text: token.value };
      }
    });

    flush("run-end");
    return nodes;
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Contemplation Text */}
      <p className="text-lg text-foreground font-serif text-center leading-relaxed max-w-[600px] mb-9 wrap-break-word text-pretty animate-fadeIn">
        {exercise.description}
      </p>

      {/* Koan: a stone resting on the sand */}
      <div
        className={cn(
          "relative w-full max-w-[640px] bg-[oklch(0.99_0.004_74)] border border-stone rounded-2xl shadow-[0_10px_36px_-16px_oklch(0.26_0.008_40/0.22)] px-8 py-10 my-4 transition-[border-color,box-shadow] duration-300 koan-card",
          activeError &&
            "border-(--maple)/50 shadow-[0_10px_36px_-16px_oklch(0.52_0.16_32/0.3)] animate-shake"
        )}
      >
        {/* Hanko seal stamped on a solved koan */}
        {isPassed && (
          <span
            className="absolute -top-4 -right-3 size-12 rounded-lg bg-maple text-[oklch(0.97_0.012_70)] flex items-center justify-center text-2xl font-display shadow-[0_6px_16px_-4px_oklch(0.52_0.16_32/0.45)] animate-seal select-none"
            aria-hidden="true"
          >
            禅
          </span>
        )}
        <div
          className={cn(
            "w-fit min-w-[3ch] mx-auto font-mono text-base leading-loose whitespace-pre select-text overflow-x-auto max-w-full",
            disableLigatures && "[font-variant-ligatures:none]"
          )}
        >
          {renderCodeTokenized()}
        </div>

        {/* Ligature toggle */}
        <label className="mt-6 pt-3 border-t border-(--stone)/40 flex items-center justify-end gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none">
          <input
            type="checkbox"
            checked={disableLigatures}
            onChange={(e) => setDisableLigatures(e.target.checked)}
            className="size-3.5 accent-maple cursor-pointer"
          />
          Ligatures {disableLigatures ? "on" : "off"}
        </label>
      </div>
    </div>
  );
}
