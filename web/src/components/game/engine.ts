/**
 * Rules of the rolling-block puzzle. Pure functions, no DOM, so the same code
 * drives the page and the level solver script.
 *
 * The block is 1x1x2. It stands upright ("z") on one cell or lies flat along
 * the x or y axis covering two cells. A move tips it over one edge. The level
 * is solved when the block stands upright on the goal tile. Falling off the
 * board, or standing on a fragile tile, resets the level.
 */
export type Dir = "up" | "down" | "left" | "right";

/** up = -y (screen up-right), down = +y, left = -x, right = +x. */
export const DIRS: Record<Dir, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

export type Orientation = "z" | "x" | "y";

/** (x, y) is the lowest-coordinate cell the block covers. */
export type Pose = { x: number; y: number; o: Orientation };

export type TileKind = "floor" | "goal" | "fragile" | "bridge" | "switch";
export type SwitchKind = "soft" | "heavy";
export type SwitchAction = "toggle" | "open" | "close";
export type SwitchDef = { kind: SwitchKind; action: SwitchAction; bridges: string[] };

export type Tile = {
  x: number;
  y: number;
  kind: TileKind;
  /** Bridge group id for bridge tiles. */
  bridge?: string;
  switch?: SwitchDef & { id: string };
};

export type LevelDef = {
  name: string;
  hint?: string;
  /**
   * Rows top to bottom. Legend: `.` empty, `#` floor, `S` start, `G` goal,
   * `o` fragile (falls if stood on), `1`-`9` bridge tiles (group = digit),
   * `a`-`h` soft switches (any contact), `A`-`H` heavy switches (standing only).
   */
  map: string[];
  switches?: Record<string, SwitchDef>;
  /** Initial open state per bridge group; default closed. */
  bridges?: Record<string, boolean>;
};

export type Level = {
  name: string;
  hint?: string;
  width: number;
  height: number;
  tiles: Map<string, Tile>;
  start: Pose;
  goal: { x: number; y: number };
  bridgeIds: string[];
  bridges: Record<string, boolean>;
};

export type Bridges = Record<string, boolean>;

export const key = (x: number, y: number) => `${x},${y}`;

export function parseLevel(def: LevelDef): Level {
  const tiles = new Map<string, Tile>();
  let start: Pose | null = null;
  let goal: { x: number; y: number } | null = null;
  const bridgeIds = new Set<string>();
  const width = Math.max(...def.map.map((r) => r.length));

  def.map.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === "." || ch === " ") continue;
      if (ch === "#") tiles.set(key(x, y), { x, y, kind: "floor" });
      else if (ch === "S") {
        tiles.set(key(x, y), { x, y, kind: "floor" });
        start = { x, y, o: "z" };
      } else if (ch === "G") {
        tiles.set(key(x, y), { x, y, kind: "goal" });
        goal = { x, y };
      } else if (ch === "o") tiles.set(key(x, y), { x, y, kind: "fragile" });
      else if (/[1-9]/.test(ch)) {
        tiles.set(key(x, y), { x, y, kind: "bridge", bridge: ch });
        bridgeIds.add(ch);
      } else if (/[a-hA-H]/.test(ch)) {
        const id = ch.toLowerCase();
        const sw = def.switches?.[id];
        if (!sw) throw new Error(`Level "${def.name}": switch "${id}" has no definition`);
        tiles.set(key(x, y), { x, y, kind: "switch", switch: { ...sw, id, kind: ch === id ? "soft" : "heavy" } });
        for (const b of sw.bridges) bridgeIds.add(b);
      } else throw new Error(`Level "${def.name}": unknown symbol "${ch}" at ${x},${y}`);
    }
  });
  if (!start || !goal) throw new Error(`Level "${def.name}": needs a start (S) and a goal (G)`);

  const ids = Array.from(bridgeIds).sort();
  const bridges: Bridges = {};
  for (const id of ids) bridges[id] = def.bridges?.[id] ?? false;
  return { name: def.name, hint: def.hint, width, height: def.map.length, tiles, start, goal, bridgeIds: ids, bridges };
}

/** Cells covered by a pose. */
export function cellsOf(p: Pose): { x: number; y: number }[] {
  if (p.o === "z") return [{ x: p.x, y: p.y }];
  if (p.o === "x") return [{ x: p.x, y: p.y }, { x: p.x + 1, y: p.y }];
  return [{ x: p.x, y: p.y }, { x: p.x, y: p.y + 1 }];
}

