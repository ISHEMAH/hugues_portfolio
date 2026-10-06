import "server-only";
import { sanityFetch } from "@/sanity/live";
import { isSanityConfigured } from "@/sanity/env";
import {
  ABOUT_PAGE_QUERY,
  HOME_PAGE_QUERY,
  PROJECT_QUERY,
  PROJECT_SLUGS_QUERY,
  SITEMAP_QUERY,
  SITE_SETTINGS_QUERY,
  WORKS_PAGE_QUERY,
} from "@/sanity/queries";
import { normalizeAbout, normalizeHome, normalizeProject, normalizeSettings, normalizeWorks } from "./normalize";
import type {
  ABOUT_PAGE_QUERY_RESULT,
  HOME_PAGE_QUERY_RESULT,
  PROJECT_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
  WORKS_PAGE_QUERY_RESULT,
} from "@/../sanity.types";
import type { AboutPage, HomePage, ProjectPage, SiteSettings, WorksPage } from "./types";
import { fallbackAbout, fallbackHome, fallbackProjects, fallbackSettings, fallbackWorks, getFallbackProject } from "@/data/fallback";

/**
 * Content access layer. Every getter tries Sanity first and falls back to the
 * local content in data/fallback.ts, so the site always renders: before the
 * first document is published, and even if the API is unreachable.
 */
async function safeFetch<T>(label: string, run: () => Promise<T>): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    return await run();
  } catch (error) {
    console.warn(`[content] ${label}: falling back to local content:`, error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await safeFetch("siteSettings", () => sanityFetch({ query: SITE_SETTINGS_QUERY }));
  return result?.data ? normalizeSettings(result.data as unknown as SITE_SETTINGS_QUERY_RESULT) : fallbackSettings;
}

export async function getHomePage(settings?: SiteSettings): Promise<HomePage> {
  const s = settings ?? (await getSiteSettings());
  const result = await safeFetch("homePage", () => sanityFetch({ query: HOME_PAGE_QUERY }));
  return result?.data ? normalizeHome(result.data as unknown as HOME_PAGE_QUERY_RESULT, s) : fallbackHome;
}

export async function getAboutPage(): Promise<AboutPage> {
  const result = await safeFetch("aboutPage", () => sanityFetch({ query: ABOUT_PAGE_QUERY }));
  return result?.data ? normalizeAbout(result.data as unknown as ABOUT_PAGE_QUERY_RESULT) : fallbackAbout;
}

export async function getWorksPage(): Promise<WorksPage> {
  const result = await safeFetch("worksPage", () => sanityFetch({ query: WORKS_PAGE_QUERY }));
  return result?.data ? normalizeWorks(result.data as unknown as WORKS_PAGE_QUERY_RESULT) : fallbackWorks;
}

export async function getProject(slug: string): Promise<ProjectPage | null> {
  const result = await safeFetch(`project:${slug}`, () => sanityFetch({ query: PROJECT_QUERY, params: { slug } }));
  const fromSanity = result?.data ? normalizeProject(result.data as unknown as PROJECT_QUERY_RESULT) : null;
  if (fromSanity) return fromSanity;
  const local = getFallbackProject(slug);
  if (!local) return null;
  const related = fallbackProjects.filter((p) => p.kind === "caseStudy" && p.slug !== slug).sort((a, b) => a.order - b.order).slice(0, 2);
  return { ...local, related };
}

export async function getProjectSlugs(): Promise<string[]> {
  const result = await safeFetch("projectSlugs", () => sanityFetch({ query: PROJECT_SLUGS_QUERY, perspective: "published", stega: false }));
  const remote = (result?.data ?? []).map((p) => p.slug).filter((s): s is string => Boolean(s));
  const local = fallbackProjects.filter((p) => p.kind === "caseStudy").map((p) => p.slug);
  return Array.from(new Set([...remote, ...local]));
}

export async function getSitemapEntries(): Promise<{ slug: string; updatedAt?: string }[]> {
  const result = await safeFetch("sitemap", () => sanityFetch({ query: SITEMAP_QUERY, perspective: "published", stega: false }));
  if (result?.data?.length) return result.data.filter((p) => p.slug).map((p) => ({ slug: p.slug as string, updatedAt: p._updatedAt }));
  return fallbackProjects.filter((p) => p.kind === "caseStudy").map((p) => ({ slug: p.slug }));
}
