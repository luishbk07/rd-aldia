import { isLidomSeason, santoDomingoDate } from "./lidom";
import { getMlbBundle } from "./mlb";
import { getLidomState } from "./lidom-store";

export function partitionGames(results) {
  const yesterday = santoDomingoDate(-1);
  const today = santoDomingoDate(0);
  const tomorrow = santoDomingoDate(1);

  const byDate = (date) => results.filter((game) => String(game.date).slice(0, 10) === date);

  const featured = results.find((game) => game.featured && game.status !== "canceled");
  const live = results.find((game) => game.status === "live");
  const todays = byDate(today);
  const yesterdays = byDate(yesterday).filter((game) => game.status === "final");

  return {
    yesterday: yesterdays,
    today: todays,
    tomorrow: byDate(tomorrow),
    recent: results.filter((game) => game.status === "final").slice(0, 8),
    gameOfTheDay: featured || live || todays[0] || yesterdays[0] || null,
  };
}

export async function getSportsBundle() {
  const [lidomState, mlb] = await Promise.all([getLidomState(), getMlbBundle()]);

  return {
    lidom: {
      inSeason: isLidomSeason(),
      source: lidomState.source,
      updatedAt: lidomState.updatedAt,
      ...partitionGames(lidomState.results || []),
      standings: lidomState.standings || [],
      spotlight: lidomState.spotlight || null,
    },
    mlb,
    source: mlb.source === "cached" || lidomState.source === "cached" ? "cached" : "live",
    updatedAt: mlb.updatedAt || lidomState.updatedAt,
  };
}
