"use client";

import { BrutalistImage } from "./BrutalistImage";

interface ProjectPreviewProps {
  title: string;
  image?: string;
}

export function ProjectPreview({ title, image }: ProjectPreviewProps) {
  if (!image) {
    return (
      <div className="preview-not-found mb-6 flex aspect-[3/2] w-full items-center justify-center group-hover:border-brutal-black">
        <span className="font-mono text-[10px] text-brutal-muted group-hover:text-brutal-black/60">
          [{title.toUpperCase().replace(/\s/g, "_")}_PREVIEW]
        </span>
      </div>
    );
  }

  return (
    <div className="mb-6 w-full group-hover:[&_.preview-not-found]:border-brutal-black">
      <BrutalistImage
        src={image}
        alt={`${title} project preview`}
        label={title}
        containerClassName="aspect-[3/2] w-full bg-brutal-black"
        imageClassName="object-contain object-center"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
