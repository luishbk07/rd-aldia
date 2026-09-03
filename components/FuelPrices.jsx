"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import DataStatusBadge from "./DataStatusBadge";

export default function FuelPrices({ variant = "full" }) {
  const [state, setState] = useState({ status: "loading" });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/fuel-prices")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "No se pudieron cargar los precios.");
        }
        return data;
      })
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Error de red.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  if (state.status === "loading") {
    return (
      <div className="animate-pulse rounded-xl border border-edge bg-surface p-6">
        <div className="h-4 w-40 rounded bg-edge" />
        <div className="mt-4 h-8 w-56 rounded bg-edge" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-24 rounded-lg bg-edge/70" />
          ))}
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-xl border border-accent/30 bg-surface p-6">
        <p className="font-heading font-semibold text-heading">Combustibles</p>
        <p className="mt-2 text-sm text-accent">{state.message}</p>
        <button
          type="button"
          onClick={() => {
            setState({ status: "loading" });
            setTick((current) => current + 1);
          }}
          className="mt-4 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!state.data?.ok) {
    return (
      <div className="rounded-xl border border-dashed border-edge bg-surface p-6">
        <p className="font-heading font-semibold text-heading">Combustibles</p>
        <p className="mt-2 text-sm text-muted">
          Aún no hay precios semanales. Se publican cada viernes en el panel.
        </p>
      </div>
    );
  }

  const { products, validity, sourceNote, fuel } = state.data;
  const regular = products.find((item) => item.key === "gasolineRegular");
  const dataSource = state.data.source === "cached" ? "cached" : "live";

  if (variant === "teaser") {
    return (
      <Card href="/combustible-hoy">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Combustible
        </p>
        <p className="mt-3 font-heading text-2xl font-semibold tracking-tight text-heading">
          {regular?.formatted ?? "RD$ —.—"}
        </p>
        <p className="mt-1 text-sm text-muted">{validity}</p>
        <div className="mt-3">
          <DataStatusBadge source={dataSource} updatedAt={fuel.updatedAt} />
        </div>
      </Card>
    );
  }

  return (
    <section className="rounded-xl border border-edge bg-surface p-6 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        Precios oficiales
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <h2 className="font-heading text-2xl font-semibold text-heading">
          Combustibles
        </h2>
        <DataStatusBadge source={dataSource} updatedAt={fuel.updatedAt} />
      </div>
      <p className="mt-2 text-sm font-medium text-heading">{validity}</p>
      <p className="mt-1 text-sm text-muted">RD$ por galón · MICM</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {products.map((product) => (
          <article
            key={product.key}
            className="rounded-lg border border-edge bg-background px-4 py-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              {product.label}
            </p>
            <p className="mt-2 font-heading text-xl font-semibold text-heading">
              {product.formatted}
            </p>
          </article>
        ))}
      </div>

      {fuel.source === "manual" ? (
        <p className="mt-5 text-xs leading-5 text-muted">{sourceNote}</p>
      ) : (
        <p className="mt-5 text-xs leading-5 text-muted">{sourceNote}</p>
      )}

      {fuel.sourceUrl ? (
        <a
          href={fuel.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Ver aviso del MICM
        </a>
      ) : null}
    </section>
  );
}
