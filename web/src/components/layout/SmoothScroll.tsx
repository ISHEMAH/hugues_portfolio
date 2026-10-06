"use client";

import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const getSnapshot = () => !window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/** Exposes the Lenis instance as `window.lenis` (handy for debugging and analytics scripts). */
function LenisBridge() {
  const lenis = useLenis();
  useEffect(() => {
    const w = window as unknown as { lenis?: unknown };
    if (lenis) w.lenis = lenis;
    return () => {
      if (w.lenis === lenis) delete w.lenis;
    };
  }, [lenis]);
  return null;
}

/** Lenis smooth scrolling (skipped on the server and for reduced-motion users). */
export function SmoothScroll({ children, enabled = true }: { children: ReactNode; enabled?: boolean }) {
  const motionOk = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!enabled || !motionOk) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true, anchors: true }}>
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
