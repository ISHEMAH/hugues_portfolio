"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, type ReactNode, Suspense } from "react";
import { ACESFilmicToneMapping } from "three";
import type { Mood } from "@/lib/mascot/brain";
import type { MascotChannel } from "@/lib/mascot/bus";
import { PALETTES, type PaletteName } from "./palette";
import { type Framing, Robot } from "./Robot";

type Props = {
  url: string;
  active: boolean;
  mood: Mood;
  channel: MascotChannel;
  palette: PaletteName;
  framing: Framing;
  idleEvery?: [number, number];
  onReady: () => void;
  onError: () => void;
  onPoke?: () => void;
};

class ModelBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[mascot] falling back:", error instanceof Error ? error.message : error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The WebGL scene around the robot. Rendering stops entirely (frameloop
 * "never") while the robot is off-screen or the tab is hidden.
 */
export default function MascotScene({ url, active, mood, channel, palette, framing, idleEvery, onReady, onError, onPoke }: Props) {
  const colours = PALETTES[palette];
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 24, near: 0.1, far: 200, position: [0, 2.3, 16] }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearAlpha(0);
      }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <ModelBoundary onError={onError}>
        <Suspense fallback={null}>
          <Robot url={url} mood={mood} channel={channel} palette={palette} framing={framing} idleEvery={idleEvery} onReady={onReady} onPoke={onPoke} />
        </Suspense>
      </ModelBoundary>
      {/* Procedural studio lighting: no HDR download, one render. */}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#fff4e6" position={[0, 5, 4]} scale={[8, 4, 1]} rotation-x={-Math.PI / 3} />
        <Lightformer form="rect" intensity={1} color="#ffe6d2" position={[-6, 2, 1]} scale={[3, 8, 1]} rotation-y={Math.PI / 2.5} />
        <Lightformer form="rect" intensity={1.6} color="#cfdcff" position={[6, 3, -2]} scale={[3, 8, 1]} rotation-y={-Math.PI / 2.5} />
        <Lightformer form="rect" intensity={0.4} color="#e8d9c8" position={[0, -3, 4]} scale={[8, 2, 1]} rotation-x={Math.PI / 3} />
      </Environment>
      <hemisphereLight intensity={0.35} color="#fff6ec" groundColor="#3a2a20" />
      <directionalLight position={[-3, 6, 5]} intensity={2.2} color="#fff2e2" />
      <directionalLight position={[4, 3, -4]} intensity={1.2} color="#d6e0ff" />
      <ContactShadows position={[0, 0.01, 0]} opacity={colours.shadowOpacity} scale={12} blur={2.6} far={6} resolution={256} frames={Infinity} color={colours.shadow} />
    </Canvas>
  );
}
