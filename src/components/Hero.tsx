"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { personalInfo } from "@/data/portfolio";
import { TerminalLogBox } from "./TerminalLogBox";
import { BrutalistButton } from "./BrutalistButton";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => (
    <div className="preview-not-found flex h-[200px] w-full items-center justify-center md:h-[280px]">
      <span className="text-[10px] text-brutal-muted font-mono">[LOADING_3D_SCENE...]</span>
    </div>
  ),
});

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from("[data-hero='status']", { y: 20, autoAlpha: 0, duration: 0.6 })
        .from("[data-hero='title']", { y: 30, autoAlpha: 0, duration: 0.8 }, "-=0.3")
        .from("[data-hero='subtitle']", { y: 20, autoAlpha: 0, duration: 0.6 }, "-=0.4")
        .from("[data-hero='cta']", { scale: 0.95, autoAlpha: 0, duration: 0.5 }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen border-b border-brutal-white pt-20"
    >
      <div className="mx-auto grid max-w-[1400px] min-h-[calc(100vh-5rem)] grid-cols-1 gap-8 px-4 py-12 md:px-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col justify-center">
          <p
            data-hero="status"
            className="mb-6 flex items-center gap-2 font-mono text-sm uppercase"
          >
            <span className="animate-pulse-green inline-block h-2 w-2 bg-brutal-green" />
            <span className="text-brutal-green">STATUS:</span> ONLINE
          </p>

          <h1
            data-hero="title"
            className="font-[family-name:var(--font-space-grotesk)] text-5xl font-bold leading-[0.85] tracking-[-0.05em] uppercase sm:text-7xl md:text-8xl lg:text-9xl"
          >
            <span className="text-stroke-white">DESIGN</span>
            <br />
            <span>THAT</span>
            <br />
            <span className="text-stroke-white">COMPILES</span>
          </h1>

          <p
            data-hero="subtitle"
            className="mt-8 max-w-xl text-xl text-brutal-zinc md:text-2xl"
          >
            {personalInfo.title}. Crafting creative, user-friendly interfaces with React,
            TypeScript, Next.js &amp; modern design systems.
          </p>

          <div data-hero="cta" className="mt-10 flex flex-wrap gap-4">
            <BrutalistButton href={`mailto:${personalInfo.email}`}>
              INITIATE_CONTACT
            </BrutalistButton>
            <BrutalistButton href={personalInfo.linkedin} external>
              LINKEDIN_PROFILE
            </BrutalistButton>
          </div>
        </div>

        <div className="flex flex-col gap-4 justify-center">
          <HeroScene />
          <TerminalLogBox />
        </div>
      </div>
    </section>
  );
}
