import type React from "react";
import { useKoanStore } from "../store/koanStore.ts";
import { BrushUnderline } from "./BrushUnderline.tsx";

export function LessonIntro(): React.JSX.Element {
  const [{ category }] = useKoanStore();

  return (
    <div className="text-center mb-14 select-none">
      <h2 className="text-4xl text-ink tracking-normal font-brush text-balance leading-tight">
        {category?.name}
      </h2>
      <BrushUnderline />
      <p className="mt-6 text-base text-muted-foreground italic font-serif leading-relaxed max-w-[560px] mx-auto text-pretty">
        “{category?.quote}”
      </p>
    </div>
  );
}
