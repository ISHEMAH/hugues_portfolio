"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { animate, type JSAnimation } from "animejs";
import { motion, AnimatePresence } from "framer-motion";

interface BrutalistImageProps {
  src: string;
  alt: string;
  label?: string;
  containerClassName?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  height?: number;
}

export function BrutalistImage({
  src,
  alt,
  label = "ASSET",
  containerClassName = "",
  imageClassName = "object-cover object-top",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  fill = true,
}: BrutalistImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const gsapCtx = useRef<gsap.Context | null>(null);
  const percentAnim = useRef<JSAnimation | null>(null);

  const startLoaderAnimations = useCallback(() => {
    gsapCtx.current?.revert();
    percentAnim.current?.pause();

    gsapCtx.current = gsap.context(() => {
      gsap.fromTo(
        scanlineRef.current,
        { top: "-4px" },
        { top: "100%", duration: 1.4, repeat: -1, ease: "none" }
      );

      gsap.to(progressBarRef.current, {
        width: "88%",
        duration: 1.8,
        ease: "steps(8)",
        repeat: -1,
        yoyo: true,
      });

      if (blocksRef.current) {
        gsap.from(blocksRef.current.children, {
          opacity: 0.15,
          duration: 0.3,
          stagger: 0.06,
          repeat: -1,
          yoyo: true,
          ease: "steps(2)",
        });
      }
    }, loaderRef);

    const counter = { val: 0 };
    percentAnim.current = animate(counter, {
      val: 97,
      duration: 2200,
      ease: "linear",
      loop: true,
      alternate: true,
      onUpdate: () => {
        if (percentRef.current) {
          percentRef.current.textContent = `${Math.round(counter.val).toString().padStart(2, "0")}%`;
        }
      },
    });
  }, []);

  const finishLoading = useCallback(() => {
    gsapCtx.current?.revert();
    percentAnim.current?.pause();

    if (percentRef.current) percentRef.current.textContent = "100%";
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, { width: "100%", duration: 0.15, ease: "steps(2)" });
    }

    setTimeout(() => setStatus("loaded"), 120);
  }, []);

  useEffect(() => {
    if (status !== "loading") return;
    startLoaderAnimations();
    return () => {
      gsapCtx.current?.revert();
      percentAnim.current?.pause();
    };
  }, [status, startLoaderAnimations]);

  const handleLoad = () => finishLoading();
  const handleError = () => {
    gsapCtx.current?.revert();
    percentAnim.current?.pause();
    setStatus("error");
  };

  if (status === "error") {
    return (
      <div
        className={`preview-not-found flex items-center justify-center ${containerClassName}`}
      >
        <span className="font-mono text-[10px] text-brutal-muted">
          [{label.toUpperCase().replace(/\s/g, "_")}_NOT_FOUND]
        </span>
      </div>
    );
  }

  return (
    <div className={`preview-not-found relative overflow-hidden ${containerClassName}`}>
      <AnimatePresence>
        {status === "loading" && (
          <motion.div
            ref={loaderRef}
            key="loader"
            className="absolute inset-0 z-10 flex flex-col justify-between bg-brutal-black p-3"
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2, ease: "linear" }}
          >
            <div className="flex items-center justify-between font-mono text-[9px] uppercase">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 animate-pulse-green bg-brutal-green" />
                <span className="text-brutal-green">LOADING</span>
              </span>
              <span className="text-brutal-muted">{label}</span>
            </div>

            <div ref={blocksRef} className="grid grid-cols-8 gap-1 py-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="h-3 border border-brutal-grid bg-brutal-grid/40" />
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[9px]">
                <span className="text-brutal-muted">DECODING_BUFFER...</span>
                <span ref={percentRef} className="text-brutal-green">
                  00%
                </span>
              </div>
              <div className="h-1.5 border border-brutal-white bg-brutal-black">
                <div
                  ref={progressBarRef}
                  className="h-full w-0 bg-brutal-green"
                  style={{ transitionTimingFunction: "steps(2)" }}
                />
              </div>
            </div>

            <div
              ref={scanlineRef}
              className="pointer-events-none absolute left-0 h-px w-full bg-white/20"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative h-full w-full bg-brutal-black"
        initial={{ opacity: 0, filter: "brightness(2) contrast(1.5)" }}
        animate={
          status === "loaded"
            ? { opacity: 1, filter: "brightness(1) contrast(1)" }
            : { opacity: 0 }
        }
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          className={imageClassName}
          sizes={sizes}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
        />
      </motion.div>
    </div>
  );
}
