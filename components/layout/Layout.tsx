"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import AdSlot from "@/components/AdSlot";
import NewsletterForm from "@/components/NewsletterForm";
import NewsletterPopup from "@/components/NewsletterPopup";
import { ThemeToggle } from "@/components/ui";
import { NAV_LINKS, ROUTES, SITE_NAME, SOCIAL_LINKS } from "@/lib/site";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="16" cy="16" r="6.25" fill="#FFD700" />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const inner = 9.2;
        const outer = 13.6;
        return (
          <line
            key={i}
            x1={16 + Math.cos(angle) * inner}
            y1={16 + Math.sin(angle) * inner}
            x2={16 + Math.cos(angle) * outer}
            y2={16 + Math.sin(angle) * outer}
            stroke="#FFD700"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function Logo({
  compact = false,
  variant = "header",
}: {
  compact?: boolean;
  variant?: "header" | "footer";
}) {
  const onFooter = variant === "footer";

  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rd-red"
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ring-1 ${
          onFooter
            ? "bg-white/10 ring-white/15"
            : "bg-[#003366]/8 ring-[#003366]/10"
        }`}
      >
        <SunIcon className="size-7" />
      </span>
      <span className="leading-none">
        <span
          className={`block font-heading font-semibold tracking-tight ${
            onFooter ? "text-white" : "text-heading"
          }`}
        >
          <span className="text-[1.35rem]">RD</span>{" "}
          <span
            className={`text-[1.2rem] font-medium ${
              onFooter ? "text-[#f3c4cb]" : "text-[#8f1024]"
            }`}
          >
            Al Día
          </span>
        </span>
        {!compact && (
          <span className="mt-0.5 hidden text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted sm:block">
            Información diaria
          </span>
        )}
      </span>
    </Link>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function SocialIcon({
  network,
  className,
}: {
  network: (typeof SOCIAL_LINKS)[number]["network"];
  className?: string;
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
    className,
  };

  switch (network) {
    case "facebook":
      return (
        <svg {...common}>
          <path d="M13.5 21v-7.2h2.4l.36-2.8H13.5V9.2c0-.8.22-1.36 1.38-1.36H16.4V5.32c-.24-.04-1.06-.1-2.02-.1-2 0-3.38 1.22-3.38 3.46v1.92H8.6v2.8h2.4V21h2.5z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5zm0 1.6A2.9 2.9 0 0 0 5.1 8v8A2.9 2.9 0 0 0 8 18.9h8A2.9 2.9 0 0 0 18.9 16V8A2.9 2.9 0 0 0 16 5.1H8zm8.15 1.35a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9zM12 8.2A3.8 3.8 0 1 1 12 15.8 3.8 3.8 0 0 1 12 8.2zm0 1.6a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M16.7 4h2.4l-5.25 6.01L20.2 20h-3.9l-3.06-4.01L9.3 20H6.88l5.62-6.43L4.3 4h4l2.76 3.66L16.7 4zm-.84 14.4h1.33L8.22 5.52H6.8l9.06 12.88z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M15.4 4c.3 2.15 1.7 3.6 3.8 3.8v2.35c-1.3.13-2.5-.28-3.6-1.08v5.68c0 3.4-2.55 5.75-5.85 5.75S3.9 18.15 3.9 14.75 6.45 9 9.75 9c.35 0 .7.03 1.03.1v2.48a3.4 3.4 0 0 0-1.03-.16c-1.85 0-3.2 1.4-3.2 3.33s1.35 3.33 3.2 3.33 3.15-1.4 3.15-3.33V4h2.5z" />
        </svg>
      );
  }
}

function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const today = new Intl.DateTimeFormat("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-edge/80 bg-surface/95 shadow-[0_1px_0_rgba(0,51,102,0.04)] backdrop-blur-md">
      <div className="flex h-1" aria-hidden="true">
        <div className="flex-1 bg-primary" />
        <div className="w-[28%] bg-accent" />
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />

        <nav
          aria-label="Principal"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-2.5 py-2 text-[0.8125rem] font-medium tracking-wide transition-colors ${
                  active
                    ? "bg-primary/8 text-heading"
                    : "text-muted hover:bg-primary/6 hover:text-heading"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href={ROUTES.studio}
            className="hidden rounded-md px-2.5 py-2 text-[0.8125rem] font-semibold text-accent hover:bg-accent/8 sm:inline-flex"
          >
            Admin
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md text-heading hover:bg-primary/8 lg:hidden dark:hover:bg-white/10"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      <p className="hidden border-t border-edge px-6 py-1.5 text-center text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted lg:block">
        República Dominicana · {today}
      </p>

      {open && (
        <div
          id={menuId}
          className="border-t border-edge bg-surface lg:hidden"
        >
          <nav aria-label="Móvil" className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <p className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted">
              {today}
            </p>
            <ul className="flex flex-col">
              <li>
                <Link
                  href={ROUTES.studio}
                  className="block rounded-md px-3 py-3 text-base font-semibold text-accent"
                >
                  Admin
                </Link>
              </li>
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded-md px-3 py-3 text-base font-medium ${
                        active
                          ? "bg-primary/8 text-heading"
                          : "text-foreground hover:bg-primary/6"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-rd-blue text-rd-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo compact variant="footer" />
          <p className="max-w-xs text-sm leading-6 text-white/70">
            El hub diario de la República Dominicana: precios, dólar, deportes,
            turismo y cultura — en un solo lugar.
          </p>
          <ul className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.network}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex size-10 items-center justify-center rounded-full bg-white/8 text-white transition-colors hover:bg-white/15"
                >
                  <SocialIcon network={social.network} className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            Secciones
          </h2>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            Enlaces rápidos
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/noticias" className="hover:text-white">
                Titulares
              </Link>
            </li>
            <li>
              <Link href="/buscar" className="hover:text-white">
                Buscar
              </Link>
            </li>
            <li>
              <Link href={ROUTES.advertise} className="hover:text-white">
                Anúnciate
              </Link>
            </li>
            <li>
              <Link href={ROUTES.about} className="hover:text-white">
                Acerca de
              </Link>
            </li>
            <li>
              <Link href={ROUTES.contact} className="hover:text-white">
                Contacto
              </Link>
            </li>
            <li>
              <Link href={ROUTES.privacy} className="hover:text-white">
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link href="/#datos-del-dia" className="hover:text-white">
                Datos del día
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            Boletín
          </h2>
          <p className="mt-4 mb-4 text-sm leading-6 text-white/70">
            Lo esencial de RD, de lunes a domingo.
          </p>
          <NewsletterForm variant="footer" id="newsletter-footer-email" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/50 sm:px-6">
          © {year} {SITE_NAME}. Todos los derechos reservados.{" "}
          <Link href={ROUTES.privacy} className="text-white/70 underline-offset-2 hover:text-white hover:underline">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/studio")) {
    return children;
  }

  return (
    <div className="flex min-h-full flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-rd-blue"
      >
        Saltar al contenido
      </a>
      <Header />
      <div className="border-b border-edge bg-background">
        <div className="mx-auto flex max-w-7xl justify-center px-4 py-3 sm:px-6">
          <div className="hidden md:block">
            <AdSlot
              size="leaderboard"
              position="header-leaderboard"
              lazy={false}
            />
          </div>
          <div className="md:hidden">
            <AdSlot size="mobile-banner" position="header-mobile" lazy={false} />
          </div>
        </div>
      </div>
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer />
      <NewsletterPopup />
    </div>
  );
}
