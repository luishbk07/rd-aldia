import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { createClient } from "@supabase/supabase-js";
import { usesSupabase } from "@/lib/admin/config";

const FILE_PATH = join(process.cwd(), ".data", "subscribers.json");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function readLocal() {
  if (!existsSync(FILE_PATH)) return [];
  try {
    const parsed = JSON.parse(readFileSync(FILE_PATH, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(rows) {
  mkdirSync(dirname(FILE_PATH), { recursive: true });
  writeFileSync(FILE_PATH, JSON.stringify(rows, null, 2), "utf8");
}

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export async function addSubscriber(rawEmail) {
  const email = normalizeEmail(rawEmail);
  const createdAt = new Date().toISOString();

  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("subscribers")
      .insert({ email })
      .select("email, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { ok: true, duplicate: true, email };
      }
      throw new Error(error.message);
    }

    return { ok: true, duplicate: false, email: data.email, createdAt: data.created_at };
  }

  const rows = readLocal();
  if (rows.some((row) => row.email === email)) {
    return { ok: true, duplicate: true, email };
  }
  rows.push({ email, created_at: createdAt });
  writeLocal(rows);
  return { ok: true, duplicate: false, email, createdAt };
}
