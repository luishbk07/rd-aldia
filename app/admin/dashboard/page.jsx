"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ArticleEditor from "@/components/admin/ArticleEditor";
import CommentsModerator from "@/components/admin/CommentsModerator";
import ExchangeRateEditor from "@/components/admin/ExchangeRateEditor";
import FuelPriceEditor from "@/components/admin/FuelPriceEditor";
import RateEditor from "@/components/admin/RateEditor";
import SportsEditor from "@/components/admin/SportsEditor";

const TABS = [
  { id: "fuel", label: "Combustible" },
  { id: "rates", label: "Dólar" },
  { id: "sports", label: "LIDOM" },
  { id: "articles", label: "Artículos" },
  { id: "comments", label: "Comentarios" },
];

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get("tab");
  const [tab, setTab] = useState(
    TABS.some((item) => item.id === requested) ? requested : "fuel",
  );
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (TABS.some((item) => item.id === requested)) setTab(requested);
  }, [requested]);

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

  const onQuoteSaved = useCallback((quote) => {
    setData((current) => (current ? { ...current, quote } : current));
  }, []);

  function selectTab(id) {
    setTab(id);
    router.replace(`/admin/dashboard?tab=${id}`);
  }

  return (
    <AdminShell
      title="Editores"
      subtitle={data?.admin?.name ? `Sesión: ${data.admin.name}` : "Cargando sesión…"}
      persistence={data?.persistence}
    >
      <nav className="mb-6 flex flex-wrap gap-2" aria-label="Secciones del panel">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectTab(item.id)}
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
        <FuelPriceEditor initialValue={data.fuel} onSaved={onFuelSaved} />
      ) : null}
      {data && tab === "rates" ? (
        <div className="space-y-6">
          <ExchangeRateEditor initialValue={data.quote} onSaved={onQuoteSaved} />
          <RateEditor initialValue={data.rates} onSaved={onRatesSaved} />
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
    </AdminShell>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<p className="px-4 py-8 text-sm text-muted">Cargando editores…</p>}>
      <DashboardInner />
    </Suspense>
  );
}
