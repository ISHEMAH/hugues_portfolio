import Image from "@/components/ui/Image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { Corners } from "@/components/ui/Corners";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowUpRightIcon } from "@/components/ui/icons";

function Placeholder({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-sand to-stone">
      <span className="font-serif text-5xl font-medium text-ink/20">{title.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

export function ProjectCard({ project, index = 0, overlayLabel = "View Case Study" }: { project: Project; index?: number; overlayLabel?: string }) {
  const image = project.cover ?? project.thumbnail;
  const isPage = project.kind === "caseStudy";
  const href = isPage ? `/works/${project.slug}` : project.externalUrl;
  const external = !isPage && Boolean(project.externalUrl);

  const inner = (
    <>
      <div className="relative aspect-video w-full overflow-hidden bg-sand">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || project.title}
            fill
            priority={index < 2}
            sizes="(min-width: 1200px) 560px, (min-width: 810px) 45vw, 92vw"
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
            placeholder={image.lqip ? "blur" : "empty"}
            blurDataURL={image.lqip}
          />
        ) : (
          <Placeholder title={project.title} />
        )}
        {href && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="t-title inline-flex items-center gap-2 text-white">
              {overlayLabel}
              <ArrowUpRightIcon className="h-5 w-5" />
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 px-1 pb-1">
        <div className="flex items-start justify-between gap-4">
          <h5 className="t-card text-ink">{project.title}</h5>
          {project.category && <span className="shrink-0 rounded-full bg-stone px-3 py-1.5 text-xs font-semibold text-ink">{project.category}</span>}
        </div>
        {project.shortDescription && <p className="t-body text-graphite">{project.shortDescription}</p>}
      </div>
      <Corners hoverOnly slide={false} className="text-ink" />
    </>
  );

  const classes = "group relative flex flex-col gap-5 border border-line bg-cream p-4 transition-shadow duration-500 hover:shadow-card";

  return (
    <Reveal delay={(index % 3) * 0.08}>
      {href ? (
        external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
            {inner}
          </a>
        ) : (
          <Link href={href} className={classes}>
            {inner}
          </Link>
        )
      ) : (
        <div className={classes}>{inner}</div>
      )}
    </Reveal>
  );
}
