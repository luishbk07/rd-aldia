/**
 * Call a same-site /api/cron/* route with the shared bearer secret.
 * Production uses URL / DEPLOY_PRIME_URL. Local invoke falls back to :3000.
 */
export function cronSiteUrl() {
  const raw =
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    `http://127.0.0.1:${process.env.PORT || 3000}`;
  return String(raw).replace(/\/$/, "");
}

export async function invokeSiteCron(path) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ ok: false, error: "Missing CRON_SECRET" }, { status: 500 });
  }

  try {
    const response = await fetch(`${cronSiteUrl()}${path}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "fetch failed";
    return Response.json(
      { ok: false, error: `No se pudo llamar ${path} (${cronSiteUrl()}): ${message}` },
      { status: 502 },
    );
  }
}
