export const SITE_NAME = "RD Al Día";

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/noticias", label: "Noticias" },
  { href: "/combustible", label: "Combustible" },
  { href: "/dolar", label: "Dólar" },
  { href: "/deportes", label: "Deportes" },
  { href: "/turismo", label: "Turismo" },
  { href: "/cultura", label: "Cultura" },
  { href: "/palabra-del-dia", label: "Palabra del Día" },
  { href: "/consejo-financiero", label: "Consejo" },
] as const;

export const SOCIAL_LINKS = [
  { href: "#", label: "Facebook", network: "facebook" },
  { href: "#", label: "Instagram", network: "instagram" },
  { href: "#", label: "X", network: "x" },
  { href: "#", label: "TikTok", network: "tiktok" },
] as const;
