"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

/** Cycles through words with a vertical slide, like the footer headline. */
export function TextCycle({ words, interval = 2200, className }: { words: string[]; interval?: number; className?: string }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (words.length < 2) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);
  const word = words[index] ?? "";
  return (
    <span className={`relative inline-grid overflow-hidden py-[0.08em] -my-[0.08em] align-bottom ${className ?? ""}`} aria-label={words.join(" / ")}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word + index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.7 }}
          className="col-start-1 row-start-1 inline-block whitespace-nowrap"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
