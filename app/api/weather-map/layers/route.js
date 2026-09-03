import { NextResponse } from "next/server";
import { jsonError } from "@/lib/admin/auth";
import { fetchWithFallback } from "@/lib/fetchWithFallback";
import { fetchWeatherLayerBundle, isWeatherLayerBundle } from "@/lib/weather-map";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await fetchWithFallback({
      cacheKey: "weather-map-layers",
      ttlMs: 5 * 60 * 1000,
      isValid: isWeatherLayerBundle,
      primary: fetchWeatherLayerBundle,
    });

    return NextResponse.json(
      {
        ok: true,
        source: result.source,
        cached: result.cached,
        fallback: result.fallback,
        updatedAt: result.updatedAt,
        timezone: result.timezone,
        points: result.points,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch {
    return jsonError("No se pudieron cargar temperatura y viento.", 502);
  }
}
