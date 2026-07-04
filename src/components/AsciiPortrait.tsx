"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { animate } from "animejs";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { personalInfo } from "@/data/portfolio";

const CHARSET = " .:-=+*#%@";
const NOISE = "0123456789ABCDEF<>/\\|_";
const HIGHLIGHT = "@#%*+";
/** Monospace glyphs render ~2× taller than wide — correct row count for square output */
const CHAR_ASPECT = 0.52;

function computeGridDimensions(
  containerWidth: number,
  imageWidth: number,
  imageHeight: number
) {
  const cols = Math.min(80, Math.max(48, Math.floor(containerWidth / 6.5)));
  const imageAspect = imageWidth / imageHeight;
  const rows = Math.max(28, Math.round((cols * CHAR_ASPECT) / imageAspect));
  return { cols, rows };
}

interface AsciiPortraitProps {
  src: string;
}

interface CellData {
  char: string;
  brightness: number;
}

function cloneGrid(grid: string[][]) {
  return grid.map((row) => [...row]);
}

function randomChar() {
  return NOISE[Math.floor(Math.random() * NOISE.length)];
}

function imageToAsciiData(
  image: HTMLImageElement,
  cols: number,
  rows: number
): CellData[][] {
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  const imgAspect = image.width / image.height;
  const gridAspect = cols / rows;
  let sx = 0;
  let sy = 0;
  let sw = image.width;
  let sh = image.height;

  if (imgAspect > gridAspect) {
    sw = image.height * gridAspect;
    sx = (image.width - sw) / 2;
  } else {
    sh = image.width / gridAspect;
    sy = (image.height - sh) / 2;
  }

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cols, rows);
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, cols, rows);

  const { data } = ctx.getImageData(0, 0, cols, rows);
  const grid: CellData[][] = [];

  for (let y = 0; y < rows; y++) {
    const row: CellData[] = [];
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      let brightness =
        0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      brightness = Math.min(255, Math.max(0, (brightness - 128) * 1.35 + 128));
      const idx = Math.floor((brightness / 255) * (CHARSET.length - 1));
      row.push({
        char: CHARSET[CHARSET.length - 1 - idx],
        brightness,
      });
    }
    grid.push(row);
  }

  return grid;
}

function cellClass(char: string, brightness: number, highlighted: boolean) {
  if (highlighted) return "text-brutal-white";
  if (char === " " || char === ".") return "text-brutal-grid";
  if (brightness > 180) return "text-brutal-white";
  if (brightness > 100) return "text-brutal-green";
  return "text-brutal-muted";
}

