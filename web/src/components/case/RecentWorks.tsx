import Image from "@/components/ui/Image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { ArrowUpRightIcon } from "@/components/ui/icons";

export function RecentWorks({ projects, heading = "Recent Case Studies" }: { projects: Project[]; heading?: string }) {
  if (!projects.length) return null;
  return (
    <section className="w-full border-t border-line">
      <div className="container-1440 frame-x flex flex-col items-center gap-10 px-4 py-16 md:px-16">
        <h3 className="t-h3 text-center text-ink">
          <SplitText text={heading} mode="letters" stagger={0.025} />
        </h3>
        <div className="container-1200 grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.slice(0, 2).map((project, i) => {
            const image = project.cover ?? project.thumbnail;
            return (
              <Reveal key={project.id} delay={i * 0.1}>
                <Link href={`/works/${project.slug}`} className="group flex flex-col gap-6">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-sand">
                    {image && (
                      <Image src={image.src} alt={image.alt || project.title} fill sizes="(min-width: 810px) 600px, 92vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]" />
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex flex-col gap-2">
                      <h5 className="t-card text-ink">{project.title}</h5>
                      {project.shortDescription && <p className="t-body text-graphite">{project.shortDescription}</p>}
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-stone text-ink transition-colors group-hover:bg-ink group-hover:text-white">
                      <ArrowUpRightIcon className="h-5 w-5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
