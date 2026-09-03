import { NextResponse } from "next/server";
import { fetchWithFallback } from "@/lib/fetchWithFallback";
import { currencyLiveFallbackOptions } from "@/lib/currency/service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await fetchWithFallback(currencyLiveFallbackOptions({ persist: true }));
    return NextResponse.json({
      ok: true,
      cached: result.cached,
      source: result.source,
      fallback: result.fallback,
      quote: result.quote,
      updatedAt: result.updatedAt,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudieron obtener tasas en vivo.",
      },
      { status: 502 },
    );
  }
}
