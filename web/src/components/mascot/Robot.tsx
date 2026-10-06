"use client";

import { useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  type AnimationAction,
  type AnimationClip,
  AnimationMixer,
  type Bone,
  Euler,
  type Group,
  LoopOnce,
  LoopRepeat,
  type Material,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  type Object3D,
  type PerspectiveCamera,
  Quaternion,
  Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { type Angles, type Clip, type Expression, MascotBrain, type Mood } from "@/lib/mascot/brain";
import { type MascotChannel, subscribeMascot } from "@/lib/mascot/bus";
import { attachPointer, getPointer } from "@/lib/mascot/pointer";
import { configureGltfLoader } from "./loaders";
import { type Palette, PALETTES, type PaletteName } from "./palette";

export type Framing = "full" | "bust" | "portrait";

type Frame = { cy: number; h: number; w: number };

/** Boxes (centre height, height, width in model units) the camera keeps in view. */
const FRAMES: Record<Framing, { standing: Frame; seated: Frame }> = {
  // Standing the robot is 4.5 units tall; a jump peaks near 5.9 and a wave reaches 3.2 units sideways.
  full: { standing: { cy: 2.5, h: 6.1, w: 4.0 }, seated: { cy: 2.0, h: 4.8, w: 3.6 } },
  bust: { standing: { cy: 3.15, h: 3.6, w: 3.8 }, seated: { cy: 2.1, h: 3.6, w: 3.8 } },
  // Small upright boxes: the whole robot, lower in the frame, leaving the top free for a speech bubble.
  portrait: { standing: { cy: 2.9, h: 6.6, w: 4.4 }, seated: { cy: 2.3, h: 5.6, w: 4.4 } },
};

/** Yaw that turns the model to face the camera (+Z). */
const FACING = 0;
/** How far the gaze target sits beside the viewer for a cursor at the edge of the screen. */
const GAIN = 1.4;
/** Cursor stillness after which the robot goes back to its idle behaviours. */
const POINTER_TIMEOUT_MS = 3500;
/** Clips that must not loop: they play once and hold their last frame. */
const POSES = new Set<Clip>(["Sitting", "Standing", "Death"]);

const damp = (cur: number, target: number, lambda: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-lambda * dt));

function anglesTo(from: Vector3, to: Vector3, tmp: Vector3): Angles {
  tmp.copy(to).sub(from).normalize();
  return { yaw: MathUtils.radToDeg(Math.atan2(tmp.x, tmp.z)), pitch: MathUtils.radToDeg(Math.asin(MathUtils.clamp(tmp.y, -1, 1))) };
}

function frameDistance(cam: PerspectiveCamera, frame: Frame, width: number, height: number) {
  const vFov = MathUtils.degToRad(cam.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (width / Math.max(height, 1)));
  return Math.max(frame.h / 2 / Math.tan(vFov / 2), frame.w / 2 / Math.tan(hFov / 2)) * 1.06;
}

function tint(material: MeshStandardMaterial, palette: Palette) {
  const part = material.name === "Main" ? "main" : material.name === "Black" ? "face" : "detail";
  material.color.set(palette[part]);
  material.roughness = part === "face" ? 0.35 : 0.62;
  material.metalness = part === "face" ? 0.25 : 0.04;
  material.envMapIntensity = 0.9;
  if (part === "face" && palette.faceGlow) {
    material.emissive.set(palette.faceGlow);
    material.emissiveIntensity = 0.6;
  }
}

type PlayState = { current: AnimationAction | null; id: number; base: string | null; animHead: boolean };

/** Crossfades to a clip. Poses play once and hold; a base pose already held is left alone. */
function fadeTo(mixer: AnimationMixer, clips: Map<Clip, AnimationClip>, play: PlayState, clip: Clip, opts: { loop: boolean; timeScale: number; fade: number; restart: boolean }) {
  const clipData = clips.get(clip) ?? clips.get("Idle");
  if (!clipData) return;
  const next = mixer.clipAction(clipData);
  const prev = play.current;
  if (prev === next && !opts.restart) return;
  next.enabled = true;
  next.paused = false;
  next.setLoop(opts.loop ? LoopRepeat : LoopOnce, Infinity);
  next.clampWhenFinished = !opts.loop;
  next.reset();
  next.setEffectiveTimeScale(opts.timeScale);
  next.setEffectiveWeight(1);
  if (opts.timeScale < 0) next.time = clipData.duration;
  if (prev && prev !== next) {
    prev.fadeOut(opts.fade);
    next.fadeIn(opts.fade);
  }
  next.play();
  play.current = next;
}

/** Writes the brain's face onto every mesh that carries the three expression morphs. */
function applyExpression(morphs: Mesh[], expression: Expression) {
  for (const mesh of morphs) {
    const dict = mesh.morphTargetDictionary;
    const inf = mesh.morphTargetInfluences;
    if (!dict || !inf) continue;
    if (dict.Angry !== undefined) inf[dict.Angry] = expression.angry;
    if (dict.Surprised !== undefined) inf[dict.Surprised] = expression.surprised;
    if (dict.Sad !== undefined) inf[dict.Sad] = expression.sad;
  }
}

