import type { SVGProps } from "react";
import { siBehance, siDribbble, siGithub, siInstagram, siWhatsapp, siX, siYoutube } from "simple-icons";
import type { ServiceIcon, SocialPlatform, TagIcon } from "@/lib/types";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
      <path d="M12 4v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 19h16" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} strokeWidth={1.75} {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} strokeWidth={2.5} {...props}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} strokeWidth={1.75} {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

/** Mouse-pointer cursor used by the collaboration cards. */
export function CursorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        d="M4.5 3.5 20 10.2c.9.4.9 1.7 0 2l-6.3 2.4-2.4 6.3c-.4.9-1.7.9-2 0L3.5 5.2c-.4-1 .5-1.9 1-1.7Z"
        fill="currentColor"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} strokeWidth={1.75} {...props}>
      <path d="M3 8h18" />
      <path d="M3 16h18" />
    </svg>
  );
}

export function QuoteIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" {...props}>
      <path d="M7.2 6C4.9 6 3 7.9 3 10.3c0 2.2 1.6 4 3.7 4.3-.3 1.4-1.3 2.5-2.7 3.1-.3.1-.4.5-.2.7.2.3.5.4.8.3 3.9-1.1 6.6-4.5 6.6-8.6 0-.1 0-.1 0-.2C11.1 7.6 9.3 6 7.2 6Zm9.6 0c-2.3 0-4.2 1.9-4.2 4.3 0 2.2 1.6 4 3.7 4.3-.3 1.4-1.3 2.5-2.7 3.1-.3.1-.4.5-.2.7.2.3.5.4.8.3 3.9-1.1 6.6-4.5 6.6-8.6v-.2C20.7 7.6 18.9 6 16.8 6Z" />
    </svg>
  );
}

/* ---------------- Service icons ---------------- */

const serviceIcons: Record<ServiceIcon, (p: IconProps) => React.JSX.Element> = {
  pen: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="m12 19 7-7 3 3-7 7-3-3z" />
      <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="m2 2 7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  cursor: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      <path d="m13 13 6 6" />
    </svg>
  ),
  palette: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="M12 22a10 10 0 1 1 10-10c0 2.2-1.8 3-3 3h-2a2 2 0 0 0-1.5 3.3c.5.6.5 1.7-.3 2.5A4 4 0 0 1 12 22Z" />
      <circle cx="7.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="10.5" cy="7.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="7.5" r="1" fill="currentColor" />
    </svg>
  ),
  branch: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="M6 3v12" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  ),
  book: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  brush: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
    </svg>
  ),
  smartphone: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <rect x="5" y="2" width="14" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </svg>
  ),
  code: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
      <path d="m14 4-4 16" />
    </svg>
  ),
  layers: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="m12 2 10 5-10 5L2 7l10-5z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  ),
  zap: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  cube: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="m3.27 6.96 8.73 5.05 8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  ),
  sparkles: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="m12 3 1.9 5.6 5.6 1.9-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9L12 3z" />
      <path d="m19 15 .7 2.1 2.1.7-2.1.7L19 20.6l-.7-2.1-2.1-.7 2.1-.7L19 15z" />
      <path d="m5 15 .6 1.6 1.6.6-1.6.6L5 19.4l-.6-1.6-1.6-.6 1.6-.6L5 15z" />
    </svg>
  ),
};

export function ServiceGlyph({ icon, ...props }: IconProps & { icon: ServiceIcon }) {
  const Comp = serviceIcons[icon] ?? serviceIcons.pen;
  return <Comp {...props} />;
}

/* ---------------- Principle / tag icons ---------------- */

const tagIcons: Record<TagIcon, (p: IconProps) => React.JSX.Element> = {
  alignment: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="M4 6h16M4 12h10M4 18h16" />
    </svg>
  ),
  colors: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <circle cx="9" cy="10" r="5" />
      <circle cx="15" cy="10" r="5" />
      <circle cx="12" cy="15" r="5" />
    </svg>
  ),
  consistency: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  ),
  typography: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
    </svg>
  ),
  "visual-cues": (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  hierarchy: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <rect x="8" y="3" width="8" height="5" rx="1" />
      <rect x="3" y="16" width="6" height="5" rx="1" />
      <rect x="15" y="16" width="6" height="5" rx="1" />
      <path d="M12 8v4M6 16v-4h12v4" />
    </svg>
  ),
  proximity: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ),
  code: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  ),
  mobile: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </svg>
  ),
  performance: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="M12 14l4-6" />
      <path d="M3.5 17a9 9 0 1 1 17 0" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
    </svg>
  ),
  accessibility: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <circle cx="12" cy="4.5" r="1.75" />
      <path d="M5 9.5c4.7 1 9.3 1 14 0" />
      <path d="M12 10v4l-3 6M12 14l3 6" />
    </svg>
  ),
  motion: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...p}>
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  ),
};

export function TagGlyph({ icon, ...props }: IconProps & { icon: TagIcon }) {
  const Comp = tagIcons[icon] ?? tagIcons.alignment;
  return <Comp {...props} />;
}

/* ---------------- Social icons ---------------- */

const brandPaths: Partial<Record<SocialPlatform, string>> = {
  behance: siBehance.path,
  instagram: siInstagram.path,
  whatsapp: siWhatsapp.path,
  github: siGithub.path,
  dribbble: siDribbble.path,
  x: siX.path,
  youtube: siYoutube.path,
};

export function SocialGlyph({ platform, ...props }: IconProps & { platform: SocialPlatform }) {
  if (platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" {...props}>
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    );
  }
  if (platform === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }
  const d = brandPaths[platform];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" {...props}>
      <path d={d} />
    </svg>
  );
}

export const socialLabels: Record<SocialPlatform, string> = {
  behance: "Behance",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
  github: "GitHub",
  dribbble: "Dribbble",
  x: "X",
  youtube: "YouTube",
  email: "Email",
};
