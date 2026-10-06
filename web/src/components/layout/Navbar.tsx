"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Link as LinkType } from "@/lib/types";
import { Corners } from "@/components/ui/Corners";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";

type NavbarProps = {
  name: string;
  links: LinkType[];
  availability: { enabled: boolean; label: string };
};

export function Navbar({ name, links, availability }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0] || "/"));

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-cream"
    >
      <nav aria-label="Main" className="container-1440 flex h-[60px] items-stretch">
        <div className="flex items-center border-r border-line px-5">
          <Link href="/" className="font-serif text-2xl font-medium tracking-[-0.02em] text-ink">
            {name}
          </Link>
        </div>

        <ul className="hidden items-stretch md:flex">
          {links.map((link) => (
            <li key={link.href} className="flex border-r border-line">
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="group relative flex w-[123px] items-center justify-center overflow-visible px-4 text-ink transition-colors hover:bg-sand"
              >
                <span className="relative z-10 text-base">{link.label}</span>
                <span className="absolute inset-2 text-ink">
                  <Corners size={10} hoverOnly slide={false} />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-stretch">
          {availability.enabled && (
            <Link
              href="/#contact-form"
              className="hidden items-center gap-2.5 border-l border-line px-6 text-ink transition-colors hover:bg-sand md:flex"
            >
              <span className="grid h-4 w-4 place-items-center">
                <span className="block h-2 w-2 rounded-full bg-green animate-pulse-dot" />
              </span>
              <span className="text-base">{availability.label}</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex w-[60px] items-center justify-center border-l border-line text-ink md:hidden"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-cream md:hidden"
          >
            <ul className="flex flex-col">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="border-b border-line"
                >
                  <Link href={link.href} onClick={() => setOpen(false)} className="block px-5 py-4 font-serif text-2xl text-ink">
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              {availability.enabled && (
                <li>
                  <Link href="/#contact-form" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-5 py-4 text-ink">
                    <span className="block h-2 w-2 rounded-full bg-green" />
                    {availability.label}
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
