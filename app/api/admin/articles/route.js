import { NextResponse } from "next/server";
import { z } from "zod";
import { isSameOrigin, jsonError, requireAdmin } from "@/lib/admin/auth";
import { createArticle } from "@/lib/admin/store";

const ArticleSchema = z.object({
  title: z.string().trim().min(4).max(140),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(96),
  category: z.enum([
    "noticias",
    "nacionales",
    "cultura",
    "turismo",
    "deportes",
    "opinion",
  ]),
  excerpt: z.string().trim().min(20).max(280),
  content: z.string().trim().min(20).max(20000),
  featured: z.boolean().optional().default(false),
});

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return jsonError("Origen no permitido.", 403);
  }

  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body;
  try {
    body = ArticleSchema.parse(await request.json());
  } catch {
    return jsonError("Artículo inválido. Revisa título, slug, extracto y contenido.");
  }

  try {
    const article = await createArticle(body);
    return NextResponse.json({ ok: true, article });
  } catch {
    return jsonError("No se pudo crear el artículo.", 500);
  }
}
