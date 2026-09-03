import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { createClient } from "@supabase/supabase-js";
import { usesSupabase } from "../admin/config";
import { fetchWithFallback } from "../fetchWithFallback";
import {
  computeStandings,
  currentLidomSeason,
  defaultStandings,
} from "./lidom";

const FILE_PATH = join(process.cwd(), ".data", "lidom.json");

function nowIso() {
  return new Date().toISOString();
}

function emptyFile() {
  const season = currentLidomSeason();
  return {
    results: [],
    standings: defaultStandings(season),
    spotlight: null,
  };
}

function readFile() {
  if (!existsSync(FILE_PATH)) return emptyFile();
  return { ...emptyFile(), ...JSON.parse(readFileSync(FILE_PATH, "utf8")) };
}

function writeFile(data) {
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

export function mapResult(row) {
  if (!row) return null;
  return {
    id: row.id,
    date: row.date,
    homeTeam: row.home_team ?? row.homeTeam,
    awayTeam: row.away_team ?? row.awayTeam,
    homeScore: Number(row.home_score ?? row.homeScore ?? 0),
    awayScore: Number(row.away_score ?? row.awayScore ?? 0),
    stadium: row.stadium || "",
    status: row.status,
    featured: Boolean(row.featured),
    createdAt: row.created_at ?? row.createdAt,
  };
}

function mapStanding(row) {
  return {
    id: row.id,
    team: row.team,
    wins: Number(row.wins),
    losses: Number(row.losses),
    pct: Number(row.pct),
    gamesBack: Number(row.games_back ?? row.gamesBack ?? 0),
    season: row.season,
    updatedAt: row.updated_at ?? row.updatedAt,
  };
}

export async function listLidomResults() {
  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("lidom_results")
      .select("*")
      .order("date", { ascending: false })
      .limit(80);
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapResult);
  }

  return [...readFile().results].sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export async function createLidomResult(input) {
  const createdAt = nowIso();
  const row = {
    date: input.date,
    home_team: input.homeTeam,
    away_team: input.awayTeam,
    home_score: input.homeScore,
    away_score: input.awayScore,
    stadium: input.stadium || "",
    status: input.status,
    featured: Boolean(input.featured),
    created_at: createdAt,
  };

  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("lidom_results")
      .insert(row)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    if (data.featured) {
      await supabaseAdmin()
        .from("lidom_results")
        .update({ featured: false })
        .neq("id", data.id);
    }
    return mapResult(data);
  }

  const store = readFile();
  const next = mapResult({ ...row, id: `lidom_${Date.now()}` });
  store.results = store.results.map((item) => ({
    ...item,
    featured: next.featured ? false : item.featured,
  }));
  store.results.unshift(next);
  writeFile(store);
  return next;
}

export async function updateLidomResult(id, input) {
  const row = {
    date: input.date,
    home_team: input.homeTeam,
    away_team: input.awayTeam,
    home_score: input.homeScore,
    away_score: input.awayScore,
    stadium: input.stadium || "",
    status: input.status,
    featured: Boolean(input.featured),
  };

  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("lidom_results")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    if (data.featured) {
      await supabaseAdmin()
        .from("lidom_results")
        .update({ featured: false })
        .neq("id", data.id);
    }
    return mapResult(data);
  }

  const store = readFile();
  const index = store.results.findIndex((item) => item.id === id);
  if (index < 0) throw new Error("Partido no encontrado.");
  store.results[index] = mapResult({
    ...store.results[index],
    ...row,
    id,
  });
  if (store.results[index].featured) {
    store.results = store.results.map((item) => ({
      ...item,
      featured: item.id === id,
    }));
  }
  writeFile(store);
  return store.results.find((item) => item.id === id);
}

export async function deleteLidomResult(id) {
  if (usesSupabase()) {
    const { error } = await supabaseAdmin().from("lidom_results").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  }

  const store = readFile();
  store.results = store.results.filter((item) => item.id !== id);
  writeFile(store);
  return { ok: true };
}

export async function listLidomStandings(season = currentLidomSeason()) {
  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("lidom_standings")
      .select("*")
      .eq("season", season)
      .order("wins", { ascending: false });
    if (error) throw new Error(error.message);
    const rows = (data ?? []).map(mapStanding);
    return rows.length ? computeStandings(rows) : defaultStandings(season);
  }

  const store = readFile();
  const rows = (store.standings || []).filter((row) => row.season === season);
  return rows.length ? computeStandings(rows) : defaultStandings(season);
}

export async function upsertLidomStandings(input) {
  const season = input.season || currentLidomSeason();
  const ranked = computeStandings(
    (input.teams || []).map((team) => ({
      ...team,
      season,
      wins: Number(team.wins),
      losses: Number(team.losses),
    })),
  );
  const updatedAt = nowIso();

  if (usesSupabase()) {
    const rows = ranked.map((team) => ({
      team: team.team,
      wins: team.wins,
      losses: team.losses,
      pct: team.pct,
      games_back: team.gamesBack,
      season,
      updated_at: updatedAt,
    }));

    const saved = [];
    for (const row of rows) {
      const { data, error } = await supabaseAdmin()
        .from("lidom_standings")
        .upsert(row, { onConflict: "season,team" })
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      saved.push(mapStanding(data));
    }
    return computeStandings(saved);
  }

  const store = readFile();
  store.standings = ranked.map((team) => ({
    ...team,
    id: team.id || `${season}-${team.team}`,
    updatedAt,
  }));
  writeFile(store);
  return store.standings;
}

export async function getSpotlight() {
  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("lidom_spotlight")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      playerName: data.player_name,
      team: data.team,
      note: data.note,
      weekOf: data.week_of,
      updatedAt: data.updated_at,
    };
  }

  return readFile().spotlight;
}

export async function saveSpotlight(input) {
  const updatedAt = nowIso();
  const next = {
    playerName: input.playerName,
    team: input.team,
    note: input.note,
    weekOf: input.weekOf,
    updatedAt,
  };

  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("lidom_spotlight")
      .insert({
        player_name: next.playerName,
        team: next.team,
        note: next.note,
        week_of: next.weekOf,
        updated_at: updatedAt,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return {
      playerName: data.player_name,
      team: data.team,
      note: data.note,
      weekOf: data.week_of,
      updatedAt: data.updated_at,
    };
  }

  const store = readFile();
  store.spotlight = next;
  writeFile(store);
  return next;
}

export function lidomStateFallbackOptions() {
  return {
    cacheKey: "lidom-state",
    ttlMs: 15 * 1000,
    fallbackFile: "data/fallbacks/lidom.json",
    isValid: (data) => Array.isArray(data?.results) && Array.isArray(data?.standings),
    async primary() {
      const [results, standings, spotlight] = await Promise.all([
        listLidomResults(),
        listLidomStandings(),
        getSpotlight(),
      ]);
      return { results, standings, spotlight };
    },
  };
}

export async function getLidomState() {
  return fetchWithFallback(lidomStateFallbackOptions());
}
