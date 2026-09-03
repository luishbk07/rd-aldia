import { NextResponse } from "next/server";
import { jsonError } from "@/lib/admin/auth";
import { fetchWithFallback } from "@/lib/fetchWithFallback";
import { fetchWeatherBundle, isWeatherBundle } from "@/lib/weather";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await fetchWithFallback({
      cacheKey: "rd-weather",
      ttlMs: 10 * 60 * 1000,
      fallbackFile: "data/fallbacks/weather.json",
      isValid: isWeatherBundle,
      primary: fetchWeatherBundle,
    });

    return NextResponse.json(
      {
        ok: true,
        source: result.source,
        cached: result.cached,
        fallback: result.fallback,
        updatedAt: result.updatedAt,
        timezone: result.timezone,
        cities: result.cities,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800",
        },
      },
    );
  } catch {
    return jsonError("No se pudo cargar el clima.", 500);
  }
}
