import type { ReactNode } from "react";

type SectionFrameProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** adds the 1px top border line */
  borderTop?: boolean;
  /** adds the 1px bottom border line */
  borderBottom?: boolean;
  as?: "section" | "div" | "header";
};

/** 1440px frame with the template's hairline vertical borders. */
export function SectionFrame({ id, children, className = "", borderTop, borderBottom, as = "section" }: SectionFrameProps) {
  const Tag = as;
  return (
    <Tag id={id} className={`relative w-full ${className}`}>
      <div
        className={`container-1440 frame-x relative ${borderTop ? "border-t border-line" : ""} ${
          borderBottom ? "border-b border-line" : ""
        }`}
      >
        {children}
      </div>
    </Tag>
  );
}
