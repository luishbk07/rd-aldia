import { NextResponse } from "next/server";
import { z } from "zod";
import { isSameOrigin, jsonError, requireAdmin } from "@/lib/admin/auth";
import { asQuote } from "@/lib/currency/providers";
import { setMemoryQuote } from "@/lib/currency/cache";
import { saveQuote } from "@/lib/currency/store";

const UpdateSchema = z.object({
  usdRate: z.number().positive().max(200),
  euroRate: z.number().positive().max(300),
  goldUsd: z.number().positive().max(20000),
  goldRd: z.number().positive().max(2_000_000).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  source: z.enum(["manual", "bcrd"]).optional(),
});

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return jsonError("Origen no permitido.", 403);
  }

  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body;
  try {
    body = UpdateSchema.parse(await request.json());
  } catch {
    return jsonError("Tasas inválidas.");
  }

  try {
    const quote = asQuote({
      usdRate: body.usdRate,
      euroRate: body.euroRate,
      goldUsd: body.goldUsd,
      goldRd: body.goldRd,
      source: body.source || "bcrd",
      date: body.date,
    });
    const saved = await saveQuote(quote);
    setMemoryQuote(saved);
    return NextResponse.json({ ok: true, quote: saved });
  } catch {
    return jsonError("No se pudo guardar la cotización.", 500);
  }
}
