"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import DataStatusBadge from "./DataStatusBadge";

const CurrencyChart = dynamic(() => import("./CurrencyChart"), {
  ssr: false,
  loading: () => <p className="text-sm text-muted">Cargando gráfico…</p>,
});

function formatDop(value, digits = 2) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value) || 0);
}

function formatWhen(iso) {
  if (!iso) return "Sin hora";
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function Change({ change }) {
  if (!change || change.amount == null) {
    return <p className="text-xs text-muted">Sin comparación de ayer</p>;
  }

  const arrow = change.direction === "up" ? "▲" : change.direction === "down" ? "▼" : "■";
  const color =
    change.direction === "up"
      ? "text-emerald-600"
      : change.direction === "down"
        ? "text-accent"
        : "text-muted";

  return (
    <p className={`text-sm font-medium ${color}`}>
      {arrow} {change.amount > 0 ? "+" : ""}
      {change.amount.toFixed(2)} ({change.percent > 0 ? "+" : ""}
      {change.percent}%)
    </p>
  );
}

const CARDS = [
  {
    key: "usd",
    icon: "💵",
    title: "Dólar",
    rateKey: "usdRate",
    changeKey: "usd",
    accent: "border-primary/25 bg-primary/5",
    label: "1 USD",
  },
  {
    key: "euro",
    icon: "💶",
    title: "Euro",
    rateKey: "euroRate",
    changeKey: "euro",
    accent: "border-[#5b3a9e]/25 bg-[#5b3a9e]/5",
    label: "1 EUR",
  },
  {
    key: "gold",
    icon: "🥇",
    title: "Oro",
    rateKey: "goldRd",
    changeKey: "gold",
    accent: "border-gold/40 bg-gold/10",
    label: "1 oz",
  },
];

export default function CurrencyTracker({ variant = "full" }) {
  const [state, setState] = useState({ status: "loading" });
  const [amount, setAmount] = useState("100");

  const load = useCallback(async () => {
    setState((current) =>
      current.status === "ready" ? { ...current, refreshing: true } : { status: "loading" },
    );

    try {
      const response = await fetch("/api/currency/combined", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudieron cargar las tasas.");
      }
      setState({ status: "ready", data, refreshing: false });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Error de red.",
      });
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [load]);

  const converted = useMemo(() => {
    const usd = Number(amount);
    const rate = state.data?.quote?.usdRate;
    if (!(usd >= 0) || !(rate > 0)) return null;
    return usd * rate;
  }, [amount, state.data]);

  if (state.status === "loading") {
    return (
      <div className="grid animate-pulse gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-40 rounded-xl border border-edge bg-surface" />
        ))}
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-xl border border-accent/30 bg-surface p-6">
        <p className="font-heading font-semibold text-heading">Divisas</p>
        <p className="mt-2 text-sm text-accent">{state.message}</p>
        <Button type="button" variant="outline" className="mt-4" onClick={load}>
          Reintentar
        </Button>
      </div>
    );
  }

  const { quote, change, history, fallback, source, updatedAt } = state.data;
  const official = quote.official;
  const dataSource = source === "cached" || fallback ? "cached" : "live";

  if (variant === "teaser") {
    return (
      <Link
        href="/dolar-rd"
        className="group relative block rounded-xl border border-edge bg-surface p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Dólar
        </p>
        <p className="mt-3 font-heading text-2xl font-semibold text-heading">
          {formatDop(quote.usdRate)}
        </p>
        <Change change={change?.usd} />
        <div className="mt-3">
          <DataStatusBadge source={dataSource} updatedAt={updatedAt || quote.createdAt} />
        </div>
      </Link>
    );
  }

  const shareText = `Dólar: ${formatDop(quote.usdRate)} · Euro: ${formatDop(quote.euroRate)} · Oro: ${formatDop(quote.goldRd)}/oz · RD Al Día`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-2xl font-semibold text-heading">
              Dólar, euro y oro
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${
                official
                  ? "bg-primary/10 text-primary"
                  : "bg-slate-100 text-muted dark:bg-white/10"
              }`}
            >
              {official ? "Tasa oficial BCRD" : "Referencia de mercado"}
            </span>
            <DataStatusBadge source={dataSource} updatedAt={updatedAt || quote.createdAt} />
          </div>
          <p className="mt-2 text-sm text-muted">
            Actualizado {formatWhen(quote.createdAt)}
            {fallback ? " · usando última tasa guardada" : ""}
            {state.refreshing ? " · actualizando…" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={load}>
            Actualizar
          </Button>
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-[#a30e26]"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {CARDS.map((card) => (
          <article
            key={card.key}
            className={`rounded-xl border p-5 ${card.accent}`}
          >
            <p className="text-2xl" aria-hidden="true">
              {card.icon}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {card.title}
            </p>
            <p className="mt-2 font-heading text-2xl font-semibold text-heading">
              {formatDop(quote[card.rateKey], card.key === "gold" ? 0 : 2)}
            </p>
            <p className="text-xs text-muted">{card.label} en RD$</p>
            <div className="mt-3">
              <Change change={change?.[card.changeKey]} />
            </div>
            {official ? (
              <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-primary">
                Tasa oficial BCRD
              </p>
            ) : null}
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-edge bg-surface p-5">
          <h3 className="font-heading text-lg font-semibold text-heading">Convertir</h3>
          <p className="mt-1 text-sm text-muted">USD a pesos dominicanos</p>
          <label className="mt-4 block text-sm">
            Monto en USD
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
            />
          </label>
          <p className="mt-4 font-heading text-2xl font-semibold text-heading">
            {converted == null ? "—" : formatDop(converted)}
          </p>
        </div>

        <div className="rounded-xl border border-edge bg-surface p-5">
          <h3 className="font-heading text-lg font-semibold text-heading">
            Últimos 30 días
          </h3>
          <p className="mt-1 mb-4 text-sm text-muted">Dólar y euro en RD$</p>
          <CurrencyChart history={history} />
        </div>
      </div>

      {quote.goldUsd ? (
        <p className="text-xs text-muted">
          Oro spot{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(quote.goldUsd)}{" "}
          / oz · {formatDop(quote.goldRd)} al tipo de cambio actual.
        </p>
      ) : null}
    </section>
  );
}
