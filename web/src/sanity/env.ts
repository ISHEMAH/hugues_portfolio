export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rnc8k23w";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-09-26";
export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";
export const isSanityConfigured = Boolean(projectId && dataset);
