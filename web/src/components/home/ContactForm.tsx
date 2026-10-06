"use client";

import { useState, type FormEvent } from "react";
import { emitMascot } from "@/lib/mascot/bus";

type ContactFormProps = {
  submitLabel: string;
  successMessage: string;
  className?: string;
};

type Status = { state: "idle" | "sending" | "success" | "error"; message?: string };

const inputClass =
  "w-full rounded-lg border border-silver bg-cream px-3 py-3 font-inter text-sm text-ink placeholder:text-pale outline-none transition-colors focus:border-ink focus:bg-white disabled:opacity-60";

export function ContactForm({ submitLabel, successMessage, className = "" }: ContactFormProps) {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ state: "sending" });
    emitMascot("contact", { type: "cue", cue: "nod" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setStatus({ state: "success", message: successMessage });
      emitMascot("contact", { type: "cue", cue: "celebrate" });
      form.reset();
    } catch (error) {
      setStatus({ state: "error", message: error instanceof Error ? error.message : "Something went wrong." });
      emitMascot("contact", { type: "cue", cue: "oops" });
    }
  }

  const sending = status.state === "sending";

  return (
    <form
      onSubmit={onSubmit}
      onFocus={() => emitMascot("contact", { type: "cue", cue: "attention" })}
      className={`flex flex-col gap-5 rounded-xl bg-white p-5 shadow-card ${className}`}
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="text-sm text-ink-soft">
          Name
        </label>
        <input id="contact-name" name="name" type="text" required minLength={2} maxLength={80} placeholder="Enter your name" className={inputClass} disabled={sending} autoComplete="name" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="text-sm text-ink-soft">
          Email
        </label>
        <input id="contact-email" name="email" type="email" required placeholder="Your official email" className={inputClass} disabled={sending} autoComplete="email" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-subject" className="text-sm text-ink-soft">
          Subject
        </label>
        <input id="contact-subject" name="subject" type="text" required maxLength={120} placeholder="Subject" className={inputClass} disabled={sending} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm text-ink-soft">
          Message
        </label>
        <textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={4} placeholder="Write your message here" className={`${inputClass} min-h-[100px] resize-y`} disabled={sending} />
      </div>
      {/* Honeypot: real people never see or fill this */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="flex h-10 w-full items-center justify-center rounded-[10px] bg-ink text-sm font-semibold text-white transition-colors hover:bg-ink-deep disabled:cursor-wait disabled:opacity-70"
      >
        {sending ? "Sending…" : submitLabel}
      </button>
      {status.state === "success" && (
        <p role="status" className="rounded-lg bg-green-tint px-3 py-2 text-sm text-green-ink">
          {status.message}
        </p>
      )}
      {status.state === "error" && (
        <p role="alert" className="rounded-lg bg-accent-tint px-3 py-2 text-sm text-red">
          {status.message}
        </p>
      )}
    </form>
  );
}
