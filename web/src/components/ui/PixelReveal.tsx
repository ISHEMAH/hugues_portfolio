"use client";

import { motion } from "motion/react";
import { useMemo, type ReactNode } from "react";

type PixelRevealProps = {
  children: ReactNode;
  gridSize?: number;
  color?: string;
  delay?: number;
  tileDuration?: number;
  spread?: number;
  className?: string;
};

/** Deterministic shuffle so server and client render identical markup. */
function shuffledOrder(count: number, seed: number) {
  const order = Array.from({ length: count }, (_, i) => i);
  let s = seed;
  for (let i = order.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** Reveals its content through a grid of tiles that disappear in random order. */
export function PixelReveal({
  children,
  gridSize = 10,
  color = "#1a1c1c",
  delay = 0.6,
  tileDuration = 0.35,
  spread = 1.2,
  className = "",
}: PixelRevealProps) {
  const total = gridSize * gridSize;
  const order = useMemo(() => shuffledOrder(total, gridSize * 31 + 7), [total, gridSize]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gridTemplateRows: `repeat(${gridSize}, 1fr)` }}
      >
        {order.map((position, i) => (
          <motion.span
            key={i}
            style={{ backgroundColor: color }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: tileDuration, delay: delay + (position / total) * spread, ease: "easeOut" }}
          />
        ))}
      </div>
    </div>
  );
}
