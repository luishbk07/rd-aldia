import { NextResponse } from "next/server";
import { jsonError } from "@/lib/admin/auth";
import { cronAuthorized } from "@/lib/cron-auth";
import { getLiveQuote } from "@/lib/currency/service";

export async function GET(request) {
  if (!cronAuthorized(request)) {
    return jsonError("No autorizado.", 401);
  }

  try {
    const result = await getLiveQuote({ persist: true, forceRefresh: true });
    return NextResponse.json({ ok: true, cached: result.cached, quote: result.quote });
  } catch {
    return jsonError("El cron de divisas falló.", 500);
  }
}
