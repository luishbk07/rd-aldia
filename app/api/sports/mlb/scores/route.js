import { jsonError } from "@/lib/admin/auth";
import { fetchWithFallback } from "@/lib/fetchWithFallback";
import { santoDomingoDate } from "@/lib/sports/lidom";
import { mlbScoresFallbackOptions } from "@/lib/sports/mlb";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const date = new URL(request.url).searchParams.get("date") || santoDomingoDate();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return jsonError("Usa una fecha YYYY-MM-DD.");
    }
    const payload = await fetchWithFallback(mlbScoresFallbackOptions(date));
    return Response.json({ ok: true, ...payload });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "No se pudieron cargar los marcadores de MLB.",
      502,
    );
  }
}
