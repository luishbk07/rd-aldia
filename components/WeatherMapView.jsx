"use client";

import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { rainViewerTileUrl } from "@/lib/weather-map";
import "leaflet/dist/leaflet.css";

const RD_CENTER = [18.7, -70.2];
const RD_ZOOM = 8;
const RD_BOUNDS = [
  [15.6, -74.2],
  [21.6, -66.2],
];

const LIGHT_BASE = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const DARK_BASE = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

function temperatureColor(value) {
  if (!Number.isFinite(value)) return "#64748b";
  if (value < 22) return "#2563eb";
  if (value < 26) return "#16a34a";
  if (value < 30) return "#ca8a04";
  if (value < 33) return "#ea580c";
  return "#dc2626";
}

function windIcon(speed, direction) {
  const going = ((Number(direction) || 0) + 180) % 360;
  const strength = Math.min(1, Math.max(0.35, (Number(speed) || 0) / 40));
  return L.divIcon({
    className: "weather-wind-icon",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;transform:rotate(${going}deg);opacity:${strength}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3v14M12 3l-4.2 5.2M12 3l4.2 5.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>`,
  });
}

function RadarTiles({ frame, visible }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = L.tileLayer("", {
      opacity: 0.72,
      zIndex: 350,
      tileSize: 256,
      className: "weather-radar-tiles",
      attribution:
        'Radar &copy; <a href="https://www.rainviewer.com/api.html">RainViewer</a>',
    });
    layerRef.current = layer;
    return () => {
      map.removeLayer(layer);
    };
  }, [map]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    if (!visible || !frame?.path) {
      if (map.hasLayer(layer)) map.removeLayer(layer);
      return;
    }
    layer.setUrl(rainViewerTileUrl(frame.path, frame.host));
    if (!map.hasLayer(layer)) layer.addTo(map);
  }, [frame, map, visible]);

  return null;
}

function RecenterControl() {
  const map = useMap();

  return (
    <button
      type="button"
      onClick={() => map.setView(RD_CENTER, RD_ZOOM, { animate: true })}
      className="absolute top-3 right-3 z-5 rounded-md border border-white/20 bg-heading/85 px-3 py-1.5 text-xs font-semibold text-white shadow-card backdrop-blur-sm hover:bg-heading dark:border-gold/40 dark:bg-surface/90 dark:text-gold"
    >
      Centrar en RD
    </button>
  );
}

function WindMarker({ point }) {
  const icon = useMemo(
    () => windIcon(point.windSpeed, point.windDirection),
    [point.windDirection, point.windSpeed],
  );

  return (
    <Marker position={[point.lat, point.lon]} icon={icon}>
      <Tooltip direction="top" offset={[0, -8]}>
        <span className="font-semibold">{point.name || "Viento"}</span>
        <br />
        {point.windSpeed} km/h
      </Tooltip>
    </Marker>
  );
}

function TemperatureLegend() {
  return (
    <div className="absolute bottom-8 left-3 z-5 rounded-md border border-edge bg-surface/90 px-2.5 py-2 text-[0.65rem] text-heading shadow-card backdrop-blur-sm dark:text-foreground">
      <p className="mb-1 font-semibold uppercase tracking-[0.08em]">°C</p>
      <div className="flex items-center gap-1">
        {[
          ["#2563eb", "22"],
          ["#16a34a", "26"],
          ["#ca8a04", "30"],
          ["#ea580c", "33"],
          ["#dc2626", "+"],
        ].map(([color, label]) => (
          <span key={label} className="flex flex-col items-center gap-0.5">
            <span className="size-3 rounded-sm" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function WeatherMapView({
  dark,
  frame,
  radarVisible,
  showTemperature,
  showWind,
  points,
}) {
  return (
    <MapContainer
      center={RD_CENTER}
      zoom={RD_ZOOM}
      minZoom={6}
      maxZoom={12}
      maxBounds={RD_BOUNDS}
      maxBoundsViscosity={0.7}
      scrollWheelZoom
      className="weather-leaflet h-full w-full"
      attributionControl
    >
      <TileLayer
        url={dark ? DARK_BASE : LIGHT_BASE}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <RadarTiles frame={frame} visible={radarVisible} />

      {showTemperature
        ? points
            .filter((point) => Number.isFinite(point.temperature))
            .map((point) => (
              <CircleMarker
                key={`temp-${point.id}`}
                center={[point.lat, point.lon]}
                radius={point.name ? 11 : 16}
                pathOptions={{
                  color: temperatureColor(point.temperature),
                  fillColor: temperatureColor(point.temperature),
                  fillOpacity: point.name ? 0.92 : 0.28,
                  weight: point.name ? 2 : 0,
                }}
              >
                <Tooltip direction="top" offset={[0, -6]}>
                  <span className="font-semibold">
                    {point.name || "Punto de malla"}
                  </span>
                  <br />
                  {point.temperature}°C
                </Tooltip>
              </CircleMarker>
            ))
        : null}

      {showWind
        ? points
            .filter((point) => Number.isFinite(point.windSpeed))
            .map((point) => <WindMarker key={`wind-${point.id}`} point={point} />)
        : null}

      {showTemperature ? <TemperatureLegend /> : null}
      <RecenterControl />
    </MapContainer>
  );
}
