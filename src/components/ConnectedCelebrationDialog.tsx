import type React from "react";
import { useKoanStore } from "../store/koanStore.ts";
import { CelebrationDialog } from "./CelebrationDialog.tsx";

export function ConnectedCelebrationDialog(): React.JSX.Element {
  const [state, { setShowCelebration, proceedFromCelebration, startLanguageTrack }] =
    useKoanStore();

  return (
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
  );
}
