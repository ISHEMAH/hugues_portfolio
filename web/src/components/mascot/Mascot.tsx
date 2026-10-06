"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { MascotSettings } from "@/lib/types";
import type { Mood } from "@/lib/mascot/brain";
import { attachMascotTriggers, type MascotChannel } from "@/lib/mascot/bus";
import { checkCapabilities } from "@/lib/mascot/capabilities";
import type { PaletteName } from "./palette";
import type { Framing } from "./Robot";

const MascotScene = dynamic(() => import("./MascotScene"), { ssr: false });

/** Bundled robot: "RobotExpressive" by Tomás Laulhé (Quaternius), modified by Don McCurdy, CC0. */
export const MASCOT_MODEL_URL = "/models/robot.glb";

const DEFAULT_SETTINGS: MascotSettings = { enabled: true, showOnMobile: true };

function useMedia(query: string, serverValue: boolean) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

type Props = {
  settings?: MascotSettings;
  /** Which bus channel this robot answers to. */
  channel: MascotChannel;
  mood?: Mood;
  palette?: PaletteName;
  framing?: Framing;
  /** Seconds between spontaneous emotes, [min, max]. */
  idleEvery?: [number, number];
  /** Rendered instead of the robot when 3D is off, unsupported or failed to load. */
  fallback?: ReactNode;
  /** Rendered behind the robot at all times (glow, captions, decorations). */
  children?: ReactNode;
  /** Small caption shown once the robot is ready, until the first poke. */
  hint?: string;
  /** Collapse to nothing when the robot cannot show and there is no fallback. */
  collapse?: boolean;
  className?: string;
  label?: string;
};

/**
 * Mounts the robot only where it makes sense: after the page has loaded, on
 * devices that can afford WebGL, never for reduced-motion visitors, and only
 * on phones when Site Settings allow it. Until then, or if anything fails,
 * the fallback (for the hero, the photo) is shown instead.
 */
export function Mascot({
  settings = DEFAULT_SETTINGS,
  channel,
  mood = "greeter",
  palette = "light",
  framing = "full",
  idleEvery,
  fallback,
  children,
  hint,
  collapse = false,
  className = "",
  label = "Animated robot mascot",
}: Props) {
  const reducedMotion = useMedia("(prefers-reduced-motion: reduce)", false);
  const wide = useMedia("(min-width: 810px)", true);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [capable, setCapable] = useState(false);
  const [phase, setPhase] = useState<"loading" | "ready" | "failed">("loading");
  const [poked, setPoked] = useState(false);

  const wanted = settings.enabled && !reducedMotion && (settings.showOnMobile || wide);

  // Capability check, deferred until the document is parsed and the main
  // thread is idle. It does not wait for every image on the page: the robot is
  // the hero's main visual, so an empty panel costs more than a little bandwidth.
  useEffect(() => {
    if (!wanted) return;
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const run = () => {
      if (!cancelled && checkCapabilities().ok) setCapable(true);
    };
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") idleId = window.requestIdleCallback(run, { timeout: 1500 });
      else timeoutId = window.setTimeout(run, 300);
    };
    if (document.readyState !== "loading") schedule();
    else document.addEventListener("DOMContentLoaded", schedule, { once: true });
    return () => {
      cancelled = true;
      document.removeEventListener("DOMContentLoaded", schedule);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [wanted]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  // The scene is created the first time the box comes near the viewport, so a
  // robot hidden by CSS or far down the page costs nothing until needed.
  const mounted = wanted && capable && seen && phase !== "failed";
  useEffect(() => (mounted ? attachMascotTriggers() : undefined), [mounted]);

  const ready = mounted && phase === "ready";
  const showFallback = !wanted || phase === "failed";

  if (collapse && !fallback && showFallback) return null;

  return (
    <div ref={ref} className={`relative ${className}`} data-mascot-state={ready ? "ready" : showFallback ? "fallback" : "loading"}>
      {children}
      {fallback && (
        <div className={`absolute inset-0 transition-opacity duration-700 ease-out ${showFallback ? "opacity-100" : "pointer-events-none opacity-0"}`}>{fallback}</div>
      )}
      {mounted && (
        <div role="img" aria-label={label} className={`absolute inset-0 transition-opacity duration-700 ease-out ${ready ? "opacity-100" : "opacity-0"}`}>
          <MascotScene
            url={MASCOT_MODEL_URL}
            active={inView && pageVisible}
            mood={mood}
            channel={channel}
            palette={palette}
            framing={framing}
            idleEvery={idleEvery}
            onReady={() => setPhase("ready")}
            onError={() => setPhase("failed")}
            onPoke={() => setPoked(true)}
          />
        </div>
      )}
      {hint && (
        <span
          aria-hidden
          className={`pointer-events-none absolute bottom-5 left-5 flex items-center gap-2 transition-opacity duration-700 ${ready && !poked ? "opacity-100 delay-1000" : "opacity-0"}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${palette === "light" ? "bg-accent-soft" : "bg-accent"} animate-pulse-dot`} />
          <span className={`t-tag uppercase ${palette === "light" ? "text-cream/70" : "text-ash"}`}>{hint}</span>
        </span>
      )}
    </div>
  );
}
