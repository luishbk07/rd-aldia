import { NextResponse } from "next/server";
import { isSameOrigin, jsonError, sessionCookieOptions } from "@/lib/admin/auth";
import { SESSION_COOKIE } from "@/lib/admin/config";

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return jsonError("Origen no permitido.", 403);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
