import type React from "react";
import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import { evaluateKoan } from "../compiler.ts";
import { useKoanState } from "../hooks/useKoanState.ts";
import { KOANS } from "../koans.ts";
import { playSuccessSound } from "../lib/audio.ts";
import { triggerCanvasConfetti } from "../lib/confetti.ts";
import type { AnswersState, ProgressState } from "../types.ts";

export type Stage = "lesson" | "subpath" | "all";

// All koan-app state, persistence, navigation, and verification in one place.
// Exposed app-wide via KoanStore (unstated-next container).
function useKoanController() {
  const [currentLanguage, setCurrentLanguage] = useState("javascript");
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [activeError, setActiveError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { progress, answers, saveState } = useKoanState();

  // A subpath (language) is solved when every one of its lessons is solved.
  const isLangSolved = (lang: string, prog: ProgressState = progress) =>
    KOANS[lang].categories.every((c) => (prog[lang]?.[c.name] ?? []).every(Boolean));

  const firstIncompleteCategory = (lang: string) =>
    (KOANS[lang]?.categories || []).findIndex(
      (c) => !(progress[lang]?.[c.name] || []).every(Boolean)
    );

  // Jump to the first unsolved koan when the language, lesson, or progress changes.
  useEffect(() => {
    const cat = KOANS[currentLanguage]?.categories[currentCategoryIndex];
    const next = cat ? (progress[currentLanguage]?.[cat.name]?.indexOf(false) ?? -1) : -1;
    setActiveExerciseIndex(next === -1 ? 0 : next);
    setActiveError(null);
    setShowCelebration(false);
  }, [currentLanguage, currentCategoryIndex, progress]);

  // Focus the first empty blank of the active koan whenever it changes.
  useEffect(() => {
    const timer = setTimeout(() => {
      const inputs = document.querySelectorAll<HTMLInputElement>(
        `.koan-card .koan-input[data-koan-index="${activeExerciseIndex}"]`
      );
      if (!inputs.length) return;
      (Array.from(inputs).find((input) => !input.value) ?? inputs[0]).focus();
    }, 120);
    return () => clearTimeout(timer);
  }, [activeExerciseIndex]);

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
      // Maple leaves are the all-paths finale; everything short of that gets confetti.
      const everythingSolved = Object.keys(KOANS).every((l) => isLangSolved(l, updatedProgress));
      if (!everythingSolved) triggerCanvasConfetti();
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

  const proceedFromCelebration = () => {
    setShowCelebration(false);

    // Everything solved → the leaves finale stays; nowhere to go.
    if (Object.keys(KOANS).every((l) => isLangSolved(l))) return;

    // Current subpath solved → chain to the next unsolved subpath (language).
    if (isLangSolved(currentLanguage)) {
      const nextLang = Object.keys(KOANS).find((l) => !isLangSolved(l));
      if (nextLang) {
        setCurrentLanguage(nextLang);
        setCurrentCategoryIndex(Math.max(0, firstIncompleteCategory(nextLang)));
        setActiveError(null);
      }
      return;
    }

    // Otherwise advance to the next unsolved lesson in this subpath.
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
  const nextLanguageKey = Object.keys(KOANS).find((l) => !isLangSolved(l));
  const nextLanguageName = nextLanguageKey ? KOANS[nextLanguageKey].name : null;

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
    answers,
    langConfig,
    category,
    exercise,
    activeProgressList,
    isPassed,
    nextLessonName,
    nextLanguageName,
    stage,
    allSolved,
    langProgress,
  };

  const actions = {
    setActiveExerciseIndex,
    setShowCelebration,
    setShowResetConfirm,
    handleLanguageChange,
    selectCategory,
    handleInputChange,
    handleInputKeyDown,
    proceedFromCelebration,
  };

  return [state, actions] as const;
}

export const KoanStore = createContainer(useKoanController);
