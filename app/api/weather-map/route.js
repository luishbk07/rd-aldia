import { NextResponse } from "next/server";
import { jsonError } from "@/lib/admin/auth";
import { fetchWithFallback } from "@/lib/fetchWithFallback";
import { fetchRainViewerBundle, isRainViewerBundle } from "@/lib/weather-map";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await fetchWithFallback({
      cacheKey: "weather-map",
      ttlMs: 5 * 60 * 1000,
      isValid: isRainViewerBundle,
      primary: fetchRainViewerBundle,
    });

    return NextResponse.json(
      {
        ok: true,
        source: result.source,
        cached: result.cached,
        fallback: result.fallback,
        updatedAt: result.updatedAt,
        host: result.host,
        generated: result.generated,
        frames: result.frames,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch {
    return jsonError("No se pudo cargar el radar de lluvia.", 502);
  }
}
