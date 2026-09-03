import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/admin/auth";
import { getAdminData } from "@/lib/admin/store";
import { getLatestQuote } from "@/lib/currency/store";
import { listLidomResults } from "@/lib/sports/lidom-store";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const [data, results, quote] = await Promise.all([
      getAdminData(),
      listLidomResults().catch(() => []),
      getLatestQuote().catch(() => null),
    ]);

    return NextResponse.json({
      ...data,
      quote,
      lidom: {
        count: results.length,
        results: results.slice(0, 8),
      },
      admin: { name: auth.session.name },
    });
  } catch {
    return jsonError("No se pudieron cargar los datos.", 500);
  }
}
