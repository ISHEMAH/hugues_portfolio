import { boundsOf, type Bridges, type Dir, type Level, type Pose, type Tile } from "./engine";

/** Screen mapping for the isometric view: +x runs right-down, +y left-down, +z up. */
export type Camera = { u: number; ox: number; oy: number };
export type Vec3 = { x: number; y: number; z: number };
export type PointTransform = (p: Vec3) => Vec3;
export type DirTransform = (n: Vec3) => Vec3;

const COS30 = Math.sqrt(3) / 2;
const TILE_DEPTH = 0.22;

export const COLORS = {
  board: "#1a1c1c",
  tile: "#f4f3ee",
  goal: "#3ddc7a",
  fragile: "#ffd6bf",
  bridge: "#dae2ff",
  block: "#ff9556",
  ink: "#141819",
};

function normalize(v: Vec3): Vec3 {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
}
const dot = (a: Vec3, b: Vec3) => a.x * b.x + a.y * b.y + a.z * b.z;
const LIGHT = normalize({ x: 0.25, y: 0.45, z: 0.86 });
const VIEW = normalize({ x: 1, y: 1, z: 1 });

export function project(cam: Camera, p: Vec3): [number, number] {
  return [cam.ox + (p.x - p.y) * COS30 * cam.u, cam.oy + (p.x + p.y) * 0.5 * cam.u - p.z * cam.u];
}

/** Scales and centres the board inside a canvas of the given CSS size. */
export function fitCamera(level: Level, width: number, height: number, pad = 28): Camera {
  const unit: Camera = { u: 1, ox: 0, oy: 0 };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const t of level.tiles.values()) {
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      for (const z of [-TILE_DEPTH, 2.1]) {
        const [px, py] = project(unit, { x: t.x + dx, y: t.y + dy, z });
        minX = Math.min(minX, px); maxX = Math.max(maxX, px);
        minY = Math.min(minY, py); maxY = Math.max(maxY, py);
      }
    }
  }
  const u = Math.max(6, Math.min((width - 2 * pad) / (maxX - minX), (height - 2 * pad) / (maxY - minY)));
  return { u, ox: width / 2 - ((minX + maxX) / 2) * u, oy: height / 2 - ((minY + maxY) / 2) * u };
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function shade(hex: string, n: Vec3, alpha = 1) {
  const f = 0.55 + 0.5 * Math.max(0, dot(n, LIGHT));
  const [r, g, b] = hexToRgb(hex).map((c) => Math.min(255, Math.round(c * f)));
  return `rgba(${r},${g},${b},${alpha})`;
}

type Face = { corners: [number, number, number][]; normal: Vec3 };
const FACES: Face[] = [
  { corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], normal: { x: 0, y: 0, z: 1 } },
  { corners: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], normal: { x: 0, y: 0, z: -1 } },
  { corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], normal: { x: 1, y: 0, z: 0 } },
  { corners: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]], normal: { x: -1, y: 0, z: 0 } },
  { corners: [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]], normal: { x: 0, y: 1, z: 0 } },
  { corners: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], normal: { x: 0, y: -1, z: 0 } },
];

export type Box = { x0: number; y0: number; z0: number; sx: number; sy: number; sz: number };
type BoxOptions = { transform?: PointTransform; rotate?: DirTransform; alpha?: number; stroke?: string };

