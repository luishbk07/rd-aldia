"use client";

import { useEffect, useState } from "react";
import NewsletterForm, { hasNewsletterSubscription } from "./NewsletterForm";

const DISMISS_KEY = "rd-newsletter-dismissed";
const DELAY_MS = 30_000;

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasNewsletterSubscription()) return undefined;
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return undefined;
    } catch {
      /* private mode */
    }

    const id = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private mode */
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-heading/50 backdrop-blur-[2px]"
        aria-label="Cerrar boletín"
        onClick={dismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-popup-title"
        className="relative z-1 w-full max-w-md rounded-2xl border border-edge bg-surface p-5 shadow-card sm:p-6"
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 rounded-md px-2 py-1 text-sm font-semibold text-muted hover:bg-primary/8 hover:text-heading"
        >
          Cerrar
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Boletín
        </p>
        <h2
          id="newsletter-popup-title"
          className="mt-1 font-heading text-xl font-semibold text-heading"
        >
          Lo esencial de RD, en tu correo
        </h2>
        <p className="mt-2 mb-4 text-sm leading-6 text-muted">
          Combustible, dólar y titulares. Un envío, de lunes a domingo.
        </p>
        <NewsletterForm id="newsletter-popup-email" onSuccess={dismiss} />
      </div>
    </div>
  );
}
