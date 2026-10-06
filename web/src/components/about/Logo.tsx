import Image from "@/components/ui/Image";
import type { Img } from "@/lib/types";

/** 50px square logo with an initials fallback. */
export function Logo({ image, name, size = 50 }: { image?: Img; name: string; size?: number }) {
  const initials = name
    .split(/[\s\u2014\u2013-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-lg bg-stone font-serif text-base font-medium text-ink-soft"
      style={{ width: size, height: size }}
    >
      {image ? <Image src={image.src} alt={image.alt || name} fill sizes={`${size}px`} className="object-cover" unoptimized={image.src.endsWith(".svg")} /> : initials}
    </span>
  );
}
