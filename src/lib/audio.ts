// A soft singing-bowl chime: a pure sine fundamental with two quiet inharmonic
// overtones, a gentle swell-in (no onset click) and a long, calm decay. Replaces
// the old rising two-note triangle blip, which felt more arcade than temple.
export function playSuccessSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      console.warn("AudioContext not supported in this browser.");
      return;
    }
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const duration = 2.4;

    // Master envelope: ease in over 60ms, then a long exponential ring-out.
    const master = ctx.createGain();
    master.connect(ctx.destination);
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.16, now + 0.06);
    master.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Fundamental at 432Hz plus bowl-like inharmonic partials that shimmer and fade.
    const partials = [
      { freq: 432, gain: 1 },
      { freq: 432 * 2.76, gain: 0.22 },
      { freq: 432 * 5.4, gain: 0.08 },
    ];
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
