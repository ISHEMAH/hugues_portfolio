/**
 * Behaviour engine for the robot mascot. Pure TypeScript, no three.js: every
 * frame it takes what the pointer is doing and returns which animation clip
 * should play, where the head should look, how the face should feel and how
 * big the robot is while it pops in. The Robot component turns that into
 * mixer calls, bone rotations and morph target weights.
 *
 * Angles are yaw (positive = towards +X, the viewer's right) and pitch
 * (positive = up), in degrees, relative to the robot facing the camera.
 */
export type Angles = { yaw: number; pitch: number };

export type Clip =
  | "Idle"
  | "Walking"
  | "Running"
  | "Dance"
  | "Death"
  | "Sitting"
  | "Standing"
  | "Jump"
  | "Yes"
  | "No"
  | "Wave"
  | "Punch"
  | "ThumbsUp"
  | "WalkJump";

/** Clips that work as one-off reactions. */
export type Emote = "Jump" | "Yes" | "No" | "Wave" | "Punch" | "ThumbsUp" | "Dance" | "Death";

/** Morph target weights on the face, 0 to 1 each. */
export type Expression = { angry: number; surprised: number; sad: number };

/** "greeter" stands and entertains, "lost" sits and sulks until poked (404 page). */
export type Mood = "greeter" | "lost";

/** Higher level requests other parts of the page can send; the brain decides the performance. */
export type Cue = "greet" | "celebrate" | "oops" | "nod" | "attention" | "startle";

export type BrainInput = {
  /** Seconds since the previous update. */
  dt: number;
  /** Direction from the head to the cursor, or null when the device has no fine pointer. */
  cursor: Angles | null;
  /** True when the cursor moved recently and is inside the window. */
  pointerActive: boolean;
  /** True when the cursor has left the browser window. */
  pointerOutside: boolean;
  /** True while the pointer is over the robot itself. */
  hovering: boolean;
  /** Direction from the head to the camera, i.e. to the person looking at the page. */
  viewer: Angles;
};

/** One request to play a clip. A new id means "start this now". */
export type Performance = { id: number; clip: Clip; loop: boolean; timeScale: number; fade: number };

export type BrainOutput = {
  /** The looping stance to return to: standing idle or the seated pose. */
  base: "Idle" | "Sitting";
  action: Performance | null;
  head: Angles;
  headRoll: number;
  /** How much the look-at may override the clip's own head motion, 0 to 1. */
  lookWeight: number;
  bodyYaw: number;
  expression: Expression;
  /** Pop-in scale, 0 to 1 with a small overshoot. */
  scale: number;
  seated: boolean;
  /** Current behaviour, for debugging and hints. */
  label: string;
};

type Step =
  | { kind: "play"; clip: Clip; timeScale?: number; hold?: boolean; fade?: number; face?: Partial<Expression> }
  | { kind: "base"; clip: "Idle" | "Sitting" }
  | { kind: "wait"; seconds: number; face?: Partial<Expression> }
  | { kind: "face"; face: Partial<Expression>; seconds: number }
  | { kind: "call"; fn: () => void };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const damp = (cur: number, target: number, lambda: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-lambda * dt));
const angleDistance = (a: Angles, b: Angles) => Math.hypot(a.yaw - b.yaw, a.pitch - b.pitch);

function pick<T>(items: Array<[T, number]>): T {
  let total = 0;
  for (const [, w] of items) total += w;
  let r = Math.random() * total;
  for (const [item, w] of items) {
    r -= w;
    if (r <= 0) return item;
  }
  return items[items.length - 1][0];
}

/** Ease-out with a little bounce for the pop-in. */
function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const x = clamp(t, 0, 1);
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

export const LIMITS = { headYaw: 42, headPitch: 26, bodyYaw: 16 };

const POP_DURATION = 0.75;
const POKE_WINDOW = 2.6;
const DOZE_AFTER = 34;
const SIT_BACK_AFTER = 7;

