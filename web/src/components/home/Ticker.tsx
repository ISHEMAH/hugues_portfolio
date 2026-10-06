import type { TickerSection } from "@/lib/types";
import { Marquee } from "@/components/ui/Marquee";

export function Ticker({ section }: { section: TickerSection }) {
  if (!section.items.length) return null;
  return (
    <div className="w-full">
      <div className="container-1440 frame-x border-b border-line bg-cream">
        <Marquee duration={Math.max(20, section.items.length * 5)} gap={0} className="h-16 md:h-[90px]">
          {section.items.map((item, i) => (
            <div key={item + i} className="flex h-16 items-center gap-4 px-6 md:h-[90px]">
              <span className="block h-3 w-3 rounded-full bg-red" />
              <span className="t-eyebrow whitespace-nowrap text-ink">{item}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
