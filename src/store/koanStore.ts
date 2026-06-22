import { isErr } from "@onrails/result";
import type React from "react";
import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import { evaluateKoan } from "../compiler/index.ts";
import { useKoanState } from "../hooks/useKoanState.ts";
import { KOANS } from "../koans.ts";
import { playLessonComplete, playPathComplete, playRightAnswer } from "../lib/audio.ts";
import { triggerCanvasConfetti } from "../lib/confetti.ts";
import { blankCount, fillBlanks } from "../lib/fillBlanks.ts";
import { loadSoundEnabled, saveSoundEnabled } from "../lib/storage.ts";
import type { AnswersState, ProgressState } from "../types.ts";

export type Stage = "lesson" | "subpath" | "all";

// Every required blank is present and non-whitespace.
const allBlanksFilled = (userAnswers: string[], requiredBlanks: number): boolean =>
  userAnswers.length >= requiredBlanks &&
  userAnswers.slice(0, requiredBlanks).every((val) => val.trim() !== "");

// Focus the input at `index` if it exists; a no-op past either edge.
const focusInput = (inputs: HTMLInputElement[], index: number): void => {
  if (index >= 0 && index < inputs.length) inputs[index].focus();
};

function useKoanController() {
  const [currentLanguage, setCurrentLanguage] = useState("javascript");
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [activeError, setActiveError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [disableLigatures, setDisableLigatures] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(loadSoundEnabled);

  const toggleSound = () =>
    setSoundEnabled((prev) => {
      const next = !prev;
      saveSoundEnabled(next);
      return next;
    });

  const { progress, answers, saveState } = useKoanState();

  // A subpath (language) is solved when every one of its lessons is solved.
  const isLangSolved = (lang: string, prog: ProgressState = progress) =>
    KOANS[lang].categories.every((c) => (prog[lang]?.[c.name] ?? []).every(Boolean));

  const firstIncompleteCategory = (lang: string) =>
    (KOANS[lang]?.categories || []).findIndex(
      (c) => !(progress[lang]?.[c.name] || []).every(Boolean)
    );

  // Jump to the first unsolved koan when language, lesson, or progress changes.
  // Does NOT reset showCelebration/activeError — those are navigation concerns owned by
  // handleLanguageChange/selectCategory/proceedFromCelebration. Resetting them here clobbered
  // the celebration that verifyKoan sets when the final koan in a lesson is solved.
  useEffect(() => {
    const cat = KOANS[currentLanguage]?.categories[currentCategoryIndex];
    const next = cat ? (progress[currentLanguage]?.[cat.name]?.indexOf(false) ?? -1) : -1;
    setActiveExerciseIndex(next === -1 ? 0 : next);
  }, [currentLanguage, currentCategoryIndex, progress]);

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

  // Escalating chimes: a light bell per answer, the bowl when a lesson is done,
  // a deep gong when the whole language path is finished.
  const playProgressChime = (lessonComplete: boolean, pathComplete: boolean) => {
    if (!soundEnabled) return;
    if (pathComplete) playPathComplete();
    else if (lessonComplete) playLessonComplete();
    else playRightAnswer();
  };

  // After a correct answer: celebrate a finished lesson, otherwise step to the next koan.
  const celebrateOrAdvance = (
    progressList: boolean[],
    lessonComplete: boolean,
    pathComplete: boolean
  ) => {
    if (!lessonComplete) {
      const nextIncomplete = progressList.indexOf(false);
      if (nextIncomplete !== -1) {
        setTimeout(() => setActiveExerciseIndex(nextIncomplete), 800);
      }
      return;
    }
    setShowCelebration(true);
    // A single lesson gets confetti; completing a whole track shows the falling-leaves
    // finale (rendered in App while the celebration modal is open).
    if (!pathComplete) triggerCanvasConfetti();
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

    if (!allBlanksFilled(userAnswers, blankCount(template)) && !forceVerify) {
      setActiveError(null);
      return;
    }

    // Splice the answers back into the template's blanks, then compile + run.
    const evaluation = await evaluateKoan(lang, fillBlanks(template, userAnswers));
    if (isErr(evaluation)) {
      setActiveError(evaluation.error.message);
      return;
    }

    const updatedProgress = JSON.parse(JSON.stringify(progress)) as ProgressState;
    updatedProgress[lang][category.name][koanIndex] = true;
    saveState(updatedProgress, activeAnswers);
    setActiveError(null);

    const progressList = updatedProgress[lang][category.name];
    const lessonComplete = progressList.every(Boolean);
    const pathComplete = lessonComplete && isLangSolved(lang, updatedProgress);

    playProgressChime(lessonComplete, pathComplete);
    celebrateOrAdvance(progressList, lessonComplete, pathComplete);
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
    const atEnd = input.selectionStart === input.value.length;
    const atStart = input.selectionEnd === 0;
    const isLast = inputIndex === inputs.length - 1;

    if (e.key === "ArrowRight" && atEnd) focusInput(inputs, inputIndex + 1);
    else if (e.key === "ArrowLeft" && atStart) focusInput(inputs, inputIndex - 1);
    else if (e.key === "Enter") {
      e.preventDefault();
      if (isLast) verifyKoan(koanIndex, answers, true);
      else focusInput(inputs, inputIndex + 1);
    }
  };

  // Start a chosen language track from the celebration modal's track picker.
  // Explicit selection — no auto-jumping.
  const startLanguageTrack = (langKey: string) => {
    if (!KOANS[langKey]) return;
    setCurrentLanguage(langKey);
    setCurrentCategoryIndex(Math.max(0, firstIncompleteCategory(langKey)));
    setActiveError(null);
    setShowCelebration(false);
  };

  // Used by the lesson + all-complete stages. Track completion is handled by the
  // track picker (startLanguageTrack), not here.
  const proceedFromCelebration = () => {
    setShowCelebration(false);

    // Everything solved → the leaves finale stays; nowhere to go.
    if (Object.keys(KOANS).every((l) => isLangSolved(l))) return;

    // Advance to the next unsolved lesson in this track.
    const next = firstIncompleteCategory(currentLanguage);
    if (next !== -1) selectCategory(next);
  };

  const langConfig = KOANS[currentLanguage];
  const category = langConfig?.categories[currentCategoryIndex];
  const exercise = category?.exercises[activeExerciseIndex];

  const activeProgressList = progress[currentLanguage]?.[category?.name] || [];
  const isPassed = activeProgressList[activeExerciseIndex] === true;

  const nextIncompleteCat = firstIncompleteCategory(currentLanguage);
  const nextLessonName =
    nextIncompleteCat === -1 ? null : langConfig.categories[nextIncompleteCat].name;

  const allSolved = Object.keys(KOANS).every((l) => isLangSolved(l));
  const subpathSolved = isLangSolved(currentLanguage);
  const stage: Stage = allSolved ? "all" : subpathSolved ? "subpath" : "lesson";

  // Unsolved language tracks the user can pick from the celebration modal.
  const availableTracks = Object.keys(KOANS)
    .filter((l) => !isLangSolved(l))
    .map((l) => ({ key: l, name: KOANS[l].name }));

  const langProgress = (() => {
    const categories = langConfig?.categories || [];
    const total = categories.reduce((sum, cat) => sum + cat.exercises.length, 0);
    const solved = categories.reduce(
      (sum, cat) => sum + (progress[currentLanguage]?.[cat.name] || []).filter(Boolean).length,
      0
    );
    return { solved, total, pct: total > 0 ? (solved / total) * 100 : 0 };
  })();

  const state = {
    currentLanguage,
    currentCategoryIndex,
    activeExerciseIndex,
    activeError,
    showCelebration,
    showResetConfirm,
    disableLigatures,
    soundEnabled,
    answers,
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
  };

  return [state, actions] as const;
}

export const { Provider: KoanStoreProvider, useContainer: useKoanStore } =
  createContainer(useKoanController);
