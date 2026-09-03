import { jsonError } from "@/lib/admin/auth";
import { getNewsBundle } from "@/lib/news/aggregator";

export const dynamic = "force-dynamic";

function clampLimit(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 40;
  return Math.min(80, Math.max(1, Math.round(n)));
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = clampLimit(searchParams.get("limit"));
    const data = await getNewsBundle();

    return Response.json({
      ok: true,
      ...data,
      articles: data.articles.slice(0, limit),
    });
  } catch {
    return jsonError("No se pudieron cargar las noticias.", 500);
  }
}
