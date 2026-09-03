import { z } from "zod";
import { isSameOrigin, jsonError, requireAdmin } from "@/lib/admin/auth";
import { getSpotlight, saveSpotlight } from "@/lib/sports/lidom-store";

const SpotlightSchema = z.object({
  playerName: z.string().trim().min(2).max(80),
  team: z.string().trim().min(2).max(80),
  note: z.string().trim().min(8).max(400),
  weekOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function GET() {
  try {
    const spotlight = await getSpotlight();
    return Response.json({ ok: true, spotlight });
  } catch {
    return jsonError("No se pudo cargar el jugador de la semana.", 500);
  }
}

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Origen no permitido.", 403);
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = SpotlightSchema.parse(await request.json());
    const spotlight = await saveSpotlight(body);
    return Response.json({ ok: true, spotlight });
  } catch {
    return jsonError("Jugador de la semana inválido.");
  }
}
