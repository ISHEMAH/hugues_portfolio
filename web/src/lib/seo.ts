import type { Metadata } from "next";
import { stegaClean } from "next-sanity";
import type { Seo, SiteSettings } from "./types";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Builds Next.js metadata from a page's SEO fields, falling back to site defaults. */
export function buildMetadata(settings: SiteSettings, page?: Seo, fallbackTitle?: string, path = "/"): Metadata {
  const siteTitle = stegaClean(settings.seo?.title || `${settings.name} | ${settings.roleTitle ?? "Portfolio"}`);
  const title = stegaClean(page?.title || fallbackTitle || siteTitle);
  const description = stegaClean(page?.description || settings.seo?.description || "");
  const image = page?.image ?? settings.seo?.image;
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: page?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: stegaClean(settings.name),
      type: "website",
      images: image ? [{ url: image.src, width: image.width ?? 1200, height: image.height ?? 630, alt: image.alt ?? title }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image.src] : undefined },
  };
}
