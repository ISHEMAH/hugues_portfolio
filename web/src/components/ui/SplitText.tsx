"use client";

import { motion, type Variants } from "motion/react";
import { createElement, type ElementType } from "react";

type SplitTextProps = {
  text: string;
  as?: ElementType;
  /** "letters" animates each character, "words" each word */
  mode?: "letters" | "words";
  className?: string;
  delay?: number;
  stagger?: number;
  /** animate on mount instead of when scrolled into view */
  onMount?: boolean;
  once?: boolean;
};

const containerVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const letterVariants: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.15, duration: 0.7 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.2, duration: 0.8 } },
};

/**
 * Splits text into animated words or letters, mirroring the template's staggered
 * text reveals. Words never break across lines.
 */
export function SplitText({
  text,
  as = "span",
  mode = "words",
  className,
  delay = 0,
  stagger,
  onMount = false,
  once = true,
}: SplitTextProps) {
  const words = text.split(/\s+/).filter(Boolean);
  const step = stagger ?? (mode === "letters" ? 0.035 : 0.06);
  const animationProps = onMount
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once, amount: 0.35 } };

  return createElement(
    motion.span as ElementType,
    {
      className,
      "aria-label": text,
      role: "text",
      variants: containerVariants(step, delay),
      initial: "hidden",
      ...animationProps,
      style: { display: as === "span" ? "inline" : "block" },
    },
    words.map((word, wi) => (
      <span key={`${word}-${wi}`} aria-hidden className="inline-block whitespace-nowrap">
        {mode === "letters"
          ? Array.from(word).map((char, ci) => (
              <motion.span key={ci} variants={letterVariants} className="inline-block will-change-transform">
                {char}
              </motion.span>
            ))
          : (
              <motion.span variants={wordVariants} className="inline-block will-change-transform">
                {word}
              </motion.span>
            )}
        {wi < words.length - 1 ? " " : null}
      </span>
    )),
  );
}
