import { SplitText } from "@/components/ui/SplitText";

export function WorksHeader({ heading, subheading }: { heading: string; subheading?: string }) {
  return (
    <header className="w-full">
      <div className="container-1440 frame-x flex flex-col items-center gap-3 px-4 pt-[124px] pb-10 text-center md:px-16 md:pt-36 md:pb-14">
        <h1 className="t-h2 text-ink-dark">
          <SplitText text={heading} mode="letters" onMount stagger={0.03} />
        </h1>
        {subheading && (
          <p className="t-eyebrow text-graphite">
            <SplitText text={subheading} mode="words" onMount delay={0.4} />
          </p>
        )}
      </div>
    </header>
  );
}
