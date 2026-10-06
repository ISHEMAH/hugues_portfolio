"use client";

import Image from "@/components/ui/Image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { SkillsSection, Tool } from "@/lib/types";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";

function ToolDetail({ tool }: { tool: Tool }) {
  return (
    <div className="group relative w-full max-w-[384px] overflow-hidden bg-ink-dark p-[2px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[60%] opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-spin-slow"
        style={{
          background: "conic-gradient(from 0deg, #ff8d4a 0%, #b2ada1 35%, #f4f3ee 55%, #ff8d4a 100%)",
        }}
      />
      <div className="relative min-h-[283px] bg-coal p-6">
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-charcoal">
              {tool.logo && <Image src={tool.logo.src} alt={tool.logo.alt || tool.name} fill sizes="64px" className="object-cover" unoptimized />}
            </div>
            <h3 className="font-serif text-xl font-medium text-silver">{tool.name}</h3>
            {tool.description && <p className="text-sm leading-[1.5] text-fog">{tool.description}</p>}
          </motion.div>
      </div>
    </div>
  );
}

export function Skills({ section }: { section: SkillsSection }) {
  const tools = section.tools;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || tools.length < 2) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setActive((i) => (i + 1) % tools.length);
    }, 3500);
    return () => clearInterval(id);
  }, [paused, tools.length]);

  if (!tools.length) return null;
  const current = tools[active] ?? tools[0];

  return (
    <section id={section.anchor || "design-tools"} className="w-full bg-charcoal">
      <div className="container-1440 border-x border-line-dark px-4 py-16 md:px-16 md:py-24 lg:py-[120px]">
        <div className="container-1200 flex flex-col items-start gap-14 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="flex w-full max-w-[640px] flex-col gap-10">
            <div className="flex flex-col gap-4">
              {section.label && (
                <Reveal>
                  <p className="t-label text-fog">{section.label}</p>
                </Reveal>
              )}
              <h2 className="t-h2 max-w-[460px] text-white">
                <SplitText text={section.heading} mode="words" />
              </h2>
            </div>
            <Reveal delay={0.2} className="w-full">
              <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
                <Marquee duration={Math.max(18, tools.length * 2.4)} gap={38} pauseOnHover>
                  {tools.map((tool, i) => (
                    <button
                      key={tool.id}
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      aria-label={tool.name}
                      aria-pressed={i === active}
                      className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg transition duration-300 md:h-[90px] md:w-[90px] ${
                        i === active ? "scale-105 ring-2 ring-accent-soft/70" : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      {tool.logo && (
                        <Image src={tool.logo.src} alt="" fill sizes="90px" className="object-cover" unoptimized />
                      )}
                    </button>
                  ))}
                </Marquee>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.3} className="w-full lg:w-auto">
            <ToolDetail tool={current} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
