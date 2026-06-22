import type React from "react";
import { lazy, Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { BrushUnderline } from "./components/BrushUnderline.tsx";
import { CelebrationDialog } from "./components/CelebrationDialog.tsx";
import { ExerciseCard } from "./components/ExerciseCard.tsx";
import { Header } from "./components/Header.tsx";
import { LessonControls } from "./components/LessonControls.tsx";
import { ResetDialog } from "./components/ResetDialog.tsx";
import { clearProgress } from "./lib/storage.ts";
import { KoanProvider, useKoanStore } from "./store/koanStore.ts";

// Code-split: the canvas loop only loads when a track is finished (reward, not appetizer).
const FallingLeaves = lazy(() =>
  import("./components/FallingLeaves.tsx").then((m) => ({ default: m.FallingLeaves }))
);

function Workspace(): React.JSX.Element {
  const [
    state,
    {
      setActiveExerciseIndex,
      setShowCelebration,
      setShowResetConfirm,
      setDisableLigatures,
      toggleSound,
      handleLanguageChange,
      selectCategory,
      handleInputChange,
      handleInputKeyDown,
      proceedFromCelebration,
      startLanguageTrack,
    },
  ] = useKoanStore();

  // Falling leaves: the track-completion reward (while the modal is open) and the
  // persistent all-paths finale.
  const showLeaves = state.allSolved || (state.showCelebration && state.stage === "subpath");

  return (
    <div className="min-h-screen w-full flex flex-col text-foreground font-sans antialiased relative overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:border focus:border-stone focus:rounded-md focus:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
      >
        Skip to main content
      </a>

      <div className="zen-watermark" aria-hidden="true" />
      {showLeaves && (
        <Suspense fallback={null}>
          {/* During the path-complete modal, lift leaves above the overlay blur (below the dialog);
              the all-paths finale stays ambient behind content. */}
          <FallingLeaves className={state.showCelebration && state.stage === "subpath" ? "z-55" : undefined} />
        </Suspense>
      )}

      <Header
        currentLanguage={state.currentLanguage}
        currentCategoryIndex={state.currentCategoryIndex}
        soundEnabled={state.soundEnabled}
        onLanguageChange={handleLanguageChange}
        onCategoryChange={selectCategory}
        onToggleSound={toggleSound}
        onResetProgress={() => setShowResetConfirm(true)}
      />

      <main
        id="main-content"
        className="flex-1 max-w-[880px] w-full mx-auto px-6 md:px-10 py-16 flex flex-col justify-center z-10 relative scroll-mt-12"
      >
        <div className="text-center mb-14 select-none">
          <h2 className="text-4xl text-ink tracking-normal font-brush text-balance leading-tight">
            {state.category?.name}
          </h2>
          <BrushUnderline />
          <p className="mt-6 text-base text-muted-foreground italic font-serif leading-relaxed max-w-[560px] mx-auto text-pretty">
            “{state.category?.quote}”
          </p>
        </div>

        {state.exercise && state.category && (
          <div className="flex flex-col items-center">
            <ExerciseCard
              key={`${state.currentLanguage}-${state.currentCategoryIndex}-${state.activeExerciseIndex}`}
              exercise={state.exercise}
              activeExerciseIndex={state.activeExerciseIndex}
              currentLanguage={state.currentLanguage}
              categoryName={state.category.name}
              answers={state.answers}
              activeError={state.activeError}
              isPassed={state.isPassed}
              disableLigatures={state.disableLigatures}
              onToggleLigatures={setDisableLigatures}
              onInputChange={handleInputChange}
              onInputKeyDown={handleInputKeyDown}
            />

            {state.activeError && (
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
                    <code>{state.activeError}</code>
                  </pre>
                </AlertDescription>
              </Alert>
            )}

            <LessonControls
              states={state.activeProgressList}
              activeIndex={state.activeExerciseIndex}
              total={state.category.exercises.length}
              onSelect={setActiveExerciseIndex}
              languageName={state.langConfig?.name ?? ""}
              langProgress={state.langProgress}
            />
          </div>
        )}

        <CelebrationDialog
          open={state.showCelebration}
          onOpenChange={setShowCelebration}
          stage={state.stage}
          languageName={state.langConfig?.name ?? ""}
          categoryName={state.category?.name ?? ""}
          nextLessonName={state.nextLessonName}
          availableTracks={state.availableTracks}
          onStartTrack={startLanguageTrack}
          onProceed={proceedFromCelebration}
        />

        <ResetDialog
          open={state.showResetConfirm}
          onOpenChange={setShowResetConfirm}
          onConfirm={clearProgress}
        />
      </main>
    </div>
  );
}

export default function App(): React.JSX.Element {
  return (
    <KoanProvider>
      <TooltipProvider>
        <Workspace />
      </TooltipProvider>
    </KoanProvider>
  );
}
