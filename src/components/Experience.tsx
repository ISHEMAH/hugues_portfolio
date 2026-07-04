"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate } from "animejs";
import { experiences } from "@/data/portfolio";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(experiences[0].id);
  const active = experiences.find((e) => e.id === activeId) || experiences[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-exp]", {
        y: 20,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = document.querySelector("[data-exp-detail]");
    if (el) {
      animate(el, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 400,
        ease: "outExpo",
      });
    }
  }, [activeId]);

  return (
    <section id="experience" ref={sectionRef} className="border-b border-brutal-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
        <h2 className="section-heading mb-12" data-exp>
          <span className="text-brutal-green">&gt;</span> WORK EXPERIENCE
          <span className="text-brutal-green">.</span>
        </h2>

        <div className="grid grid-cols-1 gap-0 border border-brutal-white lg:grid-cols-[300px_1fr]">
          <div className="border-b border-brutal-white lg:border-b-0 lg:border-r">
            {experiences.map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => setActiveId(exp.id)}
                className={`w-full border-b border-brutal-white px-6 py-4 text-left font-mono text-sm uppercase transition-all duration-100 last:border-b-0 ${
                  activeId === exp.id
                    ? "bg-brutal-green text-brutal-black"
                    : "hover:bg-brutal-white hover:text-brutal-black"
                }`}
                style={{ transitionTimingFunction: "steps(2)" }}
              >
                <span className="block text-[10px] opacity-70">{exp.period}</span>
                {exp.company}
              </button>
            ))}
          </div>

          <div className="p-8 md:p-12" data-exp-detail>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "linear" }}
              >
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold uppercase tracking-[-0.05em]">
                      {active.role}
                    </h3>
                    <p className="mt-1 font-mono text-sm text-brutal-green">{active.company}</p>
                  </div>
                  <span className="border border-brutal-white px-3 py-1 font-mono text-[10px] uppercase">
                    {active.type}
                  </span>
                </div>
                <p className="mb-6 font-mono text-xs text-brutal-zinc">{active.period}</p>
                <ul className="space-y-3">
                  {active.description.map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex gap-3 font-mono text-sm leading-relaxed"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <span className="text-brutal-green">&gt;</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
