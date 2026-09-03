"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { addDays, formatValidityRange } from "@/lib/fuel/dates";
import { FUEL_PRODUCTS } from "@/lib/fuel/normalize";
import { LastUpdated } from "./LastUpdated";

function toPayload(values) {
  return {
    effectiveFrom: values.effectiveFrom,
    effectiveTo: values.effectiveTo || addDays(values.effectiveFrom, 6),
    gasolinePremium: Number(values.gasolinePremium),
    gasolineRegular: Number(values.gasolineRegular),
    gasoilRegular: Number(values.gasoilRegular),
    gasoilOptimo: Number(values.gasoilOptimo),
    glp: Number(values.glp),
    source: values.source || "manual",
    sourceUrl: values.sourceUrl || null,
  };
}

export default function PriceEditor({ initialValue, onSaved }) {
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
      setNotice("Precios semanales guardados.");
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

  const previewRange =
    values.effectiveFrom && (values.effectiveTo || values.effectiveFrom)
      ? formatValidityRange(
          values.effectiveFrom,
          values.effectiveTo || addDays(values.effectiveFrom, 6),
        )
      : null;

  return (
    <section className="rounded-xl border border-edge bg-surface p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-heading">
            Precios semanales de combustible
          </h2>
          <p className="mt-1 text-sm text-muted">
            MICM publica cada viernes. RD$ por galón. Este formulario es la fuente
            más fiable.
          </p>
        </div>
        <LastUpdated value={values.updatedAt} saving={saving} />
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            Vigente desde
            <input
              required
              type="date"
              value={values.effectiveFrom || ""}
              onChange={(event) => update("effectiveFrom", event.target.value)}
              className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
            />
          </label>
          <label className="block text-sm">
            Vigente hasta
            <input
              required
              type="date"
              value={values.effectiveTo || ""}
              onChange={(event) => update("effectiveTo", event.target.value)}
              className="mt-1 h-11 w-full rounded-md border border-edge bg-background px-3"
            />
          </label>
        </div>

        {previewRange ? (
          <p className="text-sm font-medium text-heading">{previewRange}</p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {FUEL_PRODUCTS.map((field) => (
            <label key={field.key} className="block text-sm">
              {field.label}
              <input
                required
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={values[field.key] ?? ""}
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

      {values.sourceUrl ? (
        <p className="mt-4 text-sm">
          <a
            href={values.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Abrir aviso oficial del MICM
          </a>
        </p>
      ) : null}
    </section>
  );
}
