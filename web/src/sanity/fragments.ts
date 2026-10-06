/** Image projection with everything the frontend needs (LQIP, dimensions, hotspot). */
export const IMAGE_FRAGMENT = /* groq */ `{
  asset->{ _id, url, metadata { lqip, dimensions { width, height } } },
  alt,
  hotspot,
  crop
}`;

export const CTA_FRAGMENT = /* groq */ `{ label, href, newTab }`;

export const PROJECT_CARD_FRAGMENT = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  kind,
  category,
  timeline,
  shortDescription,
  tags,
  thumbnail ${IMAGE_FRAGMENT},
  cover ${IMAGE_FRAGMENT},
  externalUrl,
  externalLabel,
  disciplines,
  featured,
  order,
  enabled
}`;

export const TOOL_FRAGMENT = /* groq */ `{
  _id, name, description, category, enabled, order,
  logo ${IMAGE_FRAGMENT}
}`;

export const SERVICE_FRAGMENT = /* groq */ `{ _id, title, description, icon, enabled, order }`;

export const TESTIMONIAL_FRAGMENT = /* groq */ `{
  _id, name, role, quote, enabled, order,
  avatar ${IMAGE_FRAGMENT}
}`;

export const EXPERIENCE_FRAGMENT = /* groq */ `{
  _id, company, period, employmentType, location, highlights, enabled, order,
  logo ${IMAGE_FRAGMENT},
  roles[]{ _key, title, period }
}`;

export const EDUCATION_FRAGMENT = /* groq */ `{
  _id, degree, institution, period, description, enabled, order,
  logo ${IMAGE_FRAGMENT}
}`;

export const CERTIFICATION_FRAGMENT = /* groq */ `{
  _id, title, issuer, duration, credentialUrl, enabled, order,
  logo ${IMAGE_FRAGMENT}
}`;

export const SEO_FRAGMENT = /* groq */ `{ title, description, noIndex, image ${IMAGE_FRAGMENT} }`;
