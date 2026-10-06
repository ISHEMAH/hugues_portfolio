/**
 * Page-wide event bus for the robot mascot. Any part of the site can ask a
 * robot to react without knowing where it is rendered: the contact form
 * celebrates a sent message, the 404 game reports a fall, a button hover asks
 * for a thumbs up. Each robot listens on a channel; "all" reaches every one.
 */
import type { Cue, Emote, Expression } from "./brain";

export type MascotChannel = "hero" | "contact" | "lost" | "about";

export type MascotEvent =
  | { type: "emote"; emote: Emote; face?: Partial<Expression> }
  | { type: "cue"; cue: Cue };

type Handler = (event: MascotEvent) => void;

const handlers = new Map<MascotChannel, Set<Handler>>();

export function emitMascot(channel: MascotChannel | "all", event: MascotEvent) {
  if (channel === "all") {
    for (const set of handlers.values()) for (const h of set) h(event);
    return;
  }
  const set = handlers.get(channel);
  if (!set) return;
  for (const h of set) h(event);
}

export function subscribeMascot(channel: MascotChannel, handler: Handler): () => void {
  let set = handlers.get(channel);
  if (!set) {
    set = new Set();
    handlers.set(channel, set);
  }
  set.add(handler);
  return () => {
    set!.delete(handler);
  };
}

const EMOTES = new Set<string>(["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp", "Dance", "Death"]);
const CUES = new Set<string>(["greet", "celebrate", "oops", "nod", "attention", "startle"]);

/** Parses a data-mascot value: an emote name ("ThumbsUp") or a cue ("cue:celebrate"). */
export function parseTrigger(value: string): MascotEvent | null {
  const v = value.trim();
  if (v.startsWith("cue:")) {
    const cue = v.slice(4);
    return CUES.has(cue) ? { type: "cue", cue: cue as Cue } : null;
  }
  return EMOTES.has(v) ? { type: "emote", emote: v as Emote } : null;
}

const TRIGGER_COOLDOWN_MS = 4000;
const lastFired = new WeakMap<Element, number>();
let triggerRefs = 0;
let detachTriggers: (() => void) | null = null;

/**
 * Lets plain markup drive the robot: any element with `data-mascot="ThumbsUp"`
 * (optionally `data-mascot-channel="contact"`) fires that reaction when a mouse
 * or pen pointer enters it. Reference counted so the single document listener
 * lives exactly as long as there is a robot on the page.
 */
export function attachMascotTriggers(): () => void {
  if (typeof document === "undefined") return () => {};
  triggerRefs += 1;
  if (triggerRefs === 1) {
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const target = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-mascot]") : null;
      if (!target) return;
      const related = e.relatedTarget instanceof Node ? e.relatedTarget : null;
      if (related && target.contains(related)) return; // moving between children
      const now = performance.now();
      if (now - (lastFired.get(target) ?? -Infinity) < TRIGGER_COOLDOWN_MS) return;
      const event = parseTrigger(target.dataset.mascot ?? "");
      if (!event) return;
      lastFired.set(target, now);
      const channel = (target.dataset.mascotChannel as MascotChannel | "all" | undefined) ?? "hero";
      emitMascot(channel, event);
    };
    document.addEventListener("pointerover", onOver, { passive: true });
    detachTriggers = () => document.removeEventListener("pointerover", onOver);
  }
  return () => {
    triggerRefs -= 1;
    if (triggerRefs === 0 && detachTriggers) {
      detachTriggers();
      detachTriggers = null;
    }
  };
}
