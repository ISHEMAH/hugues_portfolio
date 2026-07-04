"use client";

import { personalInfo } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="border-t border-brutal-white">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 py-8 font-mono text-xs uppercase md:flex-row md:px-8">
        <p>
          COPYRIGHT © {new Date().getFullYear()}{" "}
          <a
            href={personalInfo.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brutal-green hover:underline"
          >
            {personalInfo.name}
          </a>
          . ALL RIGHTS RESERVED.
        </p>
        <p className="text-brutal-zinc">
          <span className="text-brutal-green">&gt;</span> SYSTEM STATUS: OPERATIONAL
        </p>
      </div>
    </footer>
  );
}
