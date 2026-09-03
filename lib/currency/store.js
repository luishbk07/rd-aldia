import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { createClient } from "@supabase/supabase-js";
import { usesSupabase } from "../admin/config";

const FILE_PATH = join(process.cwd(), ".data", "currency-quotes.json");

function nowIso() {
  return new Date().toISOString();
}

function emptyFile() {
  return { latest: null, history: [] };
}

function readFileQuotes() {
  if (!existsSync(FILE_PATH)) return emptyFile();
  return { ...emptyFile(), ...JSON.parse(readFileSync(FILE_PATH, "utf8")) };
}

function writeFileQuotes(data) {
  mkdirSync(dirname(FILE_PATH), { recursive: true });
  writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf8");
}

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export function mapQuote(row) {
  if (!row) return null;
  return {
    id: row.id,
    usdRate: Number(row.usd_rate ?? row.usdRate),
    euroRate: Number(row.euro_rate ?? row.euroRate),
    goldUsd: Number(row.gold_usd ?? row.goldUsd),
    goldRd: Number(row.gold_rd ?? row.goldRd),
    date: row.date,
    source: row.source,
    createdAt: row.created_at ?? row.createdAt,
    official: row.source === "bcrd" || row.source === "manual",
  };
}

export async function getLatestQuote() {
  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("currency_quotes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return mapQuote(data);
  }

  return mapQuote(readFileQuotes().latest);
}

export async function getQuoteHistory(days = 30) {
  if (usesSupabase()) {
    const from = new Date();
    from.setDate(from.getDate() - days);
    const { data, error } = await supabaseAdmin()
      .from("currency_quotes")
      .select("*")
      .gte("date", from.toISOString().slice(0, 10))
      .order("date", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const byDate = new Map();
    for (const row of data ?? []) {
      byDate.set(row.date, mapQuote(row));
    }
    return [...byDate.values()];
  }

  const from = new Date();
  from.setDate(from.getDate() - days);
  const fromKey = from.toISOString().slice(0, 10);
  return (readFileQuotes().history || [])
    .filter((row) => row.date >= fromKey)
    .map(mapQuote);
}

export async function getPreviousQuote(date) {
  const history = await getQuoteHistory(40);
  const earlier = history.filter((row) => row.date < date);
  return earlier.at(-1) || null;
}

export async function saveQuote(quote) {
  const createdAt = quote.createdAt || nowIso();
  const row = {
    usd_rate: quote.usdRate,
    euro_rate: quote.euroRate,
    gold_usd: quote.goldUsd,
    gold_rd: quote.goldRd,
    date: quote.date,
    source: quote.source,
    created_at: createdAt,
  };

  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("currency_quotes")
      .insert(row)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapQuote(data);
  }

  const store = readFileQuotes();
  const mapped = mapQuote({ ...row, id: `cq_${Date.now()}` });
  store.latest = mapped;
  store.history = [
    ...(store.history || []).filter((item) => item.date !== mapped.date),
    mapped,
  ]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-60);
  writeFileQuotes(store);
  return mapped;
}

export function variation(current, previous, key) {
  if (!current || !previous || !(previous[key] > 0)) {
    return { amount: null, percent: null, direction: "flat" };
  }

  const amount = Number((current[key] - previous[key]).toFixed(4));
  const percent = Number(((amount / previous[key]) * 100).toFixed(2));
  const direction = amount > 0 ? "up" : amount < 0 ? "down" : "flat";
  return { amount, percent, direction };
}
