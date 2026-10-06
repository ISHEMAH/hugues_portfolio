import type { Project } from "@/lib/types";
import { SplitText } from "@/components/ui/SplitText";
import { ProjectCard } from "./ProjectCard";

export function CaseStudiesGrid({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  return (
    <section id="case-studies" className="w-full scroll-mt-[80px]">
      <div className="container-1440 frame-x px-4 pb-16 md:px-16">
        <div className="container-1200 grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function OtherWorksGrid({ projects, heading, subheading }: { projects: Project[]; heading?: string; subheading?: string }) {
  if (!projects.length) return null;
  return (
    <section id="other-works" className="w-full scroll-mt-[80px] border-t border-line">
      <div className="container-1440 frame-x px-4 py-16 md:px-16">
        <div className="container-1200 flex flex-col gap-10">
          <div className="flex flex-col items-center gap-2 text-center">
            {heading && (
              <h2 className="t-h2 text-ink-dark">
                <SplitText text={heading} mode="letters" stagger={0.03} />
              </h2>
            )}
            {subheading && (
              <p className="t-eyebrow text-ash">
                <SplitText text={subheading} mode="words" />
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} overlayLabel="View Project" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
