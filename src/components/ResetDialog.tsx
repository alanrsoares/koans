import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

interface ResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ResetDialog({ open, onOpenChange, onConfirm }: ResetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[400px] flex flex-col gap-5 p-8 bg-[oklch(0.99_0.004_74)] border border-[var(--stone)] rounded-2xl shadow-[0_24px_60px_-20px_oklch(0.26_0.008_40/0.3)] focus-visible:outline-none"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="text-2xl tracking-normal text-[var(--ink)] font-display text-balance">
            Begin again?
          </DialogTitle>
          <DialogDescription className="text-[var(--muted-foreground)] text-sm leading-relaxed font-serif">
            This clears every solved koan and answer across all paths. There is no undo.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--ink)] rounded-lg focus-visible:ring-1 focus-visible:ring-[var(--ink)] focus-visible:outline-none transition-colors duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-bold text-[oklch(0.97_0.012_70)] bg-[var(--maple)] hover:brightness-95 rounded-lg focus-visible:ring-2 focus-visible:ring-[var(--maple)] focus-visible:ring-offset-2 focus-visible:outline-none transition-[filter,transform] duration-200 active:scale-[0.99] cursor-pointer"
          >
            Clear progress
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