export function drawBox(ctx: CanvasRenderingContext2D, cam: Camera, box: Box, color: string, opts: BoxOptions = {}) {
  const alpha = opts.alpha ?? 1;
  for (const face of FACES) {
    const n = opts.rotate ? opts.rotate(face.normal) : face.normal;
    if (dot(n, VIEW) <= 0.001) continue;
    ctx.beginPath();
    face.corners.forEach(([dx, dy, dz], i) => {
      let p: Vec3 = { x: box.x0 + dx * box.sx, y: box.y0 + dy * box.sy, z: box.z0 + dz * box.sz };
      if (opts.transform) p = opts.transform(p);
      const [px, py] = project(cam, p);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = shade(color, n, alpha);
    ctx.fill();
    ctx.strokeStyle = opts.stroke ?? `rgba(20,24,25,${0.3 * alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function diamond(ctx: CanvasRenderingContext2D, cam: Camera, x: number, y: number, inset: number, z = 0) {
  const pts = [
    project(cam, { x: x + inset, y: y + inset, z }),
    project(cam, { x: x + 1 - inset, y: y + inset, z }),
    project(cam, { x: x + 1 - inset, y: y + 1 - inset, z }),
    project(cam, { x: x + inset, y: y + 1 - inset, z }),
  ];
  ctx.beginPath();
  pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
  ctx.closePath();
}

export function drawTile(ctx: CanvasRenderingContext2D, cam: Camera, tile: Tile, open: boolean) {
  if (tile.kind === "bridge" && !open) {
    diamond(ctx, cam, tile.x, tile.y, 0.08);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(218,226,255,0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    return;
  }
  const color = tile.kind === "goal" ? COLORS.goal : tile.kind === "fragile" ? COLORS.fragile : tile.kind === "bridge" ? COLORS.bridge : COLORS.tile;
  drawBox(ctx, cam, { x0: tile.x, y0: tile.y, z0: -TILE_DEPTH, sx: 1, sy: 1, sz: TILE_DEPTH }, color);

  if (tile.kind === "goal") {
    diamond(ctx, cam, tile.x, tile.y, 0.24);
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fill();
  } else if (tile.kind === "fragile") {
    diamond(ctx, cam, tile.x, tile.y, 0.2);
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = "rgba(234,108,17,0.75)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (tile.switch) {
    const [cx, cy] = project(cam, { x: tile.x + 0.5, y: tile.y + 0.5, z: 0 });
    ctx.strokeStyle = COLORS.ink;
    ctx.lineCap = "round";
    if (tile.switch.kind === "soft") {
      const r = 0.24 * cam.u;
      ctx.lineWidth = Math.max(1.5, cam.u * 0.07);
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 1.2247, r * 0.7071, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 0.4, r * 0.24, 0, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.ink;
      ctx.fill();
    } else {
      ctx.lineWidth = Math.max(2, cam.u * 0.09);
      const a = project(cam, { x: tile.x + 0.28, y: tile.y + 0.28, z: 0 });
      const b = project(cam, { x: tile.x + 0.72, y: tile.y + 0.72, z: 0 });
      const c = project(cam, { x: tile.x + 0.72, y: tile.y + 0.28, z: 0 });
      const d = project(cam, { x: tile.x + 0.28, y: tile.y + 0.72, z: 0 });
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.moveTo(c[0], c[1]);
      ctx.lineTo(d[0], d[1]);
      ctx.stroke();
    }
  }
}

/** Rigid rotation of the block about the bottom edge it tips over, by `angle` radians. */
export function rollTransform(pose: Pose, dir: Dir, angle: number): { point: PointTransform; rotate: DirTransform } {
  const b = boundsOf(pose);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  switch (dir) {
    case "right": {
      const px = b.x0 + b.sx;
      return {
        point: (p) => ({ x: px + (p.x - px) * c + p.z * s, y: p.y, z: p.z * c - (p.x - px) * s }),
        rotate: (n) => ({ x: n.x * c + n.z * s, y: n.y, z: n.z * c - n.x * s }),
      };
    }
    case "left": {
      const px = b.x0;
      return {
        point: (p) => ({ x: px + (p.x - px) * c - p.z * s, y: p.y, z: p.z * c + (p.x - px) * s }),
        rotate: (n) => ({ x: n.x * c - n.z * s, y: n.y, z: n.z * c + n.x * s }),
      };
    }
    case "down": {
      const py = b.y0 + b.sy;
      return {
        point: (p) => ({ x: p.x, y: py + (p.y - py) * c + p.z * s, z: p.z * c - (p.y - py) * s }),
        rotate: (n) => ({ x: n.x, y: n.y * c + n.z * s, z: n.z * c - n.y * s }),
      };
    }
    case "up": {
      const py = b.y0;
      return {
        point: (p) => ({ x: p.x, y: py + (p.y - py) * c - p.z * s, z: p.z * c + (p.y - py) * s }),
        rotate: (n) => ({ x: n.x, y: n.y * c - n.z * s, z: n.z * c + n.y * s }),
      };
    }
  }
}

export type BlockView = {
  pose: Pose;
  transform?: PointTransform;
  rotate?: DirTransform;
  alpha?: number;
  hidden?: boolean;
};

export type Scene = { level: Level; bridges: Bridges; block: BlockView };

function blockMinZ(view: BlockView) {
  if (!view.transform) return 0;
  const b = boundsOf(view.pose);
  let min = Infinity;
  for (const [dx, dy, dz] of [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]]) {
    min = Math.min(min, view.transform({ x: b.x0 + dx * b.sx, y: b.y0 + dy * b.sy, z: dz * b.sz }).z);
  }
  return min;
}

export function drawScene(ctx: CanvasRenderingContext2D, width: number, height: number, cam: Camera, scene: Scene) {
  ctx.clearRect(0, 0, width, height);
  const tiles = Array.from(scene.level.tiles.values()).sort((a, b) => a.x + a.y - (b.x + b.y) || a.y - b.y);
  const view = scene.block;
  const b = boundsOf(view.pose);
  const blockDepth = b.x0 + b.sx / 2 + b.y0 + b.sy / 2;
  const below = blockMinZ(view) < -0.01;
  let blockDrawn = view.hidden ?? false;

  const drawBlock = () => {
    drawBox(ctx, cam, { x0: b.x0, y0: b.y0, z0: 0, sx: b.sx, sy: b.sy, sz: b.sz }, COLORS.block, {
      transform: view.transform,
      rotate: view.rotate,
      alpha: view.alpha ?? 1,
      stroke: `rgba(120,50,8,${0.45 * (view.alpha ?? 1)})`,
    });
  };

  for (const t of tiles) {
    if (below && !blockDrawn && t.x + t.y + 1 > blockDepth) {
      drawBlock();
      blockDrawn = true;
    }
    drawTile(ctx, cam, t, t.kind === "bridge" ? Boolean(scene.bridges[t.bridge!]) : true);
  }
  if (!blockDrawn) drawBlock();
}
