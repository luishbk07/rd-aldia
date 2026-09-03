import { createClient } from "@supabase/supabase-js";
import { usesSupabase } from "./admin/config";

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export async function saveCronSnapshot(key, payload) {
  if (!usesSupabase()) return payload;

  const { error } = await supabaseAdmin()
    .from("cron_snapshots")
    .upsert(
      {
        key,
        payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );

  if (error) throw new Error(error.message);
  return payload;
}

export async function getCronSnapshot(key) {
  if (!usesSupabase()) return null;

  const { data, error } = await supabaseAdmin()
    .from("cron_snapshots")
    .select("payload")
    .eq("key", key)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data?.payload ?? null;
}
