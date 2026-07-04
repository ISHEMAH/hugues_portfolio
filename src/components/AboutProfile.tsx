"use client";

import { personalInfo } from "@/data/portfolio";
import { AsciiPortrait } from "./AsciiPortrait";

function StaticProfileFallback() {
  return (
    <div className="preview-not-found mb-8 flex min-h-[280px] items-center justify-center">
      <div className="text-center font-mono">
        <p className="mb-2 text-xs text-brutal-green">[SYSTEM_PROFILE]</p>
        <pre className="text-[10px] leading-relaxed text-brutal-muted">
          {`┌─────────────────────────┐
│  ISHEMA M. HUGUES       │
│  ─────────────────────  │
│  ROLE: ${personalInfo.title.slice(0, 20).padEnd(20)}│
│  LOC:  ${personalInfo.location.slice(0, 20).padEnd(20)}│
│  EXP:  4+ YEARS         │
│  STATUS: OPERATIONAL    │
└─────────────────────────┘`}
        </pre>
      </div>
    </div>
  );
}

export function AboutProfile() {
  if (!personalInfo.profileImage) {
    return <StaticProfileFallback />;
  }

  return <AsciiPortrait src={personalInfo.profileImage} />;
}
