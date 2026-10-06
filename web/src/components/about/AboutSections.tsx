import type { AboutSection, SiteSettings } from "@/lib/types";
import { Contact } from "@/components/home/Contact";
import { AboutLayout } from "./AboutLayout";
import { CertificationList, EducationList } from "./EducationList";
import { ExperienceList } from "./ExperienceList";
import { Hobbies } from "./Hobbies";
import { SkillGroups } from "./SkillGroups";

export function AboutSections({ sections, settings }: { sections: AboutSection[]; settings: SiteSettings }) {
  return (
    <>
      {sections
        .filter((s) => s.enabled)
        .map((section) => {
          switch (section.type) {
            case "experience":
              return section.items.length ? (
                <AboutLayout key={section.key} id="experience" heading={section.heading}>
                  <ExperienceList items={section.items} />
                </AboutLayout>
              ) : null;
            case "education":
              return section.items.length ? (
                <AboutLayout key={section.key} id="educations" heading={section.heading}>
                  <EducationList items={section.items} />
                </AboutLayout>
              ) : null;
            case "certifications":
              return section.items.length ? (
                <AboutLayout key={section.key} id="certifications" heading={section.heading}>
                  <CertificationList items={section.items} />
                </AboutLayout>
              ) : null;
            case "skillGroups":
              return section.groups.length ? (
                <AboutLayout key={section.key} id="skills" heading={section.heading}>
                  <SkillGroups groups={section.groups} />
                </AboutLayout>
              ) : null;
            case "hobbies":
              return section.items.length ? (
                <AboutLayout key={section.key} id="hobbies" heading={section.heading}>
                  <Hobbies items={section.items} />
                </AboutLayout>
              ) : null;
            case "contact":
              return <Contact key={section.key} section={section} settings={settings} />;
            default:
              return null;
          }
        })}
    </>
  );
}