/** Face each clip brings along, and how much of its own head motion to keep. */
const CLIPS: Record<Clip, { face?: Partial<Expression>; look: number }> = {
  Idle: { look: 1 },
  Walking: { look: 0.5 },
  Running: { look: 0.4 },
  Dance: { look: 0.15 },
  Death: { face: { sad: 1 }, look: 0 },
  Sitting: { look: 0.6 },
  Standing: { look: 0.6 },
  Jump: { face: { surprised: 0.7 }, look: 0.4 },
  Yes: { look: 0.3 },
  No: { face: { angry: 0.35 }, look: 0.25 },
  Wave: { look: 0.8 },
  Punch: { face: { angry: 1 }, look: 0.3 },
  ThumbsUp: { look: 0.8 },
  WalkJump: { look: 0.4 },
};

const TRICKS: Array<[Emote, number]> = [
  ["Jump", 2],
  ["ThumbsUp", 2],
  ["Yes", 1.5],
  ["Wave", 1.5],
  ["Dance", 0.8],
];

const IDLE_EMOTES: Array<[Emote, number]> = [
  ["Wave", 2],
  ["Yes", 2],
  ["ThumbsUp", 2],
  ["No", 1],
  ["Jump", 1],
  ["Dance", 0.5],
  ["Punch", 0.4],
];

const ZERO_FACE: Expression = { angry: 0, surprised: 0, sad: 0 };

export class MascotBrain {
  private t = 0;
  private mood: Mood;
  private idleEvery: [number, number];

  // Animation
  private base: "Idle" | "Sitting" = "Idle";
  private action: Performance | null = null;
  private actionDone = false;
  private holding = false;
  private nextId = 1;
  private queue: Step[] = [];
  private stepStarted = false;
  private waitUntil = 0;
  private lookWeight = 1;

  // Look
  private lookState: "follow" | "stare" | "wander" | "idle" = "idle";
  private lookUntil = 0;
  private target: Angles = { yaw: 0, pitch: 0 };
  private drift: Angles = { yaw: 0, pitch: 0 };
  private nextDrift = 0;
  private head: Angles = { yaw: 0, pitch: 0 };
  private bodyYaw = 0;
  private roll = 0;
  private rollTarget = 0;
  private nextRoll = 0;
  private prevCursor: Angles | null = null;
  private droopUntil = 0;

  // Face
  private face: Expression = { ...ZERO_FACE };
  private faceTarget: Expression = { ...ZERO_FACE };
  private faceUntil = 0;
  private resting: Expression;

  // Life
  private scale = 0;
  private seated = false;
  private dozing = false;
  private lastPointerActivity = 0;
  private outsideSince = -1;
  private missedYou = false;
  private hoverSince = -1;
  private nextHoverReact = 0;
  private nextIdleEmote: number;
  private pokes = 0;
  private lastPoke = -10;
  private sulkUntil = 0;
  private sitBackAt = -1;
  private cooldowns = new Map<string, number>();
  private label = "hello";

