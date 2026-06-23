import { useState } from "react";
import { playLessonComplete, playPathComplete, playRightAnswer } from "../../lib/audio.ts";
import { loadSoundEnabled, saveSoundEnabled } from "../../lib/storage.ts";

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(loadSoundEnabled);

  const toggleSound = () =>
    setSoundEnabled((prev) => {
      const next = !prev;
      saveSoundEnabled(next);
      return next;
    });

  const playProgressChime = (lessonComplete: boolean, pathComplete: boolean) => {
    if (!soundEnabled) return;
    if (pathComplete) playPathComplete();
    else if (lessonComplete) playLessonComplete();
    else playRightAnswer();
  };

  return { soundEnabled, setSoundEnabled, toggleSound, playProgressChime };
}
