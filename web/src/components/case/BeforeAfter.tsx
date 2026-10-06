"use client";

import Image from "@/components/ui/Image";
import { useState } from "react";
import type { Img } from "@/lib/types";

export function BeforeAfter({ before, after, beforeLabel = "Before", afterLabel = "After" }: { before: Img; after: Img; beforeLabel?: string; afterLabel?: string }) {
  const [value, setValue] = useState(50);
  const ratio = after.width && after.height ? `${after.width} / ${after.height}` : "16 / 9";
  return (
    <figure className="relative w-full select-none overflow-hidden rounded-xl bg-sand" style={{ aspectRatio: ratio }}>
      <Image src={after.src} alt={after.alt || afterLabel} fill sizes="(min-width: 1200px) 1000px, 92vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <Image src={before.src} alt={before.alt || beforeLabel} fill sizes="(min-width: 1200px) 1000px, 92vw" className="object-cover" />
      </div>
      <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white">{beforeLabel}</span>
      <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white">{afterLabel}</span>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-pill" style={{ left: `${value}%` }}>
        <span className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-pill">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 7-4 5 4 5M15 7l4 5-4 5" />
          </svg>
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </figure>
  );
}
