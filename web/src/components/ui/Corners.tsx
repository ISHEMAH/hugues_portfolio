type CornersProps = {
  /** size of each bracket in px */
  size?: number;
  /** border thickness in px */
  thickness?: number;
  /** colour class, e.g. "text-ink" (uses currentColor) */
  className?: string;
  /** hidden until the parent `.group` is hovered */
  hoverOnly?: boolean;
  /** brackets slide 4px outward on hover */
  slide?: boolean;
};

/**
 * Four L-shaped bracket corners, the template's signature "selection" frame.
 * Render inside a `relative group` element.
 */
export function Corners({ size = 12, thickness = 1.5, className = "", hoverOnly = false, slide = true }: CornersProps) {
  const base = `pointer-events-none absolute block border-current transition-all duration-300 ease-out-expo ${
    hoverOnly ? "opacity-0 group-hover:opacity-100" : ""
  }`;
  const dims = { width: size, height: size };
  const bw = `${thickness}px`;
  return (
    <span aria-hidden className={`contents ${className}`}>
      <span
        className={`${base} top-0 left-0 ${slide ? "group-hover:-top-1 group-hover:-left-1" : ""}`}
        style={{ ...dims, borderTopWidth: bw, borderLeftWidth: bw }}
      />
      <span
        className={`${base} top-0 right-0 ${slide ? "group-hover:-top-1 group-hover:-right-1" : ""}`}
        style={{ ...dims, borderTopWidth: bw, borderRightWidth: bw }}
      />
      <span
        className={`${base} right-0 bottom-0 ${slide ? "group-hover:-right-1 group-hover:-bottom-1" : ""}`}
        style={{ ...dims, borderBottomWidth: bw, borderRightWidth: bw }}
      />
      <span
        className={`${base} bottom-0 left-0 ${slide ? "group-hover:-bottom-1 group-hover:-left-1" : ""}`}
        style={{ ...dims, borderBottomWidth: bw, borderLeftWidth: bw }}
      />
    </span>
  );
}
