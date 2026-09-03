import { NextResponse } from "next/server";
import { jsonError } from "@/lib/admin/auth";
import { getLatestFuelPrices, upsertFuelPrices } from "@/lib/admin/store";
import { scrapeMicmFuelNotice } from "@/lib/fuel/scrape-micm";

function authorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(request) {
  if (!authorized(request)) {
    return jsonError("No autorizado.", 401);
  }

  try {
    const notice = await scrapeMicmFuelNotice();
    if (!notice.ok || !notice.prices) {
      return NextResponse.json({
        ok: false,
        skipped: true,
        reason: notice.reason,
        noticeUrl: notice.noticeUrl,
      });
    }

    const current = await getLatestFuelPrices();
    if (
      current.effectiveFrom === notice.effectiveFrom &&
      current.updatedAt &&
      current.source === "scrape"
    ) {
      return NextResponse.json({ ok: true, skipped: true, reason: "Ya estaba guardado." });
    }

    const fuel = await upsertFuelPrices({
      effectiveFrom: notice.effectiveFrom,
      effectiveTo: notice.effectiveTo,
      ...notice.prices,
      source: "scrape",
      sourceUrl: notice.noticeUrl,
    });

    return NextResponse.json({ ok: true, fuel });
  } catch {
    return jsonError("El cron de combustibles falló.", 500);
  }
}
