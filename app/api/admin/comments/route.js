import { NextResponse } from "next/server";
import { z } from "zod";
import { isSameOrigin, jsonError, requireAdmin } from "@/lib/admin/auth";
import { updateComment } from "@/lib/admin/store";

const CommentSchema = z.object({
  id: z.string().min(1).max(80),
  approved: z.boolean(),
  featured: z.boolean(),
});

export async function PATCH(request) {
  if (!isSameOrigin(request)) {
    return jsonError("Origen no permitido.", 403);
  }

  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body;
  try {
    body = CommentSchema.parse(await request.json());
  } catch {
    return jsonError("Comentario inválido.");
  }

  try {
    const comment = await updateComment(body.id, {
      approved: body.approved,
      featured: body.featured,
    });
    return NextResponse.json({ ok: true, comment });
  } catch {
    return jsonError("No se pudo actualizar el comentario.", 500);
  }
}
