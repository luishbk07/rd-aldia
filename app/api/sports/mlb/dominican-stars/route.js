import { jsonError } from "@/lib/admin/auth";
import { fetchWithFallback } from "@/lib/fetchWithFallback";
import { mlbDominicanStarsFallbackOptions } from "@/lib/sports/mlb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await fetchWithFallback(mlbDominicanStarsFallbackOptions());
    return Response.json({ ok: true, ...payload });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "No se pudieron cargar los dominicanos en MLB.",
      502,
    );
  }
}
