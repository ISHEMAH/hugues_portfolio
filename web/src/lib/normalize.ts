/**
 * Maps raw Sanity query results onto the frontend domain types.
 * Every function is defensive: Sanity fields can be null, references can be
 * unresolved and arrays can be empty. Local fallback data fills the gaps.
 */
import type {
  ABOUT_PAGE_QUERY_RESULT,
  HOME_PAGE_QUERY_RESULT,
  PROJECT_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
  WORKS_PAGE_QUERY_RESULT,
} from "@/../sanity.types";
import { toImg, type SanityImageLike } from "./image";
import type {
  AboutPage,
  AboutSection,
  Certification,
  Education,
  Experience,
  HomePage,
  HomeSection,
  Img,
  Link,
  Metric,
  PortableTextValue,
  Project,
  ProjectPage,
  Seo,
  Service,
  ServiceIcon,
  SiteSettings,
  Social,
  SocialPlatform,
  TagIcon,
  Testimonial,
  Tool,
  ToolCategory,
  WorksPage,
} from "./types";
import { fallbackAbout, fallbackContactSection, fallbackHome, fallbackSettings, fallbackWorks } from "@/data/fallback";

type Maybe<T> = T | null | undefined;
const str = (v: Maybe<string>, fallback = "") => (typeof v === "string" && v.trim() ? v : fallback);
const bool = (v: Maybe<boolean>, fallback = true) => (typeof v === "boolean" ? v : fallback);
const num = (v: Maybe<number>, fallback = 0) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
const strs = (v: Maybe<Array<Maybe<string>>>) => (v ?? []).filter((s): s is string => typeof s === "string" && s.trim().length > 0);

const SOCIALS: SocialPlatform[] = ["behance", "instagram", "linkedin", "whatsapp", "github", "dribbble", "x", "youtube", "email"];
const SERVICE_ICONS: ServiceIcon[] = ["pen", "cursor", "palette", "branch", "book", "brush", "smartphone", "code", "layers", "zap", "cube", "sparkles"];
const TAG_ICONS: TagIcon[] = ["alignment", "colors", "consistency", "typography", "visual-cues", "hierarchy", "proximity", "code", "mobile", "performance", "accessibility", "motion"];
const TOOL_CATEGORIES: ToolCategory[] = ["design", "development", "mobile", "motion", "productivity"];

const oneOf = <T extends string>(v: Maybe<string>, list: T[], fallback: T): T => (list.includes(v as T) ? (v as T) : fallback);

function link(v: Maybe<{ label?: Maybe<string>; href?: Maybe<string>; newTab?: Maybe<boolean> }>): Link | undefined {
  if (!v || !str(v.label) || !str(v.href)) return undefined;
  return { label: v.label as string, href: v.href as string, newTab: v.newTab ?? undefined };
}
const links = (v: Maybe<Array<Parameters<typeof link>[0]>>) => (v ?? []).map(link).filter((l): l is Link => Boolean(l));

function metric(v: Maybe<{ value?: Maybe<string>; suffix?: Maybe<string>; label?: Maybe<string> }>): Metric | undefined {
  if (!v || !str(v.value)) return undefined;
  return { value: v.value as string, suffix: v.suffix ?? undefined, label: str(v.label) };
}

function seo(v: Maybe<{ title?: Maybe<string>; description?: Maybe<string>; noIndex?: Maybe<boolean>; image?: SanityImageLike }>): Seo | undefined {
  if (!v) return undefined;
  return { title: v.title ?? undefined, description: v.description ?? undefined, noIndex: v.noIndex ?? undefined, image: toImg(v.image, 1200) };
}

