import { NextResponse } from "next/server";
import { jsonError } from "@/lib/admin/auth";
import { cronAuthorized } from "@/lib/cron-auth";
import { fetchWithFallback } from "@/lib/fetchWithFallback";
import { fetchWeatherBundle, isWeatherBundle, storedWeatherBundle } from "@/lib/weather";

export async function GET(request) {
  if (!cronAuthorized(request)) {
    return jsonError("No autorizado.", 401);
  }

  try {
    const result = await fetchWithFallback({
      cacheKey: "rd-weather",
      ttlMs: 10 * 60 * 1000,
      forceRefresh: true,
      fallbackFile: "data/fallbacks/weather.json",
      isValid: isWeatherBundle,
      store: storedWeatherBundle,
      primary: fetchWeatherBundle,
    });

    return NextResponse.json({
      ok: true,
      source: result.source,
      updatedAt: result.updatedAt,
      cities: result.cities?.length ?? 0,
    });
  } catch {
    return jsonError("El cron de clima falló.", 500);
  }
}
