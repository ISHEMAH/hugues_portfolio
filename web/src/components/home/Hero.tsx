"use client";

import Image from "@/components/ui/Image";
import type { HeroSection, MascotSettings } from "@/lib/types";
import { Mascot } from "@/components/mascot/Mascot";
import { CornerButton } from "@/components/ui/CornerButton";
import { NumberRoll } from "@/components/ui/NumberRoll";
import { PixelReveal } from "@/components/ui/PixelReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { Typewriter } from "@/components/ui/Typewriter";

export function Hero({ section, mascot }: { section: HeroSection; mascot?: MascotSettings }) {
  const { eyebrow, headline, typewriterWords, intro, cta, portrait, metrics } = section;
  const isDownload = cta ? /resume|cv|download/i.test(cta.label) : false;

  return (
    <header id={section.anchor || "hero"} className="relative w-full">
      <div className="container-1440 frame-x">
        <div className="flex flex-col border-b border-line lg:h-[90vh] lg:min-h-[680px] lg:flex-row">
          {/* Left */}
          <div className="flex w-full flex-col justify-center gap-8 bg-cream px-6 pt-[100px] pb-10 md:px-8 md:pt-32 md:pb-16 lg:w-1/2 lg:px-16 lg:pt-[92px] lg:pb-8">
            <div className="flex flex-col gap-5">
              {eyebrow && (
                <p className="t-eyebrow text-ash">
                  <SplitText text={eyebrow} mode="letters" onMount stagger={0.03} />
                </p>
              )}
              <h1 className="t-display text-ink-deep">
                <SplitText text={headline} mode="letters" onMount delay={0.3} stagger={0.03} />
                {typewriterWords.length > 0 && (
                  <>
                    <br />
                    <Typewriter words={typewriterWords} className="text-accent" cursorClassName="text-accent" />
                  </>
                )}
              </h1>
            </div>
            {intro && (
              <p className="t-body-lg max-w-[562px] text-graphite">
                <SplitText text={intro} mode="words" onMount delay={0.9} stagger={0.02} />
              </p>
            )}
            {cta && (
              <Reveal delay={1.4} y={12}>
                {/* Hovering the call to action earns a thumbs up from the robot. */}
                <span className="inline-block" data-mascot="ThumbsUp" data-mascot-channel="hero">
                  <CornerButton href={cta.href} newTab={cta.newTab} icon={isDownload ? "download" : "arrow"}>
                    {cta.label}
                  </CornerButton>
                </span>
              </Reveal>
            )}
          </div>

          {/* Right */}
          <div className="relative flex w-full flex-col bg-ink lg:w-1/2 lg:flex-row">
            <div className="relative h-[400px] w-full overflow-hidden sm:h-[480px] lg:h-full lg:flex-1">
              <Mascot
                settings={mascot}
                channel="hero"
                mood="greeter"
                palette="light"
                framing="full"
                hint="Poke the robot"
                label="Animated robot mascot. It waves, follows your cursor and reacts when you click it."
                className="group absolute inset-0 h-full w-full"
                fallback={
                  portrait ? (
                    <PixelReveal color="#1a1c1c" className="absolute inset-0 h-full w-full" delay={0.8}>
                      <Image
                        src={portrait.src}
                        alt={portrait.alt || ""}
                        fill
                        sizes="(min-width: 1200px) 33vw, 100vw"
                        className="object-cover object-top"
                        placeholder={portrait.lqip ? "blur" : "empty"}
                        blurDataURL={portrait.lqip}
                      />
                    </PixelReveal>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-coal to-ink" />
                  )
                }
              >
                {/* Backdrop: a soft accent glow that breathes while the robot loads. */}
                <div aria-hidden className="absolute inset-0 overflow-hidden">
                  <div className="absolute left-1/2 top-[56%] h-[72%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(234,108,17,0.30),rgba(234,108,17,0.08)_55%,transparent_78%)] blur-2xl transition-opacity duration-1000 group-data-[mascot-state=loading]:animate-pulse group-data-[mascot-state=fallback]:opacity-0" />
                </div>
              </Mascot>
            </div>
            {metrics.length > 0 && (
              <div className="flex w-full flex-row items-stretch bg-cream lg:w-[245px] lg:flex-col lg:pt-[60px]">
                {metrics.map((metric, i) => (
                  <div
                    key={metric.label + i}
                    className="flex flex-1 flex-col items-center justify-center gap-1 border-t border-line p-4 sm:p-8 lg:min-h-[130px] lg:border-l lg:p-12 [&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-l"
                  >
                    <span className="flex items-baseline font-sans text-[32px] leading-none text-ink sm:text-[44px]">
                      <NumberRoll value={metric.value} delay={1 + i * 0.15} />
                      {metric.suffix && <span className="text-accent">{metric.suffix}</span>}
                    </span>
                    <span className="t-tag text-ink-soft">{metric.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
