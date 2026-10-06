"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** vertical offset the element travels from (px) */
  y?: number;
  once?: boolean;
  amount?: number;
  duration?: number;
};

/** Framer-style "appear" animation: fades and slides into place when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  amount = 0.2,
  duration = 0.9,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ type: "spring", bounce: 0.2, duration, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
