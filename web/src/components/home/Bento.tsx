"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { BentoSection, ProcessStep } from "@/lib/types";
import { Marquee } from "@/components/ui/Marquee";
import { NumberRoll } from "@/components/ui/NumberRoll";
import { Reveal } from "@/components/ui/Reveal";
import { CheckIcon, CursorIcon, TagGlyph } from "@/components/ui/icons";

function Card({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className={`relative min-h-[175px] overflow-hidden border-r border-b border-line bg-cream ${className}`}>
      {children}
    </Reveal>
  );
}

function ThinkingCard({ data, delay }: { data: NonNullable<BentoSection["thinking"]>; delay: number }) {
  return (
    <Card className="flex flex-col justify-between gap-5 p-6 md:col-span-2" delay={delay}>
      <h3 className="t-title text-ink">{data.title}</h3>
      <Marquee duration={Math.max(16, data.principles.length * 3)} gap={24}>
        {data.principles.map((p, i) => (
          <div key={p.label + i} className="flex w-[99px] flex-col items-center gap-2.5 text-center">
            <TagGlyph icon={p.icon} className="h-8 w-8 text-ink-soft" />
            <span className="t-tag text-ash">{p.label}</span>
          </div>
        ))}
      </Marquee>
    </Card>
  );
}

function CraftCard({ data, delay }: { data: NonNullable<BentoSection["craft"]>; delay: number }) {
  return (
    <Card className="flex items-center justify-center p-6 md:col-span-2" delay={delay}>
      <motion.div
        className="relative w-full max-w-[400px] bg-cream p-6 shadow-card"
        animate={{ x: [0, 14, -8, 0], y: [0, -8, 10, 0], rotate: [0, 1.2, -0.8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full bg-blue" />
        <span className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full bg-red" />
        <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full bg-yellow" />
        <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-indigo" />
        <div className="flex flex-col gap-2">
          <h3 className="t-card text-ink-soft">{data.title}</h3>
          <p className="t-body text-graphite">{data.quote}</p>
        </div>
        <motion.div
          className="absolute -bottom-3 -right-2 text-indigo"
          animate={{ x: [0, -6, 4, 0], y: [0, 4, -3, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <CursorIcon className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </Card>
  );
}

function ExperienceCard({ data, delay }: { data: NonNullable<BentoSection["experience"]>; delay: number }) {
  return (
    <Card className="flex flex-col gap-5 p-6 md:col-span-2 md:row-span-2" delay={delay}>
      <h3 className="t-label text-ash">{data.label}</h3>
      {data.metric && (
        <div className="flex w-[188px] items-stretch overflow-hidden">
          <span className="w-11 shrink-0 bg-amber" />
          <div className="flex flex-col items-center justify-center p-2">
            <span className="flex items-baseline font-grotesk text-[44px] font-semibold leading-none text-ink">
              <NumberRoll value={data.metric.value} />
              {data.metric.suffix && <span className="text-accent">{data.metric.suffix}</span>}
            </span>
            <span className="t-card text-ink">{data.metric.label}</span>
          </div>
        </div>
      )}
      <div className="mt-auto flex flex-col gap-2">
        <h4 className="t-card text-ink">{data.title}</h4>
        <p className="t-body text-graphite">{data.text}</p>
      </div>
    </Card>
  );
}

const CURSOR_COLORS = ["bg-green", "bg-magenta", "bg-blue"];
function CollabCard({ data, delay }: { data: NonNullable<BentoSection["collaboration"]>; delay: number }) {
  return (
    <Card className="flex flex-col justify-between gap-6 p-5 md:col-span-2" delay={delay}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[150px] left-1/2 h-[364px] w-[364px] -translate-x-1/2"
        style={{ background: "radial-gradient(50% 50%, #efeee6 0%, #faf9f5 100%)" }}
      />
      <h3 className="t-label relative text-ash">{data.label}</h3>
      <div className="relative flex max-w-[66%] flex-col gap-1">
        <h4 className="t-card text-ink-soft">{data.title}</h4>
        <p className="t-body text-graphite">{data.text}</p>
      </div>
      {data.collaborators.slice(0, 3).map((name, i) => (
        <motion.div
          key={name + i}
          aria-hidden
          className={`pointer-events-none absolute hidden md:block ${i === 0 ? "top-5 right-24" : i === 1 ? "top-16 right-8" : "bottom-8 right-20"}`}
          animate={{ x: [0, i % 2 ? -14 : 12, 0], y: [0, i % 2 ? 10 : -8, 0] }}
          transition={{ duration: 6 + i * 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <CursorIcon className={`h-5 w-5 ${i === 0 ? "text-green" : i === 1 ? "text-magenta" : "text-blue"}`} />
          <span
            className={`absolute top-4 left-4 whitespace-nowrap rounded-full px-3 py-1 text-base font-semibold text-white shadow-pill ${CURSOR_COLORS[i % 3]}`}
          >
            {name}
          </span>
        </motion.div>
      ))}
    </Card>
  );
}

function ShippedCard({ data, delay }: { data: NonNullable<BentoSection["shipped"]>; delay: number }) {
  return (
    <Card className="flex items-center p-5 md:col-span-2" delay={delay}>
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(294deg, #eeffeb 0%, #fafafa 100%)" }} />
      <div className="relative flex items-center gap-5">
        {data.metric && (
          <span className="flex items-baseline font-grotesk text-[44px] font-semibold leading-none text-green-ink">
            <NumberRoll value={data.metric.value} />
            {data.metric.suffix && <span className="text-accent">{data.metric.suffix}</span>}
          </span>
        )}
        <div className="flex flex-col gap-1">
          <h3 className="t-card text-green-ink">{data.title}</h3>
          <p className="t-body text-graphite">{data.text}</p>
        </div>
      </div>
    </Card>
  );
}

function LanguagesCard({ data, delay }: { data: NonNullable<BentoSection["languages"]>; delay: number }) {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <Card className="flex flex-col justify-center gap-5 p-5 md:col-span-2" delay={delay}>
      <h3 className="t-label text-ash">{data.title}</h3>
      <ul ref={ref} className="grid grid-cols-2 gap-x-3 gap-y-3">
        {data.items.map((lang, i) => (
          <li key={lang.name} className="flex flex-col gap-1.5">
            <span className="t-tag text-ash">{lang.name}</span>
            <span className="block h-2 w-full overflow-hidden rounded-full bg-silver">
              <motion.span
                className="block h-full rounded-full bg-fog"
                initial={{ width: 0 }}
                animate={inView ? { width: `${Math.max(0, Math.min(100, lang.level))}%` } : { width: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 1.2, delay: 0.15 * i }}
              />
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ProcessCard({ data, delay }: { data: NonNullable<BentoSection["process"]>; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const steps: ProcessStep[] = data.steps;
  const segments = Math.max(steps.length - 1, 1);
  return (
    <Card className="flex flex-col justify-center gap-6 p-6 md:col-span-2 lg:col-span-4" delay={delay}>
      <h3 className="t-label text-ash">{data.title}</h3>
      <div ref={ref} className="flex flex-col gap-3">
        <div className="relative flex items-center justify-between">
          <div aria-hidden className="absolute inset-x-3 top-1/2 flex h-0.5 -translate-y-1/2 bg-line">
            {Array.from({ length: segments }).map((_, i) => {
              const done = steps[i + 1]?.state === "done" || steps[i + 1]?.state === "current";
              return (
                <motion.span
                  key={i}
                  className="block h-full origin-left bg-green-deep"
                  style={{ width: `${100 / segments}%` }}
                  initial={{ scaleX: 0 }}
                  animate={inView && done ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.35, ease: "easeInOut" }}
                />
              );
            })}
          </div>
          {steps.map((step, i) => (
            <motion.span
              key={step.label + i}
              className={`relative grid h-6 w-6 place-items-center rounded-full ${
                step.state === "done"
                  ? "bg-green text-white"
                  : step.state === "current"
                    ? "bg-cream ring-2 ring-green text-green"
                    : "bg-silver text-fog"
              }`}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.6, delay: 0.15 + i * 0.35 }}
            >
              {step.state === "done" && <CheckIcon className="h-3.5 w-3.5" />}
              {step.state === "current" && <span className="h-2 w-2 rounded-full bg-green" />}
            </motion.span>
          ))}
        </div>
        <div className="flex justify-between">
          {steps.map((step, i) => (
            <span
              key={step.label + i}
              className={`text-xs sm:text-sm ${i === 0 ? "font-semibold text-ink-soft" : "text-graphite"} ${
                i === 0 ? "text-left" : i === steps.length - 1 ? "text-right" : "text-center"
              }`}
              style={{ width: `${100 / steps.length}%` }}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function Bento({ section }: { section: BentoSection }) {
  const entries: Array<{ key: string; render: (delay: number) => React.ReactNode }> = [];
  if (section.thinking) {
    const data = section.thinking;
    entries.push({ key: "thinking", render: (delay) => <ThinkingCard key="thinking" data={data} delay={delay} /> });
  }
  if (section.craft) {
    const data = section.craft;
    entries.push({ key: "craft", render: (delay) => <CraftCard key="craft" data={data} delay={delay} /> });
  }
  if (section.experience) {
    const data = section.experience;
    entries.push({ key: "experience", render: (delay) => <ExperienceCard key="experience" data={data} delay={delay} /> });
  }
  if (section.collaboration) {
    const data = section.collaboration;
    entries.push({ key: "collab", render: (delay) => <CollabCard key="collab" data={data} delay={delay} /> });
  }
  if (section.shipped) {
    const data = section.shipped;
    entries.push({ key: "shipped", render: (delay) => <ShippedCard key="shipped" data={data} delay={delay} /> });
  }
  if (section.languages) {
    const data = section.languages;
    entries.push({ key: "languages", render: (delay) => <LanguagesCard key="languages" data={data} delay={delay} /> });
  }
  if (section.process) {
    const data = section.process;
    entries.push({ key: "process", render: (delay) => <ProcessCard key="process" data={data} delay={delay} /> });
  }
  const cards = entries.map((entry, i) => entry.render((i + 1) * 0.07));
  if (!cards.length) return null;

  return (
    <section id={section.anchor || "bento"} className="relative w-full">
      <div className="container-1440 frame-x relative overflow-hidden px-4 py-16 md:px-16 md:py-[120px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, #faf9f5 19%, #ffdbca 53%, #faf9f5 100%)" }}
        />
        <div className="container-1200 relative grid grid-cols-1 border-t border-l border-line md:grid-cols-4 lg:grid-cols-6">
          {cards}
        </div>
      </div>
    </section>
  );
}
