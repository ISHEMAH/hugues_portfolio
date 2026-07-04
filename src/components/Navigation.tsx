"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, personalInfo } from "@/data/portfolio";
import { BrutalistButton } from "./BrutalistButton";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 h-20 border-b border-brutal-white bg-brutal-black transition-colors ${
        scrolled ? "bg-brutal-black/95" : ""
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-4 md:px-8">
        <a href="#home" className="font-mono text-sm font-bold uppercase">
          <span className="text-brutal-green">&gt;</span> {personalInfo.shortName}
          <span className="animate-blink text-brutal-green">_</span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link-brutal px-3 py-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <BrutalistButton href={`mailto:${personalInfo.email}`}>
            EXECUTE_REQUEST.EXE
          </BrutalistButton>
        </div>

        <button
          type="button"
          className="border border-brutal-white p-2 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="border-b border-brutal-white bg-brutal-black lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
          >
            <nav className="flex flex-col p-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="nav-link-brutal border-b border-brutal-grid px-3 py-4"
                  onClick={() => setMobileOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="mt-4">
                <BrutalistButton href={`mailto:${personalInfo.email}`}>
                  EXECUTE_REQUEST.EXE
                </BrutalistButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
