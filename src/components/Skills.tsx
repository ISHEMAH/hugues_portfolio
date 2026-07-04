"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@/data/portfolio";
import { motion } from "framer-motion";
import { animate } from "animejs";

gsap.registerPlugin(ScrollTrigger);

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-skill]", {
        scale: 0.8,
        autoAlpha: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
        stagger: 0.04,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (hoveredSkill) {
      animate("[data-skill-active]", {
        scale: [1, 1.05, 1],
        duration: 300,
        ease: "outExpo",
      });
    }
  }, [hoveredSkill]);

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="skills" ref={sectionRef} className="border-b border-brutal-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="section-heading">
            <span className="text-brutal-green">&gt;</span> SKILLS
            <span className="text-brutal-green">.</span>
          </h2>
          <p className="font-mono text-sm text-brutal-zinc">
            {hoveredSkill
              ? `// ${skills.find((s) => s.name === hoveredSkill)?.category} — ${hoveredSkill}`
              : "* HOVER OVER CARD TO READ *"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-0 border border-brutal-white sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              data-skill
              data-skill-active={hoveredSkill === skill.name ? "" : undefined}
              className="flex aspect-square cursor-default flex-col items-center justify-center border-r border-b border-brutal-white p-4"
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
              whileHover={{
                backgroundColor: "#ffffff",
                color: "#000000",
                boxShadow: "6px 6px 0 0 #00ff00",
                x: -3,
                y: -3,
              }}
              transition={{ duration: 0.1, ease: "linear" }}
            >
              <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold uppercase tracking-[-0.05em] md:text-xl">
                {skill.name}
              </span>
              <span className="mt-2 font-mono text-[10px] uppercase opacity-60">
                {skill.category}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((cat) => (
            <div key={cat} className="border border-brutal-grid p-4">
              <p className="font-mono text-[10px] uppercase text-brutal-green">{cat}</p>
              <p className="mt-1 font-mono text-2xl font-bold">
                {skills.filter((s) => s.category === cat).length}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
