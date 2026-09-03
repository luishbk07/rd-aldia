"use client";

function hoursOld(updatedAt) {
  if (!updatedAt) return null;
  const hours = (Date.now() - new Date(updatedAt).getTime()) / 36e5;
  if (!Number.isFinite(hours) || hours < 0) return null;
  if (hours < 1) return "menos de 1 h";
  if (hours < 24) return `~${Math.round(hours)} h`;
  const days = Math.round(hours / 24);
  return `~${days} d`;
}

export default function DataStatusBadge({
  source = "live",
  updatedAt,
  className = "",
  tone = "light",
}) {
  const cached = source === "cached";
  const age = cached ? hoursOld(updatedAt) : null;
  const dark = tone === "dark";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold tracking-[0.04em] ${
        dark ? "bg-black/25 text-white/85" : "bg-slate-100 text-muted dark:bg-white/10 dark:text-slate-300"
      } ${className}`}
    >
      <span
        className={`size-1.5 rounded-full ${cached ? "bg-amber-400" : "bg-emerald-500"}`}
        aria-hidden="true"
      />
      {cached
        ? `Datos en caché${age ? ` · ${age}` : ""}`
        : "En vivo"}
    </span>
  );
}
