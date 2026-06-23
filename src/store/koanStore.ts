import { useCallback, useState } from "react";
import { createContainer } from "unstated-next";
import { KOANS } from "../koans.ts";
import { useKoanInputHandlers } from "./slices/useKoanInputHandlers.ts";
import {
  firstIncompleteCategory,
  isLangSolved,
  useKoanNavigation,
} from "./slices/useKoanNavigation.ts";
import { useKoanVerification } from "./slices/useKoanVerification.ts";
import { usePersistedState } from "./slices/usePersistedState.ts";
import { useSoundEffects } from "./slices/useSoundEffects.ts";

export type Stage = "lesson" | "subpath" | "all";

function useKoanController() {
  // 1. Settings & Core persisted storage
  const [disableLigatures, setDisableLigatures] = useState(false);
  const persisted = usePersistedState();
  const sound = useSoundEffects();

  // 2. Lifted dialog/error states
  const [activeError, setActiveError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleNavigate = useCallback(() => {
    setActiveError(null);
    setShowCelebration(false);
  }, []);

  // 3. Navigation Slice
  const navigation = useKoanNavigation({
    progress: persisted.progress,
    showCelebration,
    showResetConfirm,
    onNavigate: handleNavigate,
  });

  // 4. Verification Slice
  const verification = useKoanVerification({
    currentLanguage: navigation.currentLanguage,
    currentCategoryIndex: navigation.currentCategoryIndex,
    progress: persisted.progress,
    saveState: persisted.saveState,
    selectCategory: navigation.selectCategory,
    setActiveExerciseIndex: navigation.setActiveExerciseIndex,
    playProgressChime: sound.playProgressChime,
    setActiveError,
    setShowCelebration,
  });

  // 5. Input Handlers Slice
  const inputs = useKoanInputHandlers({
    currentLanguage: navigation.currentLanguage,
    currentCategoryIndex: navigation.currentCategoryIndex,
    answers: persisted.answers,
    progress: persisted.progress,
    saveState: persisted.saveState,
    verifyKoan: verification.verifyKoan,
    navigateToExercise: navigation.navigateToExercise,
  });

  // Derived config, progress, & page calculation
  const langConfig = KOANS[navigation.currentLanguage];
  const category = langConfig?.categories[navigation.currentCategoryIndex];
  const exercise = category?.exercises[navigation.activeExerciseIndex];

  const activeProgressList =
    (category ? persisted.progress[navigation.currentLanguage]?.[category.name] : null) || [];
  const isPassed = activeProgressList[navigation.activeExerciseIndex] === true;

  const nextIncompleteCat = firstIncompleteCategory(navigation.currentLanguage, persisted.progress);
  const nextLessonName =
    nextIncompleteCat === -1 ? null : langConfig?.categories[nextIncompleteCat]?.name || null;

  const allSolved = Object.keys(KOANS).every((l) => isLangSolved(l, persisted.progress));
  const subpathSolved = isLangSolved(navigation.currentLanguage, persisted.progress);
  const stage: Stage = allSolved ? "all" : subpathSolved ? "subpath" : "lesson";

  const availableTracks = Object.keys(KOANS)
    .filter((l) => !isLangSolved(l, persisted.progress))
    .map((l) => ({ key: l, name: KOANS[l]?.name ?? "" }));

  const langProgress = (() => {
    const categories = langConfig?.categories || [];
    const total = categories.reduce((sum, cat) => sum + cat.exercises.length, 0);
    const solved = categories.reduce(
      (sum, cat) =>
        sum +
        (persisted.progress[navigation.currentLanguage]?.[cat.name] || []).filter(Boolean).length,
      0
    );
    return { solved, total, pct: total > 0 ? (solved / total) * 100 : 0 };
  })();

  const state = {
    currentLanguage: navigation.currentLanguage,
    currentCategoryIndex: navigation.currentCategoryIndex,
    activeExerciseIndex: navigation.activeExerciseIndex,
    activeError,
    showCelebration,
    showResetConfirm,
    disableLigatures,
    soundEnabled: sound.soundEnabled,
    answers: persisted.answers,
    langConfig,
    category,
    exercise,
    activeProgressList,
    isPassed,
    nextLessonName,
    availableTracks,
    stage,
    allSolved,
    langProgress,
  };

  const actions = {
    setActiveExerciseIndex: navigation.setTransitionActiveExerciseIndex,
    setShowCelebration,
    setShowResetConfirm,
    setDisableLigatures,
    toggleSound: sound.toggleSound,
    handleLanguageChange: navigation.handleLanguageChange,
    selectCategory: navigation.selectCategory,
    handleInputChange: inputs.handleInputChange,
    handleInputKeyDown: inputs.handleInputKeyDown,
    proceedFromCelebration: verification.proceedFromCelebration,
    startLanguageTrack: navigation.startLanguageTrack,
  };

  return [state, actions] as const;
}

export const { Provider: KoanStoreProvider, useContainer: useKoanStore } =
  createContainer(useKoanController);
