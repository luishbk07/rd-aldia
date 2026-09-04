"use client";

import { useId, useState } from "react";

const SUBSCRIBED_KEY = "rd-newsletter-subscribed";

export function markNewsletterSubscribed() {
  try {
    localStorage.setItem(SUBSCRIBED_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function hasNewsletterSubscription() {
  try {
    return localStorage.getItem(SUBSCRIBED_KEY) === "1";
  } catch {
    return false;
  }
}

export default function NewsletterForm({
  variant = "default",
  id,
  onSuccess,
}) {
  const autoId = useId();
  const fieldId = id || `newsletter-email-${autoId}`;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const footer = variant === "footer";

  async function onSubmit(event) {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setStatus("error");
      setMessage("Escribe un correo.");
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value,
          website: event.currentTarget.elements.website?.value || "",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "No se pudo suscribir.");
      }
      markNewsletterSubscribed();
      setEmail("");
      setStatus("success");
      setMessage(data.message || "Listo. Te escribiremos lo esencial de RD.");
      onSuccess?.();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Error de red.");
    }
  }

  const inputClass = footer
    ? "h-11 w-full rounded-md border border-white/15 bg-white/8 px-3 text-sm text-white placeholder:text-white/45 outline-none ring-rd-red/40 focus:ring-2"
    : "h-11 w-full rounded-md border border-edge bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:bg-surface";

  const buttonClass = footer
    ? "h-11 shrink-0 rounded-md bg-rd-red px-4 text-sm font-semibold text-white transition-colors hover:bg-[#a30e26] disabled:opacity-50"
    : "h-11 shrink-0 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-[#00264d] disabled:opacity-50 dark:bg-gold dark:text-heading";

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <label htmlFor={fieldId} className="sr-only">
        Correo electrónico
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={fieldId}
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "sending") {
              setStatus("idle");
              setMessage("");
            }
          }}
          placeholder="tu@correo.com"
          className={inputClass}
        />
        <button type="submit" disabled={status === "sending"} className={buttonClass}>
          {status === "sending" ? "Enviando…" : "Suscribirse"}
        </button>
      </div>
      <p className="hidden" aria-hidden="true">
        <label>
          Sitio web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <p
        className={`text-xs leading-5 ${
          status === "error"
            ? footer
              ? "text-[#ffb3bf]"
              : "text-accent"
            : status === "success"
              ? footer
                ? "text-emerald-200"
                : "text-emerald-700 dark:text-emerald-400"
              : footer
                ? "text-white/60"
                : "text-muted"
        }`}
        aria-live="polite"
      >
        {message ||
          (footer
            ? "Recibe combustible, dólar y titulares. Puedes darte de baja cuando quieras."
            : "Un correo al día. Sin spam. Nos tomamos en serio tu bandeja.")}
      </p>
    </form>
  );
}
