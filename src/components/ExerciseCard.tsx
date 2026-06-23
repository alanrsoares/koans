import { match } from "@onrails/pattern";
import tw from "@styled-cva/react";
import type React from "react";
import { useEffect, useRef } from "react";
import type { Exercise } from "../koans.ts";
import { type Token, tokenize } from "../tokenizer.ts";
import type { AnswersState } from "../types.ts";

const Contemplation = tw.p`
  mb-9 max-w-[600px] animate-fadeIn text-center font-serif text-lg leading-relaxed
  text-foreground text-pretty wrap-break-word
`;

// The stone resting on the sand; reddens and shakes when the answer is wrong.
const KoanCard = tw.div(
  "koan-card relative my-4 w-full max-w-[640px] rounded-2xl border border-stone bg-[oklch(0.99_0.004_74)] px-8 py-10 shadow-[0_10px_36px_-16px_oklch(0.26_0.008_40/0.22)] transition-[border-color,box-shadow] duration-300",
  {
    variants: {
      $error: {
        true: "border-(--maple)/50 shadow-[0_10px_36px_-16px_oklch(0.52_0.16_32/0.3)] animate-shake",
        false: "",
      },
    },
    defaultVariants: { $error: false },
  }
);

// Hanko seal stamped on a solved koan.
const HankoSeal = tw.span`
  absolute -top-4 -right-3 flex size-12 animate-seal items-center justify-center
  rounded-lg bg-maple font-display text-2xl text-[oklch(0.97_0.012_70)]
  shadow-[0_6px_16px_-4px_oklch(0.52_0.16_32/0.45)] select-none
`;

const CodeBlock = tw.div(
  "mx-auto w-fit min-w-[3ch] max-w-full overflow-x-auto font-mono text-base leading-loose whitespace-pre select-text",
  {
    variants: {
      $noLigatures: { true: "[font-variant-ligatures:none]", false: "" },
    },
    defaultVariants: { $noLigatures: false },
  }
);

const KoanInput = tw.input(
  [
    "koan-input mx-1 box-content min-w-[3ch] rounded-md px-2 py-0.5 text-center align-middle font-mono text-base font-bold",
    "text-ink transition-[border-color,background-color,box-shadow] duration-200 focus-visible:outline-none",
  ],
  {
    variants: {
      $passed: {
        true: "pointer-events-none border border-solid border-stone bg-[oklch(0.93_0.012_74)]",
        false:
          "border border-dashed border-stone bg-[oklch(0.96_0.01_74)] focus-visible:border-maple focus-visible:bg-white focus-visible:shadow-[0_0_0_3px_oklch(0.52_0.16_32/0.14)]",
      },
    },
    defaultVariants: { $passed: false },
  }
);

const LigatureToggle = tw.label`
  mt-6 flex cursor-pointer items-center justify-end gap-2 border-t border-(--stone)/40
  pt-3 text-[10px] font-medium tracking-wider text-muted-foreground uppercase select-none
`;

interface ExerciseCardProps {
  exercise: Exercise;
  activeExerciseIndex: number;
  currentLanguage: string;
  categoryName: string;
  answers: AnswersState;
  activeError: string | null;
  isPassed: boolean;
  disableLigatures: boolean;
  onToggleLigatures: (disabled: boolean) => void;
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
  disableLigatures,
  onToggleLigatures,
  onInputChange,
  onInputKeyDown,
}: ExerciseCardProps) {
  // Focus the first empty blank on mount. The parent remounts this card per exercise
  // (via key), so this fires on every koan/lesson/track change.
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const inputs = cardRef.current?.querySelectorAll<HTMLInputElement>(".koan-input");
    if (!inputs?.length) return;
    (Array.from(inputs).find((input) => !input.value) ?? inputs[0]).focus();
  }, []);

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
          <KoanInput
            key={idx}
            $passed={isPassed}
            type="text"
            name={`blank-${currentBlankIndex}`}
            aria-label={`Blank ${currentBlankIndex + 1}`}
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
    <div ref={cardRef} className="flex w-full flex-col items-center">
      <Contemplation>{exercise.description}</Contemplation>

      <KoanCard $error={Boolean(activeError)}>
        {isPassed && <HankoSeal aria-hidden="true">禅</HankoSeal>}
        <CodeBlock $noLigatures={disableLigatures}>{renderCodeTokenized()}</CodeBlock>
        <LigatureToggle>
          font ligatures
          <input
            type="checkbox"
            checked={!disableLigatures}
            onChange={(e) => onToggleLigatures(!e.target.checked)}
            className="size-3.5 cursor-pointer accent-maple"
          />
        </LigatureToggle>
      </KoanCard>
    </div>
  );
}
