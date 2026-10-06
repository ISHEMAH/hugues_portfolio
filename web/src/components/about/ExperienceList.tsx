import type { Experience } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { Logo } from "./Logo";

function ExperienceCard({ item, index }: { item: Experience; index: number }) {
  const multi = item.roles.length > 1;
  const primaryRole = item.roles[0];
  return (
    <Reveal delay={index * 0.06} className="flex flex-col gap-4 border-b border-black/10 pb-6 last:border-b-0 last:pb-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-2.5">
        <div className="flex flex-1 items-start gap-2.5">
          <Logo image={item.logo} name={item.company} />
          <div className="flex flex-col gap-0.5">
            <h5 className="t-card text-ink">{item.company}</h5>
            {primaryRole && !multi && <p className="text-base text-ash">{primaryRole.title}</p>}
            {multi && <p className="text-base text-ash">{item.roles.length} roles</p>}
            {(item.employmentType || item.location) && (
              <p className="text-sm text-mist">{[item.employmentType, item.location].filter(Boolean).join(" · ")}</p>
            )}
          </div>
        </div>
        <p className="shrink-0 text-lg text-ink-soft md:text-right">{item.period}</p>
      </div>

      {multi && (
        <ol className="flex flex-col pl-0 md:pl-[60px]">
          {item.roles.map((role, i) => (
            <li key={role.title + i} className="flex items-stretch gap-2.5">
              <span className="flex w-[50px] shrink-0 flex-col items-center">
                <span className={`w-px flex-1 ${i === 0 ? "bg-transparent" : "bg-silver"}`} />
                <span className="my-1 h-3 w-3 rounded-full bg-accent" />
                <span className={`w-px flex-1 ${i === item.roles.length - 1 ? "bg-transparent" : "bg-silver"}`} />
              </span>
              <div className="flex flex-1 flex-col py-4">
                <p className="text-base font-semibold text-ink-soft">{role.title}</p>
                <p className="text-sm text-graphite">{role.period}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {item.highlights.length > 0 && (
        <ul className="flex max-w-[62ch] list-disc flex-col gap-1.5 pl-5 text-sm leading-[1.6] text-graphite md:pl-[80px] md:[list-style-position:outside]">
          {item.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}

export function ExperienceList({ items }: { items: Experience[] }) {
  return (
    <div className="flex flex-col gap-6">
      {items.map((item, i) => (
        <ExperienceCard key={item.id} item={item} index={i} />
      ))}
    </div>
  );
}
