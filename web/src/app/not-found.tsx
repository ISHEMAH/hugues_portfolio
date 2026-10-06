import type { Metadata } from "next";
import { BlockGame } from "@/components/game/BlockGame";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found | Ishema Hugues",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const settings = await getSiteSettings();
  return <BlockGame mascot={settings.mascot} />;
}
