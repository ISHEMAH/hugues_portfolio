import { initScrollReveal } from "./scrollReveal.js";
import { hoverChangeExperience } from "./hoverChangeExperience.js";
import { typeWrite } from "./typeWrite.js";
import { hoverChangeDescription } from "./hoverChangeDescription.js";
import { menu } from "./menu.js";

menu();
initScrollReveal();
typeWrite(document.querySelector(".typewriter"));

hoverChangeExperience(
  ".digitalhouse",
  `I worked as a content instructor in frontend at
  Digital House, where my job was to create content for frontend
  specialization classes. Some topics covered in the content
  were: React, Redux, TypeScript, Tests, GraphQL, Next.js, MUI,
  React Hook Form, and styled-components.`,
  "Content Instructor in Frontend",
  "Digital House",
  "Nov 2021 - Nov 2022 (1 year)"
);

hoverChangeExperience(
  ".zuplae",
  `I worked as a Social Media and Designer at Zuplae, which is a
  programming school. The focus was on creating content about
  programming for the dev community through social media.`,
  "Social Media and UI Designer",
  "Zuplae",
  "Jan 2022 - Apr 2022 (4 months)"
);

hoverChangeExperience(
  ".codigofontetv",
  `I worked as a Social Media and Designer at Código Fonte TV,
  focusing on creating content about programming for the dev
  community through social media.`,
  "Social Media and Designer",
  "Código Fonte TV",
  "Jun 2021 - Jan 2022 (8 months)"
);

hoverChangeExperience(
  ".contweb",
  `I interned at ContWeb, an accounting company. It was my
  first experience with React. In addition to frontend development,
  I designed the new platform for the company.`,
  "Frontend Developer and UI Designer",
  "ContWeb",
  "Sep 2021 - Nov 2021 (3 months)"
);

// Apply hoverChangeDescription to elements with specific classes
hoverChangeDescription(
  ".html",
  "HTML is a markup language where we mark elements to define what information the page will display."
);
hoverChangeDescription(
  ".css",
  "CSS is a style sheet language composed of 'layers,' created to style pages."
);
hoverChangeDescription(
  ".js",
  "JavaScript is a programming language that allows you to implement dynamic elements on web pages."
);
hoverChangeDescription(
  ".sass",
  "Sass is a CSS preprocessor that adds some features not available natively."
);
hoverChangeDescription(
  ".react",
  "React is a JavaScript library focused on creating composable user interfaces."
);
hoverChangeDescription(
  ".next",
  "Next.js is a web framework that enables features like server-side rendering and static site generation for React-based web applications."
);
hoverChangeDescription(
  ".styled",
  "styled-components is a library that utilizes the concept of CSS-in-JS, allowing us to write CSS code within JavaScript."
);
hoverChangeDescription(
  ".tailwind",
  "Tailwind CSS is a CSS framework that provides utility classes for styling pages."
);
hoverChangeDescription(
  ".typescript",
  "TypeScript is a superset of JavaScript that includes features not present in the language natively, in addition to making it statically typed."
);
hoverChangeDescription(
  ".radix",
  "Radix is a library that provides accessible and style-free React components for building applications."
);
hoverChangeDescription(
  ".cypress",
  "Cypress is an end-to-end testing framework that currently uses the JavaScript language."
);
hoverChangeDescription(
  ".storybook",
  "Storybook is a tool that aims to document and test application components."
);