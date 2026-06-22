import { ArrowLeft, ArrowRight } from "lucide-react";
import { SteppingStones } from "./SteppingStones.tsx";

interface LessonControlsProps {
  states: boolean[];
  activeIndex: number;
  total: number;
  onSelect: (index: number) => void;
  languageName: string;
  langProgress: { solved: number; total: number; pct: number };
}

const navButton =
  "text-[var(--muted-foreground)] hover:text-[var(--ink)] focus-visible:ring-1 focus-visible:ring-[var(--ink)] focus-visible:outline-none rounded p-1 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:pointer-events-none";

export function LessonControls({
  states,
  activeIndex,
  total,
  onSelect,
  languageName,
  langProgress,
}: LessonControlsProps) {
  return (
    <div className="mt-14 flex flex-col items-center gap-6 w-full max-w-[640px] select-none">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onSelect(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          aria-label="Previous koan"
          className={navButton}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </button>
        <SteppingStones states={states} activeIndex={activeIndex} onSelect={onSelect} />
        <button
          type="button"
          onClick={() => onSelect(Math.min(total - 1, activeIndex + 1))}
          disabled={activeIndex === total - 1}
          aria-label="Next koan"
          className={navButton}
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Path meta + raked-sand progress line */}
      <div className="w-full flex flex-col items-center gap-2.5">
        <span className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-[0.18em]">
          {activeIndex + 1} / {total} in this lesson
        </span>
        <div className="h-px w-full max-w-[280px] bg-[var(--stone)]/60 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-[var(--ink)] transition-[width] duration-500 ease-out"
            style={{ width: `${langProgress.pct}%` }}
          />
        </div>
        <span className="text-[10px] font-medium text-[var(--muted-foreground)] tracking-wide">
          {langProgress.solved} of {langProgress.total} koans on the {languageName} path
        </span>
      </div>
    </div>
  );
}
