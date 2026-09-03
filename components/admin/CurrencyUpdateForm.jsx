"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export default function CurrencyUpdateForm() {
  const [values, setValues] = useState({
    usdRate: "",
    euroRate: "",
    goldUsd: "",
    date: new Date().toISOString().slice(0, 10),
    source: "bcrd",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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
          date: values.date,
          source: values.source,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo guardar.");
      setNotice("Cotización publicada en el tracker.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-edge bg-surface p-6">
      <h2 className="font-heading text-lg font-semibold text-heading">
        Publicar tasa BCRD / manual
      </h2>
      <p className="mt-1 text-sm text-muted">
        Esto aparece en el tracker público con la insignia “Tasa oficial BCRD”.
      </p>

      <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          USD → DOP
          <input
            required
            type="number"
            step="0.0001"
            min="0.01"
            value={values.usdRate}
            onChange={(event) => setValues((current) => ({ ...current, usdRate: event.target.value }))}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          />
        </label>
        <label className="text-sm">
          EUR → DOP
          <input
            required
            type="number"
            step="0.0001"
            min="0.01"
            value={values.euroRate}
            onChange={(event) => setValues((current) => ({ ...current, euroRate: event.target.value }))}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          />
        </label>
        <label className="text-sm">
          Oro USD / oz
          <input
            required
            type="number"
            step="0.01"
            min="0.01"
            value={values.goldUsd}
            onChange={(event) => setValues((current) => ({ ...current, goldUsd: event.target.value }))}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          />
        </label>
        <label className="text-sm">
          Fecha
          <input
            required
            type="date"
            value={values.date}
            onChange={(event) => setValues((current) => ({ ...current, date: event.target.value }))}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          Fuente
          <select
            value={values.source}
            onChange={(event) => setValues((current) => ({ ...current, source: event.target.value }))}
            className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
          >
            <option value="bcrd">Tasa oficial BCRD</option>
            <option value="manual">Manual</option>
          </select>
        </label>
        <div>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Publicando…" : "Publicar en el tracker"}
          </Button>
        </div>
      </form>

      {notice ? <p className="mt-4 text-sm text-heading">{notice}</p> : null}
      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}
    </section>
  );
}
