"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

/** Reusable class maps — use these if you prefer raw className strings. */
export const ui = {
  card: cx(
    "group relative rounded-xl border border-edge bg-surface p-6",
    "shadow-card transition-all duration-200",
    "hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover",
    "dark:shadow-none dark:hover:border-gold/40",
  ),
  cardAccent:
    "pointer-events-none absolute inset-x-6 top-0 h-0.5 origin-left scale-x-0 rounded-full bg-gold transition-transform duration-200 group-hover:scale-x-100",
  sectionTitle: "font-heading text-2xl font-semibold tracking-tight text-heading sm:text-3xl",
  sectionEyebrow:
    "mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent",
  sectionRule: "mt-3 block h-1 w-14 rounded-full bg-gold",
  button: {
    base: "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
    primary:
      "bg-primary text-primary-foreground hover:bg-[#00264d] focus-visible:outline-primary",
    secondary:
      "bg-accent text-accent-foreground hover:bg-[#a30e26] focus-visible:outline-accent",
    outline:
      "border border-primary bg-transparent text-primary hover:bg-primary/8 focus-visible:outline-primary dark:border-gold dark:text-gold dark:hover:bg-gold/10",
  },
  badge: {
    base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em]",
    primary: "bg-primary/10 text-primary dark:bg-primary/30 dark:text-white",
    accent: "bg-accent/10 text-accent dark:bg-accent/25 dark:text-[#ffb3bf]",
    gold: "bg-gold/25 text-heading dark:bg-gold/20 dark:text-gold",
    muted: "bg-slate-100 text-muted dark:bg-white/10 dark:text-slate-300",
    noticias: "bg-primary/10 text-primary dark:bg-primary/30 dark:text-white",
    nacionales: "bg-primary/10 text-primary dark:bg-primary/30 dark:text-white",
    cultura: "bg-accent/10 text-accent dark:bg-accent/25 dark:text-[#ffb3bf]",
    turismo: "bg-gold/25 text-heading dark:bg-gold/20 dark:text-gold",
    deportes: "bg-primary/10 text-primary dark:bg-gold/15 dark:text-gold",
    opinion: "bg-accent/10 text-accent dark:bg-accent/25 dark:text-[#ffb3bf]",
  },
};

export function Card({ children, href, className = "", ...props }) {
  const classes = cx(ui.card, className);
  const inner = (
    <>
      <span className={ui.cardAccent} aria-hidden="true" />
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cx(classes, "block")} {...props}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={classes} {...props}>
      {inner}
    </div>
  );
}

export function SectionTitle({
  children,
  eyebrow,
  as: Tag = "h2",
  className = "",
}) {
  return (
    <div className={className}>
      {eyebrow ? <p className={ui.sectionEyebrow}>{eyebrow}</p> : null}
      <Tag className={ui.sectionTitle}>{children}</Tag>
      <span className={ui.sectionRule} aria-hidden="true" />
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  href,
  className = "",
  type = "button",
  ...props
}) {
  const classes = cx(ui.button.base, ui.button[variant] ?? ui.button.primary, className);

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export function Badge({ children, tone = "primary", className = "" }) {
  return (
    <span className={cx(ui.badge.base, ui.badge[tone] ?? ui.badge.primary, className)}>
      {children}
    </span>
  );
}

const THEME_KEY = "rd-theme";

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = stored === "dark" || stored === "light" ? stored : prefersDark ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={cx(
        "inline-flex size-10 items-center justify-center rounded-md text-heading transition-colors hover:bg-primary/8 dark:hover:bg-white/10",
        className,
      )}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 3v1.6M12 19.4V21M4.2 4.2l1.1 1.1M18.7 18.7l1.1 1.1M3 12h1.6M19.4 12H21M4.2 19.8l1.1-1.1M18.7 5.3l1.1-1.1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path
            d="M15.4 13.2A6 6 0 0 1 10.8 5.1 6.2 6.2 0 1 0 18.9 13a6 6 0 0 1-3.5.2z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
