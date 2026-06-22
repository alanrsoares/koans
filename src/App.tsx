import type React from "react";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { ConnectedCelebrationDialog } from "./components/ConnectedCelebrationDialog.tsx";
import { ConnectedHeader } from "./components/ConnectedHeader.tsx";
import { ConnectedResetDialog } from "./components/ConnectedResetDialog.tsx";
import { ExercisePanel } from "./components/ExercisePanel.tsx";
import { LeavesReward } from "./components/LeavesReward.tsx";
import { LessonIntro } from "./components/LessonIntro.tsx";
import { KoanStoreProvider } from "./store/koanStore.ts";

function Workspace(): React.JSX.Element {
  return (
    <div className="min-h-screen w-full flex flex-col text-foreground font-sans antialiased relative overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:border focus:border-stone focus:rounded-md focus:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
      >
        Skip to main content
      </a>

      <div className="zen-watermark" aria-hidden="true" />
      <LeavesReward />
      <ConnectedHeader />

      <main
        id="main-content"
        className="flex-1 max-w-[880px] w-full mx-auto px-6 md:px-10 py-16 flex flex-col justify-center z-10 relative scroll-mt-12"
      >
        <LessonIntro />
        <ExercisePanel />
        <ConnectedCelebrationDialog />
        <ConnectedResetDialog />
      </main>
    </div>
  );
}

export default function App(): React.JSX.Element {
  return (
    <KoanStoreProvider>
      <TooltipProvider>
        <Workspace />
      </TooltipProvider>
    </KoanStoreProvider>
  );
}
