"use client";

import Image from "@/components/ui/Image";
import { motion } from "motion/react";
import type { Testimonial, TestimonialsSection } from "@/lib/types";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";

const FLAG_POSITIONS = [
  "left-[6%] top-[12%]",
  "right-[8%] top-[10%]",
  "left-[14%] bottom-[14%]",
  "right-[16%] bottom-[8%]",
  "left-[40%] top-[4%]",
  "right-[38%] bottom-[2%]",
];

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="relative flex w-[300px] flex-col justify-center gap-5 overflow-hidden bg-sand p-5 sm:w-[328px]">
      <Image
        aria-hidden
        src="/images/textures/dots.png"
        alt=""
        width={131}
        height={131}
        className="pointer-events-none absolute -top-2 -right-2 h-[131px] w-[131px] opacity-70"
      />
      <div className="relative flex items-center gap-2.5">
        <span className="relative h-9 w-9 overflow-hidden rounded-full bg-stone">
          {item.avatar && <Image src={item.avatar.src} alt={item.avatar.alt || item.name} fill sizes="36px" className="object-cover" />}
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold leading-tight text-ink-dark">{item.name}</p>
          {item.role && <p className="text-xs leading-none text-mist">{item.role}</p>}
        </div>
      </div>
      <p className="relative text-sm leading-[1.5] text-graphite">{item.quote}</p>
    </article>
  );
}

export function Testimonials({ section }: { section: TestimonialsSection }) {
  if (!section.testimonials.length) return null;
  return (
    <section id={section.anchor || "testimonials"} className="w-full">
      <div className="container-1440 frame-x px-4 py-16 md:px-16">
        <div className="flex flex-col items-center gap-6">
          <h2 className="t-h2 text-center text-ink">
            <SplitText text={section.heading} mode="letters" stagger={0.03} />
          </h2>
          <Reveal className="w-full">
            <div className="relative flex flex-col items-center gap-5 px-6 py-16 text-center md:px-8 md:py-24">
              {section.flags.map((flag, i) => (
                <motion.span
                  key={flag.src + i}
                  aria-hidden
                  className={`absolute hidden h-11 w-11 overflow-hidden rounded-full shadow-pill md:block ${FLAG_POSITIONS[i % FLAG_POSITIONS.length]}`}
                  animate={{ y: [0, i % 2 ? 12 : -12, 0], rotate: [0, i % 2 ? -6 : 6, 0] }}
                  transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image src={flag.src} alt="" fill sizes="44px" className="object-cover" />
                </motion.span>
              ))}
              {section.subheading && (
                <h3 className="t-h3 max-w-[900px] text-ink">
                  <SplitText text={section.subheading} mode="words" />
                </h3>
              )}
              {section.description && (
                <p className="t-body-lg max-w-[500px] text-graphite">
                  <SplitText text={section.description} mode="words" delay={0.2} stagger={0.02} />
                </p>
              )}
            </div>
          </Reveal>
          <Reveal className="w-full" delay={0.1}>
            <Marquee duration={Math.max(30, section.testimonials.length * 9)} gap={16} pauseOnHover>
              {section.testimonials.map((t) => (
                <TestimonialCard key={t.id} item={t} />
              ))}
            </Marquee>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
