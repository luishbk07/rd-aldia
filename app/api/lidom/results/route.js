import { isSameOrigin, jsonError, requireAdmin } from "@/lib/admin/auth";
import { assertDistinctTeams, LidomResultSchema } from "@/lib/sports/schema";
import { createLidomResult, listLidomResults } from "@/lib/sports/lidom-store";

export async function GET() {
  try {
    const results = await listLidomResults();
    return Response.json({ ok: true, results });
  } catch {
    return jsonError("No se pudieron cargar los resultados LIDOM.", 500);
  }
}

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Origen no permitido.", 403);
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = LidomResultSchema.parse(await request.json());
    assertDistinctTeams(body.homeTeam, body.awayTeam);
    const result = await createLidomResult(body);
    return Response.json({ ok: true, result });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Resultado inválido.");
  }
}
