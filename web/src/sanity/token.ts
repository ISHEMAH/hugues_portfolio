import "server-only";

/** Viewer token used for draft previews. Optional: the site works without it. */
export const readToken = process.env.SANITY_API_READ_TOKEN || undefined;
/** Editor token used by the contact form to archive submissions. Optional. */
export const writeToken = process.env.SANITY_API_WRITE_TOKEN || undefined;
