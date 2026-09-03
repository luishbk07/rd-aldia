import { NextResponse } from "next/server";
import { jsonError } from "@/lib/admin/auth";
import { cronAuthorized } from "@/lib/cron-auth";
import { getNewsBundle } from "@/lib/news/aggregator";

export async function GET(request) {
  if (!cronAuthorized(request)) {
    return jsonError("No autorizado.", 401);
  }

  try {
    const data = await getNewsBundle({ forceRefresh: true });
    return NextResponse.json({
      ok: true,
      source: data.source,
      cached: data.cached,
      updatedAt: data.updatedAt,
      articles: data.articles?.length ?? 0,
    });
  } catch {
    return jsonError("El cron de noticias falló.", 500);
  }
}
