"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { addDays, formatValidityRange } from "@/lib/fuel/dates";
import { FUEL_PRODUCTS, formatDop } from "@/lib/fuel/normalize";
import { LastUpdated } from "./LastUpdated";

const FIELDS = [
  { key: "gasolinePremium", label: "Premium", alias: "premium" },
  { key: "gasolineRegular", label: "Regular", alias: "regular" },
  { key: "gasoilOptimo", label: "Diésel óptimo", alias: "diesel_optimo" },
  { key: "gasoilRegular", label: "Diésel regular", alias: "diesel_regular" },
  { key: "glp", label: "GLP", alias: "glp" },
];

function toPayload(values) {
  return {
    effectiveFrom: values.effectiveFrom || values.date_effective,
    effectiveTo: values.effectiveTo || addDays(values.effectiveFrom || values.date_effective, 6),
    gasolinePremium: Number(values.gasolinePremium ?? values.premium),
    gasolineRegular: Number(values.gasolineRegular ?? values.regular),
    gasoilRegular: Number(values.gasoilRegular ?? values.diesel_regular),
    gasoilOptimo: Number(values.gasoilOptimo ?? values.diesel_optimo),
    glp: Number(values.glp),
    source: values.source || "manual",
    sourceUrl: values.sourceUrl || null,
  };
}

export default function FuelPriceEditor({ initialValue, onSaved }) {
  const [values, setValues] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setValues(initialValue);
  }, [initialValue]);

  function update(key, raw) {
    setValues((current) => {
      const next = { ...current, [key]: raw, source: "manual" };
      if (key === "effectiveFrom" && raw) {
        next.effectiveTo = addDays(raw, 6);
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
      const response = await fetch("/api/admin/fuel-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(values)),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al guardar.");
      onSaved?.(data.fuel);
      setValues(data.fuel);
      setNotice("Precios semanales guardados en fuel_prices.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function lookupMicm() {
    setScraping(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/fuel-prices/scrape", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo consultar el MICM.");

      setValues((current) => ({
        ...current,
        effectiveFrom: data.effectiveFrom || current.effectiveFrom,
        effectiveTo: data.effectiveTo || current.effectiveTo,
        sourceUrl: data.noticeUrl || current.sourceUrl,
        ...(data.prices || {}),
      }));

      setNotice(
        data.ok
          ? "Se extrajeron precios del aviso. Revisa y guarda."
          : data.reason || "Abre el PDF del MICM y copia los 5 precios.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo consultar el MICM.");
    } finally {
      setScraping(false);
    }
  }

  const from = values?.effectiveFrom || "";
  const previewRange =
    from && (values.effectiveTo || from)
      ? formatValidityRange(from, values.effectiveTo || addDays(from, 6))
      : null;

  return (
    <section className="rounded-xl border border-edge bg-surface p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-heading">
            Precios de combustible
          </h2>
          <p className="mt-1 text-sm text-muted">
            RD$ por galón. Fecha efectiva = vigencia semanal del MICM.
          </p>
        </div>
        <LastUpdated value={values?.updatedAt} saving={saving} />
      </div>

      {previewRange ? (
        <div className="mb-5 rounded-lg border border-edge bg-background px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Últimos precios
          </p>
          <p className="mt-1 text-sm font-medium text-heading">{previewRange}</p>
          <p className="mt-2 text-sm text-muted">
            {FUEL_PRODUCTS.map((product) => (
              <span key={product.key} className="mr-3">
                {product.short} {formatDop(values?.[product.key])}
              </span>
            ))}
          </p>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-5">
        <label className="block text-sm">
          Fecha efectiva
          <input
            required
            type="date"
            name="date_effective"
            value={from}
            onChange={(event) => update("effectiveFrom", event.target.value)}
            className="mt-1 h-11 w-full max-w-xs rounded-md border border-edge bg-background px-3"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <label key={field.key} className="block text-sm">
              {field.label}
              <input
                required
                name={field.alias}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={values?.[field.key] ?? ""}
                onChange={(event) => update(field.key, event.target.value)}
                className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
              />
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Guardando…" : "Guardar precios"}
          </Button>
          <Button type="button" variant="outline" onClick={lookupMicm} disabled={scraping}>
            {scraping ? "Buscando aviso…" : "Buscar aviso MICM"}
          </Button>
        </div>
      </form>

      {notice ? <p className="mt-4 text-sm text-heading">{notice}</p> : null}
      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}
    </section>
  );
}
