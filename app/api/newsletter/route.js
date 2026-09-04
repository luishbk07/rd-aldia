import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, isSameOrigin, jsonError } from "@/lib/admin/auth";
import { rateLimit } from "@/lib/admin/rate-limit";
import { addSubscriber } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

const Schema = z.object({
  email: z.string().trim().email().max(160),
  website: z.string().optional(),
});

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return jsonError("Origen no permitido.", 403);
  }

  const limited = rateLimit(`newsletter:${clientIp(request)}`, {
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera e inténtalo de nuevo." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  let body;
  try {
    body = Schema.parse(await request.json());
  } catch {
    return jsonError("Escribe un correo válido.");
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  try {
    const result = await addSubscriber(body.email);
    return NextResponse.json({
      ok: true,
      duplicate: result.duplicate,
      message: result.duplicate
        ? "Este correo ya está en el boletín."
        : "Listo. Te escribiremos lo esencial de RD.",
    });
  } catch {
    return jsonError("No se pudo guardar la suscripción.", 500);
  }
}
