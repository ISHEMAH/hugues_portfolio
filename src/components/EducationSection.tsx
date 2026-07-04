"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { education } from "@/data/portfolio";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function EducationSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-edu]", {
        y: 20,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="education" ref={sectionRef} className="border-b border-brutal-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
        <h2 className="section-heading mb-12">
          <span className="text-brutal-green">&gt;</span> EDUCATION
          <span className="text-brutal-green">.</span>
        </h2>

        <div className="space-y-0 border border-brutal-white">
          {education.map((edu, i) => (
            <motion.article
              key={edu.institution}
              data-edu
              className={`grid grid-cols-1 gap-4 border-brutal-white p-8 md:grid-cols-[200px_1fr] md:p-10 ${
                i < education.length - 1 ? "border-b" : ""
              }`}
              whileHover={{ backgroundColor: "#111111" }}
              transition={{ duration: 0.1 }}
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-brutal-green">
                  {edu.period}
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-[family-name:var(--font-space-grotesk)] text-xl font-bold uppercase tracking-[-0.05em]">
                  {edu.degree}
                </h3>
                <p className="mb-4 font-mono text-sm text-brutal-zinc">{edu.institution}</p>
                <p className="font-mono text-sm leading-relaxed text-brutal-zinc">
                  {edu.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
