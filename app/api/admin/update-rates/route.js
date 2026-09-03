import { NextResponse } from "next/server";
import { z } from "zod";
import { isSameOrigin, jsonError, requireAdmin } from "@/lib/admin/auth";
import { upsertExchangeRates } from "@/lib/admin/store";

const RateSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    usdBuy: z.number().min(0).max(500),
    usdSell: z.number().min(0).max(500),
    euroBuy: z.number().min(0).max(500),
    euroSell: z.number().min(0).max(500),
    goldPrice: z.number().min(0).max(20000),
  })
  .refine((value) => value.usdSell >= value.usdBuy, {
    message: "USD venta debe ser ≥ compra.",
  })
  .refine((value) => value.euroSell >= value.euroBuy, {
    message: "EUR venta debe ser ≥ compra.",
  });

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return jsonError("Origen no permitido.", 403);
  }

  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body;
  try {
    body = RateSchema.parse(await request.json());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tasas inválidas.";
    return jsonError(message);
  }

  try {
    const rates = await upsertExchangeRates(body);
    return NextResponse.json({ ok: true, rates });
  } catch {
    return jsonError("No se pudieron guardar las tasas.", 500);
  }
}
