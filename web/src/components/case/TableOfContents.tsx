"use client";

import { useEffect, useState } from "react";

export type TocEntry = { id: string; text: string };

export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    if (!entries.length) return;
    const observer = new IntersectionObserver(
      (records) => {
        const visible = records.filter((r) => r.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );
    entries.forEach((e) => {
      const el = document.getElementById(e.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [entries]);

  if (!entries.length) return null;
  return (
    <nav aria-label="Table of contents" className="flex flex-col gap-3">
      <p className="t-label text-ash">Table of Content</p>
      <ol className="flex flex-col gap-1">
        {entries.map((entry) => {
          const isActive = active === entry.id;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                className={`flex items-center gap-2 py-1 text-sm transition-colors ${isActive ? "font-semibold text-ink" : "text-graphite hover:text-ink"}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full transition-colors ${isActive ? "bg-accent" : "bg-line"}`} />
                {entry.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
