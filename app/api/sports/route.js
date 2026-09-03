import { jsonError } from "@/lib/admin/auth";
import { getSportsBundle } from "@/lib/sports/service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSportsBundle();
    return Response.json({ ok: true, ...data });
  } catch {
    return jsonError("No se pudo armar la sección de deportes.", 500);
  }
}
