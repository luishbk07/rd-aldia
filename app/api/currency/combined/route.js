import { NextResponse } from "next/server";
import { getCombinedQuote } from "@/lib/currency/service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getCombinedQuote();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No hay tasas en vivo ni guardadas.",
      },
      { status: 502 },
    );
  }
}
