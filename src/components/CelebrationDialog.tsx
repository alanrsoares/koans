import { ArrowRight, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

type Stage = "lesson" | "subpath" | "all";

interface CelebrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage: Stage;
  languageName: string;
  categoryName: string;
  nextLessonName: string | null;
  nextLanguageName: string | null;
  onProceed: () => void;
}

export function CelebrationDialog({
  open,
  onOpenChange,
  stage,
  languageName,
  categoryName,
  nextLessonName,
  nextLanguageName,
  onProceed,
}: CelebrationDialogProps) {
  const title =
    stage === "all"
      ? "Every Path Walked"
      : stage === "subpath"
        ? `${languageName} Path Complete`
        : "Lesson Complete";
  const body =
    stage === "all"
      ? "You have walked every path to its end. Rest beneath the maple."
      : stage === "subpath"
        ? `Every lesson on the ${languageName} path is behind you. A new path opens.`
        : `You solved every koan in ${categoryName}.`;
  const cta =
    stage === "all"
      ? "Rest in the leaves"
      : stage === "subpath"
        ? nextLanguageName
          ? `Begin the ${nextLanguageName} path`
          : "Continue"
        : nextLessonName
          ? `Continue: ${nextLessonName}`
          : "Continue";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="text-center max-w-[440px] flex flex-col items-center gap-5 p-9 bg-[oklch(0.99_0.004_74)] border border-stone rounded-2xl shadow-[0_24px_60px_-20px_oklch(0.26_0.008_40/0.3)] animate-[scaleUp_0.4s_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-col items-center gap-3">
          <div className="text-maple mb-1">
            <Sparkles className="size-11 mx-auto" aria-hidden="true" />
          </div>
          <DialogTitle
            id="celebration-title"
            className="text-3xl tracking-normal text-ink font-brush text-balance"
          >
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-muted-foreground text-base leading-relaxed font-serif">
          {body}
        </DialogDescription>
        <button
          type="button"
          onClick={onProceed}
          className="w-full bg-ink hover:bg-[oklch(0.32_0.01_40)] text-background hover:scale-[1.01] active:scale-[0.99] focus-visible:scale-[1.01] focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:outline-none rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-[background-color,transform,box-shadow] duration-200 cursor-pointer"
        >
          {cta}
          {stage !== "all" && <ArrowRight className="size-4" aria-hidden="true" />}
        </button>
      </DialogContent>
    </Dialog>
  );
}
