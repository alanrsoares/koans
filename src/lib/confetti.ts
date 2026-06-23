interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rv: number;
}

export function triggerCanvasConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth * window.devicePixelRatio);
  let height = (canvas.height = window.innerHeight * window.devicePixelRatio);

  const handleResize = () => {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
  };
  window.addEventListener("resize", handleResize);

  const particles: ConfettiParticle[] = [];
  const colors = ["#d8cdb8", "#a89b88", "#5c524c", "#dbd4cb", "#b8ae9c", "#8c827a"];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: width / 2,
      y: height / 2 + 100,
      vx: (Math.random() - 0.5) * 12 * window.devicePixelRatio,
      vy: (Math.random() - 0.7) * 16 * window.devicePixelRatio,
      radius: Math.random() * 4 + 2 * window.devicePixelRatio,
      color: colors[Math.floor(Math.random() * colors.length)] ?? "#d8cdb8",
      alpha: 1,
      decay: Math.random() * 0.012 + 0.008,
      rotation: Math.random() * Math.PI * 2,
      rv: (Math.random() - 0.5) * 0.15,
    });
  }

  const updateFrame = () => {
    ctx.clearRect(0, 0, width, height);
    let active = false;

    for (const p of particles) {
      if (p.alpha <= 0) continue;
      active = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25 * window.devicePixelRatio;
      p.alpha -= p.decay;
      p.rotation += p.rv;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.radius, -p.radius / 2, p.radius * 2, p.radius);
      ctx.restore();
    }

    if (active) {
      requestAnimationFrame(updateFrame);
    } else {
      window.removeEventListener("resize", handleResize);
      document.body.removeChild(canvas);
    }
  };

  requestAnimationFrame(updateFrame);
}
