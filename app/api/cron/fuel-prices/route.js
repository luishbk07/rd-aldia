import { NextResponse } from "next/server";
import { jsonError } from "@/lib/admin/auth";
import { getLatestFuelPrices, upsertFuelPrices } from "@/lib/admin/store";
import { cronAuthorized } from "@/lib/cron-auth";
import { scrapeMicmFuelNotice } from "@/lib/fuel/scrape-micm";

export async function GET(request) {
  if (!cronAuthorized(request)) {
    return jsonError("No autorizado.", 401);
  }

  try {
    const notice = await scrapeMicmFuelNotice();
    if (!notice.ok || !notice.prices) {
      const fuel = await getLatestFuelPrices();
      return NextResponse.json({
        ok: true,
        skipped: true,
        source: "admin",
        reason: notice.reason,
        noticeUrl: notice.noticeUrl,
        fuel,
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
