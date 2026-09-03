import { NextResponse } from "next/server";
import { isSameOrigin, jsonError, requireAdmin } from "@/lib/admin/auth";
import { scrapeMicmFuelNotice } from "@/lib/fuel/scrape-micm";

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return jsonError("Origen no permitido.", 403);
  }

  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const notice = await scrapeMicmFuelNotice();
    return NextResponse.json(notice);
  } catch {
    return jsonError("No se pudo consultar el aviso del MICM.", 502);
  }
}
