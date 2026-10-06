"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { emitMascot } from "@/lib/mascot/bus";
import type { MascotSettings } from "@/lib/types";
import { applyMove, parseLevel, type Bridges, type Dir, type Level, type Pose } from "./engine";
import { LEVELS } from "./levels";
import { type BlockView, type Camera, drawScene, fitCamera, rollTransform } from "./render";
import { updateProgress, useProgress } from "./storage";
import { DotNumber } from "./DotNumber";

const TOTAL = LEVELS.length;
const ROLL_MS = 170;
const FALL_MS = 520;
const WIN_MS = 620;
const SWIPE_PX = 24;

const parsedLevels: Level[] = LEVELS.map(parseLevel);

const KEY_DIRS: Record<string, Dir> = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right",
};

/** Where each move travels on screen, used to interpret swipes. */
const SCREEN_VEC: Record<Dir, [number, number]> = {
  up: [0.866, -0.5],
  right: [0.866, 0.5],
  down: [-0.866, 0.5],
  left: [-0.866, -0.5],
};

type Anim =
  | { kind: "roll"; dir: Dir; from: Pose; start: number; win: boolean }
  | { kind: "fall"; dir: Dir; from: Pose; start: number }
  | { kind: "win"; start: number };

type Phase = "playing" | "won" | "finished";

type Sim = {
  index: number;
  level: Level;
  pose: Pose;
  bridges: Bridges;
  moves: number;
  anim: Anim | null;
  queue: Dir[];
  cam: Camera | null;
  width: number;
  height: number;
  phase: Phase;
  reducedMotion: boolean;
};

const easeOut = (t: number) => 1 - (1 - t) * (1 - t);
const easeIn = (t: number) => t * t;

