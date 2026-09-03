"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function AdminShell({
  children,
  title,
  subtitle,
  persistence,
}) {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto min-h-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Administración
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold text-heading">
            {title}
          </h1>
          {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          {persistence === "local-file" ? (
            <p className="mt-1 text-xs text-muted">
              Persistencia local (.data) hasta conectar Supabase
            </p>
          ) : persistence === "supabase" ? (
            <p className="mt-1 text-xs text-muted">Supabase conectado</p>
          ) : null}
        </div>
        <Button type="button" variant="outline" onClick={logout}>
          Cerrar sesión
        </Button>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Panel">
        <Link
          href="/admin"
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            pathname === "/admin"
              ? "bg-primary text-primary-foreground"
              : "bg-surface text-heading ring-1 ring-edge"
          }`}
        >
          Resumen
        </Link>
        <Link
          href="/admin/dashboard"
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            pathname.startsWith("/admin/dashboard")
              ? "bg-primary text-primary-foreground"
              : "bg-surface text-heading ring-1 ring-edge"
          }`}
        >
          Editores
        </Link>
      </nav>

      {children}
    </div>
  );
}
