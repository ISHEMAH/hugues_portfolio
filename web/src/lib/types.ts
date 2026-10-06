/**
 * Domain types used by every component. Content comes either from Sanity
 * (normalized in lib/normalize.ts) or from the local fallback in data/fallback.ts,
 * so components never need to know where it came from.
 */

export type Img = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  /** base64 blur placeholder (Sanity LQIP) */
  lqip?: string;
};

export type Link = { label: string; href: string; newTab?: boolean };

export type SocialPlatform =
  | "behance"
  | "instagram"
  | "linkedin"
  | "whatsapp"
  | "github"
  | "dribbble"
  | "x"
  | "youtube"
  | "email";

export type Social = { platform: SocialPlatform; url: string };

export type Metric = { value: string; suffix?: string; label: string };

export type Seo = { title?: string; description?: string; image?: Img; noIndex?: boolean };

/** Animated 3D robot mascot in the hero, contact section and 404 page (see components/mascot). */
export type MascotSettings = { enabled: boolean; showOnMobile: boolean };

export type SiteSettings = {
  name: string;
  roleTitle?: string;
  availability: { enabled: boolean; label: string };
  resumeUrl?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  socials: Social[];
  navLinks: Link[];
  footer: { prefix: string; cycleWords: string[]; suffix: string; links: Link[] };
  copyright?: string;
  effects: { filmGrain: boolean; smoothScroll: boolean };
  mascot: MascotSettings;
  seo?: Seo;
};

export type ServiceIcon =
  | "pen"
  | "cursor"
  | "palette"
  | "branch"
  | "book"
  | "brush"
  | "smartphone"
  | "code"
  | "layers"
  | "zap"
  | "cube"
  | "sparkles";

export type Service = { id: string; title: string; description: string; icon: ServiceIcon };

export type ToolCategory = "design" | "development" | "mobile" | "motion" | "productivity";

export type Tool = { id: string; name: string; description?: string; logo?: Img; category: ToolCategory };

export type ProjectKind = "caseStudy" | "project";

/** Raw Portable Text from Sanity; rendered by components/case/CaseBody. */
export type PortableTextBlockLike = { _type: string; _key: string; [key: string]: unknown };
export type PortableTextValue = PortableTextBlockLike[];

export type Project = {
  id: string;
  title: string;
  slug: string;
  kind: ProjectKind;
  category?: string;
  timeline?: string;
  shortDescription?: string;
  tags: string[];
  thumbnail?: Img;
  cover?: Img;
  externalUrl?: string;
  externalLabel?: string;
  disciplines: string[];
  featured: boolean;
  order: number;
  // case overview
  role?: string;
  duration?: string;
  tools?: string;
  team?: string;
  client?: string;
  year?: string;
  body?: PortableTextValue;
  seo?: Seo;
};

export type Experience = {
  id: string;
  company: string;
  logo?: Img;
  roles: { title: string; period: string }[];
  period: string;
  employmentType?: string;
  location?: string;
  highlights: string[];
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  logo?: Img;
  period: string;
  description?: string;
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  logo?: Img;
  duration?: string;
  credentialUrl?: string;
};

export type Testimonial = { id: string; name: string; role?: string; avatar?: Img; quote: string };

export type TagIcon =
  | "alignment"
  | "colors"
  | "consistency"
  | "typography"
  | "visual-cues"
  | "hierarchy"
  | "proximity"
  | "code"
  | "mobile"
  | "performance"
  | "accessibility"
  | "motion";

export type ProcessStep = { label: string; state: "done" | "current" | "upcoming" };

type SectionBase = { key: string; enabled: boolean; anchor?: string };

export type HeroSection = SectionBase & {
  type: "hero";
  eyebrow?: string;
  headline: string;
  typewriterWords: string[];
  intro?: string;
  cta?: Link;
  portrait?: Img;
  metrics: Metric[];
};

export type TickerSection = SectionBase & { type: "ticker"; items: string[] };

export type ServicesSection = SectionBase & {
  type: "services";
  label?: string;
  heading: string;
  services: Service[];
  showShapes: boolean;
};

export type WorksSection = SectionBase & {
  type: "works";
  label?: string;
  heading: string;
  projects: Project[];
  cta?: Link;
};

export type SkillsSection = SectionBase & { type: "skills"; label?: string; heading: string; tools: Tool[] };

export type BentoSection = SectionBase & {
  type: "bento";
  thinking?: { title: string; principles: { label: string; icon: TagIcon }[] };
  craft?: { title: string; quote: string };
  experience?: { label: string; metric?: Metric; title: string; text: string };
  collaboration?: { label: string; title: string; text: string; collaborators: string[] };
  shipped?: { title: string; text: string; metric?: Metric };
  languages?: { title: string; items: { name: string; level: number }[] };
  process?: { title: string; steps: ProcessStep[] };
};

export type TestimonialsSection = SectionBase & {
  type: "testimonials";
  heading: string;
  subheading?: string;
  description?: string;
  testimonials: Testimonial[];
  flags: Img[];
};

export type FaqSection = SectionBase & {
  type: "faq";
  heading: string;
  description?: string;
  items: { question: string; answer: string }[];
};

export type ContactSection = SectionBase & {
  type: "contact";
  heading: string;
  description?: string;
  submitLabel: string;
  successMessage: string;
};

export type HomeSection =
  | HeroSection
  | TickerSection
  | ServicesSection
  | WorksSection
  | SkillsSection
  | BentoSection
  | TestimonialsSection
  | FaqSection
  | ContactSection;

export type HomePage = { sections: HomeSection[]; seo?: Seo };

export type ExperienceSection = SectionBase & { type: "experience"; heading: string; items: Experience[] };
export type EducationSection = SectionBase & { type: "education"; heading: string; items: Education[] };
export type CertificationsSection = SectionBase & { type: "certifications"; heading: string; items: Certification[] };
export type SkillGroupsSection = SectionBase & {
  type: "skillGroups";
  heading: string;
  groups: { title: string; items: string[] }[];
};
export type HobbiesSection = SectionBase & { type: "hobbies"; heading: string; items: { label: string; image?: Img }[] };

export type AboutSection =
  | ExperienceSection
  | EducationSection
  | CertificationsSection
  | SkillGroupsSection
  | HobbiesSection
  | ContactSection;

export type AboutPage = {
  greeting: string;
  headline: string;
  subheadline?: string;
  intro?: string;
  sections: AboutSection[];
  seo?: Seo;
};

export type WorksPage = {
  heading: string;
  subheading?: string;
  showOtherWorks: boolean;
  otherWorksHeading?: string;
  otherWorksSubheading?: string;
  showContact: boolean;
  caseStudies: Project[];
  otherWorks: Project[];
  seo?: Seo;
};

export type ProjectPage = Project & { related: Project[] };
