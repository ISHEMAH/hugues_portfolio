"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/data/portfolio";
import { BrutalistButton } from "./BrutalistButton";

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-cta]", {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-brutal-green text-brutal-black"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-4 py-16 md:flex-row md:items-center md:px-8 md:py-24">
        <div data-cta>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest">
            {"// READY_TO_CONNECT"}
          </p>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] md:text-6xl lg:text-7xl">
            UPGRADE YOUR
            <br />
            PRESENCE.NOW
          </h2>
          <p className="mt-6 max-w-md font-mono text-sm">
            {personalInfo.email} · {personalInfo.phone} · {personalInfo.location}
          </p>
        </div>

        <div data-cta>
          <BrutalistButton
            href={`mailto:${personalInfo.email}?subject=PROJECT_INQUIRY&body=INITIATING_CONTACT_FROM_PORTFOLIO...`}
            variant="dark"
          >
            INITIATE_CONTACT
          </BrutalistButton>
        </div>
      </div>
    </section>
  );
}
