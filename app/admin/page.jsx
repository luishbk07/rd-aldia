"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { formatDop } from "@/lib/fuel/normalize";
import { findTeam } from "@/lib/sports/lidom";

function Card({ href, title, value, detail, entries }) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-edge bg-surface p-5 shadow-card transition-colors hover:border-primary/40"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {title}
      </p>
      <p className="mt-2 font-heading text-2xl font-semibold text-heading">{value}</p>
      {detail ? <p className="mt-1 text-sm text-muted">{detail}</p> : null}
      {entries?.length ? (
        <ul className="mt-3 space-y-1 text-xs text-muted">
          {entries.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </Link>
  );
}

export default function AdminOverviewPage() {
  const router = useRouter();
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

  const fuel = data?.fuel;
  const quote = data?.quote;
  const rates = data?.rates;
  const lidom = data?.lidom || { results: [], count: 0 };

  return (
    <AdminShell
      title="Panel RD Al Día"
      subtitle={data?.admin?.name ? `Sesión: ${data.admin.name}` : "Cargando sesión…"}
      persistence={data?.persistence}
    >
      {error ? <p className="mb-4 text-sm text-accent">{error}</p> : null}
      {!data && !error ? <p className="text-sm text-muted">Cargando resumen…</p> : null}

      {data ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card
            href="/admin/dashboard?tab=fuel"
            title="Combustible"
            value={
              fuel?.updatedAt
                ? formatDop(fuel.gasolineRegular)
                : "Sin publicar"
            }
            detail={
              fuel?.effectiveFrom
                ? `Regular · vigente ${fuel.effectiveFrom}`
                : "Carga los 5 precios semanales"
            }
            entries={
              fuel?.updatedAt
                ? [
                    `Premium ${formatDop(fuel.gasolinePremium)}`,
                    `Gasoil ${formatDop(fuel.gasoilRegular)}`,
                    `GLP ${formatDop(fuel.glp)}`,
                  ]
                : []
            }
          />
          <Card
            href="/admin/dashboard?tab=rates"
            title="Dólar y oro"
            value={
              quote?.usdRate
                ? `${quote.usdRate} DOP`
                : rates?.usdSell
                  ? `${rates.usdSell} DOP`
                  : "Sin tasa"
            }
            detail={
              quote?.euroRate
                ? `EUR ${quote.euroRate} · oro RD$ ${quote.goldRd || "—"}`
                : "Publica usd, euro y oro"
            }
          />
          <Card
            href="/admin/dashboard?tab=sports"
            title="LIDOM"
            value={`${lidom.count} partidos`}
            detail="Resultados recientes"
            entries={(lidom.results || []).slice(0, 3).map((game) => {
              const away = findTeam(game.awayTeam);
              const home = findTeam(game.homeTeam);
              return `${String(game.date).slice(0, 10)} · ${away.short} ${game.awayScore} @ ${home.short} ${game.homeScore}`;
            })}
          />
          <Card
            href="/admin/dashboard?tab=articles"
            title="Contenido"
            value={`${data.articles?.length || 0} artículos`}
            detail={`${data.comments?.length || 0} comentarios`}
          />
        </div>
      ) : null}

      {data ? (
        <p className="mt-8 text-sm text-muted">
          Entra a Editores para cargar combustible, tasas o resultados LIDOM.
        </p>
      ) : null}
    </AdminShell>
  );
}
