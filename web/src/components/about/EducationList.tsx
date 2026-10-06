import type { Certification, Education } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Logo } from "./Logo";

export function EducationList({ items }: { items: Education[] }) {
  return (
    <div className="flex flex-col gap-6">
      {items.map((item, i) => (
        <Reveal key={item.id} delay={i * 0.06} className="flex flex-col gap-3 border-b border-black/10 pb-6 last:border-b-0 last:pb-0">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-2.5">
            <div className="flex flex-1 items-start gap-2.5">
              <Logo image={item.logo} name={item.institution} />
              <div className="flex flex-col gap-0.5">
                <h5 className="t-card text-ink">{item.degree}</h5>
                <p className="text-base text-ash">{item.institution}</p>
              </div>
            </div>
            <p className="shrink-0 text-lg text-ink-soft md:text-right">{item.period}</p>
          </div>
          {item.description && <p className="max-w-[62ch] text-sm leading-[1.6] text-graphite md:pl-[60px]">{item.description}</p>}
        </Reveal>
      ))}
    </div>
  );
}

export function CertificationList({ items }: { items: Certification[] }) {
  return (
    <div className="flex flex-col gap-6">
      {items.map((item, i) => (
        <Reveal key={item.id} delay={i * 0.06} className="flex flex-col gap-3 border-b border-black/10 pb-6 last:border-b-0 last:pb-0 md:flex-row md:items-center md:gap-2.5">
          <div className="flex flex-1 items-start gap-2.5">
            <Logo image={item.logo} name={item.issuer} />
            <div className="flex flex-col gap-0.5">
              <h5 className="t-card text-ink">{item.title}</h5>
              <p className="text-base text-ash">{item.issuer}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:justify-end">
            {item.duration && <p className="text-lg text-ink-soft">{item.duration}</p>}
            {item.credentialUrl && (
              <a
                href={item.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1 text-base text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Show credential
                <ArrowUpRightIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
