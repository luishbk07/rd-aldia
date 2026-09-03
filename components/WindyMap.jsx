"use client";

import { useMemo, useState } from "react";

const LAT = 18.7;
const LON = -70.2;
const ZOOM = 8;

const LAYERS = [
  { id: "wind", overlay: "wind", label: "Viento" },
  { id: "temp", overlay: "temp", label: "Temperatura" },
  { id: "rain", overlay: "rain", label: "Lluvia" },
  { id: "clouds", overlay: "clouds", label: "Nubes" },
];

function embedUrl(overlay) {
  const params = new URLSearchParams({
    lat: String(LAT),
    lon: String(LON),
    zoom: String(ZOOM),
    overlay,
    product: "ecmwf",
    level: "surface",
    type: "map",
    location: "coordinates",
    metricTemp: "°C",
    metricWind: "km/h",
  });
  return `https://embed.windy.com/embed2.html?${params}`;
}

function windyPageUrl(overlay) {
  return `https://www.windy.com/?${overlay},${LAT},${LON},${ZOOM}`;
}

export default function WindyMap() {
  const [overlay, setOverlay] = useState("wind");
  const [loaded, setLoaded] = useState(false);

  const src = useMemo(() => embedUrl(overlay), [overlay]);
  const current = LAYERS.find((layer) => layer.overlay === overlay) || LAYERS[0];

  function changeLayer(next) {
    if (next === overlay) return;
    setLoaded(false);
    setOverlay(next);
  }

  return (
    <section className="mb-10 overflow-hidden rounded-2xl border border-sky-200/80 bg-surface shadow-card dark:border-sky-900/60 dark:shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-edge px-4 py-4 sm:px-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Mapa interactivo
            </p>
            <span className="inline-flex items-center rounded-full bg-gold/25 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-heading dark:bg-gold/20 dark:text-gold">
              Premium
            </span>
          </div>
          <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight text-heading sm:text-2xl">
            Viento, lluvia y temperatura
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Mapa ECMWF de Windy centrado en República Dominicana, con partículas
            de viento y capas de lluvia, temperatura y nubes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-heading">
            <span className="text-muted">Cambiar capa</span>
            <select
              value={overlay}
              onChange={(event) => changeLayer(event.target.value)}
              className="rounded-md border border-edge bg-sky-50/80 px-3 py-1.5 text-xs font-semibold text-heading dark:bg-sky-950/40 dark:text-foreground"
              aria-label="Cambiar capa"
            >
              {LAYERS.map((layer) => (
                <option key={layer.id} value={layer.overlay}>
                  {layer.label}
                </option>
              ))}
            </select>
          </label>
          <a
            href={windyPageUrl(overlay)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/8 dark:border-gold dark:text-gold dark:hover:bg-gold/10"
          >
            Ver en Windy.com
          </a>
        </div>
      </div>

      <div className="relative h-[300px] w-full bg-sky-50 dark:bg-sky-950/40 sm:h-[500px]">
        {!loaded ? (
          <div className="absolute inset-0 z-1 flex flex-col items-center justify-center gap-3">
            <span
              className="size-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary dark:border-gold/20 dark:border-t-gold"
              aria-hidden="true"
            />
            <p className="text-sm text-muted">Cargando mapa de {current.label.toLowerCase()}…</p>
          </div>
        ) : null}

        <iframe
          key={src}
          title={`Mapa Windy · ${current.label} en República Dominicana`}
          src={src}
          width="100%"
          height="500"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
          className="relative z-0 h-full w-full border-0"
        />
      </div>

      <p className="border-t border-edge px-4 py-3 text-xs text-muted sm:px-5">
        Pronóstico ECMWF vía Windy · capa {current.label.toLowerCase()}
      </p>
    </section>
  );
}
