import { cn } from "@/lib/utils.ts";

interface SteppingStonesProps {
  states: boolean[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

// Lesson position as a path of garden stones: filled = solved, ringed = current.
export function SteppingStones({ states, activeIndex, onSelect }: SteppingStonesProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-[440px]">
      {states.map((solved, i) => (
        <button
          key={`stone-${i}`}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Koan ${i + 1}${solved ? ", solved" : ""}${i === activeIndex ? ", current" : ""}`}
          aria-current={i === activeIndex ? "step" : undefined}
          className={cn(
            "size-3 rounded-full cursor-pointer transition-[transform,background-color,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
            solved
              ? "bg-[var(--ink)]"
              : "bg-transparent border border-[var(--stone)] hover:border-[var(--ink)]",
            i === activeIndex &&
              "scale-125 ring-2 ring-[var(--maple)] ring-offset-2 ring-offset-[var(--background)]"
          )}
        />
      ))}
    </div>
  );
}
