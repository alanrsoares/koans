import type React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { useKoanStore } from "../store/koanStore.ts";
import { ExerciseCard } from "./ExerciseCard.tsx";
import { LessonControls } from "./LessonControls.tsx";

export function ExercisePanel(): React.JSX.Element | null {
  const [
    state,
    { setActiveExerciseIndex, setDisableLigatures, handleInputChange, handleInputKeyDown },
  ] = useKoanStore();

  if (!state.exercise || !state.category) return null;

  return (
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

      {state.activeError && <KoanError message={state.activeError} />}

      <LessonControls
        states={state.activeProgressList}
        activeIndex={state.activeExerciseIndex}
        total={state.category.exercises.length}
        onSelect={setActiveExerciseIndex}
        languageName={state.langConfig?.name ?? ""}
        langProgress={state.langProgress}
      />
    </div>
  );
}

function KoanError({ message }: { message: string }): React.JSX.Element {
  return (
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
          <code>{message}</code>
        </pre>
      </AlertDescription>
    </Alert>
  );
}
