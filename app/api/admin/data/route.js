import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/admin/auth";
import { getAdminData } from "@/lib/admin/store";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const data = await getAdminData();
    return NextResponse.json({
      ...data,
      admin: { name: auth.session.name },
    });
  } catch {
    return jsonError("No se pudieron cargar los datos.", 500);
  }
}
