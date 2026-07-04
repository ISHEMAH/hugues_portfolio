"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo, workCategories } from "@/data/portfolio";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Github, Linkedin, Instagram, Palette } from "lucide-react";
import { AboutProfile } from "./AboutProfile";

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { icon: Linkedin, href: personalInfo.linkedin, label: "LINKEDIN" },
  { icon: Github, href: personalInfo.github, label: "GITHUB" },
  { icon: Instagram, href: personalInfo.instagram, label: "INSTAGRAM" },
  { icon: Palette, href: personalInfo.behance, label: "BEHANCE" },
  { icon: Mail, href: `mailto:${personalInfo.email}`, label: "EMAIL" },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-about]", {
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
    <section id="about" ref={sectionRef} className="border-b border-brutal-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
        <h2 className="section-heading mb-12" data-about>
          <span className="text-brutal-green">&gt;</span> ABOUT
          <span className="text-brutal-green">.</span>
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div data-about>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-brutal-green">
              {"// WHO_I_AM"}
            </p>
            <h3 className="mb-2 font-[family-name:var(--font-space-grotesk)] text-5xl font-bold uppercase tracking-[-0.05em] md:text-6xl">
              {personalInfo.shortName}
            </h3>
            <p className="mb-6 font-mono text-lg text-brutal-zinc">{personalInfo.title}</p>
            <p className="mb-8 font-mono text-sm leading-relaxed text-brutal-zinc md:text-base">
              {personalInfo.summary}
            </p>

            <div className="space-y-3 font-mono text-sm">
              <p className="flex items-center gap-3">
                <MapPin size={16} className="text-brutal-green" />
                {personalInfo.location}
              </p>
              <p className="flex items-center gap-3">
                <Phone size={16} className="text-brutal-green" />
                {personalInfo.phone}
              </p>
              <p className="flex items-center gap-3">
                <Mail size={16} className="text-brutal-green" />
                {personalInfo.email}
              </p>
            </div>
          </div>

          <div data-about>
            <AboutProfile />

            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-brutal-green">
              {"// CAPABILITIES"}
            </p>
            <div className="mb-8 flex flex-wrap gap-2">
              {workCategories.map((cat) => (
                <motion.span
                  key={cat}
                  className="border border-brutal-white px-3 py-1 font-mono text-[10px] uppercase"
                  whileHover={{
                    backgroundColor: "#00ff00",
                    color: "#000000",
                    boxShadow: "4px 4px 0 0 #ffffff",
                    x: -2,
                    y: -2,
                  }}
                  transition={{ duration: 0.1, ease: "linear" }}
                >
                  {cat}
                </motion.span>
              ))}
            </div>

            <nav className="flex flex-wrap gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-brutal-white px-4 py-2 font-mono text-xs uppercase"
                  whileHover={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    boxShadow: "4px 4px 0 0 #00ff00",
                    x: -2,
                    y: -2,
                  }}
                  transition={{ duration: 0.1, ease: "linear" }}
                >
                  <Icon size={14} />
                  {label}
                </motion.a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
