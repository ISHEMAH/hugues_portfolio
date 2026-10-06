import Link from "next/link";
import type { ReactNode } from "react";
import { Corners } from "./Corners";
import { ArrowUpRightIcon, DownloadIcon } from "./icons";

type CornerButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "dark" | "light" | "ghost";
  icon?: "arrow" | "download" | "none";
  newTab?: boolean;
  className?: string;
  download?: boolean;
};

const variants = {
  dark: "bg-ink text-white hover:bg-ink-deep",
  light: "bg-cream text-ink",
  ghost: "bg-transparent text-ink",
};

/** Button with the template's bracket corners and sliding arrow icon. */
export function CornerButton({
  href,
  children,
  variant = "dark",
  icon = "arrow",
  newTab,
  className = "",
  download,
}: CornerButtonProps) {
  const Icon = icon === "download" ? DownloadIcon : ArrowUpRightIcon;
  const external = newTab || /^https?:\/\//.test(href);
  const content = (
    <>
      <span className="t-button relative z-10 whitespace-nowrap">{children}</span>
      {icon !== "none" && (
        <span className="relative z-10 block h-5 w-5 overflow-hidden">
          <Icon className="absolute inset-0 h-5 w-5 transition-transform duration-300 ease-out-expo group-hover:translate-x-5 group-hover:-translate-y-5" />
          <Icon className="absolute inset-0 h-5 w-5 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      )}
      <Corners className={variant === "dark" ? "text-ink" : "text-ink"} hoverOnly={variant === "ghost"} />
    </>
  );
  const classes = `group relative inline-flex items-center justify-center gap-1 px-4 py-3 transition-colors duration-300 ${variants[variant]} ${className}`;

  if (external || download) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        download={download || undefined}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
