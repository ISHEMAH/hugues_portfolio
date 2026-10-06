"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

type NumberRollProps = {
  value: string;
  className?: string;
  delay?: number;
};

const DIGITS = Array.from({ length: 10 }, (_, i) => i);

/** Slot-machine style number reveal: each digit rolls down to its final value. */
export function NumberRoll({ value, className, delay = 0 }: NumberRollProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const chars = Array.from(value);

  return (
    <span ref={ref} className={`inline-flex ${className ?? ""}`} aria-label={value}>
      {chars.map((char, i) => {
        if (!/\d/.test(char)) {
          return (
            <span key={i} aria-hidden>
              {char}
            </span>
          );
        }
        const digit = Number(char);
        return (
          <span key={i} aria-hidden className="relative inline-block h-[1em] overflow-hidden leading-none">
            <span className="invisible">{char}</span>
            <motion.span
              className="absolute left-0 top-0 flex flex-col leading-none"
              initial={{ y: "0%" }}
              animate={inView ? { y: `-${digit * 10}%` } : { y: "0%" }}
              transition={{ type: "spring", stiffness: 70, damping: 16, delay: delay + i * 0.12 }}
            >
              {DIGITS.map((d) => (
                <span key={d} className="h-[1em] leading-none">
                  {d}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
