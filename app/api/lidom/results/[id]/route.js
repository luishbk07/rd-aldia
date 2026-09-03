import { isSameOrigin, jsonError, requireAdmin } from "@/lib/admin/auth";
import { assertDistinctTeams, LidomResultSchema } from "@/lib/sports/schema";
import { deleteLidomResult, updateLidomResult } from "@/lib/sports/lidom-store";

export async function PUT(request, context) {
  if (!isSameOrigin(request)) return jsonError("Origen no permitido.", 403);
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;

  try {
    const body = LidomResultSchema.parse(await request.json());
    assertDistinctTeams(body.homeTeam, body.awayTeam);
    const result = await updateLidomResult(id, body);
    return Response.json({ ok: true, result });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "No se pudo actualizar.");
  }
}

export async function DELETE(request, context) {
  if (!isSameOrigin(request)) return jsonError("Origen no permitido.", 403);
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;

  try {
    await deleteLidomResult(id);
    return Response.json({ ok: true });
  } catch {
    return jsonError("No se pudo eliminar el partido.", 500);
  }
}
