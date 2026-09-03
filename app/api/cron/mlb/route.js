import { NextResponse } from "next/server";
import { jsonError } from "@/lib/admin/auth";
import { cronAuthorized } from "@/lib/cron-auth";
import { getMlbBundle } from "@/lib/sports/mlb";

export async function GET(request) {
  if (!cronAuthorized(request)) {
    return jsonError("No autorizado.", 401);
  }

  try {
    const data = await getMlbBundle({ forceRefresh: true });
    return NextResponse.json({
      ok: true,
      source: data.source,
      updatedAt: data.updatedAt,
      games: data.scores?.games?.length ?? 0,
      divisions: data.standings?.divisions?.length ?? 0,
      stars: data.players?.length ?? 0,
    });
  } catch {
    return jsonError("El cron de MLB falló.", 500);
  }
}
