"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const WeatherMapView = dynamic(() => import("./WeatherMapView"), {
  ssr: false,
  loading: () => <MapSpinner label="Cargando mapa…" />,
});

const FRAME_MS = 520;
const HOLD_LAST_MS = 1400;

function MapSpinner({ label = "Cargando radar…" }) {
  return (
    <div className="flex h-full min-h-[420px] w-full flex-col items-center justify-center gap-3 bg-sky-50 dark:bg-sky-950/40">
      <span
        className="size-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary dark:border-gold/20 dark:border-t-gold"
        aria-hidden="true"
      />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

function formatFrameTime(unix) {
  if (!Number.isFinite(unix)) return "—";
  return new Intl.DateTimeFormat("es-DO", {
    timeZone: "America/Santo_Domingo",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(unix * 1000));
}

function layerButtonClass(active) {
  return `rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
    active
      ? "bg-primary text-white dark:bg-gold dark:text-heading"
      : "bg-white/80 text-heading hover:bg-white dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10"
  }`;
}

export default function WeatherMap() {
  const [radar, setRadar] = useState({ status: "loading" });
  const [layers, setLayers] = useState({ status: "loading", points: [] });
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [radarOn, setRadarOn] = useState(true);
  const [showRain, setShowRain] = useState(true);
  const [showTemperature, setShowTemperature] = useState(false);
  const [showWind, setShowWind] = useState(false);
  const [dark, setDark] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/weather-map")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "No se pudo cargar el radar de lluvia.");
        }
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        let lastPast = data.frames.length - 1;
        for (let index = data.frames.length - 1; index >= 0; index -= 1) {
          if (data.frames[index].kind === "past") {
            lastPast = index;
            break;
          }
        }
        setFrameIndex(Math.max(lastPast, 0));
        setRadar({ status: "ready", data });
      })
      .catch((error) => {
        if (!cancelled) {
          setRadar({
            status: "error",
            message: error instanceof Error ? error.message : "Error de red.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reload]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/weather-map/layers")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "No se pudieron cargar temperatura y viento.");
        }
        return data;
      })
      .then((data) => {
        if (!cancelled) setLayers({ status: "ready", points: data.points || [] });
      })
      .catch(() => {
        if (!cancelled) setLayers({ status: "error", points: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [reload]);

  const frames = radar.status === "ready" ? radar.data.frames : [];
  const frame = frames[frameIndex] || null;
  const radarVisible = radarOn && showRain && Boolean(frame);

  useEffect(() => {
    if (!playing || !radarVisible || frames.length < 2) return undefined;
    const delay = frameIndex === frames.length - 1 ? HOLD_LAST_MS : FRAME_MS;
    const id = window.setTimeout(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, delay);
    return () => window.clearTimeout(id);
  }, [frameIndex, frames.length, playing, radarVisible]);

  const layerHint = useMemo(() => {
    if (showTemperature && layers.status === "error") {
      return "Temperatura no disponible en este momento.";
    }
    if (showWind && layers.status === "error") {
      return "Viento no disponible en este momento.";
    }
    return null;
  }, [layers.status, showTemperature, showWind]);

  function toggleRain() {
    setShowRain((current) => {
      const next = !current;
      if (next) setRadarOn(true);
      return next;
    });
  }

  function toggleRadar() {
    setRadarOn((current) => {
      const next = !current;
      if (next) setShowRain(true);
      return next;
    });
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
            Radar, temperatura y viento
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Radar de lluvia, temperatura y viento sobre República Dominicana.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-edge bg-sky-50/80 p-1 dark:bg-sky-950/40" role="group" aria-label="Capas del mapa">
            <button type="button" aria-pressed={showRain} className={layerButtonClass(showRain)} onClick={toggleRain}>
              Lluvia
            </button>
            <button
              type="button"
              aria-pressed={showTemperature}
              className={layerButtonClass(showTemperature)}
              onClick={() => setShowTemperature((current) => !current)}
            >
              Temperatura
            </button>
            <button
              type="button"
              aria-pressed={showWind}
              className={layerButtonClass(showWind)}
              onClick={() => setShowWind((current) => !current)}
            >
              Viento
            </button>
          </div>
          <button
            type="button"
            aria-pressed={radarOn && showRain}
            onClick={toggleRadar}
            className={layerButtonClass(radarOn && showRain)}
          >
            Radar
          </button>
        </div>
      </div>

      {radar.status === "error" ? (
        <div className="border-b border-accent/25 bg-accent/5 px-4 py-3 sm:px-5">
          <p className="text-sm text-accent">{radar.message}</p>
          <button
            type="button"
            onClick={() => {
              setRadar({ status: "loading" });
              setLayers({ status: "loading", points: [] });
              setReload((current) => current + 1);
            }}
            className="mt-2 text-sm font-semibold text-primary underline-offset-2 hover:underline dark:text-gold"
          >
            Reintentar radar
          </button>
        </div>
      ) : null}

      {layerHint ? (
        <p className="border-b border-edge px-4 py-2 text-xs text-muted sm:px-5">{layerHint}</p>
      ) : null}

      <div className="weather-map-root relative h-[420px] w-full sm:h-[480px]">
        {radar.status === "loading" ? (
          <MapSpinner />
        ) : (
          <WeatherMapView
            dark={dark}
            frame={frame}
            radarVisible={radarVisible}
            showTemperature={showTemperature}
            showWind={showWind}
            points={layers.points}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-edge px-4 py-3 sm:px-5">
        <button
          type="button"
          disabled={!radarVisible || frames.length < 2}
          onClick={() => setPlaying((current) => !current)}
          className="inline-flex min-w-20 items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gold dark:text-heading"
        >
          {playing ? "Pausa" : "Reproducir"}
        </button>
        <input
          type="range"
          min={0}
          max={Math.max(frames.length - 1, 0)}
          value={frameIndex}
          disabled={!radarVisible || frames.length < 2}
          onChange={(event) => {
            setPlaying(false);
            setFrameIndex(Number(event.target.value));
          }}
          className="h-1.5 min-w-36 flex-1 accent-primary dark:accent-gold"
          aria-label="Cuadro del radar"
        />
        <p className="min-w-28 text-right text-xs font-medium text-heading">
          {frame ? formatFrameTime(frame.time) : "Sin radar"}
          {frame?.kind === "nowcast" ? (
            <span className="ml-1 text-accent">Pronóstico</span>
          ) : null}
        </p>
      </div>
    </section>
  );
}
