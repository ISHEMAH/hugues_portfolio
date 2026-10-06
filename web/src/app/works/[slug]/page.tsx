import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getProjectSlugs, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { fallbackContactSection } from "@/data/fallback";
import { Contact } from "@/components/home/Contact";
import { CaseHeader } from "@/components/case/CaseHeader";
import { CaseBody, extractToc } from "@/components/case/CaseBody";
import { TableOfContents } from "@/components/case/TableOfContents";
import { RecentWorks } from "@/components/case/RecentWorks";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [settings, project] = await Promise.all([getSiteSettings(), getProject(slug)]);
  if (!project) return {};
  return buildMetadata(
    settings,
    { ...project.seo, description: project.seo?.description ?? project.shortDescription, image: project.seo?.image ?? project.cover ?? project.thumbnail },
    `${project.title} | ${settings.name}`,
    `/works/${slug}`,
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [settings, project] = await Promise.all([getSiteSettings(), getProject(slug)]);
  if (!project) notFound();

  const toc = extractToc(project.body);
  const hasBody = Boolean(project.body?.length);

  return (
    <>
      <CaseHeader project={project} />
      {hasBody && (
        <div className="w-full">
          <div className="container-1440 frame-x flex flex-col items-start lg:flex-row">
            {toc.length > 1 && (
              <aside className="w-full px-4 pt-10 lg:sticky lg:top-[100px] lg:w-[300px] lg:shrink-0 lg:px-8 lg:pt-16">
                <TableOfContents entries={toc} />
              </aside>
            )}
            <article id="content" className="w-full flex-1 px-4 py-10 md:px-16 md:py-16">
              <CaseBody body={project.body!} />
            </article>
          </div>
        </div>
      )}
      <RecentWorks projects={project.related} />
      {fallbackContactSection.type === "contact" && <Contact section={fallbackContactSection} settings={settings} />}
    </>
  );
}