/* ---------------- Site settings ---------------- */
export function normalizeSettings(data: SITE_SETTINGS_QUERY_RESULT): SiteSettings {
  const f = fallbackSettings;
  if (!data) return f;
  const socials: Social[] = (data.socials ?? [])
    .map((s) => (s.platform && s.url ? { platform: oneOf(s.platform, SOCIALS, "email"), url: s.url } : null))
    .filter((s): s is Social => Boolean(s));
  return {
    name: str(data.name, f.name),
    roleTitle: data.roleTitle ?? f.roleTitle,
    availability: { enabled: bool(data.availabilityEnabled, true), label: str(data.availabilityLabel, f.availability.label) },
    resumeUrl: data.resumeUrl ?? f.resumeUrl,
    email: data.email ?? f.email,
    phone: data.phone ?? f.phone,
    whatsapp: data.whatsapp ?? f.whatsapp,
    location: data.location ?? f.location,
    socials: socials.length ? socials : f.socials,
    navLinks: links(data.navLinks).length ? links(data.navLinks) : f.navLinks,
    footer: {
      prefix: str(data.footerPrefix, f.footer.prefix),
      cycleWords: strs(data.footerCycleWords).length ? strs(data.footerCycleWords) : f.footer.cycleWords,
      suffix: str(data.footerSuffix, f.footer.suffix),
      links: links(data.footerLinks).length ? links(data.footerLinks) : f.footer.links,
    },
    copyright: data.copyright ?? undefined,
    effects: { filmGrain: bool(data.filmGrain, true), smoothScroll: bool(data.smoothScroll, true) },
    mascot: {
      enabled: bool(data.mascotEnabled, f.mascot.enabled),
      showOnMobile: bool(data.mascotOnMobile, f.mascot.showOnMobile),
    },
    seo: seo(data.seo) ?? f.seo,
  };
}

/* ---------------- Shared documents ---------------- */
type RawService = { _id: string; title: Maybe<string>; description: Maybe<string>; icon: Maybe<string>; enabled: Maybe<boolean>; order: Maybe<number> };
type RawTool = { _id: string; name: Maybe<string>; description: Maybe<string>; category: Maybe<string>; enabled: Maybe<boolean>; order: Maybe<number>; logo: SanityImageLike };
type RawTestimonial = { _id: string; name: Maybe<string>; role: Maybe<string>; quote: Maybe<string>; enabled: Maybe<boolean>; order: Maybe<number>; avatar: SanityImageLike };
type RawProjectCard = {
  _id: string;
  title: Maybe<string>;
  slug: Maybe<string>;
  kind: Maybe<string>;
  category: Maybe<string>;
  timeline: Maybe<string>;
  shortDescription: Maybe<string>;
  tags: Maybe<Array<string>>;
  thumbnail: SanityImageLike;
  cover: SanityImageLike;
  externalUrl: Maybe<string>;
  externalLabel: Maybe<string>;
  disciplines: Maybe<Array<string>>;
  featured: Maybe<boolean>;
  order: Maybe<number>;
  enabled: Maybe<boolean>;
};
type RawExperience = {
  _id: string;
  company: Maybe<string>;
  period: Maybe<string>;
  employmentType: Maybe<string>;
  location: Maybe<string>;
  highlights: Maybe<Array<string>>;
  enabled: Maybe<boolean>;
  order: Maybe<number>;
  logo: SanityImageLike;
  roles: Maybe<Array<{ _key: string; title: Maybe<string>; period: Maybe<string> }>>;
};
type RawEducation = { _id: string; degree: Maybe<string>; institution: Maybe<string>; period: Maybe<string>; description: Maybe<string>; enabled: Maybe<boolean>; order: Maybe<number>; logo: SanityImageLike };
type RawCertification = { _id: string; title: Maybe<string>; issuer: Maybe<string>; duration: Maybe<string>; credentialUrl: Maybe<string>; enabled: Maybe<boolean>; order: Maybe<number>; logo: SanityImageLike };

const enabledOnly = <T extends { enabled: Maybe<boolean> }>(items: Maybe<Array<Maybe<T>>>) =>
  (items ?? []).filter((i): i is T => Boolean(i) && (i as T).enabled !== false);