/** Axis-aligned extent of a pose: origin corner plus size along each axis. */
export function boundsOf(p: Pose): { x0: number; y0: number; sx: number; sy: number; sz: number } {
  if (p.o === "z") return { x0: p.x, y0: p.y, sx: 1, sy: 1, sz: 2 };
  if (p.o === "x") return { x0: p.x, y0: p.y, sx: 2, sy: 1, sz: 1 };
  return { x0: p.x, y0: p.y, sx: 1, sy: 2, sz: 1 };
}

export function nextPose(p: Pose, d: Dir): Pose {
  switch (p.o) {
    case "z":
      if (d === "right") return { x: p.x + 1, y: p.y, o: "x" };
      if (d === "left") return { x: p.x - 2, y: p.y, o: "x" };
      if (d === "down") return { x: p.x, y: p.y + 1, o: "y" };
      return { x: p.x, y: p.y - 2, o: "y" };
    case "x":
      if (d === "right") return { x: p.x + 2, y: p.y, o: "z" };
      if (d === "left") return { x: p.x - 1, y: p.y, o: "z" };
      if (d === "down") return { x: p.x, y: p.y + 1, o: "x" };
      return { x: p.x, y: p.y - 1, o: "x" };
    case "y":
      if (d === "down") return { x: p.x, y: p.y + 2, o: "z" };
      if (d === "up") return { x: p.x, y: p.y - 1, o: "z" };
      if (d === "right") return { x: p.x + 1, y: p.y, o: "y" };
      return { x: p.x - 1, y: p.y, o: "y" };
  }
}

export type Outcome = "ok" | "fall" | "win";
export type MoveResult = { pose: Pose; bridges: Bridges; outcome: Outcome; toggled: string[] };

export function applyMove(level: Level, pose: Pose, bridges: Bridges, dir: Dir): MoveResult {
  const next = nextPose(pose, dir);
  const cells = cellsOf(next);

  for (const c of cells) {
    const tile = level.tiles.get(key(c.x, c.y));
    if (!tile) return { pose: next, bridges, outcome: "fall", toggled: [] };
    if (tile.kind === "bridge" && !bridges[tile.bridge!]) return { pose: next, bridges, outcome: "fall", toggled: [] };
    if (tile.kind === "fragile" && next.o === "z") return { pose: next, bridges, outcome: "fall", toggled: [] };
  }

  let nextBridges = bridges;
  const toggled: string[] = [];
  for (const c of cells) {
    const sw = level.tiles.get(key(c.x, c.y))?.switch;
    if (!sw) continue;
    if (sw.kind === "heavy" && next.o !== "z") continue;
    if (nextBridges === bridges) nextBridges = { ...bridges };
    for (const b of sw.bridges) {
      nextBridges[b] = sw.action === "toggle" ? !nextBridges[b] : sw.action === "open";
      toggled.push(b);
    }
  }

  if (next.o === "z" && level.tiles.get(key(next.x, next.y))?.kind === "goal") {
    return { pose: next, bridges: nextBridges, outcome: "win", toggled };
  }
  return { pose: next, bridges: nextBridges, outcome: "ok", toggled };
}

const ALL_DIRS: Dir[] = ["up", "down", "left", "right"];

/** Shortest number of moves that solves a level, or null when it cannot be solved. Small boards, so a plain BFS is instant. */
export function solveLevel(level: Level): number | null {
  const enc = (p: Pose, b: Bridges) => `${p.x},${p.y},${p.o}|${level.bridgeIds.map((id) => (b[id] ? 1 : 0)).join("")}`;
  const queue: { pose: Pose; bridges: Bridges; depth: number }[] = [{ pose: level.start, bridges: level.bridges, depth: 0 }];
  const seen = new Set([enc(level.start, level.bridges)]);
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    for (const d of ALL_DIRS) {
      const r = applyMove(level, cur.pose, cur.bridges, d);
      if (r.outcome === "fall") continue;
      if (r.outcome === "win") return cur.depth + 1;
      const k = enc(r.pose, r.bridges);
      if (seen.has(k)) continue;
      seen.add(k);
      queue.push({ pose: r.pose, bridges: r.bridges, depth: cur.depth + 1 });
    }
  }
  return null;
}
