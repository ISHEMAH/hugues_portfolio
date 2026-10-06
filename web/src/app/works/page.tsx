import type { Metadata } from "next";
import { getSiteSettings, getWorksPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { fallbackContactSection } from "@/data/fallback";
import { Contact } from "@/components/home/Contact";
import { WorksHeader } from "@/components/works/WorksHeader";
import { CaseStudiesGrid, OtherWorksGrid } from "@/components/works/WorksGrid";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getWorksPage()]);
  return buildMetadata(settings, page.seo, `Works | ${settings.name}`, "/works");
}

export default async function WorksPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getWorksPage()]);
  return (
    <>
      <WorksHeader heading={page.heading} subheading={page.subheading} />
      <CaseStudiesGrid projects={page.caseStudies} />
      {page.showOtherWorks && <OtherWorksGrid projects={page.otherWorks} heading={page.otherWorksHeading} subheading={page.otherWorksSubheading} />}
      {page.showContact && fallbackContactSection.type === "contact" && <Contact section={fallbackContactSection} settings={settings} />}
    </>
  );
}
