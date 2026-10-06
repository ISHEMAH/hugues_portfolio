import Image from "@/components/ui/Image";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { Img, PortableTextValue } from "@/lib/types";
import { toImg, type SanityImageLike } from "@/lib/image";
import { slugify } from "@/lib/slug";
import { Marquee } from "@/components/ui/Marquee";
import { QuoteIcon } from "@/components/ui/icons";
import { BeforeAfter } from "./BeforeAfter";
import type { TocEntry } from "./TableOfContents";

type Block = PortableTextValue[number];

function blockText(block: Block): string {
  const children = block.children as Array<{ text?: string }> | undefined;
  return (children ?? []).map((c) => c.text ?? "").join("");
}

/** Headings (h2) become table-of-contents entries with stable ids. */
export function extractToc(body: PortableTextValue | undefined): TocEntry[] {
  if (!body) return [];
  const seen = new Map<string, number>();
  return body
    .filter((b) => b._type === "block" && b.style === "h2")
    .map((b) => {
      const text = blockText(b);
      let id = slugify(text) || "section";
      const count = seen.get(id) ?? 0;
      seen.set(id, count + 1);
      if (count) id = `${id}-${count + 1}`;
      return { id, text };
    });
}

function headingId(text: string, registry: Map<string, number>) {
  let id = slugify(text) || "section";
  const count = registry.get(id) ?? 0;
  registry.set(id, count + 1);
  if (count) id = `${id}-${count + 1}`;
  return id;
}

function Figure({ img, caption, wide }: { img?: Img; caption?: string; wide?: boolean }) {
  if (!img) return null;
  const ratio = img.width && img.height ? `${img.width} / ${img.height}` : "16 / 9";
  return (
    <figure className={`flex w-full flex-col gap-3 ${wide ? "max-w-none" : "max-w-[1000px]"}`}>
      <div className="relative w-full overflow-hidden rounded-xl bg-sand" style={{ aspectRatio: ratio }}>
        <Image src={img.src} alt={img.alt || caption || ""} fill sizes="(min-width: 1200px) 1000px, 92vw" className="object-cover" placeholder={img.lqip ? "blur" : "empty"} blurDataURL={img.lqip} />
      </div>
      {caption && <figcaption className="text-center text-sm text-mist">{caption}</figcaption>}
    </figure>
  );
}

