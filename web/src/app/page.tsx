import type { Metadata } from "next";
import { getHomePage, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { HomeSections } from "@/components/home/HomeSections";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const home = await getHomePage(settings);
  return buildMetadata(settings, home.seo, undefined, "/");
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const home = await getHomePage(settings);
  return <HomeSections sections={home.sections} settings={settings} />;
}
