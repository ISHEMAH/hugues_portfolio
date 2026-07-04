"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { metrics } from "@/data/portfolio";
import { animate } from "animejs";

gsap.registerPlugin(ScrollTrigger);

function parseMetricValue(value: string) {
  const numValue = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.includes("+") ? "+" : value.includes("%") ? "%" : "";
  return { numValue, suffix };
}

export function DataBar() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-metric]", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        clearProps: "opacity,transform",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true,
        },
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        once: true,
        onEnter: () => {
          section.querySelectorAll("[data-metric-value]").forEach((cell) => {
            const target = parseInt(cell.getAttribute("data-target") || "0", 10);
            const suffix = cell.getAttribute("data-suffix") || "";
            const obj = { val: 0 };

            animate(obj, {
              val: target,
              duration: 1200,
              ease: "outExpo",
              onUpdate: () => {
                cell.textContent = `${Math.round(obj.val)}${suffix}`;
              },
            });
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-y border-brutal-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 border-l border-brutal-white md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((metric) => {
          const { numValue, suffix } = parseMetricValue(metric.value);

          return (
            <div
              key={metric.label}
              data-metric
              className="group flex min-h-[120px] flex-col justify-start border-b border-r border-brutal-white p-6 opacity-100 transition-colors duration-100 md:min-h-[140px] md:p-8 hover:bg-brutal-green hover:text-brutal-black"
              style={{ transitionTimingFunction: "steps(2)" }}
            >
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-brutal-zinc group-hover:text-brutal-black/70">
                {metric.label}
              </p>
              <p className="flex items-baseline gap-1.5 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold leading-none text-brutal-white group-hover:text-brutal-black md:text-4xl">
                <span
                  data-metric-value
                  data-target={numValue}
                  data-suffix={suffix}
                >
                  0{suffix}
                </span>
                {metric.suffix && (
                  <span className="text-sm font-mono font-bold uppercase text-brutal-zinc group-hover:text-brutal-black/70 md:text-base">
                    {metric.suffix}
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