function Arrow({ rotate }: { rotate: number }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M12 20V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BlockGame({ mascot }: { mascot?: MascotSettings }) {
  const progress = useProgress(TOTAL);
  const levelIndex = Math.min(progress.level, TOTAL - 1);
  const level = parsedLevels[levelIndex];

  const [moves, setMoves] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [toast, setToast] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const toastTimer = useRef(0);
  const swipeStart = useRef<{ x: number; y: number; id: number } | null>(null);
  const tickRef = useRef<(now: number) => void>(() => {});
  const sim = useRef<Sim>({
    index: levelIndex,
    level,
    pose: level.start,
    bridges: { ...level.bridges },
    moves: 0,
    anim: null,
    queue: [],
    cam: null,
    width: 0,
    height: 0,
    phase: "playing",
    reducedMotion: false,
  });

  const requestRender = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame((now) => {
      rafRef.current = 0;
      tickRef.current(now);
    });
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const resetBoard = useCallback(() => {
    const s = sim.current;
    s.pose = s.level.start;
    s.bridges = { ...s.level.bridges };
    s.moves = 0;
    s.anim = null;
    s.queue = [];
    setMoves(0);
    requestRender();
  }, [requestRender]);

  const setLevel = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(TOTAL - 1, index));
      sim.current.phase = "playing";
      setPhase("playing");
      setMoves(0);
      updateProgress(TOTAL, (p) => ({ ...p, level: clamped }));
    },
    [],
  );

  const move = useCallback(
    (dir: Dir) => {
      const s = sim.current;
      if (s.phase !== "playing") return;
      if (s.anim) {
        if (s.queue.length < 4) s.queue.push(dir);
        return;
      }
      const result = applyMove(s.level, s.pose, s.bridges, dir);
      const from = s.pose;
      const start = s.reducedMotion ? -1e9 : performance.now();
      s.moves += 1;
      setMoves(s.moves);
      if (result.outcome === "fall") {
        s.anim = { kind: "fall", dir, from, start };
      } else {
        s.pose = result.pose;
        s.bridges = result.bridges;
        s.anim = { kind: "roll", dir, from, start, win: result.outcome === "win" };
      }
      requestRender();
    },
    [requestRender],
  );

  const completeLevel = useCallback(() => {
    const s = sim.current;
    const idx = s.index;
    const movesUsed = s.moves;
    updateProgress(TOTAL, (p) => {
      const best = p.best[idx];
      return {
        ...p,
        best: { ...p.best, [idx]: best === undefined ? movesUsed : Math.min(best, movesUsed) },
        completed: p.completed.includes(idx) ? p.completed : [...p.completed, idx],
        unlocked: Math.max(p.unlocked, Math.min(TOTAL - 1, idx + 1)),
      };
    });
    const next: Phase = idx >= TOTAL - 1 ? "finished" : "won";
    s.phase = next;
    setPhase(next);
    emitMascot("lost", { type: "cue", cue: "celebrate" });
  }, []);

  const afterFall = useCallback(() => {
    const s = sim.current;
    updateProgress(TOTAL, (p) => ({ ...p, falls: { ...p.falls, [s.index]: (p.falls[s.index] ?? 0) + 1 } }));
    showToast("Off the edge. Back to the start.");
    emitMascot("lost", { type: "cue", cue: "oops" });
    resetBoard();
  }, [resetBoard, showToast]);

  // The frame loop reads the latest callbacks through this ref.
  useEffect(() => {
    tickRef.current = (now: number) => {
      const canvas = canvasRef.current;
      const s = sim.current;
      if (!canvas || !s.cam || !s.width) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      let view: BlockView = { pose: s.pose };
      let animating = false;
      const a = s.anim;
      if (a?.kind === "roll") {
        const t = Math.min(1, (now - a.start) / ROLL_MS);
        if (t < 1) {
          const tr = rollTransform(a.from, a.dir, easeOut(t) * (Math.PI / 2));
          view = { pose: a.from, transform: tr.point, rotate: tr.rotate };
          animating = true;
        } else {
          s.anim = a.win ? { kind: "win", start: now } : null;
          if (a.win) {
            s.queue = [];
            animating = true;
          } else if (s.queue.length) {
            move(s.queue.shift()!);
            return;
          }
        }
      } else if (a?.kind === "fall") {
        const t1 = Math.min(1, (now - a.start) / ROLL_MS);
        const t2 = Math.max(0, Math.min(1, (now - a.start - ROLL_MS) / FALL_MS));
        if (t2 < 1) {
          const tr = rollTransform(a.from, a.dir, easeOut(t1) * (Math.PI / 2) + t2 * 0.8);
          const drop = -7 * t2 * t2;
          view = { pose: a.from, transform: (p) => { const q = tr.point(p); return { x: q.x, y: q.y, z: q.z + drop }; }, rotate: tr.rotate, alpha: 1 - t2 * 0.9 };
          animating = true;
        } else {
          s.anim = null;
          afterFall();
          return;
        }
      } else if (a?.kind === "win") {
        const t = Math.min(1, (now - a.start) / WIN_MS);
        if (t < 1) {
          const drop = -2.6 * easeIn(t);
          view = { pose: s.pose, transform: (p) => ({ x: p.x, y: p.y, z: p.z + drop }), alpha: 1 - t * 0.85 };
          animating = true;
        } else {
          s.anim = null;
          view = { pose: s.pose, hidden: true };
          completeLevel();
        }
      }
      if (s.phase !== "playing" && !a) view = { ...view, hidden: true };

      drawScene(ctx, s.width, s.height, s.cam, { level: s.level, bridges: s.bridges, block: view });
      if (animating) requestRender();
    };
  }, [afterFall, completeLevel, move, requestRender]);

  // Load the level whenever the stored index changes (including after hydration).
  useEffect(() => {
    const s = sim.current;
    const lv = parsedLevels[levelIndex];
    s.index = levelIndex;
    s.level = lv;
    s.pose = lv.start;
    s.bridges = { ...lv.bridges };
    s.moves = 0;
    s.anim = null;
    s.queue = [];
    if (s.width && s.height) s.cam = fitCamera(lv, s.width, s.height);
    requestRender();
  }, [levelIndex, requestRender]);

  // Canvas sizing follows its container.
  useEffect(() => {
    const board = boardRef.current;
    const canvas = canvasRef.current;
    if (!board || !canvas) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const s = sim.current;
      s.width = width;
      s.height = height;
      s.cam = fitCamera(s.level, width, height);
      requestRender();
    });
    observer.observe(board);
    return () => observer.disconnect();
  }, [requestRender]);

  // Reduced motion, keyboard, and cleanup.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      sim.current.reducedMotion = media.matches;
    };
    syncMotion();
    media.addEventListener("change", syncMotion);

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      const s = sim.current;
      const dir = KEY_DIRS[e.key];
      if (dir) {
        e.preventDefault();
        move(dir);
        return;
      }
      if (e.key === "r" || e.key === "R") {
        if (s.phase === "playing") {
          e.preventDefault();
          resetBoard();
        }
        return;
      }
      if (e.key === "n" || e.key === "N" || e.key === "Enter" || e.key === " ") {
        if (s.phase === "won") {
          e.preventDefault();
          setLevel(s.index + 1);
        } else if (s.phase === "finished") {
          e.preventDefault();
          setLevel(0);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      media.removeEventListener("change", syncMotion);
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      window.clearTimeout(toastTimer.current);
    };
  }, [move, resetBoard, setLevel]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    swipeStart.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.hypot(dx, dy) < SWIPE_PX) {
      const s = sim.current;
      if (s.phase === "won") setLevel(s.index + 1);
      else if (s.phase === "finished") setLevel(0);
      return;
    }
    let best: Dir = "up";
    let bestDot = -Infinity;
    (Object.keys(SCREEN_VEC) as Dir[]).forEach((d) => {
      const [vx, vy] = SCREEN_VEC[d];
      const dot = dx * vx + dy * vy;
      if (dot > bestDot) {
        bestDot = dot;
        best = d;
      }
    });
    move(best);
  };

  const falls = progress.falls[levelIndex] ?? 0;
  const best = progress.best[levelIndex];
  const levelNumber = String(levelIndex + 1).padStart(2, "0");
  const hint = LEVELS[levelIndex].hint;

  const card = "border border-line bg-cream p-6 md:p-7";
  const label = "t-eyebrow text-ash";

  return (
    <section className="container-1440 frame-x pt-[84px] pb-16 lg:pt-[92px]" aria-labelledby="nf-title">
      <div className="grid gap-px bg-line md:grid-cols-[minmax(300px,380px)_1fr]">
        {/* Board */}
        <div className="order-1 bg-cream md:order-2">
          <div ref={boardRef} className="relative h-[min(calc(100vw-32px),72vh)] w-full overflow-hidden bg-ink md:h-[calc(100vh-190px)] md:min-h-[520px]">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full touch-none select-none"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => { swipeStart.current = null; }}
              aria-label={`Level ${levelIndex + 1}: ${LEVELS[levelIndex].name}. Roll the block onto the green tile.`}
              role="img"
            />
            <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-3 text-cream">
              <span className="t-eyebrow text-fog">Level</span>
              <span className="font-sans text-2xl leading-none">{levelNumber}</span>
              <span className="t-eyebrow text-fog">/ {TOTAL}</span>
            </div>
            {toast && (
              <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 border border-cream/20 bg-ink/80 px-4 py-2 text-sm text-cream backdrop-blur" role="status">
                {toast}
              </div>
            )}
            {phase !== "playing" && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/70 p-6 backdrop-blur-[2px]" role="dialog" aria-live="polite">
                <div className="w-full max-w-sm border border-line bg-cream p-7 text-center">
                  <p className={label}>{phase === "finished" ? "All 15 levels" : `Level ${levelNumber}`}</p>
                  <h2 className="t-h3 mt-3 text-ink-deep">{phase === "finished" ? "You found your way home." : "Level complete"}</h2>
                  <p className="mt-3 text-sm text-graphite">
                    {moves} move{moves === 1 ? "" : "s"}
                    {best !== undefined && best < moves ? ` (your best is ${best})` : ""}
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    {phase === "won" ? (
                      <button type="button" onClick={() => setLevel(levelIndex + 1)} className="border border-ink bg-ink px-5 py-3 text-sm uppercase tracking-[2px] text-cream transition-colors hover:bg-coal" autoFocus>
                        Next level
                      </button>
                    ) : (
                      <Link href="/" className="border border-ink bg-ink px-5 py-3 text-sm uppercase tracking-[2px] text-cream transition-colors hover:bg-coal">
                        Take me home
                      </Link>
                    )}
                    <button type="button" onClick={() => (phase === "finished" ? setLevel(0) : resetBoard())} className="border border-line px-5 py-3 text-sm uppercase tracking-[2px] text-ink transition-colors hover:border-ink" onMouseDown={(e) => e.preventDefault()}>
                      {phase === "finished" ? "Play again" : "Replay"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panels */}
        <div className="order-2 grid gap-px bg-line md:order-1">
          <div className={`${card} flex items-start justify-between gap-6`}>
            <h1 id="nf-title" className="t-h3 text-ink-deep">Page not found</h1>
            <span className="font-sans text-[44px] leading-none text-accent">404</span>
          </div>

          {/* A lost robot keeps you company: it sits and sulks, cheers when you clear a level and winces when you fall. */}
          <Mascot
            settings={mascot}
            channel="lost"
            mood="lost"
            palette="dark"
            framing="full"
            collapse
            hint="It is lost too. Poke it"
            label="A lost robot sitting down, waiting for you to find the way home"
            className="group h-[240px] border border-line bg-cream"
          >
            <div
              aria-hidden
              className="absolute left-1/2 top-[62%] h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(234,108,17,0.2),transparent_75%)] blur-2xl transition-opacity duration-1000 group-data-[mascot-state=loading]:animate-pulse"
            />
          </Mascot>

          <div className={card}>
            <p className={label}>About this page</p>
            <p className="mt-4 text-graphite">
              This URL does not exist. Roll the block onto the green tile to find your way home, one level at a time. Do not fall off the edge.
            </p>
            <Link href="/" className="mt-4 inline-block text-sm text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
              Skip the game, take me home
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-px bg-line">
            <div className={card}>
              <p className={label}>Moves</p>
              <DotNumber value={moves} className="mt-4 text-ink" />
              {best !== undefined && <p className="mt-3 text-xs text-fog">Best {best}</p>}
            </div>
            <div className={card}>
              <p className={label}>Falls</p>
              <DotNumber value={falls} className="mt-4 text-ink" />
            </div>
          </div>

          <div className={`${card} flex flex-wrap items-center justify-between gap-6`}>
            <div>
              <p className={label}>Controls</p>
              <ul className="mt-4 space-y-2 text-sm text-graphite">
                <li><span className="text-accent">✦</span> WASD or arrow keys</li>
                <li><span className="text-accent">✦</span> R resets the level, N goes on</li>
                <li><span className="text-accent">✦</span> Swipe the board on a phone</li>
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-1" aria-label="Move the block">
              <PadButton label="Roll up-left" onPress={() => move("left")}><Arrow rotate={-45} /></PadButton>
              <span />
              <PadButton label="Roll up-right" onPress={() => move("up")}><Arrow rotate={45} /></PadButton>
              <span />
              <PadButton label="Reset level" onPress={resetBoard}><span className="font-sans text-base">R</span></PadButton>
              <span />
              <PadButton label="Roll down-left" onPress={() => move("down")}><Arrow rotate={-135} /></PadButton>
              <span />
              <PadButton label="Roll down-right" onPress={() => move("right")}><Arrow rotate={135} /></PadButton>
            </div>
          </div>

          <div className={card}>
            <div className="flex items-baseline justify-between gap-4">
              <p className={label}>Levels</p>
              <p className="text-sm text-graphite">{LEVELS[levelIndex].name}</p>
            </div>
            {hint && <p className="mt-3 text-sm text-ash">{hint}</p>}
            <div className="mt-4 grid grid-cols-5 gap-1" role="list" aria-label="Level select">
              {LEVELS.map((lv, i) => {
                const locked = i > progress.unlocked;
                const done = progress.completed.includes(i);
                const current = i === levelIndex;
                return (
                  <button
                    key={lv.name}
                    type="button"
                    role="listitem"
                    disabled={locked}
                    onClick={() => setLevel(i)}
                    aria-current={current ? "true" : undefined}
                    aria-label={`Level ${i + 1}, ${lv.name}${locked ? ", locked" : done ? ", completed" : ""}`}
                    className={`flex h-10 items-center justify-center border font-sans text-sm transition-colors ${
                      current ? "border-accent text-accent" : done ? "border-ink bg-ink text-cream hover:bg-coal" : locked ? "border-dashed border-line text-fog" : "border-line text-ink hover:border-ink"
                    } disabled:cursor-not-allowed`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PadButton({ label, onPress, children }: { label: string; onPress: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onPress}
      className="flex h-12 w-12 items-center justify-center border border-line text-accent transition-colors hover:border-accent active:bg-accent-tint touch-manipulation select-none"
    >
      {children}
    </button>
  );
}
