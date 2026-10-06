import type { Metadata } from "next";
import { Inter, Merriweather, Merriweather_Sans, Space_Grotesk } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import "./globals.css";
import { SanityLive } from "@/sanity/live";
import { isSanityConfigured } from "@/sanity/env";
import { getSiteSettings } from "@/lib/content";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FilmGrain } from "@/components/layout/FilmGrain";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { DisableDraftMode } from "@/components/layout/DisableDraftMode";

const merriweather = Merriweather({ subsets: ["latin"], weight: ["400", "500", "700"], style: ["normal", "italic"], variable: "--font-merriweather", display: "swap" });
const merriweatherSans = Merriweather_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-merriweather-sans", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-space-grotesk", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-inter", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return { metadataBase: new URL(siteUrl), ...buildMetadata(settings) };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  const { isEnabled: isDraft } = await draftMode();

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${merriweather.variable} ${merriweatherSans.variable} ${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <SmoothScroll enabled={settings.effects.smoothScroll}>
          <Navbar name={settings.name} links={settings.navLinks} availability={settings.availability} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </SmoothScroll>
        {settings.effects.filmGrain && <FilmGrain />}
        {isSanityConfigured && <SanityLive />}
        {isDraft && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
      </body>
    </html>
  );
}
