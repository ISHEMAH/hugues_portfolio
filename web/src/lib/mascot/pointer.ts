/**
 * Page-wide pointer tracker shared by every robot mascot instance.
 * Listens on the window (not the canvas) so the head can follow the cursor
 * anywhere on the page. Touch input is ignored on purpose: a finger is not a
 * gaze target, so touch devices get the idle behaviours and tap reactions instead.
 */
export type PointerSnapshot = {
  /** Viewport coordinates of the last mouse or pen position. */
  x: number;
  y: number;
  /** performance.now() of the last movement, 0 when it never moved. */
  lastMove: number;
  /** True when the cursor has left the window. */
  outside: boolean;
  /** True when the device has a fine pointer (mouse, trackpad, pen). */
  fine: boolean;
};

const state: PointerSnapshot = { x: 0, y: 0, lastMove: 0, outside: true, fine: false };
let refs = 0;
let detach: (() => void) | null = null;

function start() {
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    state.x = e.clientX;
    state.y = e.clientY;
    state.lastMove = performance.now();
    state.outside = false;
  };
  const onLeave = () => {
    state.outside = true;
  };
  const onEnter = () => {
    state.outside = false;
  };
  const media = window.matchMedia("(pointer: fine)");
  const onMedia = () => {
    state.fine = media.matches;
  };
  state.fine = media.matches;
  state.x = window.innerWidth / 2;
  state.y = window.innerHeight / 2;

  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave);
  document.documentElement.addEventListener("mouseenter", onEnter);
  media.addEventListener("change", onMedia);

  return () => {
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("mouseleave", onLeave);
    document.documentElement.removeEventListener("mouseenter", onEnter);
    media.removeEventListener("change", onMedia);
  };
}

/** Reference-counted subscription. Returns the matching release function. */
export function attachPointer(): () => void {
  if (typeof window === "undefined") return () => {};
  refs += 1;
  if (refs === 1) detach = start();
  return () => {
    refs -= 1;
    if (refs === 0 && detach) {
      detach();
      detach = null;
    }
  };
}

export function getPointer(): Readonly<PointerSnapshot> {
  return state;
}
