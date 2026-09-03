import { jsonError } from "@/lib/admin/auth";
import { fetchWithFallback } from "@/lib/fetchWithFallback";
import { mlbStandingsFallbackOptions } from "@/lib/sports/mlb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await fetchWithFallback(mlbStandingsFallbackOptions());
    return Response.json({ ok: true, ...payload });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "No se pudieron cargar las posiciones de MLB.",
      502,
    );
  }
}
