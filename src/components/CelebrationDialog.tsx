import { ArrowRight, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

interface CelebrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathComplete: boolean;
  languageName: string;
  categoryName: string;
  nextLessonName: string | null;
  onProceed: () => void;
}

export function CelebrationDialog({
  open,
  onOpenChange,
  pathComplete,
  languageName,
  categoryName,
  nextLessonName,
  onProceed,
}: CelebrationDialogProps) {
  const title = pathComplete ? "Path Complete" : "Lesson Complete";
  const body = pathComplete
    ? `You have walked every lesson on the ${languageName} path. Rest here a while, or choose another path.`
    : `You solved every koan in ${categoryName}.`;
  const cta = pathComplete
    ? "Rest in the leaves"
    : nextLessonName
      ? `Continue: ${nextLessonName}`
      : "Continue";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="text-center max-w-[440px] flex flex-col items-center gap-5 p-9 bg-[oklch(0.99_0.004_74)] border border-[var(--stone)] rounded-2xl shadow-[0_24px_60px_-20px_oklch(0.26_0.008_40/0.3)] animate-[scaleUp_0.4s_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-col items-center gap-3">
          <div className="text-[var(--maple)] mb-1">
            <Sparkles className="size-11 mx-auto" aria-hidden="true" />
          </div>
          <DialogTitle
            id="celebration-title"
            className="text-3xl tracking-normal text-[var(--ink)] font-brush text-balance"
          >
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-[var(--muted-foreground)] text-base leading-relaxed font-serif">
          {body}
        </DialogDescription>
        <button
          type="button"
          onClick={onProceed}
          className="w-full bg-[var(--ink)] hover:bg-[oklch(0.32_0.01_40)] text-[var(--background)] hover:scale-[1.01] active:scale-[0.99] focus-visible:scale-[1.01] focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:outline-none rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-[background-color,transform,box-shadow] duration-200 cursor-pointer"
        >
          {cta}
          {!pathComplete && <ArrowRight className="size-4" aria-hidden="true" />}
        </button>
      </DialogContent>
    </Dialog>
  );
}
