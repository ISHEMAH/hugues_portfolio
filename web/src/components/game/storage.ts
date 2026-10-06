import { useSyncExternalStore } from "react";

/** Player progress kept in localStorage so a returning visitor continues where they left off. */
export type Progress = {
  version: 1;
  /** Level currently being played (0-based). */
  level: number;
  /** Highest level index that may be selected. */
  unlocked: number;
  /** Fewest moves per completed level. */
  best: Record<string, number>;
  /** Falls per level, all time. */
  falls: Record<string, number>;
  completed: number[];
};

const KEY = "ih-404-block-v1";
const DEFAULT: Progress = { version: 1, level: 0, unlocked: 0, best: {}, falls: {}, completed: [] };

let cache: Progress | null = null;
const listeners = new Set<() => void>();

function sanitize(raw: unknown, max: number): Progress {
  if (!raw || typeof raw !== "object") return DEFAULT;
  const r = raw as Partial<Progress>;
  const clampIndex = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.min(max - 1, Math.max(0, Math.floor(v))) : 0);
  const numbers = (v: unknown) => {
    const out: Record<string, number> = {};
    if (v && typeof v === "object") for (const [k, n] of Object.entries(v as Record<string, unknown>)) if (typeof n === "number" && n >= 0) out[k] = Math.floor(n);
    return out;
  };
  return {
    version: 1,
    level: clampIndex(r.level),
    unlocked: clampIndex(r.unlocked),
    best: numbers(r.best),
    falls: numbers(r.falls),
    completed: Array.isArray(r.completed) ? r.completed.filter((n): n is number => typeof n === "number") : [],
  };
}

function read(max: number): Progress {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? sanitize(JSON.parse(raw), max) : DEFAULT;
  } catch {
    cache = DEFAULT;
  }
  return cache;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function updateProgress(max: number, patch: (current: Progress) => Progress) {
  const next = patch(read(max));
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable (private mode, quota); the game keeps working in memory.
  }
  listeners.forEach((l) => l());
}

export function useProgress(max: number): Progress {
  return useSyncExternalStore(subscribe, () => read(max), () => DEFAULT);
}
