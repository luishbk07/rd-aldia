import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { createClient } from "@supabase/supabase-js";
import { addDays } from "../fuel/dates";
import { emptyFuel, normalizeFuel } from "../fuel/normalize";
import { usesSupabase } from "./config";

const FILE_PATH = join(process.cwd(), ".data", "admin-store.json");

function today() {
  return new Date().toISOString().slice(0, 10);
}

function nowIso() {
  return new Date().toISOString();
}

function emptyStore() {
  return {
    fuel: emptyFuel(),
    rates: {
      date: today(),
      usdBuy: 0,
      usdSell: 0,
      euroBuy: 0,
      euroSell: 0,
      goldPrice: 0,
      updatedAt: null,
    },
    sports: [],
    articles: [],
    comments: [
      {
        id: "cmt_seed_1",
        articleId: null,
        authorName: "Carmen R.",
        body: "¿Van a publicar los precios del GLP los lunes?",
        approved: false,
        featured: false,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
      {
        id: "cmt_seed_2",
        articleId: null,
        authorName: "José M.",
        body: "Buen resumen de LIDOM. Más Tigres, por favor.",
        approved: true,
        featured: false,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    ],
  };
}

function readFileStore() {
  if (!existsSync(FILE_PATH)) return emptyStore();
  return { ...emptyStore(), ...JSON.parse(readFileSync(FILE_PATH, "utf8")) };
}

function writeFileStore(data) {
  mkdirSync(dirname(FILE_PATH), { recursive: true });
  writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf8");
}

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

function mapFuel(row) {
  return normalizeFuel({
    effectiveFrom: row.effective_from || row.date,
    effectiveTo: row.effective_to,
    gasolinePremium: row.gasoline_premium,
    gasolineRegular: row.gasoline_regular,
    gasoilRegular: row.gasoil_regular ?? row.diesel,
    gasoilOptimo: row.gasoil_optimo,
    glp: row.glp ?? row.propane,
    source: row.source,
    sourceUrl: row.source_url,
    updatedAt: row.updated_at,
  });
}

function mapRates(row) {
  return {
    date: row.date,
    usdBuy: Number(row.usd_buy),
    usdSell: Number(row.usd_sell),
    euroBuy: Number(row.euro_buy),
    euroSell: Number(row.euro_sell),
    goldPrice: Number(row.gold_price),
    updatedAt: row.updated_at,
  };
}

function mapSports(row) {
  return {
    id: row.id,
    league: row.league,
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    homeScore: Number(row.home_score),
    awayScore: Number(row.away_score),
    date: row.played_at,
    status: row.status,
    updatedAt: row.updated_at,
  };
}

function mapArticle(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    excerpt: row.excerpt,
    content: row.content,
    featured: row.featured,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

function mapComment(row) {
  return {
    id: row.id,
    articleId: row.article_id,
    authorName: row.author_name,
    body: row.body,
    approved: row.approved,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getSupabaseData() {
  const db = supabaseAdmin();
  const [fuel, rates, sports, articles, comments] = await Promise.all([
    db.from("fuel_prices").select("*").order("updated_at", { ascending: false }).limit(1),
    db.from("exchange_rates").select("*").order("date", { ascending: false }).limit(1),
    db.from("sports_results").select("*").order("played_at", { ascending: false }).limit(40),
    db.from("articles").select("*").order("updated_at", { ascending: false }).limit(40),
    db.from("comments").select("*").order("created_at", { ascending: false }).limit(60),
  ]);

  const firstError = [fuel, rates, sports, articles, comments].find((result) => result.error);
  if (firstError?.error) {
    throw new Error(firstError.error.message);
  }

  return {
    fuel: fuel.data?.[0] ? mapFuel(fuel.data[0]) : emptyFuel(),
    rates: rates.data?.[0] ? mapRates(rates.data[0]) : emptyStore().rates,
    sports: (sports.data ?? []).map(mapSports),
    articles: (articles.data ?? []).map(mapArticle),
    comments: (comments.data ?? []).map(mapComment),
    persistence: "supabase",
  };
}

export async function getAdminData() {
  if (usesSupabase()) {
    return getSupabaseData();
  }

  const store = readFileStore();
  return {
    ...store,
    fuel: normalizeFuel(store.fuel),
    persistence: "local-file",
  };
}

export async function getLatestFuelPrices() {
  const data = await getAdminData();
  return normalizeFuel(data.fuel);
}

export async function upsertFuelPrices(input) {
  const updatedAt = nowIso();
  const next = normalizeFuel({
    ...input,
    updatedAt,
  });

  if (!next.effectiveFrom) {
    next.effectiveFrom = today();
  }
  if (!next.effectiveTo) {
    next.effectiveTo = addDays(next.effectiveFrom, 6);
  }

  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("fuel_prices")
      .upsert(
        {
          effective_from: next.effectiveFrom,
          effective_to: next.effectiveTo,
          gasoline_premium: next.gasolinePremium,
          gasoline_regular: next.gasolineRegular,
          gasoil_regular: next.gasoilRegular,
          gasoil_optimo: next.gasoilOptimo,
          glp: next.glp,
          source: next.source,
          source_url: next.sourceUrl,
          updated_at: updatedAt,
        },
        { onConflict: "effective_from" },
      )
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapFuel(data);
  }

  const store = readFileStore();
  store.fuel = next;
  writeFileStore(store);
  return next;
}

export async function upsertExchangeRates(input) {
  const updatedAt = nowIso();
  const next = { ...input, date: input.date || today(), updatedAt };

  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("exchange_rates")
      .upsert(
        {
          date: next.date,
          usd_buy: next.usdBuy,
          usd_sell: next.usdSell,
          euro_buy: next.euroBuy,
          euro_sell: next.euroSell,
          gold_price: next.goldPrice,
          updated_at: updatedAt,
        },
        { onConflict: "date" },
      )
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapRates(data);
  }

  const store = readFileStore();
  store.rates = next;
  writeFileStore(store);
  return next;
}

export async function upsertSportsResult(input) {
  const updatedAt = nowIso();
  const id = input.id || `lidom_${Date.now()}`;
  const next = { ...input, id, updatedAt };

  if (usesSupabase()) {
    const row = {
      league: next.league,
      home_team: next.homeTeam,
      away_team: next.awayTeam,
      home_score: next.homeScore,
      away_score: next.awayScore,
      played_at: next.date,
      status: next.status,
      updated_at: updatedAt,
    };

    const query = input.id
      ? supabaseAdmin().from("sports_results").update(row).eq("id", input.id)
      : supabaseAdmin().from("sports_results").insert(row);

    const { data, error } = await query.select("*").single();
    if (error) throw new Error(error.message);
    return mapSports(data);
  }

  const store = readFileStore();
  const index = store.sports.findIndex((item) => item.id === id);
  if (index >= 0) store.sports[index] = next;
  else store.sports.unshift(next);
  writeFileStore(store);
  return next;
}

export async function createArticle(input) {
  const updatedAt = nowIso();
  const next = {
    ...input,
    id: `art_${Date.now()}`,
    publishedAt: updatedAt,
    updatedAt,
  };

  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("articles")
      .insert({
        title: next.title,
        slug: next.slug,
        category: next.category,
        excerpt: next.excerpt,
        content: next.content,
        featured: next.featured,
        published_at: updatedAt,
        updated_at: updatedAt,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapArticle(data);
  }

  const store = readFileStore();
  store.articles.unshift(next);
  writeFileStore(store);
  return next;
}

export async function updateComment(id, patch) {
  const updatedAt = nowIso();

  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("comments")
      .update({
        approved: patch.approved,
        featured: patch.featured,
        updated_at: updatedAt,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapComment(data);
  }

  const store = readFileStore();
  const index = store.comments.findIndex((item) => item.id === id);
  if (index < 0) throw new Error("Comentario no encontrado.");
  store.comments[index] = { ...store.comments[index], ...patch, updatedAt };
  writeFileStore(store);
  return store.comments[index];
}