export function normalizeService(s: RawService): Service {
  return { id: s._id, title: str(s.title, "Service"), description: str(s.description), icon: oneOf(s.icon, SERVICE_ICONS, "pen") };
}
export function normalizeTool(t: RawTool): Tool {
  return { id: t._id, name: str(t.name, "Tool"), description: t.description ?? undefined, logo: toImg(t.logo, 180), category: oneOf(t.category, TOOL_CATEGORIES, "design") };
}
export function normalizeTestimonial(t: RawTestimonial): Testimonial {
  return { id: t._id, name: str(t.name, "Anonymous"), role: t.role ?? undefined, quote: str(t.quote), avatar: toImg(t.avatar, 160) };
}
export function normalizeProjectCard(p: RawProjectCard): Project {
  return {
    id: p._id,
    title: str(p.title, "Untitled project"),
    slug: str(p.slug, p._id),
    kind: p.kind === "project" ? "project" : "caseStudy",
    category: p.category ?? undefined,
    timeline: p.timeline ?? undefined,
    shortDescription: p.shortDescription ?? undefined,
    tags: strs(p.tags),
    thumbnail: toImg(p.thumbnail, 1000),
    cover: toImg(p.cover, 1600),
    externalUrl: p.externalUrl ?? undefined,
    externalLabel: p.externalLabel ?? undefined,
    disciplines: strs(p.disciplines),
    featured: bool(p.featured, false),
    order: num(p.order, 999),
  };
}
export function normalizeExperience(e: RawExperience): Experience {
  const roles = (e.roles ?? []).filter((r) => str(r.title)).map((r) => ({ title: r.title as string, period: str(r.period) }));
  return {
    id: e._id,
    company: str(e.company, "Company"),
    logo: toImg(e.logo, 100),
    roles: roles.length ? roles : [{ title: "", period: str(e.period) }].filter((r) => r.title),
    period: str(e.period),
    employmentType: e.employmentType ?? undefined,
    location: e.location ?? undefined,
    highlights: strs(e.highlights),
  };
}
export function normalizeEducation(e: RawEducation): Education {
  return { id: e._id, degree: str(e.degree, "Programme"), institution: str(e.institution), logo: toImg(e.logo, 100), period: str(e.period), description: e.description ?? undefined };
}
export function normalizeCertification(c: RawCertification): Certification {
  return { id: c._id, title: str(c.title, "Certification"), issuer: str(c.issuer), logo: toImg(c.logo, 100), duration: c.duration ?? undefined, credentialUrl: c.credentialUrl ?? undefined };
}

/* ---------------- Home page ---------------- */
type RawHome = NonNullable<HOME_PAGE_QUERY_RESULT>;
type RawHomeSection = NonNullable<RawHome["sections"]>[number];

