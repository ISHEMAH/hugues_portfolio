"use client";

import { motion } from "framer-motion";
import { personalInfo, terminalLogs } from "@/data/portfolio";

export function TerminalLogBox() {
  return (
    <motion.div
      className="terminal-box hidden lg:block h-full min-h-[320px]"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
    >
      <div className="mb-2 flex items-center gap-2 border-b border-brutal-border pb-2">
        <span className="text-brutal-green">●</span>
        <span>SYS_TERMINAL // {personalInfo.shortName}_DEV</span>
      </div>
      <pre className="whitespace-pre-wrap leading-relaxed">
        {terminalLogs.map((line, i) => (
          <motion.span
            key={i}
            className="block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.1 }}
          >
            {line || "\u00A0"}
          </motion.span>
        ))}
        <span className="animate-blink text-brutal-green">█</span>
      </pre>
    </motion.div>
  );
}