function toEmbed(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export function CaseBody({ body }: { body: PortableTextValue }) {
  const registry = new Map<string, number>();

  const components: PortableTextComponents = {
    block: {
      h2: ({ children, value }) => (
        <h2 id={headingId(blockText(value as unknown as Block), registry)} className="t-h3 w-full max-w-[1000px] scroll-mt-[100px] pt-4 text-ink">
          {children}
        </h2>
      ),
      h3: ({ children }) => <h3 className="t-card w-full max-w-[1000px] pt-2 text-ink">{children}</h3>,
      h4: ({ children }) => <h4 className="t-title w-full max-w-[1000px] text-ink">{children}</h4>,
      normal: ({ children }) => <p className="t-body-lg w-full max-w-[1000px] text-graphite">{children}</p>,
      blockquote: ({ children }) => (
        <blockquote className="t-title w-full max-w-[1000px] border-l-2 border-accent pl-6 text-ink">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="t-body-lg flex w-full max-w-[1000px] list-disc flex-col gap-2 pl-6 text-graphite">{children}</ul>,
      number: ({ children }) => <ol className="t-body-lg flex w-full max-w-[1000px] list-decimal flex-col gap-2 pl-6 text-graphite">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      code: ({ children }) => <code className="rounded bg-sand px-1.5 py-0.5 font-inter text-[0.9em] text-ink">{children}</code>,
      link: ({ children, value }) => {
        const href = (value as { href?: string })?.href ?? "#";
        const newTab = (value as { newTab?: boolean })?.newTab ?? true;
        return (
          <a href={href} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined} className="text-accent underline underline-offset-4">
            {children}
          </a>
        );
      },
    },
    types: {
      pteImage: ({ value }) => {
        const v = value as { image?: SanityImageLike | Img; caption?: string; size?: string };
        return <Figure img={toImg(v.image)} caption={v.caption} wide={v.size === "wide"} />;
      },
      imageGrid: ({ value }) => {
        const v = value as { images?: Array<SanityImageLike | Img>; columns?: number };
        const imgs = (v.images ?? []).map((i) => toImg(i, 1000)).filter(Boolean) as Img[];
        return (
          <div className={`grid w-full max-w-[1000px] gap-4 ${v.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {imgs.map((img, i) => (
              <div key={img.src + i} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-sand">
                <Image src={img.src} alt={img.alt || ""} fill sizes="(min-width: 810px) 500px, 92vw" className="object-cover" />
              </div>
            ))}
          </div>
        );
      },
      imageStrip: ({ value }) => {
        const v = value as { images?: Array<SanityImageLike | Img> };
        const imgs = (v.images ?? []).map((i) => toImg(i, 900)).filter(Boolean) as Img[];
        if (!imgs.length) return null;
        const half = Math.ceil(imgs.length / 2);
        const rows = [imgs.slice(0, half), imgs.slice(half).length ? imgs.slice(half) : imgs.slice(0, half)];
        return (
          <div className="flex w-full flex-col gap-4">
            {rows.map((row, r) => (
              <Marquee key={r} duration={40} gap={16} reverse={r === 1}>
                {row.map((img, i) => (
                  <div key={img.src + i} className="relative h-[180px] w-[320px] overflow-hidden rounded bg-sand md:h-[244px] md:w-[434px]">
                    <Image src={img.src} alt={img.alt || ""} fill sizes="434px" className="object-cover" />
                  </div>
                ))}
              </Marquee>
            ))}
          </div>
        );
      },
      metricCards: ({ value }) => {
        const items = ((value as { items?: { _key?: string; value: string; label: string }[] }).items ?? []).slice(0, 4);
        if (!items.length) return null;
        return (
          <div className="grid w-full max-w-[1000px] grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((m, i) => (
              <div key={m._key ?? i} className="flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-lg bg-sand p-4 text-center">
                <p className="t-h3 text-accent">{m.value}</p>
                <p className="text-sm text-graphite">{m.label}</p>
              </div>
            ))}
          </div>
        );
      },
      beforeAfter: ({ value }) => {
        const v = value as { before?: SanityImageLike | Img; after?: SanityImageLike | Img; beforeLabel?: string; afterLabel?: string };
        const before = toImg(v.before, 1600);
        const after = toImg(v.after, 1600);
        if (!before || !after) return null;
        return (
          <div className="w-full max-w-[1000px]">
            <BeforeAfter before={before} after={after} beforeLabel={v.beforeLabel} afterLabel={v.afterLabel} />
          </div>
        );
      },
      callout: ({ value }) => {
        const v = value as { text: string; tone?: string };
        const tone = v.tone === "success" ? "bg-green-tint" : v.tone === "neutral" ? "bg-sand" : "bg-accent-tint";
        return (
          <div className={`w-full max-w-[1000px] rounded-lg p-6 md:p-8 ${tone}`}>
            <p className="t-title text-ink">{v.text}</p>
          </div>
        );
      },
      pullQuote: ({ value }) => {
        const v = value as { quote: string; author?: string; role?: string };
        return (
          <blockquote className="flex w-full max-w-[1000px] flex-col gap-4 rounded-xl bg-ink p-8 text-sand md:p-12">
            <QuoteIcon className="h-8 w-8 text-accent-soft" />
            <p className="t-card text-sand">{v.quote}</p>
            {(v.author || v.role) && (
              <footer className="text-sm text-fog">
                {v.author}
                {v.role ? ` · ${v.role}` : ""}
              </footer>
            )}
          </blockquote>
        );
      },
      videoEmbed: ({ value }) => {
        const v = value as { url: string; caption?: string };
        const src = toEmbed(v.url);
        if (!src) return null;
        return (
          <figure className="flex w-full max-w-[1000px] flex-col gap-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-ink">
              <iframe src={src} title={v.caption || "Video"} className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
            {v.caption && <figcaption className="text-center text-sm text-mist">{v.caption}</figcaption>}
          </figure>
        );
      },
    },
  };

  return (
    <div className="flex flex-col items-start gap-6">
      <PortableText value={body as never} components={components} />
    </div>
  );
}
