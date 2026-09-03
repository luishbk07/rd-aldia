"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArticleEditor from "@/components/admin/ArticleEditor";
import CommentsModerator from "@/components/admin/CommentsModerator";
import PriceEditor from "@/components/admin/PriceEditor";
import CurrencyUpdateForm from "@/components/admin/CurrencyUpdateForm";
import RateEditor from "@/components/admin/RateEditor";
import SportsEditor from "@/components/admin/SportsEditor";
import { Button } from "@/components/ui";

const TABS = [
  { id: "fuel", label: "Combustible" },
  { id: "rates", label: "Dólar" },
  { id: "sports", label: "LIDOM" },
  { id: "articles", label: "Artículos" },
  { id: "comments", label: "Comentarios" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState("fuel");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/data")
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/admin/login");
          return null;
        }
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Error al cargar.");
        return json;
      })
      .then((json) => {
        if (!cancelled && json) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar.");
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const onFuelSaved = useCallback((fuel) => {
    setData((current) => (current ? { ...current, fuel } : current));
  }, []);

  const onRatesSaved = useCallback((rates) => {
    setData((current) => (current ? { ...current, rates } : current));
  }, []);

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
            Panel RD Al Día
          </h1>
          <p className="mt-1 text-sm text-muted">
            {data?.admin?.name ? `Sesión: ${data.admin.name}` : "Cargando sesión…"}
            {data?.persistence === "local-file"
              ? " · Persistencia local (.data) hasta conectar Supabase"
              : data?.persistence === "supabase"
                ? " · Supabase"
                : ""}
          </p>
        </div>
        <Button type="button" variant="outline" onClick={logout}>
          Cerrar sesión
        </Button>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Secciones del panel">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              tab === item.id
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-heading ring-1 ring-edge"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {error ? <p className="mb-4 text-sm text-accent">{error}</p> : null}
      {!data && !error ? <p className="text-sm text-muted">Cargando panel…</p> : null}

      {data && tab === "fuel" ? (
        <PriceEditor initialValue={data.fuel} onSaved={onFuelSaved} />
      ) : null}
      {data && tab === "rates" ? (
        <div>
          <RateEditor initialValue={data.rates} onSaved={onRatesSaved} />
          <CurrencyUpdateForm />
        </div>
      ) : null}
      {data && tab === "sports" ? <SportsEditor /> : null}
      {data && tab === "articles" ? (
        <ArticleEditor
          articles={data.articles}
          onChange={(articles) => setData((current) => ({ ...current, articles }))}
        />
      ) : null}
      {data && tab === "comments" ? (
        <CommentsModerator
          comments={data.comments}
          onChange={(comments) => setData((current) => ({ ...current, comments }))}
        />
      ) : null}
    </div>
  );
}
