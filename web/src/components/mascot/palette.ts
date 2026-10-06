/**
 * Colour sets for the robot, picked to sit on the site's own surfaces. The
 * model has three materials: "Main" (body shells), "Grey" (joints, feet,
 * head details) and "Black" (face plate).
 */
export type PaletteName = "light" | "dark";

export type Palette = {
  main: string;
  detail: string;
  face: string;
  /** Soft emissive tint on the face plate so the eyes read in low light. */
  faceGlow?: string;
  /** Contact shadow colour and opacity for the floor the robot stands on. */
  shadow: string;
  shadowOpacity: number;
};

export const PALETTES: Record<PaletteName, Palette> = {
  /** For dark panels (hero): accent orange body, cream joints, ink face. */
  light: { main: "#ea6c11", detail: "#f4f3ee", face: "#141819", faceGlow: "#1c2a30", shadow: "#000000", shadowOpacity: 0.55 },
  /** For cream cards (contact, 404): ink body, accent joints, near-black face. */
  dark: { main: "#1a1c1c", detail: "#ea6c11", face: "#0f1112", faceGlow: "#2a1a10", shadow: "#1a1c1c", shadowOpacity: 0.28 },
};
