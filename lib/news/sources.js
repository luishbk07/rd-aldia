/**
 * Verified 2026-09-02:
 * - Listín Diario `https://listindiario.com/rss/` → 404 / no feed
 * - El Caribe `https://www.elcaribe.com.do/rss/` → HTML, not RSS
 * - Diario Libre `https://www.diariolibre.com/rss/` → HTML; `/feed` is RSS
 * - El Nacional `https://elnacional.com.do/rss/` → RSS válido
 */
export const NEWS_SOURCES = [
  {
    id: "listin",
    name: "Listín Diario",
    shortName: "Listín",
    initials: "LD",
    homeUrl: "https://listindiario.com/",
    accent: "#003366",
    feedUrls: [googleNewsFeed("site:listindiario.com when:7d")],
  },
  {
    id: "el-caribe",
    name: "El Caribe",
    shortName: "El Caribe",
    initials: "EC",
    homeUrl: "https://www.elcaribe.com.do/",
    accent: "#0e7490",
    feedUrls: [googleNewsFeed("site:elcaribe.com.do when:7d")],
  },
  {
    id: "diario-libre",
    name: "Diario Libre",
    shortName: "Diario Libre",
    initials: "DL",
    homeUrl: "https://www.diariolibre.com/",
    accent: "#c2410c",
    feedUrls: [
      "https://www.diariolibre.com/feed/portada.xml",
      "https://www.diariolibre.com/feed",
    ],
  },
  {
    id: "el-nacional",
    name: "El Nacional",
    shortName: "El Nacional",
    initials: "EN",
    homeUrl: "https://elnacional.com.do/",
    accent: "#c8102e",
    feedUrls: ["https://elnacional.com.do/rss/"],
  },
];

export const NEWS_TABS = [
  { id: "all", label: "Todas" },
  ...NEWS_SOURCES.map((source) => ({
    id: source.id,
    label: source.shortName,
  })),
];

function googleNewsFeed(query) {
  const params = new URLSearchParams({
    q: query,
    hl: "es-419",
    gl: "DO",
    ceid: "DO:es",
  });
  return `https://news.google.com/rss/search?${params.toString()}`;
}
