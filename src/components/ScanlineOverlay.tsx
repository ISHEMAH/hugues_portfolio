"use client";

export function ScanlineOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      <div className="animate-scanline absolute left-0 h-px w-full bg-white/5" />
    </div>
  );
}
