import { useEffect, useRef } from "react";

// Japanese maple (momiji) autumn tones.
const LEAF_COLORS = ["#9e3520", "#b9472f", "#c75b39", "#d97b3f", "#e0a050"];

interface Leaf {
  x: number;
  y: number;
  size: number;
  rot: number;
  rotSpeed: number;
  fall: number;
  swayPhase: number;
  swayAmp: number;
  swaySpeed: number;
  flutter: number;
  flutterSpeed: number;
  color: string;
}

// A procedural 5-lobe palmate maple leaf, centered, radius ~1.
function tracePalmate(ctx: CanvasRenderingContext2D, r: number) {
  const lobes = 5;
  const spread = Math.PI * 1.2;
  const start = -Math.PI / 2 - spread / 2;
  ctx.beginPath();
  ctx.moveTo(0, r * 1.05); // stem base
  for (let i = 0; i < lobes; i++) {
    const a = start + (spread * i) / (lobes - 1);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    if (i < lobes - 1) {
      const valley = a + spread / (lobes - 1) / 2;
      ctx.lineTo(Math.cos(valley) * r * 0.32, Math.sin(valley) * r * 0.32);
    }
  }
  ctx.closePath();
}

// Ambient maple leaves drifting down behind the content. Pure 2D canvas, no deps.
export function FallingLeaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const spawn = (atTop: boolean): Leaf => ({
      x: rand(0, w),
      y: atTop ? rand(-h, -20) : rand(0, h),
      size: rand(9, 20),
      rot: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.012, 0.012),
      fall: rand(0.35, 0.9),
      swayPhase: rand(0, Math.PI * 2),
      swayAmp: rand(0.4, 1.3),
      swaySpeed: rand(0.008, 0.02),
      flutter: rand(0, Math.PI * 2),
      flutterSpeed: rand(0.01, 0.03),
      color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
    });

    const count = Math.max(10, Math.min(22, Math.round(w / 90)));
    const leaves = Array.from({ length: count }, () => spawn(false));

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(2.5, (now - last) / 16.67); // frames elapsed, capped
      last = now;
      ctx.clearRect(0, 0, w, h);

      for (const leaf of leaves) {
        leaf.y += leaf.fall * dt;
        leaf.swayPhase += leaf.swaySpeed * dt;
        leaf.x += Math.sin(leaf.swayPhase) * leaf.swayAmp * dt;
        leaf.rot += leaf.rotSpeed * dt;
        leaf.flutter += leaf.flutterSpeed * dt;

        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rot);
        ctx.scale(Math.cos(leaf.flutter), 1); // fake the leaf turning over
        ctx.globalAlpha = 0.62;
        ctx.fillStyle = leaf.color;
        tracePalmate(ctx, leaf.size);
        ctx.fill();
        ctx.restore();

        if (leaf.y - leaf.size > h) Object.assign(leaf, spawn(true));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
