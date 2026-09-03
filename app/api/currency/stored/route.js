import { NextResponse } from "next/server";
import { getStoredBundle } from "@/lib/currency/service";
import { variation } from "@/lib/currency/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { quote, history, previous } = await getStoredBundle();
    if (!quote) {
      return NextResponse.json({ ok: false, quote: null, history: [] });
    }

    return NextResponse.json({
      ok: true,
      quote,
      history,
      change: {
        usd: variation(quote, previous, "usdRate"),
        euro: variation(quote, previous, "euroRate"),
        gold: variation(quote, previous, "goldRd"),
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudieron leer las tasas guardadas." },
      { status: 500 },
    );
  }
}
