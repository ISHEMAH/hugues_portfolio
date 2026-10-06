import { defineQuery } from "next-sanity";
import {
  CERTIFICATION_FRAGMENT,
  CTA_FRAGMENT,
  EDUCATION_FRAGMENT,
  EXPERIENCE_FRAGMENT,
  IMAGE_FRAGMENT,
  PROJECT_CARD_FRAGMENT,
  SEO_FRAGMENT,
  SERVICE_FRAGMENT,
  TESTIMONIAL_FRAGMENT,
  TOOL_FRAGMENT,
} from "./fragments";

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_id == "siteSettings"][0]{
    name,
    roleTitle,
    availabilityEnabled,
    availabilityLabel,
    "resumeUrl": coalesce(resumeFile.asset->url, resumeUrl),
    email,
    phone,
    whatsapp,
    location,
    socials[]{ _key, platform, url },
    navLinks[]{ _key, label, href, newTab },
    footerPrefix,
    footerCycleWords,
    footerSuffix,
    footerLinks[]{ _key, label, href, newTab },
    copyright,
    filmGrain,
    smoothScroll,
    mascotEnabled,
    mascotOnMobile,
    seo ${SEO_FRAGMENT}
  }
`);

export const HOME_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "homePage"][0]{
    seo ${SEO_FRAGMENT},
    sections[]{
      _key,
      _type,
      enabled,
      anchor,
      _type == "heroSection" => {
        eyebrow, headline, typewriterWords, intro, ctaMode, ctaLabel,
        cta ${CTA_FRAGMENT},
        portrait ${IMAGE_FRAGMENT},
        metrics[]{ _key, value, suffix, label }
      },
      _type == "tickerSection" => { items },
      _type == "servicesSection" => {
        label, heading, showShapes,
        services[]-> ${SERVICE_FRAGMENT}
      },
      _type == "worksSection" => {
        label, heading,
        cta ${CTA_FRAGMENT},
        projects[]-> ${PROJECT_CARD_FRAGMENT}
      },
      _type == "skillsSection" => {
        label, heading,
        tools[]-> ${TOOL_FRAGMENT}
      },
      _type == "bentoSection" => {
        thinkingTitle, showThinking,
        principles[]{ _key, label, icon },
        craftTitle, craftQuote, showCraft,
        experienceLabel, experienceTitle, experienceText, showExperience,
        experienceMetric{ value, suffix, label },
        collabLabel, collabTitle, collabText, collaborators, showCollab,
        shippedTitle, shippedText, showShipped,
        shippedMetric{ value, suffix, label },
        languagesTitle, showLanguages,
        languages[]{ _key, name, level },
        processTitle, showProcess,
        processSteps[]{ _key, label, state }
      },
      _type == "testimonialsSection" => {
        heading, subheading, description,
        testimonials[]-> ${TESTIMONIAL_FRAGMENT},
        flags[] ${IMAGE_FRAGMENT}
      },
      _type == "faqSection" => {
        heading, description,
        items[]{ _key, question, answer }
      },
      _type == "contactSection" => { heading, description, submitLabel, successMessage }
    },
    "defaults": {
      "services": *[_type == "service" && enabled != false] | order(order asc) ${SERVICE_FRAGMENT},
      "projects": *[_type == "project" && enabled != false && featured == true] | order(order asc)[0...6] ${PROJECT_CARD_FRAGMENT},
      "tools": *[_type == "tool" && enabled != false] | order(order asc) ${TOOL_FRAGMENT},
      "testimonials": *[_type == "testimonial" && enabled != false] | order(order asc) ${TESTIMONIAL_FRAGMENT}
    }
  }
`);

export const ABOUT_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "aboutPage"][0]{
    greeting, headline, subheadline, intro,
    seo ${SEO_FRAGMENT},
    sections[]{
      _key,
      _type,
      enabled,
      heading,
      _type == "experienceSection" => { items[]-> ${EXPERIENCE_FRAGMENT} },
      _type == "educationSection" => { items[]-> ${EDUCATION_FRAGMENT} },
      _type == "certificationsSection" => { items[]-> ${CERTIFICATION_FRAGMENT} },
      _type == "skillGroupsSection" => { groups[]{ _key, title, items } },
      _type == "hobbiesSection" => { items[]{ _key, label, image ${IMAGE_FRAGMENT} } },
      _type == "contactSection" => { description, submitLabel, successMessage }
    },
    "defaults": {
      "experiences": *[_type == "experience" && enabled != false] | order(order asc) ${EXPERIENCE_FRAGMENT},
      "education": *[_type == "education" && enabled != false] | order(order asc) ${EDUCATION_FRAGMENT},
      "certifications": *[_type == "certification" && enabled != false] | order(order asc) ${CERTIFICATION_FRAGMENT}
    }
  }
`);

export const WORKS_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "worksPage"][0]{
    heading, subheading, showOtherWorks, otherWorksHeading, otherWorksSubheading, showContact,
    seo ${SEO_FRAGMENT},
    "caseStudies": *[_type == "project" && enabled != false && kind != "project"] | order(order asc) ${PROJECT_CARD_FRAGMENT},
    "otherWorks": *[_type == "project" && enabled != false && kind == "project"] | order(order asc) ${PROJECT_CARD_FRAGMENT}
  }
`);

export const PROJECT_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && slug.current == $slug && enabled != false][0]{
    ...${PROJECT_CARD_FRAGMENT},
    role, duration, tools, team, client, year,
    seo ${SEO_FRAGMENT},
    body[]{
      ...,
      markDefs[]{ ... },
      _type == "pteImage" => { image ${IMAGE_FRAGMENT} },
      _type == "imageGrid" => { images[] ${IMAGE_FRAGMENT} },
      _type == "imageStrip" => { images[] ${IMAGE_FRAGMENT} },
      _type == "beforeAfter" => { before ${IMAGE_FRAGMENT}, after ${IMAGE_FRAGMENT} }
    },
    "related": *[_type == "project" && enabled != false && kind != "project" && slug.current != $slug] | order(order asc)[0...2] ${PROJECT_CARD_FRAGMENT}
  }
`);

export const PROJECT_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && enabled != false && kind != "project" && defined(slug.current)]{ "slug": slug.current }
`);

export const SITEMAP_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && enabled != false && kind != "project" && defined(slug.current) && seo.noIndex != true]{
    "slug": slug.current,
    _updatedAt
  }
`);

export const CONTACT_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_id == "siteSettings"][0]{ email, name }
`);
