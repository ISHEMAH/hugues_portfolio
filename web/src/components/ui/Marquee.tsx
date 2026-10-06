import type { CSSProperties, ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  /** seconds for one full loop */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  gap?: number;
  className?: string;
  itemClassName?: string;
};

/** Seamless infinite horizontal scroller. Content is duplicated once for the loop. */
export function Marquee({
  children,
  duration = 30,
  reverse = false,
  pauseOnHover = false,
  gap = 24,
  className,
  itemClassName,
}: MarqueeProps) {
  const style = { "--marquee-duration": `${duration}s`, "--gap": `${gap}px` } as CSSProperties;
  return (
    <div className={`group/marquee w-full overflow-hidden ${className ?? ""}`} style={style}>
      <div
        className={`flex w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"} ${
          pauseOnHover ? "group-hover/marquee:[animation-play-state:paused]" : ""
        }`}
      >
        <div className={`flex shrink-0 items-center gap-(--gap) pr-(--gap) ${itemClassName ?? ""}`}>{children}</div>
        <div aria-hidden className={`flex shrink-0 items-center gap-(--gap) pr-(--gap) ${itemClassName ?? ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
