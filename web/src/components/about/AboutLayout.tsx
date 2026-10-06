import type { ReactNode } from "react";
import { SplitText } from "@/components/ui/SplitText";

/** The sand-coloured 1000px "Layout" card that wraps every about section. */
export function AboutLayout({ id, heading, children }: { id?: string; heading: string; children: ReactNode }) {
  return (
    <section id={id} className="w-full scroll-mt-[80px]">
      <div className="container-1440 frame-x px-4 py-6 md:px-16">
        <div className="container-1000 flex flex-col gap-8 bg-sand p-6 md:gap-11 md:p-16">
          <h3 className="t-h3 text-ink">
            <SplitText text={heading} mode="letters" stagger={0.025} />
          </h3>
          {children}
        </div>
      </div>
    </section>
  );
}
