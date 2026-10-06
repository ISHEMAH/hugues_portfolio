"use client";

import { useVisualEditingEnvironment } from "next-sanity/hooks";

export function DisableDraftMode() {
  const environment = String(useVisualEditingEnvironment());
  // Hide inside the Studio's Presentation tool; show on the live site so editors can leave draft mode.
  if (environment.startsWith("presentation")) return null;
  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-[80] rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-pill"
    >
      Exit draft mode
    </a>
  );
}
