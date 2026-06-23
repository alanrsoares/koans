import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { KOANS } from "../../koans.ts";
import type { ProgressState } from "../../types.ts";

interface DocumentWithTransition {
  startViewTransition?: (cb: () => void) => void;
}

const startTransition = (cb: () => void) => {
  if (typeof document !== "undefined") {
    const doc = document as unknown as DocumentWithTransition;
    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        flushSync(cb);
      });
      return;
    }
  }
  cb();
};

export const isLangSolved = (lang: string, progress: ProgressState): boolean => {
  const categories = KOANS[lang]?.categories || [];
  return categories.every((c) => (progress[lang]?.[c.name] ?? []).every(Boolean));
};

export const firstIncompleteCategory = (lang: string, progress: ProgressState): number => {
  const categories = KOANS[lang]?.categories || [];
  return categories.findIndex((c) => !(progress[lang]?.[c.name] || []).every(Boolean));
};

interface UseKoanNavigationProps {
  progress: ProgressState;
  showCelebration: boolean;
  showResetConfirm: boolean;
  onNavigate: () => void;
}

export function useKoanNavigation({
  progress,
  showCelebration,
  showResetConfirm,
  onNavigate,
}: UseKoanNavigationProps) {
  const [currentLanguage, setCurrentLanguage] = useState("javascript");
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);

  const setTransitionActiveExerciseIndex = useCallback((index: React.SetStateAction<number>) => {
    startTransition(() => {
      setActiveExerciseIndex(index);
    });
  }, []);

  const navigateToExercise = useCallback(
    (direction: "prev" | "next") => {
      const category = KOANS[currentLanguage]?.categories[currentCategoryIndex];
      if (!category) return;
      if (direction === "next" && activeExerciseIndex < category.exercises.length - 1) {
        setTransitionActiveExerciseIndex(activeExerciseIndex + 1);
      } else if (direction === "prev" && activeExerciseIndex > 0) {
        setTransitionActiveExerciseIndex(activeExerciseIndex - 1);
      }
    },
    [currentLanguage, currentCategoryIndex, activeExerciseIndex, setTransitionActiveExerciseIndex]
  );

  const handleLanguageChange = useCallback(
    (nextLang: string) => {
      startTransition(() => {
        setCurrentLanguage(nextLang);
        setCurrentCategoryIndex(0);
        setActiveExerciseIndex(0);
        onNavigate();
      });
    },
    [onNavigate]
  );

  const selectCategory = useCallback(
    (index: number) => {
      startTransition(() => {
        setCurrentCategoryIndex(index);
        setActiveExerciseIndex(0);
        onNavigate();
      });
    },
    [onNavigate]
  );

  const startLanguageTrack = useCallback(
    (langKey: string) => {
      if (!KOANS[langKey]) return;
      startTransition(() => {
        setCurrentLanguage(langKey);
        setCurrentCategoryIndex(Math.max(0, firstIncompleteCategory(langKey, progress)));
        setActiveExerciseIndex(0);
        onNavigate();
      });
    },
    [progress, onNavigate]
  );

  // Jump to the first unsolved koan when language, lesson, or progress changes.
  useEffect(() => {
    const cat = KOANS[currentLanguage]?.categories[currentCategoryIndex];
    const next = cat ? (progress[currentLanguage]?.[cat.name]?.indexOf(false) ?? -1) : -1;
    setActiveExerciseIndex(next === -1 ? 0 : next);
  }, [currentLanguage, currentCategoryIndex, progress]);

  // Global arrow left/right navigation for exercises when not in inputs
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }

      if (showCelebration || showResetConfirm) {
        return;
      }

      if (e.key === "ArrowLeft") {
        navigateToExercise("prev");
      } else if (e.key === "ArrowRight") {
        navigateToExercise("next");
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [showCelebration, showResetConfirm, navigateToExercise]);

  return {
    currentLanguage,
    currentCategoryIndex,
    activeExerciseIndex,
    setCurrentLanguage,
    setCurrentCategoryIndex,
    setActiveExerciseIndex,
    setTransitionActiveExerciseIndex,
    navigateToExercise,
    handleLanguageChange,
    selectCategory,
    startLanguageTrack,
  };
}
