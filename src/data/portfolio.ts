export interface Metric {
  label: string;
  value: string;
  suffix?: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  tag: "PROTO" | "STACK";
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  type: string;
  description: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  link?: string;
  linkLabel?: string;
  /** Place file at public/images/projects/{filename}.png */
  image?: string;
}

export interface Education {
  period: string;
  degree: string;
  institution: string;
  description: string;
}

export interface Skill {
  name: string;
  category: string;
}

export const personalInfo = {
  name: "ISHEMA M. HUGUES",
  shortName: "HUGUES",
  title: "Frontend Developer & UI Designer",
  location: "Kigali, Rwanda",
  phone: "+250 789 175 211",
  email: "huguesishema@gmail.com",
  linkedin: "https://www.linkedin.com/in/ishema-hugues-848163256/",
  github: "https://github.com/ISHEMAH",
  behance: "https://www.behance.net/ishemahugues5",
  instagram: "https://www.instagram.com/i.s.h.e.m.a/",
  website: "https://hugues.vercel.app/",
  /** Portrait for ASCII render — place at public/images/about/profile.png */
  profileImage: "/images/about/profile.png",
  summary:
    "With four years of experience in frontend development, graphic design and UX/UI design, I specialize in crafting creative, user-friendly interfaces using ReactJS, TypeScript, NextJS, Flutter, and more. Passionate about blending design and technology, I bring innovation and creativity to every product, ensuring visually engaging and intuitive digital experiences.",
  educationCurrent:
    "At ALU, I am turning technical theory into real-world impact. I combine software engineering and system design with the ethical integration of AI, aiming to build efficient technology that truly empowers users.",
};

export const metrics: Metric[] = [
  { label: "METRIC_EXP", value: "4+", suffix: "YRS" },
  { label: "METRIC_PROJECTS", value: "15+", suffix: "DONE" },
  { label: "METRIC_STACK", value: "12+", suffix: "TECH" },
  { label: "METRIC_CLIENTS", value: "10+", suffix: "WORK" },
  { label: "METRIC_LANGS", value: "3", suffix: "LANG" },
  { label: "METRIC_STATUS", value: "100%", suffix: "READY" },
];

export const services: Service[] = [
  {
    icon: "Palette",
    title: "UI/UX DESIGN",
    description:
      "Designing interfaces to be clear, objective, and intuitive. From wireframes to high-fidelity prototypes with modern design principles.",
    tag: "PROTO",
  },
  {
    icon: "Code2",
    title: "FRONTEND DEV",
    description:
      "Developing professional websites, portfolios, landing pages, and web apps with React, Next.js, TypeScript, and Tailwind CSS.",
    tag: "STACK",
  },
  {
    icon: "Smartphone",
    title: "MOBILE APPS",
    description:
      "Building cross-platform mobile experiences with Flutter. Native-feel interfaces with performance and accessibility in mind.",
    tag: "STACK",
  },
  {
    icon: "PenTool",
    title: "GRAPHIC DESIGN",
    description:
      "Branding, logos, illustrations, and visual identity systems. Artworks, video editing, and image composition for digital products.",
    tag: "PROTO",
  },
  {
    icon: "Zap",
    title: "MOTION DESIGN",
    description:
      "Creating interactions that convey modernity and grab attention. GSAP, Framer Motion, and scroll-driven animations.",
    tag: "STACK",
  },
  {
    icon: "Layers",
    title: "PRODUCT DESIGN",
    description:
      "End-to-end product design from research to delivery. Usability testing, UX iterations, and product roadmap support.",
    tag: "PROTO",
  },
];

