export const SITE_NAME = "RD Al Día";

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://rdaldia.com";
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export const ROUTES = {
  home: "/",
  news: "/noticias",
  fuel: "/combustible-hoy",
  dollar: "/dolar-rd",
  sports: "/lidom-resultados",
  tourism: "/turismo",
  culture: "/cultura",
  verse: "/palabra-del-dia",
  finance: "/consejo-financiero",
  search: "/buscar",
} as const;

export const NAV_LINKS = [
  { href: ROUTES.home, label: "Inicio" },
  { href: ROUTES.news, label: "Noticias" },
  { href: ROUTES.fuel, label: "Combustible" },
  { href: ROUTES.dollar, label: "Dólar" },
  { href: ROUTES.sports, label: "Deportes" },
  { href: ROUTES.tourism, label: "Turismo" },
  { href: ROUTES.culture, label: "Cultura" },
  { href: ROUTES.verse, label: "Palabra del Día" },
  { href: ROUTES.finance, label: "Consejo" },
] as const;

export const SOCIAL_LINKS = [
  { href: "#", label: "Facebook", network: "facebook" },
  { href: "#", label: "Instagram", network: "instagram" },
  { href: "#", label: "X", network: "x" },
  { href: "#", label: "TikTok", network: "tiktok" },
] as const;
