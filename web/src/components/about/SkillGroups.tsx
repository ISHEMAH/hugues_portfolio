"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";

export function SkillGroups({ groups }: { groups: { title: string; items: string[] }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="flex flex-col divide-y divide-black/10">
      {groups.map((group, i) => {
        const isOpen = open === i;
        return (
          <li key={group.title + i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-6 text-left"
            >
              <span className="font-serif text-xl font-medium text-ink">{group.title}</span>
              <span className={`grid h-6 w-6 place-items-center text-ink transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                <PlusIcon className="h-5 w-5" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="flex flex-wrap gap-2 pb-6">
                    {group.items.map((skill, j) => (
                      <motion.li
                        key={skill}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 * j }}
                        className="rounded-full border border-line bg-cream px-3 py-2 text-sm text-ink-soft"
                      >
                        {skill}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
