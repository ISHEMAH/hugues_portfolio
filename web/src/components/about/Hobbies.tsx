import Image from "@/components/ui/Image";
import type { Img } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

export function Hobbies({ items }: { items: { label: string; image?: Img }[] }) {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((hobby, i) => (
        <Reveal key={hobby.label + i} delay={i * 0.06} className="flex flex-col items-center gap-3">
          <span className="relative h-[110px] w-[110px] overflow-hidden rounded-2xl bg-cream">
            {hobby.image && <Image src={hobby.image.src} alt={hobby.image.alt || hobby.label} fill sizes="110px" className="object-cover" />}
          </span>
          <span className="t-tag text-ash">{hobby.label}</span>
        </Reveal>
      ))}
    </ul>
  );
}
