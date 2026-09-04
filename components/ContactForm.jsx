"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

const SUBJECTS = [
  "Corrección o dato",
  "Publicidad",
  "Prensa o alianza",
  "Sugerencia",
  "Privacidad",
  "Otro",
];

function formspreeUrl() {
  const id = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  if (!id) return "";
  if (id.startsWith("http")) return id;
  return `https://formspree.io/f/${id}`;
}

export default function ContactForm() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const endpoint = formspreeUrl();

    if (!endpoint) {
      setStatus("error");
      setMessage(
        `El formulario aún no está conectado. Escríbenos a ${CONTACT_EMAIL}.`,
      );
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "No se pudo enviar el mensaje.");
      }

      form.reset();
      setStatus("success");
      setMessage("Gracias. Recibimos tu mensaje y te responderemos pronto.");
    } catch {
      setStatus("error");
      setMessage(
        `No se pudo enviar. Inténtalo de nuevo o escribe a ${CONTACT_EMAIL}.`,
      );
    }
  }

  const inputClass =
    "w-full rounded-md border border-edge bg-background px-3 py-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:bg-surface";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-heading">
          Nombre
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            maxLength={80}
            className={`mt-1.5 ${inputClass}`}
          />
        </label>
        <label className="block text-sm font-medium text-heading">
          Correo
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            maxLength={120}
            className={`mt-1.5 ${inputClass}`}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-heading">
        Asunto
        <select name="subject" required defaultValue="" className={`mt-1.5 ${inputClass}`}>
          <option value="" disabled>
            Elige un asunto
          </option>
          {SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-heading">
        Mensaje
        <textarea
          name="message"
          required
          rows={6}
          minLength={20}
          maxLength={4000}
          className={`mt-1.5 resize-y ${inputClass}`}
        />
      </label>

      <p className="hidden" aria-hidden="true">
        <label>
          Sitio web
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando…" : "Enviar mensaje"}
      </Button>

      {message ? (
        <p
          className={`text-sm ${status === "success" ? "text-emerald-700 dark:text-emerald-400" : "text-accent"}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
