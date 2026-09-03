import { timingSafeEqual } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminCredentials, SESSION_COOKIE, SESSION_MAX_AGE } from "./config";

function secretKey() {
  return new TextEncoder().encode(getAdminCredentials().secret);
}

export function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));

  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }

  return timingSafeEqual(a, b);
}

export function credentialsMatch(username, password) {
  const admin = getAdminCredentials();
  const userOk = safeEqual(username.trim().toLowerCase(), admin.username.toLowerCase());
  const passOk = safeEqual(password, admin.password);
  return userOk && passOk;
}

export async function signSession(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });

    if (payload.role !== "admin" || payload.sub !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    return {
      ok: false,
      session: null,
      response: NextResponse.json({ error: "No autorizado." }, { status: 401 }),
    };
  }

  return { ok: true, session, response: null };
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
