/**
 * Local content used until Sanity has documents (and as a safety net if the
 * Content Lake is unreachable). Everything here mirrors the Sanity schema, so
 * `npm run seed` in ../studio pushes this exact content into the Studio.
 */
import type {
  AboutPage,
  Certification,
  Education,
  Experience,
  HomePage,
  PortableTextValue,
  Project,
  Service,
  SiteSettings,
  Testimonial,
  Tool,
  WorksPage,
} from "@/lib/types";

/* ---------------- Portable Text helpers ---------------- */
let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}`;
const span = (text: string, marks: string[] = []) => ({ _type: "span", _key: key(), text, marks });
const block = (style: string, text: string, extra: Record<string, unknown> = {}) => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [span(text)],
  ...extra,
});
export const pt = {
  h2: (text: string) => block("h2", text),
  h3: (text: string) => block("h3", text),
  p: (text: string) => block("normal", text),
  bullets: (items: string[]) => items.map((t) => block("normal", t, { listItem: "bullet", level: 1 })),
  callout: (text: string, tone: "neutral" | "warm" | "success" = "warm") => ({ _type: "callout", _key: key(), text, tone }),
  metrics: (items: { value: string; label: string }[]) => ({
    _type: "metricCards",
    _key: key(),
    items: items.map((i) => ({ _type: "metricCard", _key: key(), ...i })),
  }),
  quote: (quote: string, author?: string, role?: string) => ({ _type: "pullQuote", _key: key(), quote, author, role }),
};

/* ---------------- Site settings ---------------- */
export const fallbackSettings: SiteSettings = {
  name: "Ishema Hugues",
  roleTitle: "Product Designer & Mobile/Web Developer",
  availability: { enabled: true, label: "Available for freelance" },
  resumeUrl: "https://docs.google.com/document/d/1jo9CZKu9frC01V-aaJQo0e-fYNuR_5qM/edit?usp=sharing",
  email: "huguesishema@gmail.com",
  phone: "+250 789 175 211",
  whatsapp: "https://wa.me/250789175211",
  location: "Kigali, Rwanda",
  socials: [
    { platform: "behance", url: "https://www.behance.net/ishemahugues5" },
    { platform: "instagram", url: "https://www.instagram.com/i.s.h.e.m.a/" },
    { platform: "linkedin", url: "https://www.linkedin.com/in/ishema-hugues-848163256/" },
    { platform: "github", url: "https://github.com/ISHEMAH" },
    { platform: "whatsapp", url: "https://wa.me/250789175211" },
  ],
  navLinks: [
    { label: "Works", href: "/works" },
    { label: "About", href: "/about" },
  ],
  footer: {
    prefix: "Let's",
    cycleWords: ["design", "build", "ship", "elevate"],
    suffix: "incredible work together.",
    links: [
      { label: "Home", href: "/" },
      { label: "Works", href: "/works" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/#contact-form" },
    ],
  },
  effects: { filmGrain: true, smoothScroll: true },
  mascot: { enabled: true, showOnMobile: true },
  seo: {
    title: "Ishema Hugues | Product Designer & Developer",
    description:
      "Product Designer and Mobile & Web Developer in Kigali, Rwanda. I design intuitive digital journeys and build them pixel-perfect with Flutter, React Native and Next.js.",
  },
};

/* ---------------- Services ---------------- */
export const fallbackServices: Service[] = [
  {
    id: "service-ui-ux",
    title: "UI/UX Design",
    description:
      "End-to-end interface design from wireframes to polished visual designs, grounded in user research and usability best practices.",
    icon: "pen",
  },
  {
    id: "service-product",
    title: "Product Design",
    description:
      "Strategic product thinking that aligns business goals with user needs. From concept and usability testing to roadmap support and launch.",
    icon: "cursor",
  },
  {
    id: "service-mobile",
    title: "Mobile App Development",
    description:
      "Cross-platform apps built with Flutter and React Native, taken all the way from the first wireframe to App Store approval.",
    icon: "smartphone",
  },
  {
    id: "service-web",
    title: "Web Development",
    description:
      "Fast, accessible websites and web apps with React, Next.js, TypeScript and Tailwind CSS, pixel-perfect to the design.",
    icon: "code",
  },
  {
    id: "service-design-systems",
    title: "Design Systems",
    description:
      "Scalable component libraries and design tokens that keep design and code in sync and speed up your whole team.",
    icon: "palette",
  },
  {
    id: "service-brand-motion",
    title: "Brand & Motion",
    description:
      "Logos, visual identities, illustrations and motion design that give digital products a memorable, modern character.",
    icon: "zap",
  },
];

/* ---------------- Tools ---------------- */
const tile = (file: string, alt: string) => ({ src: `/images/tools/${file}.svg`, alt, width: 180, height: 180 });
export const fallbackTools: Tool[] = [
  { id: "tool-figma", name: "Figma", category: "design", logo: tile("figma", "Figma"), description: "Expert-level UI/UX design, prototyping, auto-layout, component libraries and design systems." },
  { id: "tool-flutter", name: "Flutter", category: "mobile", logo: tile("flutter", "Flutter"), description: "Cross-platform mobile apps taken from wireframes to fully approved, production-ready App Store releases." },
  { id: "tool-react-native", name: "React Native", category: "mobile", logo: tile("react-native", "React Native"), description: "Native-feeling iOS and Android experiences with shared TypeScript logic." },
  { id: "tool-react", name: "React", category: "development", logo: tile("react", "React"), description: "Component-driven interfaces with clean state management and accessible patterns." },
  { id: "tool-next", name: "Next.js", category: "development", logo: tile("next", "Next.js"), description: "Production websites and web apps: server rendering, SEO, CMS integrations and edge-fast performance." },
  { id: "tool-typescript", name: "TypeScript", category: "development", logo: tile("typescript", "TypeScript"), description: "Type-safe code across web and mobile so designs ship without surprises." },
  { id: "tool-tailwind", name: "Tailwind CSS", category: "development", logo: tile("tailwindcss", "Tailwind CSS"), description: "Design tokens translated into a consistent, responsive styling system." },
  { id: "tool-threejs", name: "Three.js", category: "motion", logo: tile("threejs", "Three.js"), description: "Interactive 3D and WebGL experiences for immersive product storytelling." },
  { id: "tool-gsap", name: "GSAP & Motion", category: "motion", logo: tile("gsap", "GSAP"), description: "Scroll-driven animations and micro-interactions that make interfaces feel alive." },
  { id: "tool-framer", name: "Framer", category: "design", logo: tile("framer", "Framer"), description: "Web design and development: landing pages, SaaS sites, portfolio templates, CMS and animations." },
  { id: "tool-illustrator", name: "Adobe Illustrator", category: "design", logo: tile("illustrator", "Adobe Illustrator"), description: "Branding, logos, icon sets and illustrations." },
  { id: "tool-photoshop", name: "Adobe Photoshop", category: "design", logo: tile("photoshop", "Adobe Photoshop"), description: "Image editing, compositing and marketing visuals." },
  { id: "tool-after-effects", name: "After Effects", category: "motion", logo: tile("after-effects", "Adobe After Effects"), description: "Motion design, video editing and micro-interaction prototypes." },
  { id: "tool-github", name: "GitHub", category: "development", logo: tile("github", "GitHub"), description: "Version control, code reviews and CI for every project I ship." },
  { id: "tool-notion", name: "Notion", category: "productivity", logo: tile("notion", "Notion"), description: "Research notes, project documentation and client hand-offs." },
  { id: "tool-claude", name: "Claude", category: "productivity", logo: tile("claude", "Claude"), description: "AI pair-designer and pair-programmer for research, copy and code exploration." },
];

/* ---------------- Projects ---------------- */
const projectImage = (file: string, alt: string, width = 1200, height = 800) => ({
  src: `/images/projects/${file}.png`,
  alt,
  width,
  height,
});

const idServiceHighlights = [
  "Simultaneously designed, developed and managed three major mobile applications (Bill Me, Gastation and ADMS), driving them from wireframes to formal execution.",
  "Cleared strict App Store review guidelines: all three applications reached fully approved, production-ready status in Apple App Store Connect.",
];

export const fallbackProjects: Project[] = [
  {
    id: "project-gastation",
    title: "Gastation",
    slug: "gastation",
    kind: "caseStudy",
    category: "Mobile App · Fuel Tech",
    timeline: "Nov 2025 - Jun 2026",
    shortDescription:
      "Rwanda's complete digital gas station platform: drivers find nearby stations in real time, buy fuel contactlessly and manage receipts, while station teams get dashboards for pompistes, managers and owners.",
    tags: ["Flutter", "Mobile App", "EN · FR · Kinyarwanda"],
    thumbnail: projectImage("gastation", "Gastation mobile app screens"),
    cover: projectImage("gastation", "Gastation mobile app screens"),
    externalUrl: "https://station.idservices.co/en",
    externalLabel: "Visit Gastation",
    disciplines: ["product-design", "mobile-development"],
    featured: true,
    order: 1,
    role: "Product Designer & Mobile Developer",
    duration: "8 months",
    tools: "Figma, Flutter, App Store Connect",
    team: "ID Service Ltd product team",
    client: "ID Service Ltd",
    year: "2026",
    body: [
      pt.h2("Overview"),
      pt.p(
        "Gastation is Rwanda's complete digital gas station platform. Drivers locate nearby stations in real time, purchase fuel contactlessly, pay securely and manage receipts, with full support in Kinyarwanda, English and French. Station teams get dedicated dashboards for pompistes, managers and owners.",
      ),
      pt.h2("My role"),
      pt.p(
        "I owned the product end to end at ID Service Ltd: research and flows, the interface in Figma, and the Flutter implementation, working in parallel on the Bill Me and ADMS applications.",
      ),
      ...pt.bullets(idServiceHighlights),
      pt.h2("Outcome"),
      pt.callout(
        "All three applications cleared Apple's App Store review on the first submission cycle and are live in production.",
        "success",
      ),
    ],
  },
  {
    id: "project-brouse",
    title: "Brouse",
    slug: "brouse",
    kind: "caseStudy",
    category: "3D · PropTech",
    timeline: "2025",
    shortDescription:
      "Immersive 3D property workspace by Brop. Physical spaces become photorealistic WebGL walkthroughs via Gaussian splatting. Scan, upload and publish shareable tours that help listings sell themselves.",
    tags: ["WebGL", "Gaussian Splatting", "Web App"],
    thumbnail: projectImage("brousemock", "Brouse 3D property workspace mockup", 2400, 1800),
    cover: projectImage("brousemock", "Brouse 3D property workspace mockup", 2400, 1800),
    externalUrl: "https://brouse.brop.rw",
    externalLabel: "Open Brouse",
    disciplines: ["product-design", "web-development", "3d"],
    featured: true,
    order: 2,
    role: "Product Designer & Frontend Developer",
    tools: "Figma, React, Three.js",
    client: "Brop",
    year: "2025",
    body: [
      pt.h2("Overview"),
      pt.p(
        "Brouse turns physical spaces into photorealistic WebGL walkthroughs using Gaussian splatting. Real estate agencies scan a property, upload the capture and publish a shareable tour in minutes.",
      ),
      pt.h2("What I designed and built"),
      ...pt.bullets([
        "A workspace that keeps the 3D viewer front and centre while upload, processing and publishing states stay understandable.",
        "Interface patterns for navigating large 3D scenes on both desktop and mobile.",
        "The frontend implementation of the viewer shell and the publishing flow.",
      ]),
    ],
  },
  {
    id: "project-aguura",
    title: "Aguura",
    slug: "aguura",
    kind: "caseStudy",
    category: "SaaS · Inventory",
    timeline: "2025",
    shortDescription:
      "Connected Inventory Performance platform for product businesses: real-time inventory across systems, channels and marketplaces, with invoicing, expense tracking, payroll and automation built in.",
    tags: ["SaaS", "Dashboard", "Web Platform"],
    thumbnail: projectImage("aguura", "Aguura inventory platform"),
    cover: projectImage("aguura", "Aguura inventory platform"),
    externalUrl: "https://aguura.com",
    externalLabel: "Visit Aguura",
    disciplines: ["product-design", "web-development"],
    featured: true,
    order: 3,
    role: "Product Designer & Frontend Developer",
    tools: "Figma, React, TypeScript",
    year: "2025",
    body: [
      pt.h2("Overview"),
      pt.p(
        "Aguura gives product businesses one live view of inventory across systems, channels and marketplaces, and folds invoicing, expense tracking, payroll and automation into the same workspace.",
      ),
      pt.h2("Focus"),
      ...pt.bullets([
        "Dense data made scannable: clear hierarchy, consistent tables and status colours.",
        "Flows that let small teams move from stock levels to invoices without leaving the page.",
        "A component system shared between marketing site and application.",
      ]),
    ],
  },
  {
    id: "project-kyuwa",
    title: "KYUWA",
    slug: "kyuwa",
    kind: "caseStudy",
    category: "Food Tech · AR",
    timeline: "2025",
    shortDescription:
      "A digital food ecosystem for restaurant discovery in Rwanda: social-media-style exploration, AR previews of dishes and marketing tools for vendors.",
    tags: ["Mobile App", "AR", "Concept"],
    thumbnail: projectImage("kyuwamock", "KYUWA app mockup", 2400, 1800),
    cover: projectImage("kyuwamock", "KYUWA app mockup", 2400, 1800),
    disciplines: ["product-design", "mobile-development"],
    featured: true,
    order: 4,
    role: "Product Designer",
    tools: "Figma",
    year: "2025",
    body: [
      pt.h2("Overview"),
      pt.p(
        "KYUWA reimagines how people discover restaurants in Rwanda: a feed built for browsing food like social media, augmented-reality previews of dishes, and a vendor side with marketing tools.",
      ),
    ],
  },
  {
    id: "project-navigo",
    title: "NaviGO",
    slug: "navigo",
    kind: "caseStudy",
    category: "Transport · AI",
    timeline: "2024",
    shortDescription:
      "AI-driven transportation platform for traffic management and efficient transport. I designed the interfaces and developed the frontend for a smarter-mobility vision.",
    tags: ["Web", "UI Design", "Frontend"],
    thumbnail: projectImage("navigo", "NaviGO website"),
    cover: projectImage("navigo", "NaviGO website"),
    disciplines: ["product-design", "web-development"],
    featured: false,
    order: 5,
    role: "Product Designer & Frontend Developer",
    tools: "Figma, React",
    client: "NaviGO",
    year: "2024",
    body: [
      pt.h2("Overview"),
      pt.p("NaviGO is an AI-driven transportation company specialising in traffic management and efficient transport solutions."),
      pt.h2("What I did"),
      ...pt.bullets([
        "Created a seamless digital experience for the AI-driven transportation company.",
        "Designed user-friendly interfaces for traffic management and transport solutions.",
        "Developed frontend solutions aligned with the smarter-mobility vision.",
      ]),
    ],
  },
  {
    id: "project-insight-nexus",
    title: "Insight Nexus",
    slug: "insight-nexus",
    kind: "caseStudy",
    category: "Consultancy · Data",
    shortDescription:
      "Data-driven consultancy platform for Insight Nexus Ltd: tailored analytics, strategic planning and capacity-building services across education, agriculture and public health in Rwanda.",
    tags: ["Web", "Corporate"],
    thumbnail: projectImage("insight-nexus", "Insight Nexus website"),
    cover: projectImage("insight-nexus", "Insight Nexus website"),
    externalUrl: "https://www.insightnexus.africa",
    externalLabel: "Visit Insight Nexus",
    disciplines: ["product-design", "web-development"],
    featured: false,
    order: 6,
    role: "Designer & Developer",
    body: [
      pt.h2("Overview"),
      pt.p(
        "A platform that presents Insight Nexus Ltd's analytics, strategic planning and capacity-building services to partners across education, agriculture and public health.",
      ),
    ],
  },
  {
    id: "project-brop",
    title: "Brop",
    slug: "brop",
    kind: "caseStudy",
    category: "Web · Platform",
    shortDescription:
      "Digital platform and web presence for Brop, a Rwanda-based venture. A modern, user-centric interface with responsive layouts and streamlined user flows.",
    tags: ["Web", "Platform"],
    thumbnail: projectImage("brop", "Brop website"),
    cover: projectImage("brop", "Brop website"),
    externalUrl: "https://brop.rw",
    externalLabel: "Visit Brop",
    disciplines: ["product-design", "web-development"],
    featured: false,
    order: 7,
    role: "Designer & Developer",
    body: [pt.h2("Overview"), pt.p("Designed and developed Brop's digital platform and web presence, from responsive layouts to streamlined user flows.")],
  },
  {
    id: "project-idservice",
    title: "IDService",
    slug: "idservice",
    kind: "caseStudy",
    category: "IT · Enterprise",
    shortDescription:
      "Corporate website for ID Service Ltd: IT consulting, enterprise networking, CCTV security and electronics solutions for organisations across Rwanda.",
    tags: ["Web", "Corporate"],
    thumbnail: projectImage("ideservice", "ID Service website"),
    cover: projectImage("ideservice", "ID Service website"),
    externalUrl: "https://idservices.co",
    externalLabel: "Visit IDService",
    disciplines: ["product-design", "web-development"],
    featured: false,
    order: 8,
    role: "Designer & Developer",
    client: "ID Service Ltd",
    body: [pt.h2("Overview"), pt.p("A corporate site that showcases ID Service Ltd's services, portfolio and client trust for organisations across Rwanda.")],
  },
  {
    id: "project-winnaz",
    title: "Winnaz Website Redesign",
    slug: "winnaz",
    kind: "caseStudy",
    category: "Brand · Web",
    timeline: "2024",
    shortDescription:
      "Reimagined the look and feel of a renowned snacks brand: enhanced UX, a modernised interface and intuitive features that exceeded client expectations.",
    tags: ["Redesign", "Brand", "Web"],
    thumbnail: projectImage("winnaz", "Winnaz website redesign", 1265, 865),
    cover: projectImage("winnaz", "Winnaz website redesign", 1265, 865),
    disciplines: ["product-design", "branding"],
    featured: false,
    order: 9,
    role: "Product Designer",
    client: "Winnaz Musanze",
    year: "2024",
    body: [
      pt.h2("Overview"),
      pt.p("Winnaz is a renowned snacks brand from Musanze. The redesign modernised the interface while keeping the brand's warm identity."),
      pt.h2("What I did"),
      ...pt.bullets([
        "Reimagined the look and feel of the brand website.",
        "Enhanced the user experience and modernised the interface.",
        "Introduced intuitive features aligned with the brand identity.",
      ]),
    ],
  },
  {
    id: "project-bigogwe",
    title: "Visit Bigogwe",
    slug: "visit-bigogwe",
    kind: "caseStudy",
    category: "Tourism · Web",
    timeline: "2024",
    shortDescription:
      "Tourism platform for Ibere rya Bigogwe: cow experiences, scenic views, camping and cultural tours in Rwanda's Northern region.",
    tags: ["Tourism", "Fullstack", "Brand"],
    thumbnail: projectImage("bigogwe", "Visit Bigogwe website", 1266, 866),
    cover: projectImage("bigogwe", "Visit Bigogwe website", 1266, 866),
    disciplines: ["web-development", "branding"],
    featured: false,
    order: 10,
    role: "Graphic Designer & Fullstack Developer",
    client: "Visit Bigogwe / IBTC",
    year: "2024",
    body: [
      pt.h2("Overview"),
      pt.p("A platform for one of Rwanda's most popular Northern-region destinations, covering cow experiences, scenic views, camping and cultural tours."),
      pt.h2("What I did"),
      ...pt.bullets([
        "Integrated creativity and innovative digital solutions for the tourism platform.",
        "Designed engaging interfaces and optimised digital interactions.",
        "Enhanced the visitor experience end to end.",
      ]),
    ],
  },
  {
    id: "project-klina",
    title: "KLINA Services",
    slug: "klina-services",
    kind: "caseStudy",
    category: "Web Design",
    shortDescription:
      "Web design for a professional housekeeping and facilities-management agency: an intuitive, modern UI with a structured layout guiding clients from discovery to inquiry.",
    tags: ["Web Design", "Services"],
    thumbnail: projectImage("klina", "KLINA Services website"),
    cover: projectImage("klina", "KLINA Services website"),
    disciplines: ["product-design"],
    featured: false,
    order: 11,
    role: "Web Designer",
    body: [pt.h2("Overview"), pt.p("A structured, modern layout that guides KLINA's clients from discovering services to sending an inquiry.")],
  },
  {
    id: "project-visit-rwanda",
    title: "Visit Rwanda Redesign",
    slug: "visit-rwanda-redesign",
    kind: "caseStudy",
    category: "Tourism · Concept",
    shortDescription:
      "Concept redesign creating an immersive, premium digital experience: layered storytelling panels and interactive 3D map visualisations for global audiences.",
    tags: ["Concept", "3D Map", "Storytelling"],
    thumbnail: projectImage("visit-rwanda", "Visit Rwanda concept redesign"),
    cover: projectImage("visit-rwanda", "Visit Rwanda concept redesign"),
    disciplines: ["product-design", "3d"],
    featured: false,
    order: 12,
    role: "Product Designer",
    body: [pt.h2("Overview"), pt.p("A concept that turns Rwanda's destinations into layered storytelling panels with interactive 3D map visualisations.")],
  },
  // ---- Other works (no dedicated page) ----
  {
    id: "project-medily",
    title: "Medily",
    slug: "medily",
    kind: "project",
    category: "Health Tech · Product Design",
    shortDescription:
      "Advanced hospital management system powered by AI: optimised hospital operations and patient workflows with intuitive UI/UX for medical and administrative staff.",
    tags: ["Product Design", "AI"],
    disciplines: ["product-design"],
    featured: false,
    order: 20,
  },
  {
    id: "project-oddbotics",
    title: "Oddbotics",
    slug: "oddbotics",
    kind: "project",
    category: "Personal Venture",
    shortDescription: "A venture I created: brand identity and digital product design.",
    tags: ["Branding", "Product Design"],
    disciplines: ["branding", "product-design"],
    featured: false,
    order: 21,
  },
  { id: "project-ibuka", title: "IBUKA", slug: "ibuka", kind: "project", category: "Design & Development", tags: [], disciplines: ["product-design"], featured: false, order: 22 },
  { id: "project-knovvo", title: "KNOVVO", slug: "knovvo", kind: "project", category: "Design & Development", tags: [], disciplines: ["product-design"], featured: false, order: 23 },
  { id: "project-brop-agency", title: "Brop Agency", slug: "brop-agency", kind: "project", category: "Branding & Web", tags: [], disciplines: ["branding", "web-development"], featured: false, order: 24 },
  { id: "project-conexus", title: "Conexus", slug: "conexus", kind: "project", category: "Design & Development", tags: [], disciplines: ["product-design"], featured: false, order: 25 },
  { id: "project-futureskills", title: "Rwanda FutureSkills Forum", slug: "rwanda-futureskills-forum", kind: "project", category: "Event · Design", tags: [], disciplines: ["branding"], featured: false, order: 26 },
  { id: "project-taskio", title: "Taskio", slug: "taskio", kind: "project", category: "Productivity · App", tags: [], disciplines: ["product-design", "mobile-development"], featured: false, order: 27 },
  { id: "project-quizzler", title: "Quizzler", slug: "quizzler", kind: "project", category: "Education · App", tags: [], disciplines: ["product-design", "mobile-development"], featured: false, order: 28 },
];

/* ---------------- Experience / education ---------------- */
export const fallbackExperiences: Experience[] = [
  {
    id: "exp-idservice",
    company: "ID Service Ltd",
    roles: [{ title: "Mobile App Developer & Product Designer", period: "Nov 2025 - Jun 2026" }],
    period: "Nov 2025 to Jun 2026",
    employmentType: "Contract",
    location: "Kigali, Rwanda",
    highlights: idServiceHighlights,
  },
  {
    id: "exp-loxotech",
    company: "Rwanda Development Board (Loxotech)",
    roles: [{ title: "Product Designer", period: "Mar 2025 - Jan 2026" }],
    period: "Mar 2025 to Jan 2026",
    employmentType: "Contract",
    highlights: [
      "Studied and designed ideas into usable solutions.",
      "Directed end-user usability tests to streamline and boost user satisfaction.",
      "Teamed with designers on UX/UI iterations and backed product roadmap refinements.",
    ],
  },
  {
    id: "exp-primature",
    company: "Primature",
    roles: [{ title: "Product Designer", period: "Jun 2025" }],
    period: "Jun 2025",
    employmentType: "Internship",
    highlights: ["Led the redesign of the eCabinet Primature system.", "Improved visual appeal and user experience through modern design principles."],
  },
  {
    id: "exp-rtb",
    company: "Rwanda TVET Board, Kigali City",
    roles: [{ title: "Product Designer", period: "Jun 2024" }],
    period: "Jun 2024",
    employmentType: "Internship (Hybrid)",
    highlights: [
      "Designed and improved functional, user-friendly digital products.",
      "Conducted end-user testing to enhance the user experience.",
      "Collaborated on UX/UI design and product design support.",
    ],
  },
  {
    id: "exp-navigo",
    company: "NaviGO",
    roles: [{ title: "Product Designer & Frontend Developer", period: "2024" }],
    period: "2024",
    employmentType: "Freelance",
    highlights: [
      "Created a seamless digital experience for an AI-driven transportation company.",
      "Designed user-friendly interfaces for traffic management and transport solutions.",
      "Developed frontend solutions aligned with the smarter-mobility vision.",
    ],
  },
  {
    id: "exp-medily",
    company: "Medily",
    roles: [{ title: "Product Designer", period: "2024" }],
    period: "2024",
    employmentType: "Freelance",
    highlights: [
      "Designed an advanced hospital management system powered by AI.",
      "Optimised hospital operations and patient management workflows.",
      "Crafted intuitive UI/UX for medical professionals and administrative staff.",
    ],
  },
  {
    id: "exp-winnaz",
    company: "Winnaz Musanze",
    roles: [{ title: "Product Designer", period: "2024" }],
    period: "2024",
    employmentType: "Freelance",
    highlights: [
      "Reimagined the look and feel of the renowned snacks brand's website.",
      "Enhanced the user experience and modernised the interface.",
      "Introduced intuitive features aligned with the brand identity.",
    ],
  },
  {
    id: "exp-bigogwe",
    company: "Visit Bigogwe / IBTC",
    roles: [{ title: "Graphic Designer & Fullstack Developer", period: "2024" }],
    period: "2024",
    employmentType: "Freelance",
    highlights: [
      "Integrated creativity and innovative digital solutions for the tourism platform.",
      "Designed engaging interfaces and optimised digital interactions.",
      "Enhanced the visitor experience for a popular Rwanda tourism destination.",
    ],
  },
];

export const fallbackEducation: Education[] = [
  {
    id: "edu-alu",
    degree: "Bachelor in Software Engineering",
    institution: "African Leadership University",
    period: "2026 - Current",
    description:
      "Turning technical theory into real-world impact: software engineering and system design combined with the ethical integration of AI, aiming to build efficient technology that truly empowers users.",
  },
  {
    id: "edu-rca",
    degree: "A Level in Software Engineering",
    institution: "Rwanda Coding Academy, Nyabihu",
    period: "2022 - 2025",
    description:
      "Specialised in software engineering, algorithms and system design, with hands-on full-stack development, problem-solving and emerging technologies including AI and cybersecurity.",
  },
  {
    id: "edu-essm",
    degree: "O Level",
    institution: "Es Sancta Maria",
    period: "2019 - 2022",
    description:
      "Strong foundation in sciences and technology with a focus on mathematics, physics and computer science. Developed problem-solving skills and an early interest in programming.",
  },
  {
    id: "edu-primary",
    degree: "Primary Education",
    institution: "Les Hirondelles De Don Bosco",
    period: "2009 - 2018",
    description: "Critical thinking, foundational STEM subjects and analytical reasoning, plus fluency in both French and English.",
  },
];

export const fallbackCertifications: Certification[] = [];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Ahmed Al Mansoori",
    role: "Operations Director",
    avatar: { src: "/images/avatars/avatar-1.jpg", alt: "Ahmed Al Mansoori", width: 160, height: 160 },
    quote: "Professional, structured and extremely reliable. The UX thinking behind every component showed maturity.",
  },
  {
    id: "testimonial-2",
    name: "Rachel Tan",
    role: "Co-Founder",
    avatar: { src: "/images/avatars/avatar-2.jpg", alt: "Rachel Tan", width: 160, height: 160 },
    quote: "Clear communication, strong design rationale and scalable solutions. He understands business goals, not just aesthetics. That's rare.",
  },
  {
    id: "testimonial-3",
    name: "Ethan Brooks",
    role: "Startup Advisor",
    avatar: { src: "/images/avatars/avatar-3.jpg", alt: "Ethan Brooks", width: 160, height: 160 },
    quote: "One of the few designers who truly understands visual hierarchy at a deep level. The result was a product that feels premium and performs better.",
  },
  {
    id: "testimonial-4",
    name: "Lisa",
    role: "Director of ABC Foods",
    avatar: { src: "/images/avatars/avatar-4.jpg", alt: "Lisa", width: 160, height: 160 },
    quote: "An incredible eye for detail, consistently delivering user-friendly interfaces with a modern aesthetic.",
  },
];

/* ---------------- Home page ---------------- */
const featuredProjects = fallbackProjects.filter((p) => p.featured).sort((a, b) => a.order - b.order);

export const fallbackHome: HomePage = {
  seo: fallbackSettings.seo,
  sections: [
    {
      type: "hero",
      key: "hero",
      enabled: true,
      anchor: "hero",
      eyebrow: "Product Designer & Developer",
      headline: "I design things that",
      typewriterWords: ["convert.", "connect.", "scale.", "ship."],
      intro:
        "Product Designer and Mobile & Web Developer with 4+ years of experience bridging creative strategy and clean engineering. I map intuitive user journeys first, then build them pixel-perfect with Flutter, React Native and Next.js.",
      cta: { label: "Download Resume", href: fallbackSettings.resumeUrl!, newTab: true },
      portrait: { src: "/images/about/portrait.png", alt: "Ishema Hugues", width: 1600, height: 1600 },
      metrics: [
        { value: "4", suffix: "+", label: "Years" },
        { value: "10", suffix: "+", label: "Clients" },
        { value: "15", suffix: "+", label: "Projects" },
      ],
    },
    {
      type: "ticker",
      key: "ticker",
      enabled: true,
      items: ["Product Strategy", "UI / UX Design", "Mobile Apps", "Web Development", "Prototyping", "Design Systems", "Motion Design", "User Research"],
    },
    {
      type: "services",
      key: "services",
      enabled: true,
      anchor: "services",
      label: "What I Do",
      heading: "Services I offer to bring your vision to life.",
      services: fallbackServices,
      showShapes: true,
    },
    {
      type: "works",
      key: "works",
      enabled: true,
      anchor: "works",
      label: "Portfolio",
      heading: "Selected Works",
      projects: featuredProjects,
      cta: { label: "More Case Studies", href: "/works" },
    },
    {
      type: "skills",
      key: "skills",
      enabled: true,
      anchor: "design-tools",
      label: "Expertise",
      heading: "I'm highly skilled in the tools that matter.",
      tools: fallbackTools,
    },
    {
      type: "bento",
      key: "bento",
      enabled: true,
      anchor: "bento",
      thinking: {
        title: "Design Thinking & Craft",
        principles: [
          { label: "Alignment", icon: "alignment" },
          { label: "Colors", icon: "colors" },
          { label: "Consistency", icon: "consistency" },
          { label: "Typography", icon: "typography" },
          { label: "Visual Cues", icon: "visual-cues" },
          { label: "Hierarchy", icon: "hierarchy" },
          { label: "Proximity", icon: "proximity" },
          { label: "Clean Code", icon: "code" },
          { label: "Performance", icon: "performance" },
          { label: "Accessibility", icon: "accessibility" },
        ],
      },
      craft: {
        title: "Craftmanship",
        quote: "I don't design to impress. I design to express, solve and simplify. Then I build it.",
      },
      experience: {
        label: "Experience",
        metric: { value: "4", suffix: "+", label: "Years" },
        title: "Crafting Digital Products",
        text: "Designing and building user-centred web and mobile experiences across SaaS, fintech, tourism and public-sector platforms.",
      },
      collaboration: {
        label: "Collaboration",
        title: "Cross-functional Workflow",
        text: "Working closely with product, engineering and business teams, often as both the designer and the developer.",
        collaborators: ["Design", "Code"],
      },
      shipped: {
        title: "Projects Shipped",
        text: "Three mobile apps live on the App Store plus web platforms delivered for startups and public institutions.",
      },
      languages: {
        title: "Languages",
        items: [
          { name: "Kinyarwanda", level: 100 },
          { name: "English", level: 95 },
          { name: "French", level: 85 },
        ],
      },
      process: {
        title: "My Design & Build Process",
        steps: [
          { label: "Discover", state: "done" },
          { label: "Define", state: "done" },
          { label: "Design", state: "done" },
          { label: "Build", state: "done" },
          { label: "Deliver", state: "done" },
        ],
      },
    },
    {
      type: "testimonials",
      key: "testimonials",
      enabled: true,
      anchor: "testimonials",
      heading: "Testimonials",
      subheading: "Design That Delivers, Globally",
      description: "From early-stage startups to scaling teams and public institutions, real impact across continents.",
      testimonials: fallbackTestimonials,
      flags: [
        { src: "/images/flags/usa.png", alt: "USA flag", width: 128, height: 128 },
        { src: "/images/flags/india.png", alt: "India flag", width: 128, height: 128 },
        { src: "/images/flags/china.png", alt: "China flag", width: 128, height: 128 },
        { src: "/images/flags/australia.png", alt: "Australia flag", width: 128, height: 128 },
        { src: "/images/flags/russia.png", alt: "Russia flag", width: 128, height: 128 },
      ],
    },
    {
      type: "faq",
      key: "faq",
      enabled: true,
      anchor: "faq",
      heading: "Frequently Asked Questions",
      description: "Common questions about working together, timelines and how I blend design with development.",
      items: [
        {
          question: "What exactly do you do: design or development?",
          answer:
            "Both. I start with research, user journeys and high-fidelity prototypes in Figma, then build the result myself with Flutter or React Native for mobile and Next.js for the web. You get one accountable person from idea to launch.",
        },
        {
          question: "Which platforms do you build for?",
          answer:
            "iOS and Android through Flutter and React Native (including App Store submission and review), plus responsive websites and web apps with React, Next.js, TypeScript and Tailwind CSS.",
        },
        {
          question: "How does a typical project start?",
          answer:
            "With a short discovery call to understand goals, users and constraints. I then propose a scope, timeline and deliverables so we align before any design work begins.",
        },
        {
          question: "How long does a project take?",
          answer:
            "A landing page or brand refresh can take a couple of weeks; a full product with design and development usually spans several months. Every proposal includes a realistic timeline for your scope.",
        },
        {
          question: "Can you work with my existing team?",
          answer:
            "Yes. I regularly collaborate with product managers, engineers and stakeholders, run usability tests and hand over organised Figma files and clean, documented code.",
        },
        {
          question: "Do you work with international clients?",
          answer:
            "Absolutely. I'm based in Kigali, Rwanda and work remotely with clients across time zones in English, French and Kinyarwanda.",
        },
        {
          question: "What happens after launch?",
          answer:
            "I can stay on for iterations, analytics reviews and new features, or hand everything over with documentation so your team can continue independently.",
        },
        {
          question: "How do I get in touch?",
          answer: "Use the contact form below or reach me directly by email or WhatsApp. I usually reply within one business day.",
        },
      ],
    },
    {
      type: "contact",
      key: "contact",
      enabled: true,
      heading: "Ready to elevate your product experience?",
      description:
        "Whether you're launching a new product or refining an existing one, I'm here to help. Share the details about your project and I'll get back to you so we can work something out.",
      submitLabel: "Submit",
      successMessage: "Thanks! Your message is on its way. I'll get back to you soon.",
    },
  ],
};

/* ---------------- About page ---------------- */
export const fallbackAbout: AboutPage = {
  greeting: "Hello!",
  headline: "This is Ishema Hugues.",
  subheadline: "A Product Designer & Developer",
  intro:
    "I am a Product Designer and Mobile & Web Developer who bridges the gap between creative strategy and clean mobile and web engineering. My first priority is always the user experience: mapping intuitive digital journeys, interactive wireframes and user-centric systems. Once that foundation is built, I use React Native, Flutter and TypeScript to translate those exact interfaces into pixel-perfect, high-performance cross-platform applications. At ALU, I'm turning technical theory into real-world impact by combining software engineering and system design with the ethical integration of AI.",
  seo: {
    title: "About | Ishema Hugues",
    description: "Product Designer and Mobile & Web Developer based in Kigali, Rwanda: experience, education, skills and what drives my work.",
  },
  sections: [
    { type: "experience", key: "experience", enabled: true, heading: "Work Experience", items: fallbackExperiences },
    { type: "education", key: "education", enabled: true, heading: "Education", items: fallbackEducation },
    { type: "certifications", key: "certifications", enabled: true, heading: "Certifications & Courses", items: fallbackCertifications },
    {
      type: "skillGroups",
      key: "skills",
      enabled: true,
      heading: "Core Skills",
      groups: [
        {
          title: "Product & UI Design",
          items: ["UI Design", "UX Research", "Wireframing", "Interactive Prototyping", "Design Systems", "Usability Testing", "Typography", "Information Architecture", "User Journey Mapping"],
        },
        {
          title: "Mobile Development",
          items: ["Flutter", "React Native", "TypeScript", "App Store & Play Store releases", "Responsive & adaptive layouts", "Offline-first patterns", "Multilingual apps"],
        },
        {
          title: "Web Development",
          items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML & CSS", "GSAP", "Framer Motion", "Three.js", "Radix UI"],
        },
        {
          title: "Brand & Creative",
          items: ["Graphic Design", "Branding & Logos", "Illustrations", "Video & Image Editing", "Motion Design", "Art Direction"],
        },
      ],
    },
    {
      type: "hobbies",
      key: "hobbies",
      enabled: true,
      heading: "My Hobbies",
      items: [
        { label: "Fitness", image: { src: "/images/hobbies/fitness.png", alt: "Fitness", width: 250, height: 250 } },
        { label: "Designing", image: { src: "/images/hobbies/design.png", alt: "Designing", width: 250, height: 250 } },
        { label: "Traveling", image: { src: "/images/hobbies/travel.png", alt: "Traveling", width: 250, height: 250 } },
        { label: "Music", image: { src: "/images/hobbies/music.png", alt: "Music", width: 250, height: 250 } },
        { label: "Learning", image: { src: "/images/hobbies/learning.png", alt: "Learning", width: 250, height: 250 } },
        { label: "Trekking", image: { src: "/images/hobbies/hiking.png", alt: "Trekking", width: 250, height: 250 } },
      ],
    },
    {
      type: "contact",
      key: "contact",
      enabled: true,
      heading: "Ready to elevate your product experience?",
      description:
        "Whether you're launching a new product or refining an existing one, I'm here to help. Share the details about your project and I'll get back to you so we can work something out.",
      submitLabel: "Submit",
      successMessage: "Thanks! Your message is on its way. I'll get back to you soon.",
    },
  ],
};

/* ---------------- Works page ---------------- */
export const fallbackWorks: WorksPage = {
  heading: "All Case Studies",
  subheading: "Research to Design to Code",
  showOtherWorks: true,
  otherWorksHeading: "Multidisciplinary Showcase",
  otherWorksSubheading: "Branding | Mobile Apps | Design Explorations",
  showContact: true,
  caseStudies: fallbackProjects.filter((p) => p.kind === "caseStudy").sort((a, b) => a.order - b.order),
  otherWorks: fallbackProjects.filter((p) => p.kind === "project").sort((a, b) => a.order - b.order),
  seo: {
    title: "Works | Ishema Hugues",
    description: "Case studies and projects spanning product design, mobile apps and web development.",
  },
};

export const fallbackContactSection = fallbackHome.sections.find((s) => s.type === "contact")!;

export const getFallbackProject = (slug: string) => fallbackProjects.find((p) => p.slug === slug && p.kind === "caseStudy");

// Ensure the PortableText helper type is exported for the seed script.
export type { PortableTextValue };
