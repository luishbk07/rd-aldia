import { NextResponse } from "next/server";
import { jsonError } from "@/lib/admin/auth";
import { getMlbBundle } from "@/lib/sports/mlb";

function authorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request) {
  if (!authorized(request)) {
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
