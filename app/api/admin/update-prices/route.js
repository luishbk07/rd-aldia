import { NextResponse } from "next/server";
import { z } from "zod";
import { isSameOrigin, jsonError, requireAdmin } from "@/lib/admin/auth";
import { upsertFuelPrices } from "@/lib/admin/store";
import { addDays } from "@/lib/fuel/dates";

const LegacySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  gasolinePremium: z.number().min(0).max(1000),
  gasolineRegular: z.number().min(0).max(1000),
  diesel: z.number().min(0).max(1000).optional(),
  propane: z.number().min(0).max(1000).optional(),
  gasoilRegular: z.number().min(0).max(1000).optional(),
  gasoilOptimo: z.number().min(0).max(1000).optional(),
  glp: z.number().min(0).max(1000).optional(),
});

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return jsonError("Origen no permitido.", 403);
  }

  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body;
  try {
    body = LegacySchema.parse(await request.json());
  } catch {
    return jsonError("Precios inválidos. Usa números en RD$ / galón.");
  }

  const effectiveFrom = body.effectiveFrom || body.date;
  if (!effectiveFrom) {
    return jsonError("Indica la fecha de vigencia.");
  }

  try {
    const fuel = await upsertFuelPrices({
      effectiveFrom,
      effectiveTo: addDays(effectiveFrom, 6),
      gasolinePremium: body.gasolinePremium,
      gasolineRegular: body.gasolineRegular,
      gasoilRegular: body.gasoilRegular ?? body.diesel ?? 0,
      gasoilOptimo: body.gasoilOptimo ?? 0,
      glp: body.glp ?? body.propane ?? 0,
      source: "manual",
    });
    return NextResponse.json({ ok: true, fuel });
  } catch {
    return jsonError("No se pudieron guardar los precios.", 500);
  }
}
