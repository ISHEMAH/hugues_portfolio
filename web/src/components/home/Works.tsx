"use client";

import Image from "@/components/ui/Image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import type { Project, WorksSection } from "@/lib/types";
import { CornerButton } from "@/components/ui/CornerButton";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { ArrowUpRightIcon } from "@/components/ui/icons";

const RIBBON_COLORS = ["bg-ribbon-lavender", "bg-ribbon-yellow", "bg-ribbon-blue", "bg-ribbon-green", "bg-accent-tint", "bg-stone"];

function Ribbon({ items, active, mirrored }: { items: string[]; active: number; mirrored?: boolean }) {
  return (
    <div
      className={`absolute top-1/2 h-20 w-[70vw] min-w-[720px] overflow-hidden shadow-pill ${
        mirrored ? "right-[-6vw] origin-center rotate-[-8deg]" : "left-[-6vw] origin-center rotate-[8deg]"
      }`}
    >
      {items.map((label, i) => (
        <motion.div
          key={label + i}
          className={`absolute inset-x-0 top-0 h-20 ${RIBBON_COLORS[i % RIBBON_COLORS.length]}`}
          animate={{ y: (i - active) * 80, zIndex: i === active ? 10 : 0 }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.9 }}
        >
          <Marquee duration={26} gap={64} reverse={mirrored} className="h-20">
            {Array.from({ length: 8 }).map((_, r) => (
              <span key={r} className="flex h-20 items-center whitespace-nowrap font-serif text-2xl font-medium tracking-[-0.02em] text-ink">
                {label}
              </span>
            ))}
          </Marquee>
        </motion.div>
      ))}
    </div>
  );
}

function StackCard({ project, index, progress }: { project: Project; index: number; progress: MotionValue<number> }) {
  // progress goes 0..total-1 across the whole stack; this card shrinks as the next one covers it
  const scale = useTransform(progress, (p) => 1 - Math.min(Math.max(p - index, 0), 1) * 0.08);
  const opacity = useTransform(progress, (p) => 1 - Math.min(Math.max(p - index, 0), 1) * 0.35);
  const y = useTransform(progress, (p) => -Math.min(Math.max(p - index, 0), 1) * 24);
  const image = project.thumbnail ?? project.cover;

  return (
    <div className="sticky top-0 flex h-screen items-center justify-center px-4" style={{ zIndex: index + 1 }}>
      <motion.div style={{ scale, opacity, y }} className="w-full max-w-[842px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 60 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", bounce: 0.2, duration: 1 }}
        >
        <Link
          href={`/works/${project.slug}`}
          className="group grid w-full grid-cols-1 gap-4 border border-line bg-cream p-4 shadow-card transition-shadow duration-500 hover:shadow-lg md:grid-cols-2 md:gap-6"
          aria-label={`${project.title} case study`}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand md:aspect-[400/508]">
            {image && (
              <Image
                src={image.src}
                alt={image.alt || project.title}
                fill
                sizes="(min-width: 810px) 420px, 92vw"
                className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                placeholder={image.lqip ? "blur" : "empty"}
                blurDataURL={image.lqip}
              />
            )}
          </div>
          <div className="flex flex-col justify-center gap-6 py-2 md:pr-4">
            <div className="flex flex-col gap-3">
              <h3 className="t-card text-ink">{project.title}</h3>
              {project.shortDescription && <p className="text-sm leading-[1.5] text-graphite">{project.shortDescription}</p>}
            </div>
            {(project.tags.length > 0 || project.timeline) && (
              <ul className="flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <li key={tag} className="rounded-full bg-stone px-3 py-2 text-xs font-semibold leading-none text-ink">
                    {tag}
                  </li>
                ))}
                {project.timeline && (
                  <li className="rounded-full bg-stone px-3 py-2 text-xs font-semibold leading-none text-ink">{project.timeline}</li>
                )}
              </ul>
            )}
            <span className="inline-flex h-8 w-10 items-center justify-center rounded-full bg-stone text-ink transition-colors group-hover:bg-ink group-hover:text-white">
              <span className="relative block h-[22px] w-[22px] overflow-hidden">
                <ArrowUpRightIcon className="absolute inset-0 h-full w-full transition-transform duration-300 ease-out-expo group-hover:translate-x-6 group-hover:-translate-y-6" />
                <ArrowUpRightIcon className="absolute inset-0 h-full w-full -translate-x-6 translate-y-6 transition-transform duration-300 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
              </span>
            </span>
          </div>
        </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Works({ section }: { section: WorksSection }) {
  const stackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const projects = section.projects.slice(0, 6);
  const total = projects.length;
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });
  const progress = useTransform(scrollYProgress, (v) => v * Math.max(total - 1, 0));
  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.min(total - 1, Math.max(0, Math.round(v)));
    if (next !== active) setActive(next);
  });

  if (!total) return null;
  const names = projects.map((p) => p.title);
  const categories = projects.map((p) => p.category || p.tags[0] || "Case study");

  return (
    <section id={section.anchor || "works"} className="relative w-full border-y border-line">
      <div className="relative flex flex-col items-center justify-end gap-2 px-4 pt-20 pb-8 md:h-[180px]">
        {section.label && (
          <Reveal>
            <p className="t-eyebrow text-ash">{section.label}</p>
          </Reveal>
        )}
        <h2 className="t-h2 text-center text-ink">
          <SplitText text={section.heading} mode="letters" stagger={0.03} />
        </h2>
      </div>

      <div ref={stackRef} className="relative isolate overflow-clip">
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="container-1200 flex h-full justify-between">
            <span className="h-full w-px bg-line" />
            <span className="h-full w-px bg-line" />
          </div>
        </div>
        <div aria-hidden className="pointer-events-none sticky top-0 z-0 hidden h-screen -mb-[100vh] overflow-hidden md:block">
          <Ribbon items={names} active={active} />
          <Ribbon items={categories} active={active} mirrored />
        </div>
        {projects.map((project, i) => (
          <StackCard key={project.id} project={project} index={i} progress={progress} />
        ))}
      </div>

      {section.cta && (
        <div className="relative z-10 flex justify-center px-4 pb-24 pt-10">
          <CornerButton href={section.cta.href}>{section.cta.label}</CornerButton>
        </div>
      )}
    </section>
  );
}
