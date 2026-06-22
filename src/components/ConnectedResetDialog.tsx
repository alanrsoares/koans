import type React from "react";
import { clearProgress } from "../lib/storage.ts";
import { useKoanStore } from "../store/koanStore.ts";
import { ResetDialog } from "./ResetDialog.tsx";

export function ConnectedResetDialog(): React.JSX.Element {
  const [{ showResetConfirm }, { setShowResetConfirm }] = useKoanStore();

  return (
    <ResetDialog
      open={showResetConfirm}
      onOpenChange={setShowResetConfirm}
      onConfirm={clearProgress}
    />
  );
}
