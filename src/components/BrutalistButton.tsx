"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface BrutalistButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "light" | "dark";
  className?: string;
  external?: boolean;
}

export function BrutalistButton({
  href,
  onClick,
  children,
  variant = "light",
  className = "",
  external = false,
}: BrutalistButtonProps) {
  const baseClass = variant === "dark" ? "btn-brutalist-dark" : "btn-brutalist";

  const content = (
    <motion.span
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${baseClass} ${className}`}
    >
      {children}
    </motion.span>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button type="button" onClick={onClick} className="cursor-pointer">
      {content}
    </button>
  );
}
