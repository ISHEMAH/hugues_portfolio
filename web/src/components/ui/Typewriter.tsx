"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
  pauseBeforeNext?: number;
  className?: string;
  cursorClassName?: string;
};

/** Types each word, pauses, deletes it and moves on, with a blinking cursor. */
export function Typewriter({
  words,
  typeSpeed = 80,
  deleteSpeed = 50,
  pause = 1400,
  pauseBeforeNext = 400,
  className,
  cursorClassName,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const word = words[index % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      timeout = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }, pauseBeforeNext);
    } else {
      timeout = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? deleteSpeed : typeSpeed,
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause, pauseBeforeNext]);

  return (
    <span className={className} aria-label={words.join(", ")}>
      <span aria-hidden>{text}</span>
      <span aria-hidden className={`inline-block animate-blink font-light ${cursorClassName ?? ""}`}>
        |
      </span>
    </span>
  );
}
