"use client";

import { useMemo, useState } from "react";
import { getDailyVerse } from "@/data/daily-verses";

function shareMessage(entry) {
  return `Palabra del Día — ${entry.reference}\n\n“${entry.verse}”\n\n${entry.explanation}\n\nRD Al Día 🇩🇴`;
}

function dateLabel(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export default function DailyVerse({ variant = "full" }) {
  const entry = useMemo(() => getDailyVerse(), []);
  const [copied, setCopied] = useState(false);

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(shareMessage(entry))}`;

  function shareFacebook() {
    const url = encodeURIComponent(`${window.location.origin}/palabra-del-dia`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener,noreferrer");
  }

  async function copyVerse() {
    try {
      await navigator.clipboard.writeText(shareMessage(entry));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const compact = variant === "teaser";

  return (
    <article
      className={`animate-verse-in relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white shadow-card ${
        compact ? "p-6" : "p-6 sm:p-8"
      }`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-gold/15 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-10 size-48 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 64 64"
        className="absolute right-5 top-5 size-10 text-gold/40 sm:size-12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M32 6v52M18 22h28"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M32 10c8 6 14 8 22 8"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.5"
        />
        <path
          d="M32 14c-8 5-14 7-22 7"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.5"
        />
      </svg>

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Palabra del Día
          </p>
          <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-gold">
            {entry.theme}
          </span>
        </div>
        <p className="mt-2 text-xs capitalize text-white/65">{dateLabel(entry.iso)}</p>

        <blockquote
          className={`mt-5 font-heading leading-relaxed text-gold ${
            compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
          }`}
        >
          “{entry.verse}”
        </blockquote>
        <p className="mt-3 text-sm italic text-white/80">{entry.reference}</p>

        {compact ? (
          <a
            href="/palabra-del-dia"
            className="mt-5 inline-block text-sm font-semibold text-gold underline-offset-2 hover:underline"
          >
            Leer la reflexión
          </a>
        ) : (
          <>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-white/85 sm:text-base">
              {entry.explanation}
            </p>
            <p className="mt-3 text-xs text-white/45">Reina-Valera</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#a30e26]"
              >
                WhatsApp
              </a>
              <button
                type="button"
                onClick={shareFacebook}
                className="inline-flex items-center rounded-md border border-white/30 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Facebook
              </button>
              <button
                type="button"
                onClick={copyVerse}
                className="inline-flex items-center rounded-md border border-gold/50 px-4 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10"
              >
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
