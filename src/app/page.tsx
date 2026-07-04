import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { DataBar } from "@/components/DataBar";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Skills } from "@/components/Skills";
import { EducationSection } from "@/components/EducationSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <DataBar />
        <About />
        <Experience />
        <Projects />
        <ServicesGrid />
        <Skills />
        <EducationSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
