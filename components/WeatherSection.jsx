"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DataStatusBadge from "./DataStatusBadge";
import { SectionTitle } from "./ui";
import { ROUTES } from "@/lib/site";

const REFRESH_MS = 30 * 60 * 1000;

function formatDegrees(value) {
  return Number.isFinite(value) ? `${value}°` : "—";
}

function CityCard({ city, compact }) {
  const featured = Boolean(city.featured);

  return (
    <article
      className={`relative overflow-hidden rounded-xl border px-4 py-4 shadow-card ${
        featured
          ? "border-primary/40 bg-gradient-to-br from-sky-100 via-sky-50 to-white ring-2 ring-primary/25 dark:border-gold/50 dark:from-sky-950 dark:via-primary/40 dark:to-surface dark:ring-gold/30"
          : "border-sky-200/80 bg-gradient-to-br from-sky-50 to-white dark:border-sky-900/60 dark:from-sky-950/70 dark:to-surface"
      } ${compact ? "" : "sm:px-5 sm:py-5"}`}
    >
      {featured ? (
        <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary dark:text-gold">
          Capital
        </p>
      ) : null}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-lg leading-none" aria-hidden="true">
            {city.icon}
          </p>
          <h3 className="mt-1.5 font-heading text-sm font-semibold tracking-tight text-heading sm:text-base">
            {city.name}
          </h3>
        </div>
        <p className="font-heading text-2xl font-semibold tabular-nums text-heading sm:text-3xl">
          {formatDegrees(city.temperature)}C
        </p>
      </div>
      <p className="mt-2 text-sm text-muted">
        <span aria-hidden="true">{city.conditionIcon} </span>
        {city.condition}
      </p>
      <p className="mt-3 text-xs font-medium text-heading">
        Min {formatDegrees(city.min)} / Max {formatDegrees(city.max)}
      </p>
      <p className="mt-1 text-xs text-muted">
        {Number.isFinite(city.precipitation) ? `${city.precipitation}% lluvia` : "Lluvia n/d"}
      </p>
    </article>
  );
}

function Skeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="h-40 animate-pulse rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 dark:from-sky-950/50 dark:to-surface"
        />
      ))}
    </div>
  );
}

export default function WeatherSection({
  variant = "home",
  showHeading = true,
  showMoreLink = true,
}) {
  const [state, setState] = useState({ status: "loading" });
  const [tick, setTick] = useState(0);
  const compact = variant === "home";

  useEffect(() => {
    let cancelled = false;

    fetch("/api/weather")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "No se pudo cargar el clima.");
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

  useEffect(() => {
    const id = setInterval(() => {
      setState({ status: "loading" });
      setTick((current) => current + 1);
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  function retry() {
    setState({ status: "loading" });
    setTick((current) => current + 1);
  }

  return (
    <section>
      {showHeading ? (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionTitle eyebrow="Antes de salir">Clima en el país</SectionTitle>
          {state.status === "ready" ? (
            <DataStatusBadge
              source={state.data.source}
              updatedAt={state.data.updatedAt}
            />
          ) : null}
        </div>
      ) : state.status === "ready" ? (
        <div className="mb-4">
          <DataStatusBadge
            source={state.data.source}
            updatedAt={state.data.updatedAt}
          />
        </div>
      ) : null}

      <div className={showHeading ? "mt-8" : ""}>
        {state.status === "loading" ? <Skeleton /> : null}

        {state.status === "error" ? (
          <div className="rounded-xl border border-accent/30 bg-sky-50 p-6 dark:bg-sky-950/30">
            <p className="font-heading font-semibold text-heading">Clima</p>
            <p className="mt-2 text-sm text-accent">{state.message}</p>
            <button
              type="button"
              onClick={retry}
              className="mt-4 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary"
            >
              Reintentar
            </button>
          </div>
        ) : null}

        {state.status === "ready" ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {state.data.cities.map((city) => (
              <CityCard key={city.id} city={city} compact={compact} />
            ))}
          </div>
        ) : null}
      </div>

      {showMoreLink && variant === "home" ? (
        <Link
          href={ROUTES.weather}
          className="mt-5 inline-block text-sm font-semibold text-primary hover:underline dark:text-gold"
        >
          Ver clima por ciudad →
        </Link>
      ) : null}

      <p className="mt-4 text-xs text-muted">
        Pronóstico Open-Meteo · hora de Santo Domingo
      </p>
    </section>
  );
}
