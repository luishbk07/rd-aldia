"use client";

import { useMemo } from "react";
import { CATEGORY_LABELS, getDailyFinancialTip } from "@/data/financial-tips";

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

function shareMessage(entry) {
  const category = CATEGORY_LABELS[entry.category] || entry.category;
  return `Consejo del Día (${category}) — ${entry.title}\n\n${entry.tip}\n\nRD Al Día 🇩🇴`;
}

export default function FinancialTip({ variant = "full" }) {
  const entry = useMemo(() => getDailyFinancialTip(), []);
  const category = CATEGORY_LABELS[entry.category] || entry.category;
  const compact = variant === "teaser";
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(shareMessage(entry))}`;

  return (
    <article
      className={`animate-verse-in rounded-2xl border border-emerald-100 bg-white p-6 shadow-card dark:border-emerald-900/40 dark:bg-surface ${
        compact ? "" : "sm:p-8"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
          Consejo del Día
        </p>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          {category}
        </span>
      </div>
      <p className="mt-2 text-xs capitalize text-muted">{dateLabel(entry.iso)}</p>

      <div className={`mt-5 flex gap-4 ${compact ? "items-start" : "sm:items-start"}`}>
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl dark:bg-emerald-950/40"
          aria-hidden="true"
        >
          {entry.icon}
        </span>
        <div>
          <h3 className="font-heading text-xl font-semibold tracking-tight text-heading">
            {entry.title}
          </h3>
          {compact ? (
            <a
              href="/consejo-financiero"
              className="mt-3 inline-block text-sm font-semibold text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
            >
              Leer el consejo
            </a>
          ) : (
            <>
              <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{entry.tip}</p>
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Compartir en WhatsApp
              </a>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
