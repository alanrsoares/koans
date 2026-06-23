import type React from "react";
import { lazy, Suspense } from "react";
import { useKoanStore } from "../store/koanStore.ts";

const FallingLeaves = lazy(() =>
  import("./FallingLeaves.tsx").then((m) => ({ default: m.FallingLeaves }))
);

export function LeavesReward(): React.JSX.Element | null {
  const [state] = useKoanStore();
  const showLeaves = state.allSolved || (state.showCelebration && state.stage === "subpath");

  return showLeaves ? (
    <Suspense fallback={null}>
      {/* During the path-complete modal, lift leaves above the overlay blur (below the dialog);
          the all-paths finale stays ambient behind content. */}
      <FallingLeaves className={state.showCelebration && state.stage === "subpath" ? "z-55" : ""} />
    </Suspense>
  ) : null;
}
