import { NextResponse } from "next/server";
import { z } from "zod";
import {
  clientIp,
  credentialsMatch,
  isSameOrigin,
  jsonError,
  sessionCookieOptions,
  signSession,
} from "@/lib/admin/auth";
import { SESSION_COOKIE } from "@/lib/admin/config";
import { rateLimit } from "@/lib/admin/rate-limit";

const LoginSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(128),
});

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return jsonError("Origen no permitido.", 403);
  }

  const limited = rateLimit(`login:${clientIp(request)}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!limited.ok) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera e inténtalo de nuevo." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfter) },
      },
    );
  }

  let body;
  try {
    body = LoginSchema.parse(await request.json());
  } catch {
    return jsonError("Datos de acceso inválidos.");
  }

  try {
    if (!credentialsMatch(body.username, body.password)) {
      return jsonError("Credenciales inválidas.", 401);
    }
  } catch {
    return jsonError("El servidor no tiene credenciales de admin configuradas.", 500);
  }

  let token;
  try {
    token = await signSession({
      sub: "admin",
      role: "admin",
      name: body.username.trim(),
    });
  } catch {
    return jsonError("El servidor no tiene AUTH_SECRET configurado.", 500);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
