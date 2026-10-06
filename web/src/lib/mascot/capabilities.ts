/**
 * Decides whether this device should get the real-time 3D robot or keep
 * the static fallback. Runs once, after the page has loaded, so it never delays paint.
 */
export type CapabilityResult = { ok: true } | { ok: false; reason: string };

type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function checkCapabilities(): CapabilityResult {
  if (typeof window === "undefined") return { ok: false, reason: "server" };
  const nav = navigator as NavigatorExtras;

  if (nav.connection?.saveData) return { ok: false, reason: "data saver" };
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return { ok: false, reason: "few cores" };
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return { ok: false, reason: "low memory" };

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!gl) return { ok: false, reason: "no WebGL2" };
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return { ok: false, reason: "WebGL error" };
  }
  return { ok: true };
}