export function normalizeHome(data: HOME_PAGE_QUERY_RESULT, settings: SiteSettings): HomePage {
  if (!data) return fallbackHome;
  const defaults = data.defaults;
  const defaultServices = enabledOnly(defaults?.services as Maybe<RawService[]>).map(normalizeService);
  const defaultProjects = enabledOnly(defaults?.projects as Maybe<RawProjectCard[]>).map(normalizeProjectCard);
  const defaultTools = enabledOnly(defaults?.tools as Maybe<RawTool[]>).map(normalizeTool);
  const defaultTestimonials = enabledOnly(defaults?.testimonials as Maybe<RawTestimonial[]>).map(normalizeTestimonial);

  const sections: HomeSection[] = (data.sections ?? [])
    .map((s: RawHomeSection): HomeSection | null => {
      const base = { key: s._key, enabled: bool(s.enabled, true), anchor: s.anchor ?? undefined };
      switch (s._type) {
        case "heroSection": {
          let cta: Link | undefined;
          if (s.ctaMode === "custom") cta = link(s.cta);
          else if (s.ctaMode !== "none" && settings.resumeUrl) cta = { label: str(s.ctaLabel, "Download Resume"), href: settings.resumeUrl, newTab: true };
          return {
            ...base,
            type: "hero",
            eyebrow: s.eyebrow ?? undefined,
            headline: str(s.headline, "I design things that"),
            typewriterWords: strs(s.typewriterWords),
            intro: s.intro ?? undefined,
            cta,
            portrait: toImg(s.portrait, 1200),
            metrics: (s.metrics ?? []).map(metric).filter((m): m is Metric => Boolean(m)),
          };
        }
        case "tickerSection":
          return { ...base, type: "ticker", items: strs(s.items) };
        case "servicesSection": {
          const chosen = enabledOnly(s.services as Maybe<RawService[]>).map(normalizeService);
          return { ...base, type: "services", label: s.label ?? undefined, heading: str(s.heading, "Services"), services: chosen.length ? chosen : defaultServices, showShapes: bool(s.showShapes, true) };
        }
        case "worksSection": {
          const chosen = enabledOnly(s.projects as Maybe<RawProjectCard[]>).map(normalizeProjectCard);
          return { ...base, type: "works", label: s.label ?? undefined, heading: str(s.heading, "Selected Works"), projects: chosen.length ? chosen : defaultProjects, cta: link(s.cta) ?? { label: "More Case Studies", href: "/works" } };
        }
        case "skillsSection": {
          const chosen = enabledOnly(s.tools as Maybe<RawTool[]>).map(normalizeTool);
          return { ...base, type: "skills", label: s.label ?? undefined, heading: str(s.heading, "Tools I use"), tools: chosen.length ? chosen : defaultTools };
        }
        case "bentoSection": {
          const fb = fallbackHome.sections.find((x) => x.type === "bento");
          const fbBento = fb && fb.type === "bento" ? fb : undefined;
          return {
            ...base,
            type: "bento",
            thinking: bool(s.showThinking, true)
              ? {
                  title: str(s.thinkingTitle, "Design Thinking & Craft"),
                  principles: (s.principles ?? []).length
                    ? (s.principles ?? []).filter((p) => str(p.label)).map((p) => ({ label: p.label as string, icon: oneOf(p.icon, TAG_ICONS, "alignment") }))
                    : fbBento?.thinking?.principles ?? [],
                }
              : undefined,
            craft: bool(s.showCraft, true) ? { title: str(s.craftTitle, "Craftmanship"), quote: str(s.craftQuote, fbBento?.craft?.quote ?? "") } : undefined,
            experience: bool(s.showExperience, true)
              ? {
                  label: str(s.experienceLabel, "Experience"),
                  metric: metric(s.experienceMetric) ?? fbBento?.experience?.metric,
                  title: str(s.experienceTitle, fbBento?.experience?.title ?? ""),
                  text: str(s.experienceText, fbBento?.experience?.text ?? ""),
                }
              : undefined,
            collaboration: bool(s.showCollab, true)
              ? {
                  label: str(s.collabLabel, "Collaboration"),
                  title: str(s.collabTitle, fbBento?.collaboration?.title ?? ""),
                  text: str(s.collabText, fbBento?.collaboration?.text ?? ""),
                  collaborators: strs(s.collaborators).length ? strs(s.collaborators) : fbBento?.collaboration?.collaborators ?? [],
                }
              : undefined,
            shipped: bool(s.showShipped, true)
              ? { title: str(s.shippedTitle, "Projects Shipped"), text: str(s.shippedText, fbBento?.shipped?.text ?? ""), metric: metric(s.shippedMetric) }
              : undefined,
            languages: bool(s.showLanguages, true)
              ? {
                  title: str(s.languagesTitle, "Languages"),
                  items: (s.languages ?? []).length
                    ? (s.languages ?? []).filter((l) => str(l.name)).map((l) => ({ name: l.name as string, level: num(l.level, 80) }))
                    : fbBento?.languages?.items ?? [],
                }
              : undefined,
            process: bool(s.showProcess, true)
              ? {
                  title: str(s.processTitle, "My Design Process"),
                  steps: (s.processSteps ?? []).length
                    ? (s.processSteps ?? []).filter((p) => str(p.label)).map((p) => ({ label: p.label as string, state: oneOf(p.state, ["done", "current", "upcoming"], "done") }))
                    : fbBento?.process?.steps ?? [],
                }
              : undefined,
          };
        }
        case "testimonialsSection": {
          const chosen = enabledOnly(s.testimonials as Maybe<RawTestimonial[]>).map(normalizeTestimonial);
          return {
            ...base,
            type: "testimonials",
            heading: str(s.heading, "Testimonials"),
            subheading: s.subheading ?? undefined,
            description: s.description ?? undefined,
            testimonials: chosen.length ? chosen : defaultTestimonials,
            flags: (s.flags ?? []).map((f) => toImg(f, 128)).filter((f): f is Img => Boolean(f)),
          };
        }
        case "faqSection":
          return {
            ...base,
            type: "faq",
            heading: str(s.heading, "Frequently Asked Questions"),
            description: s.description ?? undefined,
            items: (s.items ?? []).filter((i) => str(i.question) && str(i.answer)).map((i) => ({ question: i.question as string, answer: i.answer as string })),
          };
        case "contactSection":
          return {
            ...base,
            type: "contact",
            heading: str(s.heading, fallbackContactSection.type === "contact" ? fallbackContactSection.heading : "Get in touch"),
            description: s.description ?? undefined,
            submitLabel: str(s.submitLabel, "Submit"),
            successMessage: str(s.successMessage, "Thanks! Your message is on its way."),
          };
        default:
          return null;
      }
    })
    .filter((s): s is HomeSection => Boolean(s));

  return { sections: sections.length ? sections : fallbackHome.sections, seo: seo(data.seo) };
}

/* ---------------- About page ---------------- */
type RawAbout = NonNullable<ABOUT_PAGE_QUERY_RESULT>;
type RawAboutSection = NonNullable<RawAbout["sections"]>[number];

