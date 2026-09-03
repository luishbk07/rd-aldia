import { CITIES } from "@/data/cities";

const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";
const TIMEZONE = "America/Santo_Domingo";

/** WMO weather interpretation codes → Spanish label + emoji. */
const WEATHER_CODES = {
  0: { label: "Despejado", icon: "☀️" },
  1: { label: "Mayormente despejado", icon: "🌤️" },
  2: { label: "Parcialmente nublado", icon: "⛅" },
  3: { label: "Nublado", icon: "☁️" },
  45: { label: "Niebla", icon: "🌫️" },
  48: { label: "Niebla helada", icon: "🌫️" },
  51: { label: "Llovizna ligera", icon: "🌦️" },
  53: { label: "Llovizna", icon: "🌦️" },
  55: { label: "Llovizna intensa", icon: "🌧️" },
  56: { label: "Llovizna helada", icon: "🌧️" },
  57: { label: "Llovizna helada intensa", icon: "🌧️" },
  61: { label: "Lluvia ligera", icon: "🌧️" },
  63: { label: "Lluvia", icon: "🌧️" },
  65: { label: "Lluvia intensa", icon: "🌧️" },
  66: { label: "Lluvia helada", icon: "🌧️" },
  67: { label: "Lluvia helada intensa", icon: "🌧️" },
  71: { label: "Nieve ligera", icon: "❄️" },
  73: { label: "Nieve", icon: "❄️" },
  75: { label: "Nieve intensa", icon: "❄️" },
  77: { label: "Granos de nieve", icon: "❄️" },
  80: { label: "Chubascos ligeros", icon: "🌦️" },
  81: { label: "Chubascos", icon: "🌧️" },
  82: { label: "Chubascos fuertes", icon: "🌧️" },
  85: { label: "Chubascos de nieve", icon: "❄️" },
  86: { label: "Chubascos de nieve fuertes", icon: "❄️" },
  95: { label: "Tormenta", icon: "⛈️" },
  96: { label: "Tormenta con granizo", icon: "⛈️" },
  99: { label: "Tormenta con granizo fuerte", icon: "⛈️" },
};

export function describeWeather(code) {
  return WEATHER_CODES[code] || { label: "Condición no disponible", icon: "🌡️" };
}

function roundTemp(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function cityUrl(city) {
  const params = new URLSearchParams({
    latitude: String(city.lat),
    longitude: String(city.lon),
    current_weather: "true",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: TIMEZONE,
    forecast_days: "1",
  });
  return `${OPEN_METEO}?${params}`;
}

export function mapCityForecast(city, data) {
  const current = data?.current_weather || {};
  const daily = data?.daily || {};
  const code = Number(current.weathercode);
  const condition = describeWeather(Number.isFinite(code) ? code : -1);

  return {
    id: city.id,
    name: city.name,
    icon: city.icon,
    lat: city.lat,
    lon: city.lon,
    featured: Boolean(city.featured),
    temperature: roundTemp(current.temperature),
    weatherCode: Number.isFinite(code) ? code : null,
    condition: condition.label,
    conditionIcon: condition.icon,
    min: roundTemp(daily.temperature_2m_min?.[0]),
    max: roundTemp(daily.temperature_2m_max?.[0]),
    precipitation: Number.isFinite(Number(daily.precipitation_probability_max?.[0]))
      ? Math.round(Number(daily.precipitation_probability_max[0]))
      : null,
    observedAt: current.time || null,
  };
}

async function fetchCityWeather(city) {
  const response = await fetch(cityUrl(city), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "RD-Al-Dia/1.0 (weather)",
    },
  });
  if (!response.ok) throw new Error(`Open-Meteo HTTP ${response.status}`);
  return mapCityForecast(city, await response.json());
}

export function isWeatherBundle(data) {
  return (
    Array.isArray(data?.cities) &&
    data.cities.length === CITIES.length &&
    data.cities.every((city) => Number.isFinite(city?.temperature))
  );
}

export async function fetchWeatherBundle() {
  const cities = await Promise.all(CITIES.map(fetchCityWeather));
  return {
    cities,
    timezone: TIMEZONE,
    updatedAt: new Date().toISOString(),
  };
}
