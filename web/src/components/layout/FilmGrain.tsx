"use client";

import { useEffect, useRef } from "react";

type FilmGrainProps = {
  density?: number;
  grainSize?: number;
  fps?: number;
  opacity?: number;
  scratches?: number;
};

function seeded(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 1831565813) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Animated film-grain speckles over the whole page, like the template's overlay. */
export function FilmGrain({ density = 300, grainSize = 1.5, fps = 6, opacity = 0.35, scratches = 1 }: FilmGrainProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let raf = 0;
    let last = 0;
    const start = Date.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (time - last < 1000 / fps) return;
      last = time;
      const rand = seeded((start + frame++ * 9301 + 49297) % 233280);
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const scaled = Math.floor((w < 768 ? density * 0.5 : density) * ((w * h) / (1920 * 1080)));
      for (let i = 0; i < scaled; i++) {
        const x = rand() * w;
        const y = rand() * h;
        const kind = Math.floor(rand() * 4);
        const size = 0.5 + rand() * grainSize;
        const alpha = (80 + rand() * 175) / 255;
        ctx.fillStyle = `rgba(30, 32, 32, ${alpha})`;
        ctx.beginPath();
        if (kind === 1) ctx.ellipse(x, y, size * 1.6, size * 0.5, 0, 0, Math.PI * 2);
        else if (kind === 2) ctx.ellipse(x, y, size * 0.5, size * 1.6, 0, 0, Math.PI * 2);
        else ctx.ellipse(x, y, size, size, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      const lines = w < 810 ? 0 : Math.floor(rand() * (scratches + 1));
      for (let i = 0; i < lines; i++) {
        const x = Math.floor(rand() * w);
        const len = 40 + rand() * (h * 0.35);
        const y = rand() * (h - len);
        ctx.save();
        ctx.globalAlpha = 0.08 + rand() * 0.14;
        ctx.strokeStyle = "rgb(30,32,32)";
        ctx.lineWidth = rand() < 0.7 ? 1 : 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let yy = y; yy < y + len; yy += 8) ctx.lineTo(x + (rand() - 0.5) * 1.5, yy);
        ctx.stroke();
        ctx.restore();
      }
      if (reduced) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density, grainSize, fps, scratches]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] h-full w-full mix-blend-multiply"
      style={{ opacity }}
    />
  );
}
