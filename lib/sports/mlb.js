import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { createClient } from "@supabase/supabase-js";
import { usesSupabase } from "../admin/config";
import { fetchWithFallback } from "../fetchWithFallback";
import { isMlbSeason, santoDomingoDate } from "./lidom";

const MLB_API = "https://statsapi.mlb.com/api/v1";
const TTL_MS = 8 * 60 * 1000;
const FILE_PATH = join(process.cwd(), ".data", "mlb-dominicans.json");

export const MLB_DOMINICANS = [
  { id: 665742, name: "Juan Soto" },
  { id: 660670, name: "Ronald Acuña Jr." },
  { id: 646240, name: "Rafael Devers" },
  { id: 665487, name: "Fernando Tatis Jr." },
  { id: 665489, name: "Vladimir Guerrero Jr." },
];

function seasonYear() {
  return new Date().getFullYear();
}

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

async function mlbGet(path) {
  const response = await fetch(`${MLB_API}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "RD-Al-Dia/1.0 (sports)",
    },
  });
  if (!response.ok) throw new Error(`MLB HTTP ${response.status}`);
  return response.json();
}

function mapStatus(game) {
  const abstract = game.status?.abstractGameState || "";
  const detailed = game.status?.detailedState || "";
  const lower = detailed.toLowerCase();

  if (abstract === "Live" || lower.includes("in progress") || lower.includes("delay")) {
    return { status: "live", statusLabel: lower.includes("delay") ? detailed : "En vivo" };
  }
  if (abstract === "Final" || lower.startsWith("final")) {
    return { status: "final", statusLabel: "Final" };
  }
  if (lower.includes("postponed")) {
    return { status: "postponed", statusLabel: "Pospuesto" };
  }
  if (lower.includes("cancel")) {
    return { status: "canceled", statusLabel: "Cancelado" };
  }
  return { status: "scheduled", statusLabel: "Programado" };
}

function inningLabel(game) {
  if (game.status?.abstractGameState !== "Live") return "";
  const linescore = game.linescore;
  if (!linescore?.currentInning) return "En vivo";
  const half = linescore.inningState === "Bottom" || linescore.isTopInning === false ? "Bot" : "Top";
  return `${half} ${linescore.currentInning}`;
}

function mapGame(game) {
  const { status, statusLabel } = mapStatus(game);
  const away = game.teams?.away || {};
  const home = game.teams?.home || {};
  const scheduled = status === "scheduled" || status === "postponed" || status === "canceled";

  return {
    id: String(game.gamePk),
    date: game.officialDate || game.gameDate?.slice(0, 10) || "",
    status,
    statusLabel,
    inning: inningLabel(game),
    awayTeam: away.team?.name || "Visitante",
    awayAbbr: away.team?.abbreviation || "AWAY",
    awayScore: scheduled ? null : Number(away.score ?? 0),
    homeTeam: home.team?.name || "Local",
    homeAbbr: home.team?.abbreviation || "HOME",
    homeScore: scheduled ? null : Number(home.score ?? 0),
    venue: game.venue?.name || "",
  };
}

function previousIsoDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day));
  next.setUTCDate(next.getUTCDate() - 1);
  return next.toISOString().slice(0, 10);
}

export function mlbScoresFallbackOptions(date = santoDomingoDate()) {
  const yesterday = previousIsoDate(date);
  return {
    cacheKey: `mlb-scores:${date}`,
    ttlMs: TTL_MS,
    fallbackFile: "data/fallbacks/mlb-scores.json",
    isValid: (data) =>
      Array.isArray(data?.today) || Array.isArray(data?.games) || Array.isArray(data?.yesterday),
    async primary() {
      const data = await mlbGet(
        `/schedule?sportId=1&startDate=${yesterday}&endDate=${date}&hydrate=linescore,team`,
      );
      const byDate = new Map(
        (data.dates || []).map((block) => [block.date, (block.games || []).map(mapGame)]),
      );
      const today = byDate.get(date) || [];
      const previous = byDate.get(yesterday) || [];
      return {
        date,
        yesterdayDate: yesterday,
        today,
        yesterday: previous,
        games: today.length ? today : previous,
      };
    },
  };
}

export async function getMlbScores(date = santoDomingoDate(), { forceRefresh = false } = {}) {
  return fetchWithFallback({ ...mlbScoresFallbackOptions(date), forceRefresh });
}

export function mlbStandingsFallbackOptions(season = seasonYear()) {
  return {
    cacheKey: "mlb-standings",
    ttlMs: TTL_MS,
    fallbackFile: "data/fallbacks/mlb-standings.json",
    isValid: (data) => Array.isArray(data?.divisions) && data.divisions.length > 0,
    async primary() {
      const data = await mlbGet(
        `/standings?leagueId=103,104&season=${season}&standingsTypes=regularSeason&hydrate=division,league,team`,
      );
      const divisions = (data.records || [])
        .map((record) => ({
          league: record.league?.abbreviation || "",
          leagueName: record.league?.name || "",
          name: record.division?.nameShort || record.division?.name || "División",
          sortOrder: Number(record.division?.sortOrder || 0),
          teams: (record.teamRecords || []).map((row) => ({
            id: String(row.team?.id || row.team?.name),
            team: row.team?.name || "",
            abbreviation: row.team?.abbreviation || "",
            wins: Number(row.wins || 0),
            losses: Number(row.losses || 0),
            pct: row.winningPercentage || ".000",
            gamesBack: row.gamesBack === "-" ? "—" : String(row.gamesBack ?? "—"),
            streak: row.streak?.streakCode || "",
          })),
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder);

      return { season, divisions };
    },
  };
}

export async function getMlbStandings(season = seasonYear(), { forceRefresh = false } = {}) {
  return fetchWithFallback({ ...mlbStandingsFallbackOptions(season), forceRefresh });
}

function mapPlayer(row) {
  return {
    id: row.id,
    playerName: row.player_name ?? row.playerName,
    team: row.team,
    avg: row.avg,
    homeRuns: Number(row.home_runs ?? row.homeRuns ?? 0),
    rbi: Number(row.rbi ?? 0),
    ops: row.ops,
    season: Number(row.season),
    updatedAt: row.updated_at ?? row.updatedAt,
  };
}

function persistFile(payload) {
  mkdirSync(dirname(FILE_PATH), { recursive: true });
  writeFileSync(FILE_PATH, JSON.stringify(payload, null, 2), "utf8");
}

async function persistSupabase(players) {
  const season = seasonYear();
  const updatedAt = new Date().toISOString();
  for (const player of players) {
    await supabaseAdmin().from("mlb_dominicans").upsert(
      {
        player_name: player.playerName,
        team: player.team,
        avg: player.avg,
        home_runs: player.homeRuns,
        rbi: player.rbi,
        ops: player.ops,
        season,
        updated_at: updatedAt,
      },
      { onConflict: "player_name,season" },
    );
  }
}

async function storedPlayers() {
  if (usesSupabase()) {
    const { data, error } = await supabaseAdmin()
      .from("mlb_dominicans")
      .select("*")
      .eq("season", seasonYear())
      .order("ops", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapPlayer);
  }

  if (!existsSync(FILE_PATH)) return [];
  const parsed = JSON.parse(readFileSync(FILE_PATH, "utf8"));
  return (parsed.players || []).map(mapPlayer);
}

async function fetchDominicanStars() {
  const ids = MLB_DOMINICANS.map((player) => player.id).join(",");
  const data = await mlbGet(
    `/people?personIds=${ids}&hydrate=currentTeam,stats(group=[hitting],type=[season])`,
  );
  const season = seasonYear();
  const updatedAt = new Date().toISOString();

  return (data.people || [])
    .map((person) => {
      const hitting = person.stats?.find((block) => block.group?.displayName === "hitting");
      const split = hitting?.splits?.[0] || {};
      const stat = split.stat || {};
      return {
        id: String(person.id),
        playerName: person.fullName,
        team:
          split.team?.abbreviation ||
          person.currentTeam?.abbreviation ||
          person.currentTeam?.name ||
          "MLB",
        avg: stat.avg || ".000",
        homeRuns: Number(stat.homeRuns || 0),
        rbi: Number(stat.rbi || 0),
        ops: stat.ops || ".000",
        season,
        updatedAt,
      };
    })
    .sort((a, b) => Number(b.ops) - Number(a.ops));
}

export function mlbDominicanStarsFallbackOptions() {
  return {
    cacheKey: "mlb-dominicans",
    ttlMs: TTL_MS,
    fallbackFile: "data/fallbacks/mlb-dominicans.json",
    isValid: (data) => Array.isArray(data?.players) && data.players.length > 0,
    async store() {
      const players = await storedPlayers();
      if (!players.length) return null;
      return { players, updatedAt: players[0]?.updatedAt || null };
    },
    async primary() {
      const players = await fetchDominicanStars();
      try {
        persistFile({ players, updatedAt: new Date().toISOString() });
      } catch {
        /* Vercel / read-only FS */
      }
      if (usesSupabase()) {
        persistSupabase(players).catch(() => {});
      }
      return { players };
    },
  };
}

export async function getMlbDominicanStars({ forceRefresh = false } = {}) {
  return fetchWithFallback({ ...mlbDominicanStarsFallbackOptions(), forceRefresh });
}

export const getMlbDominicans = getMlbDominicanStars;

function emptyMlbError(message) {
  return {
    source: "error",
    cached: false,
    error: message,
  };
}

export async function getMlbBundle({ forceRefresh = false } = {}) {
  const [standings, scores, stars] = await Promise.all([
    getMlbStandings(seasonYear(), { forceRefresh }).catch((error) => ({
      season: seasonYear(),
      divisions: [],
      ...emptyMlbError(error instanceof Error ? error.message : "Standings no disponibles"),
    })),
    getMlbScores(santoDomingoDate(), { forceRefresh }).catch((error) => ({
      date: santoDomingoDate(),
      today: [],
      yesterday: [],
      games: [],
      ...emptyMlbError(error instanceof Error ? error.message : "Marcador no disponible"),
    })),
    getMlbDominicanStars({ forceRefresh }).catch((error) => ({
      players: [],
      ...emptyMlbError(error instanceof Error ? error.message : "Estrellas no disponibles"),
    })),
  ]);

  return {
    inSeason: isMlbSeason(),
    source: [standings, scores, stars].some((item) => item.source === "cached")
      ? "cached"
      : "live",
    updatedAt: standings.updatedAt || scores.updatedAt || stars.updatedAt,
    standings,
    scores,
    stars,
    players: stars.players || [],
  };
}
