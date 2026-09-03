import { z } from "zod";
import { isSameOrigin, jsonError, requireAdmin } from "@/lib/admin/auth";
import { currentLidomSeason } from "@/lib/sports/lidom";
import { listLidomStandings, upsertLidomStandings } from "@/lib/sports/lidom-store";

const StandingsSchema = z.object({
  season: z.string().min(4).max(12).optional(),
  teams: z
    .array(
      z.object({
        team: z.string().min(2),
        wins: z.number().int().min(0).max(80),
        losses: z.number().int().min(0).max(80),
      }),
    )
    .length(6),
});

export async function GET() {
  try {
    const standings = await listLidomStandings();
    return Response.json({ ok: true, standings, season: currentLidomSeason() });
  } catch {
    return jsonError("No se pudieron cargar las posiciones.", 500);
  }
}

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Origen no permitido.", 403);
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = StandingsSchema.parse(await request.json());
    const standings = await upsertLidomStandings(body);
    return Response.json({ ok: true, standings });
  } catch {
    return jsonError("Tabla de posiciones inválida.");
  }
}
