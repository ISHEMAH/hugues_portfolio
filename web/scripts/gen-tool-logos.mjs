// Generates square logo tiles for tools that the template did not ship with,
// using simple-icons glyphs. Run: node scripts/gen-tool-logos.mjs
import { writeFileSync } from "node:fs";
import * as icons from "simple-icons";

const tiles = [
  { file: "flutter", icon: icons.siFlutter, bg: "#02569B", fg: "#ffffff" },
  { file: "react-native", icon: icons.siReact, bg: "#20232a", fg: "#61DAFB" },
  { file: "threejs", icon: icons.siThreedotjs, bg: "#141414", fg: "#ffffff" },
  { file: "gsap", icon: icons.siGreensock, bg: "#0e100f", fg: "#88CE02" },
  { file: "dart", icon: icons.siDart, bg: "#0175C2", fg: "#ffffff" },
  { file: "firebase", icon: icons.siFirebase, bg: "#1f1f1f", fg: "#FFCA28" },
  { file: "vercel", icon: icons.siVercel, bg: "#000000", fg: "#ffffff" },
];

for (const t of tiles) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none"><rect width="180" height="180" rx="40" fill="${t.bg}"/><g transform="translate(42 42) scale(4)"><path d="${t.icon.path}" fill="${t.fg}"/></g></svg>`;
  writeFileSync(new URL(`../public/images/tools/${t.file}.svg`, import.meta.url), svg);
  console.log("wrote", t.file);
}
