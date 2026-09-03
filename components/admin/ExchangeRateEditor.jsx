"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { LastUpdated } from "./LastUpdated";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function emptyQuote() {
  return {
    usdRate: "",
    euroRate: "",
    goldUsd: "",
    goldRd: "",
    date: today(),
    source: "manual",
    createdAt: null,
  };
}

export default function ExchangeRateEditor({ initialValue, onSaved }) {
  const [values, setValues] = useState(initialValue || emptyQuote());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (initialValue) {
      setValues({
        usdRate: initialValue.usdRate ?? initialValue.usd_rate ?? "",
        euroRate: initialValue.euroRate ?? initialValue.euro_rate ?? "",
        goldUsd: initialValue.goldUsd ?? initialValue.gold_usd ?? "",
        goldRd: initialValue.goldRd ?? initialValue.gold_rd ?? "",
        date: initialValue.date || today(),
        source: initialValue.source || "manual",
        createdAt: initialValue.createdAt || initialValue.updatedAt || null,
      });
    }
  }, [initialValue]);

  function update(key, raw) {
    setValues((current) => {
      const next = { ...current, [key]: raw };
      if (key === "usdRate" || key === "goldUsd") {
        const usd = Number(key === "usdRate" ? raw : current.usdRate);
        const gold = Number(key === "goldUsd" ? raw : current.goldUsd);
        if (usd > 0 && gold > 0) {
          next.goldRd = Number((gold * usd).toFixed(2));
        }
      }
      return next;
    });
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/currency/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usdRate: Number(values.usdRate),
          euroRate: Number(values.euroRate),
          goldUsd: Number(values.goldUsd),
          goldRd: values.goldRd === "" ? undefined : Number(values.goldRd),
          date: values.date,
          source: values.source || "manual",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo guardar.");
      onSaved?.(data.quote);
      setValues((current) => ({
        ...current,
        ...data.quote,
        createdAt: data.quote.createdAt,
      }));
      setNotice("Cotización publicada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-edge bg-surface p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-heading">
            Tasas de cambio
          </h2>
          <p className="mt-1 text-sm text-muted">
            Publica USD, euro y oro. El oro en RD$ se calcula si lo dejas vacío
            (onza × dólar).
          </p>
        </div>
        <LastUpdated value={values.createdAt} saving={saving} />
      </div>

      {Number(values.usdRate) > 0 ? (
        <div className="mb-5 rounded-lg border border-edge bg-background px-4 py-3 text-sm text-heading">
          Actual: USD {values.usdRate} · EUR {values.euroRate} · oro USD{" "}
          {values.goldUsd} · oro RD$ {values.goldRd}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          USD (usd_rate)
          <input
            required
            name="usd_rate"
            type="number"
            step="0.0001"
            min="0.01"
            value={values.usdRate}
            onChange={(event) => update("usdRate", event.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          />
        </label>
        <label className="text-sm">
          Euro (euro_rate)
          <input
            required
            name="euro_rate"
            type="number"
            step="0.0001"
            min="0.01"
            value={values.euroRate}
            onChange={(event) => update("euroRate", event.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          />
        </label>
        <label className="text-sm">
          Oro USD / oz (gold_usd)
          <input
            required
            name="gold_usd"
            type="number"
            step="0.01"
            min="0.01"
            value={values.goldUsd}
            onChange={(event) => update("goldUsd", event.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          />
        </label>
        <label className="text-sm">
          Oro RD$ (gold_rd)
          <input
            name="gold_rd"
            type="number"
            step="0.01"
            min="0.01"
            value={values.goldRd}
            onChange={(event) => update("goldRd", event.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          />
        </label>
        <label className="text-sm">
          Fecha
          <input
            required
            type="date"
            value={values.date}
            onChange={(event) => update("date", event.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          />
        </label>
        <label className="text-sm">
          Fuente
          <select
            value={values.source}
            onChange={(event) => update("source", event.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          >
            <option value="manual">Manual</option>
            <option value="bcrd">Tasa oficial BCRD</option>
          </select>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Guardando…" : "Guardar tasas"}
          </Button>
        </div>
      </form>

      {notice ? <p className="mt-4 text-sm text-heading">{notice}</p> : null}
      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}
    </section>
  );
}
