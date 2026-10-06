import type { Metadata } from "next";
import { getAboutPage, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutSections } from "@/components/about/AboutSections";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getAboutPage()]);
  return buildMetadata(settings, page.seo, `About | ${settings.name}`, "/about");
}

export default async function AboutPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getAboutPage()]);
  return (
    <>
      <AboutHero page={page} mascot={settings.mascot} />
      <div className="flex flex-col pb-10">
        <AboutSections sections={page.sections} settings={settings} />
      </div>
    </>
  );
}
