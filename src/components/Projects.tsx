"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, additionalProjects } from "@/data/portfolio";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { ProjectPreview } from "./ProjectPreview";

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-project]", {
        y: 20,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="border-b border-brutal-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
        <h2 className="section-heading mb-4">
          <span className="text-brutal-green">&gt;</span> PROJECTS
          <span className="text-brutal-green">.</span>
        </h2>
        <p className="mb-12 font-mono text-sm text-brutal-zinc">
          {"// SELECTED WORK + PORTFOLIO CASES"}
        </p>

        <div className="grid grid-cols-1 border-t border-l border-brutal-white md:grid-cols-2">
          {projects.map((project) => (
            <motion.article
              key={project.id}
              data-project
              className="group border-r border-b border-brutal-white p-8 md:p-10"
              whileHover={{
                backgroundColor: "#00ff00",
                color: "#000000",
              }}
              transition={{ duration: 0.1, ease: "linear" }}
            >
              <ProjectPreview title={project.title} image={project.image} />

              <span className="mb-2 inline-block font-mono text-[10px] uppercase tracking-widest opacity-70">
                {project.category}
              </span>
              <h3 className="mb-3 font-[family-name:var(--font-space-grotesk)] text-xl font-bold uppercase tracking-[-0.05em]">
                {project.title}
              </h3>
              <p className="mb-6 font-mono text-sm leading-relaxed opacity-80">
                {project.description}
              </p>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-brutal-white px-4 py-2 font-mono text-xs uppercase group-hover:border-brutal-black group-hover:bg-brutal-black group-hover:text-brutal-white"
                >
                  {project.linkLabel || "VIEW"}
                  <ExternalLink size={12} />
                </a>
              )}
            </motion.article>
          ))}
        </div>

        <div className="mt-12 border border-brutal-white p-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-brutal-green">
            {"// ADDITIONAL PROJECTS"}
          </p>
          <div className="flex flex-wrap gap-2">
            {additionalProjects.map((name) => (
              <span
                key={name}
                className="border border-brutal-grid px-3 py-1 font-mono text-[10px] uppercase text-brutal-zinc"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
