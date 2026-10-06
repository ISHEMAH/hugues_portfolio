"use client";

import { motion } from "motion/react";
import type { AboutPage, MascotSettings } from "@/lib/types";
import { Mascot } from "@/components/mascot/Mascot";
import Image from "@/components/ui/Image";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";

/** Still render of the same robot, shown when the 3D version cannot run (reduced motion, no WebGL). */
const ROBOT_POSTER = "/images/mascot/robot-about.png";

export function AboutHero({ page, mascot }: { page: AboutPage; mascot?: MascotSettings }) {
  return (
    <header className="w-full">
      <div className="container-1440 frame-x px-4 pt-[124px] pb-12 md:px-16 md:pt-32 md:pb-16">
        <div className="container-1000 flex flex-col gap-8">
          <Reveal>
            <div className="relative flex flex-col gap-6 overflow-hidden bg-sand md:flex-row md:items-center">
              <span aria-hidden className="pointer-events-none absolute -top-2 -right-24 hidden h-[427px] w-[556px] bg-accent-soft/15 md:block" />
              <div className="relative h-[282px] w-[199px] shrink-0 overflow-hidden bg-accent-pale">
                <Mascot
                  settings={mascot}
                  channel="about"
                  mood="greeter"
                  palette="dark"
                  framing="portrait"
                  idleEvery={[12, 22]}
                  label="Animated robot mascot saying hello. It follows your cursor and reacts when you click it."
                  className="group absolute inset-0 h-full w-full"
                  fallback={<Image src={ROBOT_POSTER} alt="Robot mascot waving hello" fill sizes="199px" className="object-cover" />}
                >
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-[62%] h-[62%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,243,234,0.75),rgba(255,243,234,0.2)_60%,transparent_80%)] blur-xl transition-opacity duration-1000 group-data-[mascot-state=loading]:animate-pulse"
                  />
                </Mascot>
                {page.greeting && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.45, duration: 0.8, delay: 1 }}
                    className="pointer-events-none absolute left-1/2 top-[14px] -translate-x-1/2"
                  >
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative whitespace-nowrap rounded-lg bg-ink px-2 py-2 text-xs font-semibold leading-none text-white"
                    >
                      {page.greeting}
                      <span aria-hidden className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[3px] bg-ink" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
              <div className="relative flex flex-col gap-1 px-6 pb-6 md:px-0 md:pb-0">
                <h1 className="t-h2 text-ink">
                  <SplitText text={page.headline} mode="letters" onMount stagger={0.03} />
                </h1>
                {page.subheadline && (
                  <h2 className="t-h3 text-ash">
                    <SplitText text={page.subheadline} mode="letters" onMount delay={0.35} stagger={0.03} />
                  </h2>
                )}
              </div>
            </div>
          </Reveal>
          {page.intro && (
            <p className="t-body-lg text-mist">
              <SplitText text={page.intro} mode="words" onMount delay={0.6} stagger={0.012} />
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
