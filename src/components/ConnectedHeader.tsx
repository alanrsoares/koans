import type React from "react";
import { useKoanStore } from "../store/koanStore.ts";
import { Header } from "./Header.tsx";

export function ConnectedHeader(): React.JSX.Element {
  const [state, { toggleSound, handleLanguageChange, selectCategory, setShowResetConfirm }] =
    useKoanStore();

  return (
    <Header
      currentLanguage={state.currentLanguage}
      currentCategoryIndex={state.currentCategoryIndex}
      soundEnabled={state.soundEnabled}
      onLanguageChange={handleLanguageChange}
      onCategoryChange={selectCategory}
      onToggleSound={toggleSound}
      onResetProgress={() => setShowResetConfirm(true)}
    />
  );
}
