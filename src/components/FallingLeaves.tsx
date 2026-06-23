import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

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

// Momiji silhouette from maple-leaf.svg (viewBox 128x128): blade body + stem.
const MAPLE_BODY =
  "M63.88 89.48s-5.57 6.36-9.55 8.75c-3.98 2.39-9.55 5.27-10.54 4.57c-.99-.7 1.39-5.57 1.39-5.57s-8.32 1.88-17.53-.79c-8.82-2.55-14.09-6.37-13.69-7.47s4.57-1.69 8.65-3.28c4.08-1.59 9.55-4.18 9.55-4.18s-7.83-2.84-12.3-5.62s-7.29-5.41-7.39-6.31c-.1-.89 6.26-2.49 6.26-2.49s-3.48-2.39-6.07-10.14s-3.27-13.63-2.78-14.21c1.18-1.37 11.73 2.28 14.72 3.85c2.88 1.51 7.55 4.5 7.55 4.5s-.3-5.97.7-5.97c.99 0 3.58 2.39 5.87 5.37s9.05 13.32 10.74 12.53c1.69-.8.09-5.78-2.28-10.67c-1.49-3.08-3.59-8.23-4.78-14.29c-1.18-6-.5-10.94.2-11.53c.7-.6 7.46 4.67 7.46 4.67s-.54-5.79.55-10.76s2.03-6.46 2.62-6.56c.6-.1 2.99 3.4 2.99 3.4s.92-4.95 2.91-8.43s3.75-5.09 4.64-5.09c.89 0 3.52 3.49 4.71 7.17c1.19 3.68 1.88 6.73 1.88 6.73s1.51-3.09 2.18-3.2c.57-.09 2.58 2.16 3.57 7.43s.99 8.91.99 8.91s4.28-4.47 5.07-4.57c.8-.1 2.79 5.07 1.3 12.13c-1.49 7.06-5.37 13.88-6.27 17.56c-.89 3.68-1.69 7.29-.2 7.69s3-4.1 6.18-9.08s7.54-10.21 8.14-9.82c.6.4 1.49 2.29 1.69 3.28c.2.99.3 2.88.3 2.88s4.57-3.08 8.55-4.57c3.98-1.49 12.93-4.77 14.82-3.18c1.89 1.59-1.49 10.14-3.48 14.52c-1.99 4.38-6.36 10.93-6.36 10.93s5.95 1.14 5.85 2.03c-.1.89-4.95 4.89-9.33 7.18s-9.96 4.13-9.96 4.13s2.49 1.69 8.35 3.58c5.87 1.89 10.74 2.49 11.14 3.48s-2.29 4.47-11.24 6.86c-8.95 2.39-18.93 1.06-19.43 1.55c-.5.5 2.43 4.41 1.63 5.51s-6.17-.42-10.34-3.98c-5.35-4.56-9.63-9.43-9.63-9.43z";
const MAPLE_STEM =
  "M59.17 122.18c.2.99 1.31 1.87 4.39 2.07c3.08.2 5.15-.3 5.23-1.95c.09-1.65-1.14-3.49-1.34-4.88c-.2-1.39-.99-10.74-1.19-15.61c-.2-4.87-.36-14.16-.36-14.16l-4.07.43s.06 9.65-.14 14.52c-.2 4.87-1.01 12.01-1.11 13.89c-.09 1.71-1.83 3.61-1.41 5.69z";

// Ambient maple leaves drifting down. Pure 2D canvas, no deps.
// className lets callers control the z-layer (ambient finale behind content vs.
// the celebration shower that sits above the dialog overlay).
export function FallingLeaves({ className }: { className?: string }) {
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
      color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)] ?? "#9e3520",
    });

    const count = Math.max(10, Math.min(22, Math.round(w / 90)));
    const leaves = Array.from({ length: count }, () => spawn(false));

    const body = new Path2D(MAPLE_BODY);
    const stem = new Path2D(MAPLE_STEM);

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

        const s = leaf.size / 52; // SVG viewBox is 128, ~64 half-extent
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rot);
        ctx.scale(Math.cos(leaf.flutter), 1); // fake the leaf turning over
        ctx.scale(s, s);
        ctx.translate(-64, -64);
        ctx.globalAlpha = 0.62;
        ctx.fillStyle = leaf.color;
        ctx.fill(body);
        ctx.fill(stem);
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
      className={cn("fixed inset-0 w-full h-full pointer-events-none z-0", className)}
    />
  );
}
