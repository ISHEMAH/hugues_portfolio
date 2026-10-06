import type { Img } from "./types";
import { urlFor } from "@/sanity/image";

export type SanityImageLike = {
  asset?: { _id?: string | null; _ref?: string | null; url?: string | null; metadata?: { lqip?: string | null; dimensions?: { width?: number | null; height?: number | null } | null } | null } | null;
  alt?: string | null;
  hotspot?: unknown;
  crop?: unknown;
} | null | undefined;

/** Converts a Sanity image projection into the frontend `Img` shape (or passes through a local `Img`). */
export function toImg(source: SanityImageLike | Img, width = 1600): Img | undefined {
  if (!source) return undefined;
  if ("src" in source && typeof source.src === "string") return source as Img;
  const img = source as Exclude<SanityImageLike, null | undefined>;
  if (!img.asset || (!img.asset._id && !img.asset._ref && !img.asset.url)) return undefined;
  const dims = img.asset.metadata?.dimensions;
  const isSvg = img.asset.url?.endsWith(".svg");
  let src: string;
  try {
    src = isSvg && img.asset.url ? img.asset.url : urlFor(img as never).width(width).url();
  } catch {
    src = img.asset.url ?? "";
  }
  if (!src) return undefined;
  const ratio = dims?.width && dims?.height ? dims.height / dims.width : undefined;
  return {
    src,
    alt: img.alt ?? undefined,
    width: dims?.width ?? undefined,
    height: dims?.height ?? (ratio ? Math.round(width * ratio) : undefined),
    lqip: img.asset.metadata?.lqip ?? undefined,
  };
}