  constructor(mood: Mood, options: { idleEvery?: [number, number] } = {}) {
    this.mood = mood;
    this.idleEvery = options.idleEvery ?? [9, 16];
    this.resting = mood === "lost" ? { angry: 0, surprised: 0, sad: 0.6 } : { ...ZERO_FACE };
    this.faceTarget = { ...this.resting };
    this.nextIdleEmote = rand(this.idleEvery[0], this.idleEvery[1]);
    if (mood === "lost") {
      this.queue.push({ kind: "play", clip: "Sitting", hold: true, timeScale: 3, fade: 0.05 }, { kind: "base", clip: "Sitting" });
    } else {
      this.queue.push({ kind: "wait", seconds: 0.55 }, { kind: "play", clip: "Wave", face: { surprised: 0.25 } });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Inputs from the outside world                                       */
  /* ------------------------------------------------------------------ */

  /** The visitor clicked or tapped the robot. */
  poke() {
    const streak = this.t - this.lastPoke < POKE_WINDOW;
    this.pokes = streak ? this.pokes + 1 : 1;
    this.lastPoke = this.t;
    this.lastPointerActivity = this.t;

    if (this.t < this.sulkUntil) {
      this.setFace({ angry: 0.7 }, 0.9);
      this.label = "sulking";
      return;
    }
    if (this.dozing) {
      this.wake();
      return;
    }
    if (this.seated) {
      this.standUp();
      this.queue.push({ kind: "face", face: { surprised: 0.9 }, seconds: 1.1 }, { kind: "play", clip: "Wave" });
      this.scheduleSitBack();
      this.pokes = 0;
      this.label = "stood up";
      return;
    }
    if (this.busy()) return;

    if (this.pokes <= 2) {
      this.perform(pick(TRICKS));
      this.label = "trick";
    } else if (this.pokes === 3) {
      this.perform("No");
      this.label = "annoyed";
    } else if (this.pokes === 4) {
      this.perform("Punch");
      this.label = "angry";
    } else {
      this.perform("Death");
      this.pokes = 0;
      this.sulkUntil = this.t + 7;
      this.label = "knocked out";
    }
    this.scheduleSitBack();
  }

  /** A request from elsewhere on the page (contact form, game, hovered button). */
  request(event: { type: "emote"; emote: Emote; face?: Partial<Expression> } | { type: "cue"; cue: Cue }) {
    if (event.type === "emote") {
      if (!this.cooldown(`emote:${event.emote}`, 5)) return;
      if (this.dozing) this.wake();
      if (this.busy()) return;
      this.perform(event.emote, event.face);
      this.scheduleSitBack();
      return;
    }
    if (!this.cooldown(`cue:${event.cue}`, 2.5)) return;
    if (this.dozing) this.wake();
    switch (event.cue) {
      case "greet":
        if (!this.busy()) this.perform("Wave");
        break;
      case "nod":
        if (!this.busy()) this.perform("Yes");
        break;
      case "celebrate":
        this.clearQueue();
        this.restIdleTimer();
        this.standUp();
        this.queue.push({ kind: "face", face: { surprised: 0.6 }, seconds: 0.8 }, { kind: "play", clip: "ThumbsUp" }, { kind: "play", clip: "Dance", fade: 0.3 });
        this.label = "celebrating";
        break;
      case "oops":
        this.setFace({ sad: 1 }, 2.6);
        this.droopUntil = this.t + 2.2;
        if (!this.seated && !this.busy()) this.queue.push({ kind: "play", clip: "No", face: { sad: 1 } });
        this.label = "oops";
        break;
      case "attention":
        this.setFace({ surprised: 0.8 }, 1.1);
        this.enterLook("stare");
        break;
      case "startle":
        this.setFace({ surprised: 1 }, 1.3);
        if (!this.seated && !this.busy()) this.queue.push({ kind: "play", clip: "Jump", face: { surprised: 1 } });
        break;
    }
    this.scheduleSitBack();
  }

  /** The Robot reports that the one-shot clip with this id has finished (or clamped). */
  performanceFinished(id: number) {
    if (this.action && this.action.id === id) this.actionDone = true;
  }

  /* ------------------------------------------------------------------ */
  /* Per-frame update                                                    */
  /* ------------------------------------------------------------------ */

  update(input: BrainInput): BrainOutput {
    const dt = clamp(input.dt, 0, 0.05);
    this.t += dt;
    if (input.pointerActive) this.lastPointerActivity = this.t;

    this.scale = easeOutBack(this.t / POP_DURATION);
    this.runQueue();
    if (!this.busy()) this.think(input);
    this.updateLook(input, dt);
    this.updateFace(dt);

    const clip = this.action && (!this.actionDone || this.holding) ? this.action.clip : this.base;
    const wantedLook = this.dozing ? 1 : CLIPS[clip].look;
    this.lookWeight = damp(this.lookWeight, wantedLook, 6, dt);

    return {
      base: this.base,
      action: this.action,
      head: this.head,
      headRoll: this.roll,
      lookWeight: this.lookWeight,
      bodyYaw: this.bodyYaw,
      expression: this.face,
      scale: this.scale,
      seated: this.seated,
      label: this.label,
    };
  }

  /* ------------------------------------------------------------------ */
  /* Sequencing                                                          */
  /* ------------------------------------------------------------------ */

  private busy() {
    return this.queue.length > 0 || (this.action !== null && !this.actionDone);
  }

  /** Drops pending steps; whatever clip is playing keeps going until the next step replaces it. */
  private clearQueue() {
    this.queue.length = 0;
    this.stepStarted = false;
    this.waitUntil = 0;
  }

  private cooldown(key: string, seconds: number) {
    const until = this.cooldowns.get(key) ?? -Infinity;
    if (this.t < until) return false;
    this.cooldowns.set(key, this.t + seconds);
    return true;
  }

  private runQueue() {
    while (this.queue.length) {
      const step = this.queue[0];
      switch (step.kind) {
        case "play": {
          if (!this.stepStarted) {
            this.stepStarted = true;
            this.action = { id: this.nextId++, clip: step.clip, loop: false, timeScale: step.timeScale ?? 1, fade: step.fade ?? 0.22 };
            this.actionDone = false;
            this.holding = Boolean(step.hold);
            if (step.face) this.setFace(step.face, Infinity);
            return;
          }
          if (!this.actionDone) return;
          this.queue.shift();
          this.stepStarted = false;
          if (!this.holding) this.action = null;
          if (step.face) this.faceUntil = this.t + 0.3;
          continue;
        }
        case "wait": {
          if (!this.stepStarted) {
            this.stepStarted = true;
            this.waitUntil = this.t + step.seconds;
            if (step.face) this.setFace(step.face, step.seconds + 0.25);
            return;
          }
          if (this.t < this.waitUntil) return;
          this.queue.shift();
          this.stepStarted = false;
          continue;
        }
        case "base":
          this.base = step.clip;
          this.seated = step.clip === "Sitting";
          this.action = null;
          this.holding = false;
          this.queue.shift();
          continue;
        case "face":
          this.setFace(step.face, step.seconds);
          this.queue.shift();
          continue;
        case "call":
          step.fn();
          this.queue.shift();
          continue;
      }
    }
  }

  private restIdleTimer() {
    this.nextIdleEmote = this.t + rand(this.idleEvery[0], this.idleEvery[1]);
  }

  private perform(emote: Emote, face?: Partial<Expression>) {
    this.restIdleTimer();
    if (this.seated) this.standUp();
    if (emote === "Death") {
      this.queue.push(
        { kind: "play", clip: "Death", hold: true, face: { sad: 1 } },
        { kind: "wait", seconds: 1.5, face: { sad: 1 } },
        { kind: "play", clip: "Death", timeScale: -1.6, fade: 0.1 },
        { kind: "face", face: { surprised: 0.6 }, seconds: 0.9 },
      );
      return;
    }
    this.queue.push({ kind: "play", clip: emote, face: face ?? CLIPS[emote].face });
  }

  private standUp() {
    if (!this.seated && !this.dozing) return;
    this.dozing = false;
    this.queue.push({ kind: "play", clip: "Standing", hold: true, timeScale: 1.6, fade: 0.15 }, { kind: "base", clip: "Idle" });
  }

  private sitDown() {
    if (this.seated) return;
    this.queue.push({ kind: "play", clip: "Sitting", hold: true, fade: 0.2 }, { kind: "base", clip: "Sitting" });
  }

  private scheduleSitBack() {
    if (this.mood === "lost") this.sitBackAt = this.t + SIT_BACK_AFTER;
  }

  private startDoze() {
    this.dozing = true;
    this.sitDown();
    this.setFace({ sad: 0.18 }, Infinity);
    this.label = "dozing";
  }

  private wake() {
    this.dozing = false;
    this.restIdleTimer();
    this.queue.push(
      { kind: "face", face: { surprised: 1 }, seconds: 1.4 },
      { kind: "play", clip: "Standing", hold: true, timeScale: 2.2, fade: 0.1 },
      { kind: "base", clip: "Idle" },
      { kind: "play", clip: "Jump", face: { surprised: 0.9 } },
    );
    this.label = "startled";
  }

  /* ------------------------------------------------------------------ */
  /* Spontaneous behaviour                                               */
  /* ------------------------------------------------------------------ */

  private think(input: BrainInput) {
    const hasPointer = input.cursor !== null;

    // Dozes off when nobody has moved the mouse for a long while (desktop only).
    if (hasPointer && this.mood === "greeter" && !this.dozing && this.t - this.lastPointerActivity > DOZE_AFTER) {
      this.startDoze();
      return;
    }
    if (this.dozing) {
      if (input.pointerActive) this.wake();
      return;
    }

    // Misses the visitor when the cursor leaves the window, perks up when it returns.
    if (hasPointer && input.pointerOutside) {
      if (this.outsideSince < 0) this.outsideSince = this.t;
      else if (!this.missedYou && this.t - this.outsideSince > 1.8) {
        this.missedYou = true;
        this.setFace({ sad: 0.55 }, Infinity);
        this.droopUntil = Infinity;
        this.label = "missing you";
      }
    } else {
      if (this.missedYou) {
        const away = this.t - this.outsideSince;
        this.missedYou = false;
        this.droopUntil = 0;
        this.setFace({ surprised: 0.75 }, 1.1);
        this.enterLook("stare");
        if (away > 6 && !this.seated && this.cooldown("welcome", 20)) this.perform("Wave");
        this.label = "welcome back";
      }
      this.outsideSince = -1;
    }

    // Lingering over the robot earns a reaction.
    if (input.hovering) {
      if (this.hoverSince < 0) this.hoverSince = this.t;
      else if (!this.seated && this.t - this.hoverSince > 1.1 && this.t > this.nextHoverReact) {
        this.nextHoverReact = this.t + 14;
        this.perform(Math.random() < 0.5 ? "Wave" : "ThumbsUp");
        this.label = "hover";
      }
    } else {
      this.hoverSince = -1;
    }

    // A sudden cursor swing is startling.
    if (input.cursor && this.prevCursor && input.pointerActive) {
      const swing = angleDistance(input.cursor, this.prevCursor) / Math.max(input.dt, 1 / 240);
      if (swing > 320 && this.cooldown("startle", 5)) this.setFace({ surprised: 0.65 }, 0.9);
    }
    this.prevCursor = input.cursor ? { ...input.cursor } : null;

    // Idle emotes keep it alive when nobody interacts.
    if (this.mood === "greeter" && !this.seated && !input.hovering && !this.missedYou && this.t > this.nextIdleEmote) {
      this.perform(pick(IDLE_EMOTES));
      this.label = "idle emote";
    }

    // Lost robots sit back down once the fun is over.
    if (this.mood === "lost" && !this.seated && this.sitBackAt > 0 && this.t > this.sitBackAt) {
      this.sitBackAt = -1;
      this.sitDown();
      this.label = "lost again";
    }
  }

  /* ------------------------------------------------------------------ */
  /* Head and body                                                       */
  /* ------------------------------------------------------------------ */

  private enterLook(state: "follow" | "stare" | "wander" | "idle") {
    this.lookState = state;
    switch (state) {
      case "follow":
        this.lookUntil = this.t + rand(3.5, 8);
        break;
      case "stare":
        this.lookUntil = this.t + rand(1.4, 3.2);
        break;
      case "wander":
        this.lookUntil = this.t + rand(0.8, 1.8);
        this.drift = { yaw: rand(-30, 30), pitch: rand(-10, 18) };
        break;
      case "idle":
        this.lookUntil = this.t + rand(2.5, 5);
        this.nextDrift = this.t + rand(0.2, 0.6);
        break;
    }
  }

  private updateLook(input: BrainInput, dt: number) {
    const hasCursor = input.cursor !== null && input.pointerActive && !input.pointerOutside;

    if (this.lookState === "idle" && hasCursor) this.enterLook("follow");
    else if (this.lookState === "follow" && !hasCursor) this.enterLook("idle");
    else if (this.t >= this.lookUntil) {
      const r = Math.random();
      switch (this.lookState) {
        case "follow":
          this.enterLook(r < 0.45 ? "stare" : r < 0.7 ? "wander" : "follow");
          break;
        case "stare":
          this.enterLook(hasCursor ? "follow" : "idle");
          break;
        case "wander":
          this.enterLook(hasCursor ? (r < 0.3 ? "stare" : "follow") : "idle");
          break;
        case "idle":
          this.enterLook(r < 0.3 ? "stare" : "idle");
          break;
      }
    }

    const searching = this.seated && this.mood === "lost";
    switch (this.lookState) {
      case "follow":
        if (input.cursor) this.target = { yaw: clamp(input.cursor.yaw, -60, 60), pitch: clamp(input.cursor.pitch, -35, 35) };
        break;
      case "stare":
        this.target = { ...input.viewer };
        break;
      case "wander":
        this.target = { ...this.drift };
        break;
      case "idle":
        if (this.t >= this.nextDrift) {
          const spread = searching ? 40 : 16;
          this.drift =
            !searching && Math.random() < 0.35
              ? { ...input.viewer }
              : { yaw: input.viewer.yaw + rand(-spread, spread), pitch: input.viewer.pitch + rand(searching ? -14 : -9, searching ? 12 : 9) };
          this.nextDrift = this.t + rand(searching ? 1.2 : 1.4, searching ? 2.6 : 3.6);
        }
        this.target = { ...this.drift };
        break;
    }
    if (input.hovering && input.cursor) this.target = { yaw: clamp(input.cursor.yaw, -60, 60), pitch: clamp(input.cursor.pitch, -35, 35) };

    let wantedPitch = this.target.pitch;
    let wantedYaw = this.target.yaw;
    if (this.dozing) {
      wantedPitch = -24 + Math.sin(this.t * 1.1) * 3;
      wantedYaw = Math.sin(this.t * 0.45) * 6;
    } else if (this.t < this.droopUntil) {
      wantedPitch = Math.min(wantedPitch, -16);
    }

    const lambda = this.lookState === "stare" ? 4 : 6;
    this.head.yaw = damp(this.head.yaw, clamp(wantedYaw, -LIMITS.headYaw, LIMITS.headYaw), lambda, dt);
    this.head.pitch = damp(this.head.pitch, clamp(wantedPitch, -LIMITS.headPitch, LIMITS.headPitch), lambda, dt);
    const bodyShare = this.seated ? 0.12 : 0.32;
    this.bodyYaw = damp(this.bodyYaw, clamp(wantedYaw * bodyShare, -LIMITS.bodyYaw, LIMITS.bodyYaw), 2.4, dt);

    if (this.t >= this.nextRoll) {
      this.rollTarget = rand(-3, 3);
      this.nextRoll = this.t + rand(2.5, 6);
    }
    this.roll = damp(this.roll, this.rollTarget, 1.2, dt);
  }

  /* ------------------------------------------------------------------ */
  /* Face                                                                */
  /* ------------------------------------------------------------------ */

  private setFace(partial: Partial<Expression>, seconds: number) {
    this.faceTarget = { ...this.resting, ...partial };
    this.faceUntil = seconds === Infinity ? Infinity : this.t + seconds;
  }

  private updateFace(dt: number) {
    if (this.t > this.faceUntil) {
      this.faceTarget = { ...this.resting };
      this.faceUntil = Infinity;
    }
    this.face.angry = damp(this.face.angry, this.faceTarget.angry, 14, dt);
    this.face.surprised = damp(this.face.surprised, this.faceTarget.surprised, 16, dt);
    this.face.sad = damp(this.face.sad, this.faceTarget.sad, 8, dt);
  }
}
