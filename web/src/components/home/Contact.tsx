import type { ContactSection, SiteSettings } from "@/lib/types";
import { Mascot } from "@/components/mascot/Mascot";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { ContactForm } from "./ContactForm";

export function Contact({ section, settings }: { section: ContactSection; settings: SiteSettings }) {
  return (
    <section id="contact-form" className="w-full scroll-mt-[60px]">
      <div className="container-1440 frame-x px-4 py-16 md:px-16">
        <article className="container-1200 relative overflow-hidden rounded-xl bg-accent/10 p-5 md:p-16">
          <Reveal>
            <div className="flex flex-col-reverse gap-10 lg:flex-row lg:items-center lg:gap-16">
              <ContactForm submitLabel={section.submitLabel} successMessage={section.successMessage} className="relative w-full lg:w-[524px] lg:shrink-0" />
              <div className="flex flex-1 flex-col gap-5">
                {/* The robot listens to the form: it nods when you send, celebrates a delivery and sulks on errors. */}
                <Mascot
                  settings={settings.mascot}
                  channel="contact"
                  mood="greeter"
                  palette="dark"
                  framing="bust"
                  idleEvery={[14, 26]}
                  collapse
                  label="Robot mascot that reacts to the contact form"
                  className="group hidden h-[250px] w-full max-w-[400px] lg:block"
                >
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-[58%] h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(234,108,17,0.22),transparent_75%)] blur-2xl transition-opacity duration-1000 group-data-[mascot-state=loading]:animate-pulse"
                  />
                </Mascot>
                <h3 className="t-h3 text-ink">
                  <SplitText text={section.heading} mode="words" />
                </h3>
                {section.description && <p className="t-body-lg text-graphite">{section.description}</p>}
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ash">
                  {settings.email && (
                    <li>
                      <a href={`mailto:${settings.email}`} className="underline-offset-4 hover:text-ink hover:underline">
                        {settings.email}
                      </a>
                    </li>
                  )}
                  {settings.phone && (
                    <li>
                      <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="underline-offset-4 hover:text-ink hover:underline">
                        {settings.phone}
                      </a>
                    </li>
                  )}
                  {settings.whatsapp && (
                    <li>
                      <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-ink hover:underline">
                        WhatsApp
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </Reveal>
        </article>
      </div>
    </section>
  );
}
