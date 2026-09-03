import { NextResponse } from "next/server";
import { z } from "zod";
import { isSameOrigin, jsonError, requireAdmin } from "@/lib/admin/auth";
import { upsertSportsResult } from "@/lib/admin/store";

const SportsSchema = z.object({
  id: z.string().max(80).optional(),
  league: z.enum(["LIDOM", "MLB"]),
  homeTeam: z.string().trim().min(2).max(80),
  awayTeam: z.string().trim().min(2).max(80),
  homeScore: z.number().int().min(0).max(99),
  awayScore: z.number().int().min(0).max(99),
  date: z.string().min(10).max(40),
  status: z.enum(["scheduled", "live", "final", "postponed", "canceled"]),
});

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return jsonError("Origen no permitido.", 403);
  }

  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body;
  try {
    body = SportsSchema.parse(await request.json());
  } catch {
    return jsonError("Resultado deportivo inválido.");
  }

  try {
    const result = await upsertSportsResult(body);
    return NextResponse.json({ ok: true, result });
  } catch {
    return jsonError("No se pudo guardar el resultado.", 500);
  }
}
