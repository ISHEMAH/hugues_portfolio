"use client";

import NextImage, { type ImageLoaderProps, type ImageProps } from "next/image";

const SANITY_CDN = "https://cdn.sanity.io/";

/**
 * Lets Sanity's image CDN do the resizing for Sanity-hosted images. The
 * browser then fetches them directly instead of routing every size through
 * this server's optimiser, which times out on large uploads.
 */
export function sanityLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}

/** Drop-in replacement for next/image that routes Sanity images through their own CDN. */
export default function Image(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : undefined;
  if (src && src.startsWith(SANITY_CDN) && !props.unoptimized) return <NextImage {...props} loader={sanityLoader} />;
  return <NextImage {...props} />;
}