type Scratch = {
  headPos: Vector3;
  cam: Vector3;
  fwd: Vector3;
  right: Vector3;
  up: Vector3;
  target: Vector3;
  tmp: Vector3;
  euler: Euler;
  qLook: Quaternion;
  qRoot: Quaternion;
  qRootInv: Quaternion;
  qParent: Quaternion;
  qParentInv: Quaternion;
  qAnim: Quaternion;
};

type Props = {
  url: string;
  mood: Mood;
  channel: MascotChannel;
  palette: PaletteName;
  framing: Framing;
  idleEvery?: [number, number];
  onReady: () => void;
  onPoke?: () => void;
};

/**
 * The robot itself: loads the GLB once per URL (shared across instances),
 * clones it with its skeleton, recolours it, and every frame asks the brain
 * what to do, then drives the animation mixer, the head bone and the face.
 */
export function Robot({ url, mood, channel, palette, framing, idleEvery, onReady, onPoke }: Props) {
  const gl = useThree((s) => s.gl);
  const gltf = useLoader(GLTFLoader, url, (loader) => configureGltfLoader(loader, gl));

  const model = useMemo(() => {
    const scene = SkeletonUtils.clone(gltf.scene) as Group;
    const colours = PALETTES[palette];
    const materials = new Map<Material, Material>();
    const morphs: Mesh[] = [];
    scene.traverse((obj) => {
      if (!(obj instanceof Mesh)) return;
      obj.frustumCulled = false;
      const list = Array.isArray(obj.material) ? obj.material : [obj.material];
      const replaced = list.map((m) => {
        const cached = materials.get(m);
        if (cached) return cached;
        const fresh = m.clone();
        if (fresh instanceof MeshStandardMaterial) tint(fresh, colours);
        materials.set(m, fresh);
        return fresh;
      });
      obj.material = Array.isArray(obj.material) ? replaced : (replaced[0] ?? obj.material);
      if (obj.morphTargetDictionary && obj.morphTargetInfluences) morphs.push(obj);
    });
    let head: Object3D | null = null;
    scene.traverse((obj) => {
      if (!head && obj.name === "Head" && (obj as Bone).isBone) head = obj;
    });
    const headBone: Object3D = head ?? scene.getObjectByName("Neck") ?? scene;
    const mixer = new AnimationMixer(scene);
    const clips = new Map(gltf.animations.map((clip) => [clip.name as Clip, clip]));
    return { scene, morphs, headBone, mixer, clips, materials: [...materials.values()] };
  }, [gltf, palette]);

  const brain = useMemo(() => new MascotBrain(mood, { idleEvery }), [mood, idleEvery]);
  const scratch = useMemo<Scratch>(
    () => ({
      headPos: new Vector3(),
      cam: new Vector3(),
      fwd: new Vector3(),
      right: new Vector3(),
      up: new Vector3(),
      target: new Vector3(),
      tmp: new Vector3(),
      euler: new Euler(),
      qLook: new Quaternion(),
      qRoot: new Quaternion(),
      qRootInv: new Quaternion(),
      qParent: new Quaternion(),
      qParentInv: new Quaternion(),
      qAnim: new Quaternion(),
    }),
    [],
  );

  const outer = useRef<Group>(null);
  const inner = useRef<Group>(null);
  const hovering = useRef(false);
  const rect = useRef<DOMRect | null>(null);
  const frameCount = useRef(0);
  const ready = useRef(false);
  const camState = useRef({ cy: NaN, dist: NaN });
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const play = useRef<PlayState>({ current: null, id: -1, base: null, animHead: false });

  useEffect(() => attachPointer(), []);
  useEffect(() => {
    canvasEl.current = gl.domElement;
  }, [gl]);
  useEffect(() => subscribeMascot(channel, (event) => brain.request(event)), [channel, brain]);

  // Tell the brain when a one-shot clip has run its course.
  useEffect(() => {
    const { mixer } = model;
    const onFinished = (e: { action: AnimationAction }) => {
      if (e.action === play.current.current) brain.performanceFinished(play.current.id);
    };
    mixer.addEventListener("finished", onFinished);
    return () => {
      mixer.removeEventListener("finished", onFinished);
      mixer.stopAllAction();
    };
  }, [model, brain]);

  // Free GPU resources of this instance's materials when it unmounts.
  useEffect(() => {
    const { materials } = model;
    return () => {
      for (const m of materials) m.dispose();
    };
  }, [model]);

  useFrame((state, delta) => {
    const o = outer.current;
    const inn = inner.current;
    if (!o || !inn) return;
    const s = scratch;
    const cam = state.camera as PerspectiveCamera;
    const { mixer, clips, headBone, morphs } = model;

    // Where is the cursor, as seen from the robot's head?
    frameCount.current += 1;
    if (!rect.current || frameCount.current % 12 === 0) rect.current = gl.domElement.getBoundingClientRect();
    const p = getPointer();
    const cx = rect.current.left + rect.current.width / 2;
    const cy = rect.current.top + rect.current.height / 2;
    const dx = MathUtils.clamp((p.x - cx) / (window.innerWidth / 2), -1.6, 1.6);
    const dy = MathUtils.clamp(-(p.y - cy) / (window.innerHeight / 2), -1.6, 1.6);
    const pointerActive = p.fine && !p.outside && p.lastMove > 0 && performance.now() - p.lastMove < POINTER_TIMEOUT_MS;

    headBone.getWorldPosition(s.headPos);
    cam.getWorldPosition(s.cam);
    const dist = s.cam.distanceTo(s.headPos);
    const halfH = Math.tan(MathUtils.degToRad(cam.fov) / 2) * dist;
    const halfW = halfH * cam.aspect;
    cam.getWorldDirection(s.fwd);
    s.right.crossVectors(s.fwd, cam.up).normalize();
    s.up.crossVectors(s.right, s.fwd).normalize();
    s.target.copy(s.cam).addScaledVector(s.right, dx * halfW * GAIN).addScaledVector(s.up, dy * halfH * GAIN);

    const out = brain.update({
      dt: delta,
      cursor: p.fine ? anglesTo(s.headPos, s.target, s.tmp) : null,
      pointerActive,
      pointerOutside: p.outside,
      hovering: hovering.current,
      viewer: anglesTo(s.headPos, s.cam, s.tmp),
    });

    // Camera: keep the right box in view, gliding when the robot sits or stands.
    const frame = out.seated ? FRAMES[framing].seated : FRAMES[framing].standing;
    const wantedDist = frameDistance(cam, frame, state.size.width, state.size.height);
    const c = camState.current;
    if (Number.isNaN(c.dist)) {
      c.cy = frame.cy;
      c.dist = wantedDist;
    } else {
      c.cy = damp(c.cy, frame.cy, 2.5, delta);
      c.dist = damp(c.dist, wantedDist, 2.5, delta);
    }
    cam.position.set(0, c.cy, c.dist);
    cam.lookAt(0, c.cy, 0);

    // Animation: start whatever the brain asked for, or return to the stance.
    const pl = play.current;
    if (out.action) {
      if (out.action.id !== pl.id) {
        fadeTo(mixer, clips, pl, out.action.clip, { loop: out.action.loop, timeScale: out.action.timeScale, fade: out.action.fade, restart: true });
        pl.id = out.action.id;
        pl.base = null;
      }
    } else if (pl.base !== out.base || pl.id !== -1) {
      fadeTo(mixer, clips, pl, out.base, { loop: !POSES.has(out.base), timeScale: 1, fade: 0.35, restart: false });
      pl.id = -1;
      pl.base = out.base;
    }

    // The mixer owns the head bone; restore last frame's animated pose before
    // it runs so our look-at never accumulates.
    if (pl.animHead) headBone.quaternion.copy(s.qAnim);
    mixer.update(delta);
    s.qAnim.copy(headBone.quaternion);
    pl.animHead = true;

    // Look-at, layered on top of the clip: a world-space rotation about the
    // head pivot, built in the robot's own frame so pitch follows the body yaw.
    inn.rotation.y = FACING + MathUtils.degToRad(out.bodyYaw);
    const w = out.lookWeight;
    s.euler.set(-MathUtils.degToRad(out.head.pitch * w), MathUtils.degToRad(out.head.yaw * w), MathUtils.degToRad(out.headRoll * w), "YXZ");
    s.qLook.setFromEuler(s.euler);
    inn.updateWorldMatrix(true, false);
    inn.getWorldQuaternion(s.qRoot);
    s.qRootInv.copy(s.qRoot).invert();
    s.qLook.premultiply(s.qRoot).multiply(s.qRootInv);
    if (headBone.parent) {
      headBone.parent.updateWorldMatrix(true, false);
      headBone.parent.getWorldQuaternion(s.qParent);
      s.qParentInv.copy(s.qParent).invert();
      headBone.quaternion.premultiply(s.qParent).premultiply(s.qLook).premultiply(s.qParentInv);
    } else {
      headBone.quaternion.premultiply(s.qLook);
    }

    // Face and pop-in.
    applyExpression(morphs, out.expression);
    o.scale.setScalar(Math.max(out.scale, 0.0001));

    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hovering.current = true;
    if (canvasEl.current) canvasEl.current.style.cursor = "pointer";
  };
  const onOut = () => {
    hovering.current = false;
    if (canvasEl.current) canvasEl.current.style.cursor = "";
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    brain.poke();
    onPoke?.();
  };

  return (
    <group ref={outer} scale={0.0001}>
      <group ref={inner} rotation-y={FACING}>
        <primitive object={model.scene} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick} />
      </group>
    </group>
  );
}
