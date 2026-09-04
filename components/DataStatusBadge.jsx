"use client";

const TZ = "America/Santo_Domingo";

function ageMs(updatedAt) {
  const time = new Date(updatedAt).getTime();
  if (!Number.isFinite(time)) return null;
  return Math.max(0, Date.now() - time);
}

export function relativeUpdateLabel(updatedAt) {
  const ms = ageMs(updatedAt);
  if (ms == null) return "Actualizado hace un momento";

  const minutes = Math.round(ms / 60000);
  if (minutes < 1) return "Actualizado hace un momento";
  if (minutes < 60) return `Actualizado hace ${minutes} min`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Actualizado hace ${hours} ${hours === 1 ? "hora" : "horas"}`;

  const days = Math.round(hours / 24);
  return `Actualizado hace ${days} ${days === 1 ? "día" : "días"}`;
}

export function clockUpdateLabel(updatedAt, style = "auto") {
  const date = new Date(updatedAt);
  if (!Number.isFinite(date.getTime())) return null;

  const time = new Intl.DateTimeFormat("es-DO", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  const day = new Intl.DateTimeFormat("es-DO", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);

  const prettyDay = day.charAt(0).toUpperCase() + day.slice(1);

  if (style === "date") return `Actualizado: ${prettyDay}`;
  if (style === "time") return `Última actualización: ${time}`;

  const today = new Intl.DateTimeFormat("es-DO", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const thatDay = new Intl.DateTimeFormat("es-DO", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return today === thatDay
    ? `Última actualización: ${time}`
    : `Actualizado: ${prettyDay}`;
}

export default function DataStatusBadge({
  source = "live",
  updatedAt,
  lastUpdated,
  clock = "auto",
  showClock = true,
  className = "",
  tone = "light",
}) {
  const when = lastUpdated || updatedAt;
  const live = source === "live";
  const dark = tone === "dark";
  const label = live ? "En vivo" : relativeUpdateLabel(when);
  const clockText = showClock && when ? clockUpdateLabel(when, clock) : null;

  return (
    <span className={`inline-flex flex-col gap-0.5 ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold tracking-[0.04em] ${
          dark ? "bg-black/25 text-white/85" : "bg-slate-100 text-muted dark:bg-white/10 dark:text-slate-300"
        }`}
      >
        <span
          className={`size-1.5 rounded-full ${live ? "bg-emerald-500" : "bg-amber-400"}`}
          aria-hidden="true"
        />
        {label}
      </span>
      {clockText ? (
        <span className={`text-[0.65rem] font-medium ${dark ? "text-white/65" : "text-muted"}`}>
          {clockText}
        </span>
      ) : null}
    </span>
  );
}
