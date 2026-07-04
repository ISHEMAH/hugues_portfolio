import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ScanlineOverlay } from "@/components/ScanlineOverlay";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "ISHEMA HUGUES // PORTFOLIO",
  description:
    "Frontend Developer & UI Designer — crafting creative, user-friendly interfaces with React, TypeScript, Next.js, and modern design systems.",
  keywords: [
    "Hugues",
    "Ishema Hugues",
    "Frontend Developer",
    "UI Designer",
    "Product Designer",
    "Portfolio",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Ishema M. Hugues" }],
  openGraph: {
    title: "ISHEMA HUGUES // PORTFOLIO",
    description: "High-performance digital products. Industrial cyberpunk minimalism.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="relative min-h-screen overflow-x-hidden">
        <ScanlineOverlay />
        {children}
      </body>
    </html>
  );
}
