import { NextResponse } from "next/server";
import { jsonError } from "@/lib/admin/auth";
import { getLiveQuote } from "@/lib/currency/service";

function authorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request) {
  if (!authorized(request)) {
    return jsonError("No autorizado.", 401);
  }

  try {
    const result = await getLiveQuote({ persist: true });
    return NextResponse.json({ ok: true, cached: result.cached, quote: result.quote });
  } catch {
    return jsonError("El cron de divisas falló.", 500);
  }
}
