import type { HomeSection, SiteSettings } from "@/lib/types";
import { Bento } from "./Bento";
import { Contact } from "./Contact";
import { Faq } from "./Faq";
import { Hero } from "./Hero";
import { Services } from "./Services";
import { Skills } from "./Skills";
import { Testimonials } from "./Testimonials";
import { Ticker } from "./Ticker";
import { Works } from "./Works";

export function HomeSections({ sections, settings }: { sections: HomeSection[]; settings: SiteSettings }) {
  return (
    <>
      {sections
        .filter((s) => s.enabled)
        .map((section) => {
          switch (section.type) {
            case "hero":
              return <Hero key={section.key} section={section} mascot={settings.mascot} />;
            case "ticker":
              return <Ticker key={section.key} section={section} />;
            case "services":
              return <Services key={section.key} section={section} />;
            case "works":
              return <Works key={section.key} section={section} />;
            case "skills":
              return <Skills key={section.key} section={section} />;
            case "bento":
              return <Bento key={section.key} section={section} />;
            case "testimonials":
              return <Testimonials key={section.key} section={section} />;
            case "faq":
              return <Faq key={section.key} section={section} />;
            case "contact":
              return <Contact key={section.key} section={section} settings={settings} />;
            default:
              return null;
          }
        })}
    </>
  );
}
