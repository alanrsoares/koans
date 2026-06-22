type Partial = { freq: number; gain: number };

type RingOptions = {
  peak: number; // master gain at the top of the attack
  attack: number; // seconds to swell in (small but non-zero avoids an onset click)
  duration: number; // seconds until the tail fades to silence
};

// Additive synth: layer sine partials under one shared envelope, then ring out.
// Inharmonic partial ratios (non-integer multiples) give a struck-metal timbre;
// harmonic ratios stay bell-pure.
function ring(partials: Partial[], { peak, attack, duration }: RingOptions): void {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      console.warn("AudioContext not supported in this browser.");
      return;
    }
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.connect(ctx.destination);
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(peak, now + attack);
    master.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    for (const { freq, gain } of partials) {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      oscGain.gain.setValueAtTime(gain, now);
      osc.connect(oscGain);
      oscGain.connect(master);
      osc.start(now);
      osc.stop(now + duration);
    }
  } catch (e) {
    console.warn("Chime blocked by browser audio policy:", e);
  }
}

// A single correct answer: a light, quick bell. Quiet and brief since it fires often.
export const playRightAnswer = (): void =>
  ring(
    [
      { freq: 880, gain: 1 },
      { freq: 880 * 2, gain: 0.16 },
      { freq: 880 * 3.01, gain: 0.07 },
    ],
    { peak: 0.09, attack: 0.006, duration: 0.9 }
  );

// A finished lesson: the soft singing-bowl tone — fuller and longer than the bell.
export const playLessonComplete = (): void =>
  ring(
    [
      { freq: 432, gain: 1 },
      { freq: 432 * 2.76, gain: 0.22 },
      { freq: 432 * 5.4, gain: 0.08 },
    ],
    { peak: 0.16, attack: 0.06, duration: 2.4 }
  );

// A finished path (every lesson in a language): a deep zen gong with a long decay
// and rich inharmonic partials.
export const playPathComplete = (): void =>
  ring(
    [
      { freq: 110, gain: 1 },
      { freq: 110 * 1.5, gain: 0.4 },
      { freq: 110 * 2.4, gain: 0.5 },
      { freq: 110 * 4.1, gain: 0.22 },
      { freq: 110 * 6.8, gain: 0.1 },
    ],
    { peak: 0.22, attack: 0.12, duration: 5.5 }
  );
