import { NextResponse } from "next/server";
import { getLatestFuelPrices } from "@/lib/admin/store";
import { fetchWithFallback } from "@/lib/fetchWithFallback";
import { formatValidityRange } from "@/lib/fuel/dates";
import { FUEL_PRODUCTS, formatDop, hasPublishedPrices } from "@/lib/fuel/normalize";

export const revalidate = 3600;

function payloadFromFuel(fuel, source) {
  const published = hasPublishedPrices(fuel);
  return {
    ok: published,
    source,
    fuel: published ? fuel : null,
    products: published
      ? FUEL_PRODUCTS.map((product) => ({
          ...product,
          price: fuel[product.key],
          formatted: formatDop(fuel[product.key]),
        }))
      : [],
    validity: published ? formatValidityRange(fuel.effectiveFrom, fuel.effectiveTo) : null,
    sourceNote: published
      ? fuel.source === "manual"
        ? "Datos ingresados manualmente en el panel de administración (aviso semanal del MICM)."
        : "Datos tomados de un aviso semanal publicado por el MICM."
      : null,
    updatedAt: fuel?.updatedAt || null,
  };
}

export async function GET() {
  try {
    const result = await fetchWithFallback({
      cacheKey: "fuel-prices",
      ttlMs: 5 * 60 * 1000,
      fallbackFile: "data/fallbacks/fuel-prices.json",
      isValid: (data) => Boolean(data?.fuel),
      async primary() {
        const fuel = await getLatestFuelPrices();
        return { fuel, updatedAt: fuel.updatedAt };
      },
    });

    return NextResponse.json(payloadFromFuel(result.fuel, result.source), {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudieron cargar los precios de combustible." },
      { status: 500 },
    );
  }
}
