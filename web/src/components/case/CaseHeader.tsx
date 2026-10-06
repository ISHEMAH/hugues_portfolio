import Image from "@/components/ui/Image";
import type { Project } from "@/lib/types";
import { CornerButton } from "@/components/ui/CornerButton";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="t-label text-ash">{label}</p>
      <p className="text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

export function CaseHeader({ project }: { project: Project }) {
  const hasDetails = project.role || project.duration || project.tools || project.team || project.client || project.year || project.externalUrl;
  return (
    <header className="w-full">
      <div className="container-1440 frame-x pt-[60px]">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-1 flex-col gap-8 px-4 py-12 md:gap-11 md:px-16 md:py-16">
            <h1 className="t-h2 max-w-[808px] text-ink-dark">
              <SplitText text={project.title} mode="letters" onMount stagger={0.025} />
            </h1>
            {project.shortDescription && (
              <p className="t-body-lg max-w-[808px] text-ash">
                <SplitText text={project.shortDescription} mode="words" onMount delay={0.5} stagger={0.015} />
              </p>
            )}
          </div>
          {hasDetails && (
            <Reveal delay={0.3} className="flex flex-col gap-6 border-t border-line px-4 py-12 md:px-16 md:py-16 lg:w-[504px] lg:border-t-0 lg:border-l">
              <div className="grid grid-cols-2 gap-6">
                <Detail label="Role" value={project.role} />
                <Detail label="Duration" value={project.duration ?? project.timeline} />
                <Detail label="Tools" value={project.tools} />
                <Detail label="Team" value={project.team} />
                <Detail label="Client" value={project.client} />
                <Detail label="Year" value={project.year} />
              </div>
              {project.externalUrl && (
                <div>
                  <CornerButton href={project.externalUrl} newTab>
                    {project.externalLabel || "Visit live site"}
                  </CornerButton>
                </div>
              )}
            </Reveal>
          )}
        </div>
        {project.cover && (
          <Reveal y={0} className="relative w-full overflow-hidden border-t border-line" delay={0.2}>
            <div className="relative aspect-video w-full bg-sand">
              <Image
                src={project.cover.src}
                alt={project.cover.alt || project.title}
                fill
                priority
                sizes="(min-width: 1440px) 1440px, 100vw"
                className="object-cover"
                placeholder={project.cover.lqip ? "blur" : "empty"}
                blurDataURL={project.cover.lqip}
              />
            </div>
          </Reveal>
        )}
      </div>
    </header>
  );
}