export function AsciiPortrait({ src }: AsciiPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const gsapCtx = useRef<gsap.Context | null>(null);
  const idleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalDataRef = useRef<CellData[][]>([]);
  const decodeStarted = useRef(false);
  const glitching = useRef(false);
  const highlightRef = useRef<Set<string>>(new Set());
  const probeRef = useRef({ x: -1, y: -1, strength: 0 });

  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [displayGrid, setDisplayGrid] = useState<string[][]>([]);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [cols, setCols] = useState(56);
  const [rows, setRows] = useState(70);
  const [mode, setMode] = useState<"IDLE" | "PROBE" | "GLITCH">("IDLE");
  const [cursorLabel, setCursorLabel] = useState("AWAITING_INPUT");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const buildDisplayFromData = useCallback(
    (data: CellData[][], highlights: Set<string>, probe: { x: number; y: number; strength: number }) => {
      return data.map((row, y) =>
        row.map((cell, x) => {
          const key = `${y},${x}`;
          if (highlights.has(key)) return randomChar();

          if (probe.x >= 0 && probe.y >= 0) {
            const dist = Math.hypot(x - probe.x, y - probe.y);
            const radius = 5 + probe.strength * 4;
            if (dist < radius && cell.char !== " ") {
              const t = 1 - dist / radius;
              const hi = HIGHLIGHT[Math.floor(t * (HIGHLIGHT.length - 1))];
              return hi;
            }
          }

          return cell.char;
        })
      );
    },
    []
  );

  const applyProbe = useCallback(
    (clientX: number, clientY: number, strength: number) => {
      const pre = preRef.current;
      const data = finalDataRef.current;
      if (!pre || data.length === 0) return;

      const rect = pre.getBoundingClientRect();
      const relX = (clientX - rect.left) / rect.width;
      const relY = (clientY - rect.top) / rect.height;
      const gx = Math.floor(relX * data[0].length);
      const gy = Math.floor(relY * data.length);

      if (gx < 0 || gy < 0 || gx >= data[0].length || gy >= data.length) return;

      probeRef.current = { x: gx, y: gy, strength };
      setCursorLabel(`PROBE::X${String(gx).padStart(3, "0")}_Y${String(gy).padStart(3, "0")}`);
      setDisplayGrid(buildDisplayFromData(data, highlightRef.current, probeRef.current));
    },
    [buildDisplayFromData]
  );

  const runGlitch = useCallback(() => {
    const data = finalDataRef.current;
    if (!data.length || glitching.current) return;

    glitching.current = true;
    setMode("GLITCH");
    setCursorLabel("GLITCH::ACTIVE");

    const frames = 12;
    let frame = 0;

    const glitchInterval = setInterval(() => {
      if (frame >= frames) {
        clearInterval(glitchInterval);
        glitching.current = false;
        highlightRef.current.clear();
        probeRef.current = { x: -1, y: -1, strength: 0 };
        setDisplayGrid(data.map((row) => row.map((c) => c.char)));
        setMode("IDLE");
        setCursorLabel("DECODE_COMPLETE");
        return;
      }

      setDisplayGrid(
        data.map((row) =>
          row.map((cell) =>
            cell.char === " " ? " " : Math.random() > 0.4 ? randomChar() : cell.char
          )
        )
      );
      frame++;
    }, 45);

    gsap.fromTo(
      containerRef.current,
      { x: 0 },
      { x: 4, duration: 0.04, repeat: 5, yoyo: true, ease: "steps(2)" }
    );
  }, []);

  const startIdlePulse = useCallback(() => {
    const data = finalDataRef.current;
    if (!data.length) return;

    idleTimer.current = setInterval(() => {
      if (glitching.current || mode === "PROBE") return;

      highlightRef.current.clear();
      for (let i = 0; i < 4; i++) {
        const ry = Math.floor(Math.random() * data.length);
        const rx = Math.floor(Math.random() * data[0].length);
        if (data[ry][rx].char !== " ") {
          highlightRef.current.add(`${ry},${rx}`);
        }
      }

      setDisplayGrid(buildDisplayFromData(data, highlightRef.current, probeRef.current));

      setTimeout(() => {
        highlightRef.current.clear();
        if (!glitching.current) {
          setDisplayGrid(buildDisplayFromData(data, highlightRef.current, probeRef.current));
        }
      }, 90);
    }, 2800);
  }, [buildDisplayFromData, mode]);

  useEffect(() => {
    decodeStarted.current = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const img = new window.Image();
    img.crossOrigin = "anonymous";

    const counter = { val: 0 };
    const percentLoop = animate(counter, {
      val: 96,
      duration: 1600,
      loop: true,
      alternate: true,
      ease: "linear",
      onUpdate: () => {
        if (percentRef.current) {
          percentRef.current.textContent = `${Math.round(counter.val).toString().padStart(2, "0")}%`;
        }
      },
    });

    img.onload = () => {
      percentLoop.pause();
      if (percentRef.current) percentRef.current.textContent = "100%";
      if (progressRef.current) {
        gsap.to(progressRef.current, { width: "100%", duration: 0.15, ease: "steps(2)" });
      }

      const width = containerRef.current?.offsetWidth ?? 400;
      const { cols: computedCols, rows: computedRows } = computeGridDimensions(
        width,
        img.width,
        img.height
      );
      setCols(computedCols);
      setRows(computedRows);

      const asciiData = imageToAsciiData(img, computedCols, computedRows);
      finalDataRef.current = asciiData;

      if (reducedMotion) {
        setDisplayGrid(asciiData.map((row) => row.map((c) => c.char)));
        setShouldAnimate(false);
        setCursorLabel("HOVER_TO_PROBE • CLICK_TO_GLITCH");
      } else {
        setDisplayGrid(asciiData.map((row) => row.map(() => randomChar())));
        setShouldAnimate(true);
      }

      setPhase("ready");
    };

    img.onerror = () => {
      percentLoop.pause();
      setPhase("error");
    };

    img.src = src;

    return () => {
      percentLoop.pause();
      gsapCtx.current?.revert();
      if (idleTimer.current) clearInterval(idleTimer.current);
    };
  }, [src]);

  useEffect(() => {
    if (phase !== "ready" || !shouldAnimate || decodeStarted.current) return;
    const data = finalDataRef.current;
    if (!data.length) return;

    decodeStarted.current = true;
    const cx = data[0].length / 2;
    const cy = data.length / 2;

    const cells: { x: number; y: number; char: string; dist: number }[] = [];
    data.forEach((row, y) => {
      row.forEach((cell, x) => {
        cells.push({ x, y, char: cell.char, dist: Math.hypot(x - cx, y - cy) });
      });
    });
    cells.sort((a, b) => a.dist - b.dist);

    gsapCtx.current = gsap.context(() => {
      gsap.fromTo(
        scanRef.current,
        { top: "0%" },
        { top: "100%", duration: 1.8, ease: "none", repeat: -1 }
      );

      const timeline = gsap.timeline({
        onComplete: () => {
          setCursorLabel("HOVER_TO_PROBE • CLICK_TO_GLITCH");
          startIdlePulse();
        },
      });

      cells.forEach((cell, i) => {
        timeline.call(
          () => {
            setDisplayGrid((prev) => {
              const next = cloneGrid(prev);
              next[cell.y][cell.x] = cell.char;
              return next;
            });
          },
          undefined,
          i * 0.006
        );
      });
    }, containerRef);

    return () => {
      gsapCtx.current?.revert();
      if (idleTimer.current) clearInterval(idleTimer.current);
    };
  }, [phase, shouldAnimate, startIdlePulse]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (phase !== "ready" || glitching.current) return;
      setMode("PROBE");
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }

      const strengthObj = { s: probeRef.current.strength };
      animate(strengthObj, {
        s: 1,
        duration: 150,
        ease: "outExpo",
        onUpdate: () => {
          probeRef.current.strength = strengthObj.s;
        },
      });

      applyProbe(e.clientX, e.clientY, 1);
    },
    [phase, applyProbe, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    if (glitching.current) return;
    setMode("IDLE");
    probeRef.current = { x: -1, y: -1, strength: 0 };
    setCursorLabel("HOVER_TO_PROBE • CLICK_TO_GLITCH");
    setDisplayGrid(finalDataRef.current.map((row) => row.map((c) => c.char)));
  }, []);

  const renderGrid = useMemo(() => {
    const data = finalDataRef.current;
    return displayGrid.map((row, y) => ({
      y,
      cells: row.map((char, x) => {
        const base = data[y]?.[x];
        const brightness = base?.brightness ?? 0;
        return { char, className: cellClass(char, brightness, highlightRef.current.has(`${y},${x}`)) };
      }),
    }));
  }, [displayGrid]);

  if (phase === "error") {
    return (
      <div className="preview-not-found mb-8 flex min-h-[320px] items-center justify-center">
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

  return (
    <motion.div
      ref={containerRef}
      className="preview-not-found relative mb-8 cursor-crosshair overflow-hidden bg-brutal-black select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={runGlitch}
      whileHover={{
        boxShadow: "6px 6px 0 0 #00ff00",
        x: -3,
        y: -3,
      }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      role="img"
      aria-label={`Interactive ASCII portrait of ${personalInfo.name}. Hover to probe, click to glitch.`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          runGlitch();
        }
      }}
    >
      {phase === "loading" && (
        <div className="absolute inset-0 z-10 flex flex-col justify-between bg-brutal-black p-3">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 animate-pulse-green bg-brutal-green" />
              <span className="text-brutal-green">DECODING_ASCII</span>
            </span>
            <span className="text-brutal-muted">PROFILE</span>
          </div>

          <div className="grid grid-cols-8 gap-1 py-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="h-3 border border-brutal-grid bg-brutal-grid/40" />
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-[9px]">
              <span className="text-brutal-muted">RENDERING_BUFFER...</span>
              <span ref={percentRef} className="text-brutal-green">
                00%
              </span>
            </div>
            <div className="h-1.5 border border-brutal-white bg-brutal-black">
              <div ref={progressRef} className="h-full w-0 bg-brutal-green" />
            </div>
          </div>
        </div>
      )}

      {phase === "ready" && shouldAnimate && (
        <div
          ref={scanRef}
          className="pointer-events-none absolute left-0 z-20 h-px w-full bg-brutal-green/40"
        />
      )}

      {phase === "ready" && mode === "PROBE" && (
        <motion.div
          className="pointer-events-none absolute z-30 h-8 w-8 border border-brutal-green"
          style={{
            left: springX,
            top: springY,
            x: "-50%",
            y: "-50%",
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="absolute -top-3 left-1/2 h-2 w-px -translate-x-1/2 bg-brutal-green" />
          <span className="absolute -bottom-3 left-1/2 h-2 w-px -translate-x-1/2 bg-brutal-green" />
          <span className="absolute top-1/2 -left-3 h-px w-2 -translate-y-1/2 bg-brutal-green" />
          <span className="absolute top-1/2 -right-3 h-px w-2 -translate-y-1/2 bg-brutal-green" />
        </motion.div>
      )}

      <pre
        ref={preRef}
        className="flex w-full items-center justify-center overflow-hidden p-2 pb-6 font-mono text-[6px] leading-[0.55] sm:text-[7px] md:text-[8px]"
      >
        {displayGrid.length > 0 ? (
          <code className="inline-block w-fit">
            {renderGrid.map((row) => (
              <span key={row.y} className="block whitespace-pre">
                {row.cells.map((cell, x) => (
                  <span key={`${row.y}-${x}`} className={cell.className}>
                    {cell.char}
                  </span>
                ))}
              </span>
            ))}
          </code>
        ) : (
          <span className="text-brutal-muted">{"// AWAITING_IMAGE_BUFFER..."}</span>
        )}
      </pre>

      {phase === "ready" && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-brutal-grid bg-brutal-black/90 px-2 py-1 font-mono text-[8px]">
          <span className="text-brutal-green">[{mode}]</span>
          <span className="truncate text-brutal-muted">{cursorLabel}</span>
          <span className="text-brutal-zinc">
            {cols}×{rows}
          </span>
        </div>
      )}
    </motion.div>
  );
}
