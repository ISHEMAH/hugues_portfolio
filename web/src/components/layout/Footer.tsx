import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { ArrowUpRightIcon, SocialGlyph, socialLabels } from "@/components/ui/icons";
import { TextCycle } from "./TextCycle";

export function Footer({ settings }: { settings: SiteSettings }) {
  const { footer, socials, location, copyright, name, email } = settings;
  const year = new Date().getFullYear();
  return (
    <footer className="bg-charcoal px-4 py-8 text-white md:px-8">
      <div className="container-1200 flex flex-col gap-12 py-10 md:py-16 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex flex-1 flex-col gap-10 md:flex-row md:gap-9">
          <h2 className="t-h2 max-w-[600px] flex-1 text-white">
            <span className="block">
              {footer.prefix}{" "}
              <TextCycle words={footer.cycleWords.length ? footer.cycleWords : ["design"]} className="text-accent-soft" />
            </span>
            <span className="block text-[#5f5f5c]">{footer.suffix}</span>
          </h2>
          <ul className="flex flex-col gap-6 md:gap-8">
            {footer.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="group inline-flex items-center gap-1.5 text-lg text-white">
                  <span>{link.label}</span>
                  <span className="relative block h-6 w-6 overflow-hidden">
                    <ArrowUpRightIcon className="absolute inset-0 h-6 w-6 transition-transform duration-300 ease-out-expo group-hover:translate-x-6 group-hover:-translate-y-6" />
                    <ArrowUpRightIcon className="absolute inset-0 h-6 w-6 -translate-x-6 translate-y-6 transition-transform duration-300 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <ul className="flex w-full max-w-[500px] flex-col gap-8">
          {socials.length > 0 && (
            <li className="flex flex-col gap-1.5">
              <p className="text-base text-fog">Social</p>
              <div className="flex flex-wrap items-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.platform + social.url}
                    href={social.url}
                    target={social.url.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={socialLabels[social.platform]}
                    className="grid h-10 w-10 place-items-center rounded-[10px] text-white transition-colors hover:bg-white/10"
                  >
                    <SocialGlyph platform={social.platform} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </li>
          )}
          {location && (
            <li className="flex flex-col">
              <p className="text-base text-fog">Location</p>
              <p className="text-lg text-white">{location}</p>
            </li>
          )}
          {email && (
            <li className="flex flex-col">
              <p className="text-base text-fog">Email</p>
              <a href={`mailto:${email}`} className="text-lg text-white underline-offset-4 hover:underline">
                {email}
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="container-1200 border-t border-white/10 pt-6 text-sm text-fog">
        <p>{copyright || `© ${year} ${name}. All rights reserved.`}</p>
      </div>
    </footer>
  );
}
