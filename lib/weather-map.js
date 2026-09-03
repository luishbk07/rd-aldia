import { CITIES } from "@/data/cities";

const RAINVIEWER_URL = "https://api.rainviewer.com/public/weather-maps.json";
const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";
const DEFAULT_TILE_HOST = "https://tilecache.rainviewer.com";
const TIMEZONE = "America/Santo_Domingo";

const RD_LAT_MIN = 17.45;
const RD_LAT_MAX = 19.98;
const RD_LON_MIN = -72.05;
const RD_LON_MAX = -68.25;
const GRID_LATS = 6;
const GRID_LONS = 8;

export const WEATHER_MAP_CENTER = { lat: 18.7, lon: -70.2, zoom: 8 };

function headers(kind) {
  return {
    Accept: "application/json",
    "User-Agent": `RD-Al-Dia/1.0 (${kind})`,
  };
}

function asFrame(entry, kind, host) {
  const time = Number(entry?.time);
  const path = typeof entry?.path === "string" ? entry.path : "";
  if (!path || !Number.isFinite(time)) return null;
  return { time, path, kind, host };
}

export function rainViewerTileUrl(path, host = DEFAULT_TILE_HOST) {
  const origin = String(host || DEFAULT_TILE_HOST).replace(/\/$/, "");
  return `${origin}${path}/256/{z}/{x}/{y}/2/1_1.png`;
}

export function mapRainViewerPayload(data) {
  const host =
    typeof data?.host === "string" && data.host.startsWith("http")
      ? data.host.replace(/\/$/, "")
      : DEFAULT_TILE_HOST;
  const past = Array.isArray(data?.radar?.past) ? data.radar.past : [];
  const nowcast = Array.isArray(data?.radar?.nowcast) ? data.radar.nowcast : [];
  const frames = [
    ...past.map((entry) => asFrame(entry, "past", host)),
    ...nowcast.map((entry) => asFrame(entry, "nowcast", host)),
  ].filter(Boolean);

  return {
    host,
    generated: Number.isFinite(Number(data?.generated)) ? Number(data.generated) : null,
    frames,
    updatedAt: new Date().toISOString(),
  };
}

export function isRainViewerBundle(data) {
  return Array.isArray(data?.frames) && data.frames.length > 0;
}

export async function fetchRainViewerBundle() {
  const response = await fetch(RAINVIEWER_URL, {
    cache: "no-store",
    headers: headers("rainviewer"),
  });
  if (!response.ok) throw new Error(`RainViewer HTTP ${response.status}`);
  return mapRainViewerPayload(await response.json());
}

function gridCoordinates() {
  const points = [];
  for (let i = 0; i < GRID_LATS; i += 1) {
    const lat = RD_LAT_MIN + (i / (GRID_LATS - 1)) * (RD_LAT_MAX - RD_LAT_MIN);
    for (let j = 0; j < GRID_LONS; j += 1) {
      const lon = RD_LON_MIN + (j / (GRID_LONS - 1)) * (RD_LON_MAX - RD_LON_MIN);
      points.push({
        lat: Number(lat.toFixed(3)),
        lon: Number(lon.toFixed(3)),
        name: null,
      });
    }
  }
  for (const city of CITIES) {
    points.push({
      lat: city.lat,
      lon: city.lon,
      name: city.name,
    });
  }
  return points;
}

function readCurrent(row) {
  const current = row?.current || {};
  const temperature = Number(current.temperature_2m);
  const windSpeed = Number(current.wind_speed_10m);
  const windDirection = Number(current.wind_direction_10m);
  return {
    temperature: Number.isFinite(temperature) ? Math.round(temperature) : null,
    windSpeed: Number.isFinite(windSpeed) ? Math.round(windSpeed) : null,
    windDirection: Number.isFinite(windDirection) ? Math.round(windDirection) : null,
  };
}

export function mapOpenMeteoLayers(points, payload) {
  const rows = Array.isArray(payload) ? payload : [payload];
  return points.map((point, index) => {
    const values = readCurrent(rows[index] || {});
    return {
      id: point.name ? `city-${point.name}` : `grid-${point.lat}-${point.lon}`,
      lat: point.lat,
      lon: point.lon,
      name: point.name,
      ...values,
    };
  });
}

export function isWeatherLayerBundle(data) {
  return (
    Array.isArray(data?.points) &&
    data.points.length > 0 &&
    data.points.some(
      (point) => Number.isFinite(point?.temperature) || Number.isFinite(point?.windSpeed),
    )
  );
}

export async function fetchWeatherLayerBundle() {
  const points = gridCoordinates();
  const params = new URLSearchParams({
    latitude: points.map((point) => point.lat).join(","),
    longitude: points.map((point) => point.lon).join(","),
    current: "temperature_2m,wind_speed_10m,wind_direction_10m",
    wind_speed_unit: "kmh",
    timezone: TIMEZONE,
  });

  const response = await fetch(`${OPEN_METEO}?${params}`, {
    cache: "no-store",
    headers: headers("open-meteo-layers"),
  });
  if (!response.ok) throw new Error(`Open-Meteo HTTP ${response.status}`);

  return {
    timezone: TIMEZONE,
    points: mapOpenMeteoLayers(points, await response.json()),
    updatedAt: new Date().toISOString(),
  };
}