export const experiences: Experience[] = [
  {
    id: "loxotech",
    company: "Rwanda Development Board — Loxotech",
    role: "Product Designer",
    period: "Mar 2025 - Jan 2026",
    type: "Contract",
    description: [
      "Studied and designed ideas into usable solutions",
      "Directed end-user usability tests to streamline and boost user satisfaction",
      "Teamed with designers on UX/UI iterations and backed product roadmap refinements",
    ],
  },
  {
    id: "primature",
    company: "Primature",
    role: "Product Designer",
    period: "Jun 2025",
    type: "Internship",
    description: [
      "Led the redesign of the eCabinet primature system",
      "Improved visual appeal and user experience through modern design principles",
    ],
  },
  {
    id: "rtb",
    company: "Rwanda TVET Board — Kigali City",
    role: "Product Designer",
    period: "Jun 2024",
    type: "Internship (Hybrid)",
    description: [
      "Designed and improved functional and user-friendly digital products",
      "Conducted end-user testing to enhance user experience",
      "Collaborated on UX/UI design and product design support",
    ],
  },
  {
    id: "navigo",
    company: "NaviGO",
    role: "Product Designer & Frontend Developer",
    period: "2024",
    type: "Freelance",
    description: [
      "Created seamless digital experience for AI-driven transportation company",
      "Designed user-friendly interfaces for traffic management and transport solutions",
      "Developed frontend solutions aligned with smarter mobility vision",
    ],
  },
  {
    id: "medily",
    company: "Medily",
    role: "Product Designer",
    period: "2024",
    type: "Freelance",
    description: [
      "Designed advanced hospital management system powered by AI",
      "Optimized hospital operations and patient management workflows",
      "Crafted intuitive UI/UX for medical professionals and administrative staff",
    ],
  },
  {
    id: "winnaz",
    company: "Winnaz Musanze",
    role: "Product Designer",
    period: "2024",
    type: "Freelance",
    description: [
      "Reimagined look and feel of renowned snacks brand website",
      "Enhanced user experience and modernized interface",
      "Introduced intuitive features aligned with brand identity",
    ],
  },
  {
    id: "bigogwe",
    company: "Visit Bigogwe / IBTC",
    role: "Graphic Designer & Fullstack Developer",
    period: "2024",
    type: "Freelance",
    description: [
      "Integrated creativity and innovative digital solutions for tourism platform",
      "Designed engaging interfaces and optimized digital interactions",
      "Enhanced visitor experience for popular Rwanda tourism destination",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "navigo",
    title: "NaviGO",
    category: "TRANSPORT / AI",
    description:
      "AI-driven transportation platform specializing in traffic management and efficient transport solutions. Designed user-friendly interfaces and developed frontend for smarter mobility.",
    link: "#",
    linkLabel: "VIEW_CASE",
    image: "/images/projects/navigo.png",
  },
  {
    id: "winnaz",
    title: "Winnaz Website Redesign",
    category: "BRAND / WEB",
    description:
      "Reimagined the look and feel of a renowned snacks brand. Enhanced UX, modernized interface, and introduced intuitive features that exceeded client expectations.",
    link: "#",
    linkLabel: "VIEW_CASE",
    image: "/images/projects/winnaz.png",
  },
  {
    id: "bigogwe",
    title: "Visit Bigogwe",
    category: "TOURISM / WEB",
    description:
      "Tourism platform for Ibere rya Bigogwe. Cow experiences, scenic views, camping, and cultural tours in Rwanda's Northern region.",
    link: "#",
    linkLabel: "VIEW_CASE",
    image: "/images/projects/bigogwe.png",
  },
  {
    id: "gastation",
    title: "Gastation",
    category: "MOBILE / FUEL TECH",
    description:
      "Rwanda's complete digital gas station platform. Drivers locate nearby stations in real time, purchase fuel contactlessly, pay securely, and manage receipts — with full support in Kinyarwanda, English, and French. Station teams get dashboards for pompistes, managers, and owners.",
    link: "https://station.idservices.co/en",
    linkLabel: "LAUNCH",
    image: "/images/projects/gastation.png",
  },
  {
    id: "brouse",
    title: "Brouse",
    category: "3D / PROPTECH",
    description:
      "Immersive 3D property workspace by Brop. Turns physical spaces into photorealistic WebGL walkthroughs via Gaussian splatting — scan, upload, and publish shareable tours that help real estate agencies make listings sell themselves.",
    link: "https://brouse.brop.rw",
    linkLabel: "LAUNCH",
    image: "/images/projects/brousemock.png",
  },
  {
    id: "klina",
    title: "KLINA Services",
    category: "WEB DESIGN",
    description:
      "Web design project for professional housekeeping and facilities management agency. Intuitive, modern UI with structured layout guiding clients from discovery to inquiry.",
    link: "#",
    linkLabel: "VIEW_CASE",
    image: "/images/projects/klina.png",
  },
  {
    id: "kyuwa",
    title: "KYUWA",
    category: "FOOD TECH / AR",
    description:
      "Comprehensive digital food ecosystem for restaurant discovery in Rwanda. Social media-style exploration, AR technology, and vendor marketing tools.",
    link: "#",
    linkLabel: "VIEW_CASE",
    image: "/images/projects/kyuwamock.png",
  },
  {
    id: "visit-rwanda",
    title: "Visit Rwanda Redesign",
    category: "TOURISM / CONCEPT",
    description:
      "Concept redesign creating immersive premium digital experience. Layered storytelling panels and interactive 3D map visualizations for global audiences.",
    link: "#",
    linkLabel: "VIEW_CASE",
    image: "/images/projects/visit-rwanda.png",
  },
  {
    id: "brop",
    title: "Brop",
    category: "WEB / PLATFORM",
    description:
      "Digital platform and web presence for Brop — a Rwanda-based venture. Designed and developed a modern, user-centric interface with responsive layouts and streamlined user flows.",
    link: "https://brop.rw",
    linkLabel: "LAUNCH",
    image: "/images/projects/brop.png",
  },
  {
    id: "aguura",
    title: "Aguura",
    category: "SAAS / INVENTORY",
    description:
      "Connected Inventory Performance platform for product businesses. Real-time inventory across systems, channels, and marketplaces — with invoicing, expense tracking, payroll, and automation built in.",
    link: "https://aguura.com",
    linkLabel: "LAUNCH",
    image: "/images/projects/aguura.png",
  },
  {
    id: "insight-nexus",
    title: "Insight Nexus",
    category: "CONSULTANCY / DATA",
    description:
      "Data-driven consultancy platform for Insight Nexus Ltd. Tailored analytics, strategic planning, and capacity-building services across education, agriculture, and public health in Rwanda.",
    link: "https://www.insightnexus.africa",
    linkLabel: "LAUNCH",
    image: "/images/projects/insight-nexus.png",
  },
  {
    id: "idservice",
    title: "IDService",
    category: "IT / ENTERPRISE",
    description:
      "Corporate website for ID Service Ltd — IT consulting, enterprise networking, CCTV security, and electronics solutions. Showcases services, portfolio, and client trust for organizations across Rwanda.",
    link: "https://idservices.co",
    linkLabel: "LAUNCH",
    image: "/images/projects/ideservice.png",
  },
];

export const education: Education[] = [
  {
    period: "2026 — Current",
    degree: "Bachelor in Software Engineering",
    institution: "African Leadership University",
    description: personalInfo.educationCurrent,
  },
  {
    period: "2022 — 2025",
    degree: "A Level — Software Engineering",
    institution: "Rwanda Coding Academy — Nyabihu",
    description:
      "Specialized in software engineering, algorithms, and system design. Hands-on full-stack development, problem-solving, and emerging technologies including AI and cybersecurity.",
  },
  {
    period: "2019 — 2022",
    degree: "O Level",
    institution: "Es Sancta Maria",
    description:
      "Strong foundation in sciences and technology with focus on mathematics, physics, and computer science. Developed problem-solving skills and interest in programming.",
  },
  {
    period: "2009 — 2018",
    degree: "Primary Education",
    institution: "Les Hirondelles De Don Bosco",
    description:
      "Critical thinking, foundational STEM subjects, and analytical reasoning laying groundwork for future academic success. Also developed fluency in both French and English.",
  },
];

export const skills: Skill[] = [
  { name: "Figma", category: "DESIGN" },
  { name: "React", category: "FRAMEWORK" },
  { name: "Next.js", category: "FRAMEWORK" },
  { name: "TypeScript", category: "LANGUAGE" },
  { name: "JavaScript", category: "LANGUAGE" },
  { name: "Flutter", category: "MOBILE" },
  { name: "HTML", category: "MARKUP" },
  { name: "CSS", category: "STYLE" },
  { name: "Tailwind CSS", category: "STYLE" },
  { name: "GSAP", category: "MOTION" },
  { name: "Framer Motion", category: "MOTION" },
  { name: "Three.js", category: "3D" },
  { name: "Sketch", category: "DESIGN" },
  { name: "React Native", category: "MOBILE" },
  { name: "Radix UI", category: "COMPONENT" },
];

export const navLinks = [
  { href: "#home", label: "01_HOME" },
  { href: "#about", label: "02_ABOUT" },
  { href: "#experience", label: "03_WORK" },
  { href: "#projects", label: "04_PROJECTS" },
  { href: "#services", label: "05_SERVICES" },
  { href: "#skills", label: "06_SKILLS" },
  { href: "#education", label: "07_EDU" },
  { href: "#contact", label: "08_CONTACT" },
];

export const terminalLogs = [
  "> INITIALIZING PORTFOLIO_v2.0...",
  "> LOADING MODULE: frontend_dev [OK]",
  "> LOADING MODULE: ui_design [OK]",
  "> LOADING MODULE: product_design [OK]",
  "> CONNECTING: huguesishema@gmail.com [OK]",
  "> STATUS: ALL SYSTEMS OPERATIONAL",
  "",
  "  ___  ____  _   _ ____  __  __ ",
  " |_ _|/ ___|| | | | ___| \\ \\/ / ",
  "  | | \\___ \\| |_| |___ \\  >  <  ",
  "  | |  ___) |  _  |___) |/ /\\ \\ ",
  " |___||____/|_| |_|____//_/  \\_\\",
  "",
  "> READY FOR INPUT_",
];

export const workCategories = [
  "Software Development",
  "Product Design",
  "Graphic Design",
  "Frontend Development",
  "Mobile Apps",
  "Backend Development",
  "Branding & Logos",
  "Art Works",
  "Video & Image Editing",
  "Illustrations",
];

export const additionalProjects = [
  "Medily",
  "IBUKA",
  "KNOVVO",
  "Brop Agency",
  "Conexus",
  "Rwanda FutureSkills Forum",
  "Oddbotics",
  "Taskio",
  "Quizzler",
];
