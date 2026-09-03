"use client";

import { useEffect, useRef, useState } from "react";
import { LastUpdated } from "./LastUpdated";

const FIELDS = [
  { key: "usdBuy", label: "USD compra" },
  { key: "usdSell", label: "USD venta" },
  { key: "euroBuy", label: "EUR compra" },
  { key: "euroSell", label: "EUR venta" },
  { key: "goldPrice", label: "Oro (USD / oz)" },
];

export default function RateEditor({ initialValue, onSaved }) {
  const [values, setValues] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const skip = useRef(true);

  useEffect(() => {
    setValues(initialValue);
    skip.current = true;
  }, [initialValue]);

  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      setSaving(true);
      setError("");

      try {
        const response = await fetch("/api/admin/update-rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: values.date,
            usdBuy: Number(values.usdBuy),
            usdSell: Number(values.usdSell),
            euroBuy: Number(values.euroBuy),
            euroSell: Number(values.euroSell),
            goldPrice: Number(values.goldPrice),
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error al guardar.");
        onSaved?.(data.rates);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al guardar.");
      } finally {
        setSaving(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [values, onSaved]);

  return (
    <section className="rounded-xl border border-edge bg-surface p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-heading">
            Tasas de cambio
          </h2>
          <p className="mt-1 text-sm text-muted">RD$ por 1 USD / EUR. Se guarda solo.</p>
        </div>
        <LastUpdated value={values.updatedAt} saving={saving} />
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="fx-date">
          Fecha
        </label>
        <input
          id="fx-date"
          type="date"
          value={values.date || ""}
          onChange={(event) => setValues((current) => ({ ...current, date: event.target.value }))}
          className="mt-1 h-11 w-full max-w-xs rounded-md border border-edge bg-background px-3 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {field.label}
            </span>
            <input
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={values[field.key] ?? ""}
              onChange={(event) =>
                setValues((current) => ({ ...current, [field.key]: event.target.value }))
              }
              className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3 text-sm"
            />
          </label>
        ))}
      </div>

      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}
    </section>
  );
}
