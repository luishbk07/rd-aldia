export const LIDOM_TEAMS = [
  {
    id: "licey",
    name: "Tigres del Licey",
    short: "Licey",
    emoji: "🐯",
    stadium: "Estadio Quisqueya Juan Marichal",
    city: "Santo Domingo",
  },
  {
    id: "aguilas",
    name: "Águilas Cibaeñas",
    short: "Águilas",
    emoji: "🦅",
    stadium: "Estadio Cibao",
    city: "Santiago",
  },
  {
    id: "escogido",
    name: "Leones del Escogido",
    short: "Escogido",
    emoji: "🦁",
    stadium: "Estadio Quisqueya Juan Marichal",
    city: "Santo Domingo",
  },
  {
    id: "estrellas",
    name: "Estrellas Orientales",
    short: "Estrellas",
    emoji: "⭐",
    stadium: "Estadio Tetelo Vargas",
    city: "San Pedro de Macorís",
  },
  {
    id: "toros",
    name: "Toros del Este",
    short: "Toros",
    emoji: "🐂",
    stadium: "Estadio Francisco Micheli",
    city: "La Romana",
  },
  {
    id: "gigantes",
    name: "Gigantes del Cibao",
    short: "Gigantes",
    emoji: "🔷",
    stadium: "Estadio Julián Javier",
    city: "San Francisco de Macorís",
  },
];

export const LIDOM_STATUSES = [
  { value: "scheduled", label: "Programado" },
  { value: "live", label: "En vivo" },
  { value: "final", label: "Final" },
  { value: "postponed", label: "Pospuesto" },
  { value: "canceled", label: "Cancelado" },
];

export function currentLidomSeason(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return month >= 9 ? `${year}-${String(year + 1).slice(2)}` : `${year - 1}-${String(year).slice(2)}`;
}

export function isLidomSeason(date = new Date()) {
  const month = date.getMonth();
  return month >= 9 || month === 0;
}

export function isMlbSeason(date = new Date()) {
  const month = date.getMonth();
  return month >= 2 && month <= 9;
}

export function santoDomingoDate(offsetDays = 0) {
  const now = new Date();
  const local = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Santo_Domingo" }),
  );
  local.setDate(local.getDate() + offsetDays);
  const year = local.getFullYear();
  const month = String(local.getMonth() + 1).padStart(2, "0");
  const day = String(local.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function whatsAppShareUrl(game) {
  const away = findTeam(game.awayTeam);
  const home = findTeam(game.homeTeam);
  const score =
    game.status === "scheduled"
      ? `${away.short} @ ${home.short}`
      : `${away.short} ${game.awayScore} @ ${home.short} ${game.homeScore}`;
  const text = `LIDOM: ${score} · RD Al Día 🇩🇴`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function findTeam(name) {
  const needle = String(name || "").toLowerCase();
  return (
    LIDOM_TEAMS.find(
      (team) =>
        team.name.toLowerCase() === needle ||
        team.short.toLowerCase() === needle ||
        team.id === needle,
    ) || {
      id: "unknown",
      name,
      short: name,
      emoji: "⚾",
      stadium: "",
      city: "",
    }
  );
}

export function computeStandings(rows) {
  const ranked = [...rows].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (a.losses !== b.losses) return a.losses - b.losses;
    return b.pct - a.pct;
  });
  const leader = ranked[0];

  return ranked.map((row) => {
    const games = row.wins + row.losses;
    const pct = games > 0 ? row.wins / games : 0;
    const gamesBack =
      leader && games > 0
        ? (leader.wins - row.wins + row.losses - leader.losses) / 2
        : 0;
    return {
      ...row,
      pct: Number(pct.toFixed(3)),
      gamesBack: Number(gamesBack.toFixed(1)),
    };
  });
}

export function defaultStandings(season) {
  return computeStandings(
    LIDOM_TEAMS.map((team) => ({
      id: `${season}-${team.id}`,
      team: team.name,
      wins: 0,
      losses: 0,
      pct: 0,
      gamesBack: 0,
      season,
      updatedAt: null,
    })),
  );
}
