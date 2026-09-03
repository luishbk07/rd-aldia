import { NextResponse } from "next/server";
import { z } from "zod";
import { isSameOrigin, jsonError, requireAdmin } from "@/lib/admin/auth";
import { upsertFuelPrices } from "@/lib/admin/store";
import { addDays } from "@/lib/fuel/dates";

const FuelSchema = z.object({
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  effectiveTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  gasolinePremium: z.number().min(0).max(1000),
  gasolineRegular: z.number().min(0).max(1000),
  gasoilRegular: z.number().min(0).max(1000),
  gasoilOptimo: z.number().min(0).max(1000),
  glp: z.number().min(0).max(1000),
  source: z.enum(["manual", "scrape"]).optional(),
  sourceUrl: z.string().url().nullable().optional(),
});

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return jsonError("Origen no permitido.", 403);
  }

  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body;
  try {
    body = FuelSchema.parse(await request.json());
  } catch {
    return jsonError(
      "Precios inválidos. Indica la fecha de vigencia y los 5 precios en RD$ / galón.",
    );
  }

  try {
    const fuel = await upsertFuelPrices({
      ...body,
      effectiveTo: body.effectiveTo || addDays(body.effectiveFrom, 6),
      source: body.source || "manual",
    });
    return NextResponse.json({ ok: true, fuel });
  } catch {
    return jsonError("No se pudieron guardar los precios.", 500);
  }
}
