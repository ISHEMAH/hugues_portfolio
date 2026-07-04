"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Palette,
  Code2,
  Smartphone,
  PenTool,
  Zap,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { services } from "@/data/portfolio";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Code2,
  Smartphone,
  PenTool,
  Zap,
  Layers,
};

export function ServicesGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-service-card]", {
        y: 20,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="border-b border-brutal-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
        <h2 className="section-heading mb-12">
          <span className="text-brutal-green">&gt;</span> SERVICES
          <span className="text-brutal-green">.</span>
        </h2>

        <div className="grid grid-cols-1 border-t border-l border-brutal-white md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Code2;
            return (
              <motion.article
                key={service.title}
                data-service-card
                className="group relative border-r border-b border-brutal-white p-8 md:p-12"
                whileHover={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                }}
                transition={{ duration: 0.1, ease: "linear" }}
              >
                <Icon
                  className="mb-6 h-10 w-10 text-brutal-green group-hover:text-brutal-black"
                  strokeWidth={1.5}
                />
                <h3 className="mb-4 font-[family-name:var(--font-space-grotesk)] text-xl font-bold uppercase tracking-[-0.05em]">
                  {service.title}
                </h3>
                <p className="mb-8 font-mono text-sm leading-relaxed opacity-80">
                  {service.description}
                </p>
                <span className="inline-block border border-brutal-white px-2 py-1 font-mono text-[10px] uppercase group-hover:border-brutal-black group-hover:bg-brutal-black group-hover:text-brutal-white">
                  {service.tag}
                </span>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
