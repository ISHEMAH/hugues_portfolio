"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { FaqSection } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { PlusIcon } from "@/components/ui/icons";

function FaqItem({ question, answer, index, open, onToggle }: { question: string; answer: string; index: number; open: boolean; onToggle: () => void }) {
  const id = `faq-${index}`;
  return (
    <li className="bg-cream">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-start justify-between gap-6 p-5 text-left transition-colors hover:bg-sand"
      >
        <h3 className="t-title text-ink">{question}</h3>
        <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center text-ink transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
          <PlusIcon className="h-5 w-5" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="t-body px-5 pb-6 text-graphite">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Faq({ section }: { section: FaqSection }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!section.items.length) return null;
  return (
    <section id={section.anchor || "faq"} className="w-full">
      <div className="container-1440 frame-x px-4 py-16 md:px-16">
        <div className="container-1200 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
          <div className="flex flex-col gap-2.5 lg:sticky lg:top-[100px] lg:w-[365px] lg:shrink-0">
            <h2 className="t-h2 text-ink">
              <SplitText text={section.heading} mode="words" />
            </h2>
            {section.description && (
              <Reveal delay={0.1}>
                <p className="t-body-lg text-graphite">{section.description}</p>
              </Reveal>
            )}
          </div>
          <Reveal className="flex-1" delay={0.15}>
            <ul className="flex flex-col divide-y divide-line border-y border-line">
              {section.items.map((item, i) => (
                <FaqItem
                  key={item.question + i}
                  index={i}
                  question={item.question}
                  answer={item.answer}
                  open={open === i}
                  onToggle={() => setOpen(open === i ? null : i)}
                />
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