export function normalizeAbout(data: ABOUT_PAGE_QUERY_RESULT): AboutPage {
  if (!data) return fallbackAbout;
  const defaults = data.defaults;
  const defaultExperiences = enabledOnly(defaults?.experiences as Maybe<RawExperience[]>).map(normalizeExperience);
  const defaultEducation = enabledOnly(defaults?.education as Maybe<RawEducation[]>).map(normalizeEducation);
  const defaultCertifications = enabledOnly(defaults?.certifications as Maybe<RawCertification[]>).map(normalizeCertification);

  const sections: AboutSection[] = (data.sections ?? [])
    .map((s: RawAboutSection): AboutSection | null => {
      const base = { key: s._key, enabled: bool(s.enabled, true) };
      switch (s._type) {
        case "experienceSection": {
          const chosen = enabledOnly(s.items as Maybe<RawExperience[]>).map(normalizeExperience);
          return { ...base, type: "experience", heading: str(s.heading, "Work Experience"), items: chosen.length ? chosen : defaultExperiences };
        }
        case "educationSection": {
          const chosen = enabledOnly(s.items as Maybe<RawEducation[]>).map(normalizeEducation);
          return { ...base, type: "education", heading: str(s.heading, "Education"), items: chosen.length ? chosen : defaultEducation };
        }
        case "certificationsSection": {
          const chosen = enabledOnly(s.items as Maybe<RawCertification[]>).map(normalizeCertification);
          return { ...base, type: "certifications", heading: str(s.heading, "Certifications & Courses"), items: chosen.length ? chosen : defaultCertifications };
        }
        case "skillGroupsSection":
          return {
            ...base,
            type: "skillGroups",
            heading: str(s.heading, "Core Skills"),
            groups: (s.groups ?? []).filter((g) => str(g.title)).map((g) => ({ title: g.title as string, items: strs(g.items) })),
          };
        case "hobbiesSection":
          return {
            ...base,
            type: "hobbies",
            heading: str(s.heading, "My Hobbies"),
            items: (s.items ?? []).filter((h) => str(h.label)).map((h) => ({ label: h.label as string, image: toImg(h.image, 250) })),
          };
        case "contactSection":
          return {
            ...base,
            type: "contact",
            heading: str(s.heading, fallbackContactSection.type === "contact" ? fallbackContactSection.heading : "Get in touch"),
            description: s.description ?? undefined,
            submitLabel: str(s.submitLabel, "Submit"),
            successMessage: str(s.successMessage, "Thanks! Your message is on its way."),
          };
        default:
          return null;
      }
    })
    .filter((s): s is AboutSection => Boolean(s));

  return {
    greeting: str(data.greeting, fallbackAbout.greeting),
    headline: str(data.headline, fallbackAbout.headline),
    subheadline: data.subheadline ?? fallbackAbout.subheadline,
    intro: data.intro ?? fallbackAbout.intro,
    sections: sections.length ? sections : fallbackAbout.sections,
    seo: seo(data.seo) ?? fallbackAbout.seo,
  };
}

/* ---------------- Works page ---------------- */
export function normalizeWorks(data: WORKS_PAGE_QUERY_RESULT): WorksPage {
  if (!data) return fallbackWorks;
  const caseStudies = enabledOnly(data.caseStudies as Maybe<RawProjectCard[]>).map(normalizeProjectCard);
  const otherWorks = enabledOnly(data.otherWorks as Maybe<RawProjectCard[]>).map(normalizeProjectCard);
  return {
    heading: str(data.heading, fallbackWorks.heading),
    subheading: data.subheading ?? fallbackWorks.subheading,
    showOtherWorks: bool(data.showOtherWorks, true),
    otherWorksHeading: data.otherWorksHeading ?? fallbackWorks.otherWorksHeading,
    otherWorksSubheading: data.otherWorksSubheading ?? undefined,
    showContact: bool(data.showContact, true),
    caseStudies: caseStudies.length ? caseStudies : fallbackWorks.caseStudies,
    otherWorks: caseStudies.length ? otherWorks : fallbackWorks.otherWorks,
    seo: seo(data.seo) ?? fallbackWorks.seo,
  };
}

/* ---------------- Project page ---------------- */
export function normalizeProject(data: PROJECT_QUERY_RESULT): ProjectPage | null {
  if (!data) return null;
  const card = normalizeProjectCard(data as unknown as RawProjectCard);
  return {
    ...card,
    role: data.role ?? undefined,
    duration: data.duration ?? undefined,
    tools: data.tools ?? undefined,
    team: data.team ?? undefined,
    client: data.client ?? undefined,
    year: data.year ?? undefined,
    seo: seo(data.seo),
    body: (data.body ?? undefined) as PortableTextValue | undefined,
    related: enabledOnly(data.related as Maybe<RawProjectCard[]>).map(normalizeProjectCard),
  };
}
