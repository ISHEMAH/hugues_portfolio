"use client";

import Image from "@/components/ui/Image";
import { motion } from "motion/react";
import type { Service, ServicesSection } from "@/lib/types";
import { Corners } from "@/components/ui/Corners";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { ServiceGlyph } from "@/components/ui/icons";

function Shapes() {
  return (
    <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block">
      <motion.div
        className="absolute -top-24 right-52 h-[107px] w-[105px]"
        initial={{ opacity: 0, rotate: -6, scale: 0.7 }}
        whileInView={{ opacity: 1, rotate: 3, scale: 0.7 }}
        viewport={{ once: true }}
        transition={{ type: "spring", bounce: 0.3, duration: 1.2, delay: 0.3 }}
      >
        <motion.div animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
          <span className="absolute -inset-2 border border-accent-pale/70" />
          <Image src="/images/shapes/pyramid.webp" alt="" width={660} height={680} sizes="105px" style={{ width: "100%", height: "auto" }} />
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute -top-16 right-8 h-[190px] w-[172px]"
        initial={{ opacity: 0, rotate: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, rotate: 67, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", bounce: 0.3, duration: 1.2, delay: 0.45 }}
      >
        <motion.div animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
          <span className="absolute -inset-3 border border-accent-pale/70" />
          <Image src="/images/shapes/cylinder.webp" alt="" width={898} height={697} sizes="172px" style={{ width: "100%", height: "auto" }} />
        </motion.div>
      </motion.div>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <Reveal delay={index * 0.08} className="group relative overflow-hidden border-r border-b border-line bg-cream">
      <div className="absolute inset-0 origin-top scale-y-0 bg-coal transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
      <div className="relative z-10 flex min-h-[260px] flex-col justify-center gap-8 p-6 md:min-h-[325px] md:p-8">
        <figure className="relative grid h-16 w-16 place-items-center text-ink transition-colors duration-500 group-hover:text-white">
          <Corners size={8} thickness={1.5} slide={false} />
          <ServiceGlyph icon={service.icon} className="h-8 w-8" />
        </figure>
        <div className="flex flex-col gap-2">
          <h3 className="t-card text-ink transition-colors duration-500 group-hover:text-white">{service.title}</h3>
          <p className="t-body text-graphite transition-colors duration-500 group-hover:text-silver">{service.description}</p>
        </div>
      </div>
    </Reveal>
  );
}

export function Services({ section }: { section: ServicesSection }) {
  if (!section.services.length) return null;
  return (
    <section id={section.anchor || "services"} className="w-full">
      <div className="container-1440 frame-x">
        <div className="px-4 py-16 md:px-16 md:pb-32">
          <div className="container-1200 flex flex-col gap-11">
            <div className="relative flex items-center gap-6">
              <div className="flex max-w-[702px] flex-col gap-2">
                {section.label && (
                  <Reveal>
                    <p className="t-eyebrow text-graphite">{section.label}</p>
                  </Reveal>
                )}
                <h2 className="t-h2 text-ink">
                  <SplitText text={section.heading} mode="words" />
                </h2>
              </div>
              {section.showShapes && <Shapes />}
            </div>
            <div className="grid grid-cols-1 border-t border-l border-line md:grid-cols-2 lg:grid-cols-3">
              {section.services.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
