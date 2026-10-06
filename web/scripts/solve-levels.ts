/**
 * Breadth-first solver for the 404 puzzle levels. Prints the shortest solution
 * for each level (its par), how many states exist, and whether the level can
 * be beaten without ever using a switch (it should not, when it has one).
 *
 *   npx tsx scripts/solve-levels.ts
 */
import { applyMove, cellsOf, parseLevel, type Bridges, type Dir, type Level, type Pose } from "../src/components/game/engine";
import { LEVELS } from "../src/components/game/levels";

const DIR_LIST: Dir[] = ["up", "down", "left", "right"];
const LETTER: Record<Dir, string> = { up: "U", down: "D", left: "L", right: "R" };

function solve(level: Level, ignoreSwitches = false) {
  const enc = (p: Pose, b: Bridges) => `${p.x},${p.y},${p.o}|${level.bridgeIds.map((id) => (b[id] ? 1 : 0)).join("")}`;
  const queue: { pose: Pose; bridges: Bridges; path: string }[] = [{ pose: level.start, bridges: level.bridges, path: "" }];
  const seen = new Set([enc(level.start, level.bridges)]);
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    for (const d of DIR_LIST) {
      const r = applyMove(level, cur.pose, cur.bridges, d);
      if (r.outcome === "fall") continue;
      const bridges = ignoreSwitches ? cur.bridges : r.bridges;
      const path = cur.path + LETTER[d];
      if (r.outcome === "win") return { moves: path.length, path, states: seen.size };
      const k = enc(r.pose, bridges);
      if (seen.has(k)) continue;
      seen.add(k);
      queue.push({ pose: r.pose, bridges, path });
    }
  }
  return null;
}

function reachMap(level: Level) {
  // Every pose reachable with all bridges open, to see where a broken level gets stuck.
  const open: Bridges = {};
  for (const id of level.bridgeIds) open[id] = true;
  const stand = new Set<string>();
  const lie = new Set<string>();
  const seen = new Set<string>();
  const queue: Pose[] = [level.start];
  while (queue.length) {
    const p = queue.shift()!;
    const k = `${p.x},${p.y},${p.o}`;
    if (seen.has(k)) continue;
    seen.add(k);
    for (const c of cellsOf(p)) (p.o === "z" ? stand : lie).add(`${c.x},${c.y}`);
    for (const d of DIR_LIST) {
      const r = applyMove(level, p, open, d);
      if (r.outcome !== "fall") queue.push(r.pose);
    }
  }
  const rows: string[] = [];
  for (let y = 0; y < level.height; y++) {
    let row = "";
    for (let x = 0; x < level.width; x++) {
      const t = level.tiles.get(`${x},${y}`);
      if (!t) row += " ";
      else if (stand.has(`${x},${y}`)) row += t.kind === "goal" ? "G" : "*";
      else if (lie.has(`${x},${y}`)) row += t.kind === "goal" ? "g" : "+";
      else row += t.kind === "goal" ? "?" : ".";
    }
    rows.push(row);
  }
  return rows.join("\n   ");
}

let ok = true;
LEVELS.forEach((def, i) => {
  const level = parseLevel(def);
  const full = solve(level);
  const noSwitch = level.bridgeIds.length ? solve(level, true) : null;
  const n = String(i + 1).padStart(2, "0");
  if (!full) {
    ok = false;
    console.log(`${n} ${def.name.padEnd(16)} UNSOLVABLE  (${level.width}x${level.height}, ${level.tiles.size} tiles)  * = can stand, + = can lie, . = unreachable\n   ${reachMap(level)}`);
    return;
  }
  const flag = level.bridgeIds.length ? (noSwitch ? `  ! solvable without switches in ${noSwitch.moves}` : "  switches required") : "";
  console.log(`${n} ${def.name.padEnd(16)} par ${String(full.moves).padStart(2)}  states ${String(full.states).padStart(4)}  ${level.width}x${level.height} ${String(level.tiles.size).padStart(3)} tiles${flag}\n   ${full.path}`);
});
if (!ok) process.exit(1);
