import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { evaluateKoan } from "./compiler.ts";
import { BrushUnderline } from "./components/BrushUnderline.tsx";
import { CelebrationDialog } from "./components/CelebrationDialog.tsx";
import { ExerciseCard } from "./components/ExerciseCard.tsx";
import { Header } from "./components/Header.tsx";
import { LessonControls } from "./components/LessonControls.tsx";
import { ResetDialog } from "./components/ResetDialog.tsx";
import { useKoanState } from "./hooks/useKoanState.ts";
import { KOANS } from "./koans.ts";
import { playSuccessSound } from "./lib/audio.ts";
import { triggerCanvasConfetti } from "./lib/confetti.ts";
import { clearProgress } from "./lib/storage.ts";
import type { AnswersState, ProgressState } from "./types.ts";

export default function App(): React.JSX.Element {
  const [currentLanguage, setCurrentLanguage] = useState<string>("javascript");
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [activeError, setActiveError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const { progress, answers, saveState } = useKoanState();
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Move to the first unsolved koan whenever the language or lesson changes.
  const firstIncompleteIndex = useCallback((): number => {
    const cat = KOANS[currentLanguage]?.categories[currentCategoryIndex];
    return cat ? (progress[currentLanguage]?.[cat.name]?.indexOf(false) ?? -1) : -1;
  }, [currentLanguage, currentCategoryIndex, progress]);

  useEffect(() => {
    const next = firstIncompleteIndex();
    setActiveExerciseIndex(next === -1 ? 0 : next);
    setActiveError(null);
    setShowCelebration(false);
  }, [firstIncompleteIndex]);

  const focusFirstBlank = useCallback(() => {
    const card = document.querySelector(".koan-card");
    const inputs = card?.querySelectorAll<HTMLInputElement>(".koan-input");
    if (!inputs?.length) return;
    (Array.from(inputs).find((input) => !input.value) ?? inputs[0]).focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(focusFirstBlank, 120);
    return () => clearTimeout(timer);
  }, [focusFirstBlank]);

  const handleLanguageChange = (nextLang: string) => {
    setCurrentLanguage(nextLang);
    setCurrentCategoryIndex(0);
    setActiveError(null);
    setShowCelebration(false);
  };

  const selectCategory = (index: number) => {
    setCurrentCategoryIndex(index);
    setActiveError(null);
    setShowCelebration(false);
  };

  const verifyKoan = async (
    koanIndex: number,
    activeAnswers: AnswersState,
    forceVerify: boolean
  ) => {
    const lang = currentLanguage;
    const category = KOANS[lang].categories[currentCategoryIndex];
    if (!category) return;

    const { template } = category.exercises[koanIndex];
    const userAnswers = activeAnswers[lang]?.[category.name]?.[koanIndex] || [];

    const requiredBlanks = template.split("__").length - 1;
    const isAnyBlankEmpty =
      userAnswers.length < requiredBlanks ||
      userAnswers.slice(0, requiredBlanks).some((val) => !val || val.trim() === "");
    if (isAnyBlankEmpty && !forceVerify) {
      setActiveError(null);
      return;
    }

    // Splice the answers back into the template's blanks.
    const parts = template.split("__");
    const code = parts.reduce(
      (acc, part, i) => acc + part + (i < parts.length - 1 ? userAnswers[i] || "" : ""),
      ""
    );

    const evaluation = await evaluateKoan(lang, code);
    if (!evaluation.isOk()) {
      setActiveError(evaluation.error.message);
      return;
    }

    const updatedProgress = JSON.parse(JSON.stringify(progress)) as ProgressState;
    updatedProgress[lang][category.name][koanIndex] = true;
    saveState(updatedProgress, activeAnswers);
    playSuccessSound();
    setActiveError(null);

    const progressList = updatedProgress[lang][category.name];
    if (progressList.every(Boolean)) {
      setShowCelebration(true);
      triggerCanvasConfetti();
    } else {
      const nextIncomplete = progressList.indexOf(false);
      if (nextIncomplete !== -1) {
        setTimeout(() => setActiveExerciseIndex(nextIncomplete), 800);
      }
    }
  };

  const handleInputChange = async (koanIndex: number, inputIndex: number, value: string) => {
    const category = KOANS[currentLanguage].categories[currentCategoryIndex];
    if (!category) return;

    const updatedAnswers = JSON.parse(JSON.stringify(answers)) as AnswersState;
    const lang = currentLanguage;
    updatedAnswers[lang] ??= {};
    updatedAnswers[lang][category.name] ??= {};
    updatedAnswers[lang][category.name][koanIndex] ??= [];
    updatedAnswers[lang][category.name][koanIndex][inputIndex] = value;

    saveState(progress, updatedAnswers);
    await verifyKoan(koanIndex, updatedAnswers, false);
  };

  const handleInputKeyDown = (
    koanIndex: number,
    inputIndex: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const input = e.currentTarget;
    const card = document.querySelector(".koan-card");
    if (!card) return;
    const inputs = Array.from(card.querySelectorAll<HTMLInputElement>(".koan-input"));

    if (e.key === "ArrowRight" && input.selectionStart === input.value.length) {
      if (inputIndex < inputs.length - 1) inputs[inputIndex + 1].focus();
    } else if (e.key === "ArrowLeft" && input.selectionEnd === 0) {
      if (inputIndex > 0) inputs[inputIndex - 1].focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (inputIndex < inputs.length - 1) inputs[inputIndex + 1].focus();
      else verifyKoan(koanIndex, answers, true);
    }
  };

  const proceedToNextCategory = () => {
    const categories = KOANS[currentLanguage]?.categories || [];
    if (currentCategoryIndex < categories.length - 1) {
      selectCategory(currentCategoryIndex + 1);
    } else {
      setShowCelebration(false);
      window.alert(
        "Congratulations! You have walked every path to enlightenment in this language."
      );
    }
  };

  const langConfig = KOANS[currentLanguage];
  const category = langConfig?.categories[currentCategoryIndex];
  const exercise = category?.exercises[activeExerciseIndex];

  const activeProgressList = progress[currentLanguage]?.[category?.name] || [];
  const isPassed = activeProgressList[activeExerciseIndex] === true;

  const langProgress = (() => {
    const categories = langConfig?.categories || [];
    const total = categories.reduce((sum, cat) => sum + cat.exercises.length, 0);
    const solved = categories.reduce(
      (sum, cat) => sum + (progress[currentLanguage]?.[cat.name] || []).filter(Boolean).length,
      0
    );
    return { solved, total, pct: total > 0 ? (solved / total) * 100 : 0 };
  })();

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full flex flex-col text-foreground font-sans antialiased relative overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:border focus:border-(--stone) focus:rounded-md focus:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ink)"
        >
          Skip to main content
        </a>

        <div className="zen-watermark" aria-hidden="true" />

        <Header
          currentLanguage={currentLanguage}
          currentCategoryIndex={currentCategoryIndex}
          onLanguageChange={handleLanguageChange}
          onCategoryChange={selectCategory}
          onResetProgress={() => setShowResetConfirm(true)}
        />

        <main
          ref={workspaceRef}
          id="main-content"
          className="flex-1 max-w-[880px] w-full mx-auto px-6 md:px-10 py-16 flex flex-col justify-center z-10 relative scroll-mt-12"
        >
          <div className="text-center mb-14 select-none">
            <h2 className="text-4xl text-(--ink) tracking-normal font-brush text-balance leading-tight">
              {category?.name}
            </h2>
            <BrushUnderline />
            <p className="mt-6 text-base text-muted-foreground italic font-serif leading-relaxed max-w-[560px] mx-auto text-pretty">
              “{category?.quote}”
            </p>
          </div>

          {exercise && category && (
            <div className="flex flex-col items-center">
              <ExerciseCard
                exercise={exercise}
                activeExerciseIndex={activeExerciseIndex}
                currentLanguage={currentLanguage}
                categoryName={category.name}
                answers={answers}
                activeError={activeError}
                isPassed={isPassed}
                onInputChange={handleInputChange}
                onInputKeyDown={handleInputKeyDown}
              />

              {activeError && (
                <Alert
                  variant="destructive"
                  className="mt-4 max-w-[600px] w-full animate-fadeIn border-rose-200/60 bg-rose-50/50 font-serif"
                  aria-live="polite"
                >
                  <AlertTitle className="font-bold flex items-center gap-1.5 text-rose-900 text-xs">
                    <span aria-hidden="true">⚡</span>
                    <span>Look closely at the error, it points the way forward:</span>
                  </AlertTitle>
                  <AlertDescription>
                    <pre className="font-mono text-[10px] overflow-x-auto whitespace-pre-wrap leading-normal mt-1 bg-white/50 p-2 rounded border border-rose-100/50">
                      <code>{activeError}</code>
                    </pre>
                  </AlertDescription>
                </Alert>
              )}

              <LessonControls
                states={activeProgressList}
                activeIndex={activeExerciseIndex}
                total={category.exercises.length}
                onSelect={setActiveExerciseIndex}
                languageName={langConfig?.name ?? ""}
                langProgress={langProgress}
              />
            </div>
          )}

          <CelebrationDialog
            open={showCelebration}
            onOpenChange={setShowCelebration}
            isFinalCategory={currentCategoryIndex === (langConfig?.categories.length || 0) - 1}
            languageName={langConfig?.name ?? ""}
            categoryName={category?.name ?? ""}
            onProceed={proceedToNextCategory}
          />

          <ResetDialog
            open={showResetConfirm}
            onOpenChange={setShowResetConfirm}
            onConfirm={clearProgress}
          />
        </main>
      </div>
    </TooltipProvider>
  );
}
