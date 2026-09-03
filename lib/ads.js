/**
 * Ad slot catalog for RD Al Día.
 * Publisher ID is public (it appears in the page source).
 * Replace catalog slotId values with AdSense ad unit IDs after approval.
 */

export const ADSENSE_CLIENT = "ca-pub-7362041124232949";

export const AD_SIZES = {
  leaderboard: {
    key: "leaderboard",
    label: "Leaderboard",
    width: 728,
    height: 90,
    adsenseFormat: "auto",
  },
  rectangle: {
    key: "rectangle",
    label: "Rectangle",
    width: 300,
    height: 250,
    adsenseFormat: "auto",
  },
  "mobile-banner": {
    key: "mobile-banner",
    label: "Mobile Banner",
    width: 320,
    height: 50,
    adsenseFormat: "auto",
  },
  "in-article": {
    key: "in-article",
    label: "In-article",
    width: 300,
    height: 250,
    adsenseFormat: "fluid",
    layout: "in-article",
  },
};

export const AD_SLOTS = {
  "header-leaderboard": {
    size: "leaderboard",
    slotId: "",
    note: "Below header, desktop 728×90",
  },
  "header-mobile": {
    size: "mobile-banner",
    slotId: "",
    note: "Below header, mobile 320×50",
  },
  "home-after-datos": {
    size: "mobile-banner",
    slotId: "",
    note: "Homepage, between Datos del día and Para el día",
  },
  "home-after-destacados": {
    size: "mobile-banner",
    slotId: "",
    note: "Homepage, between destacados and noticias",
  },
  "article-sidebar": {
    size: "rectangle",
    slotId: "",
    note: "Article sidebar, desktop 300×250",
  },
  "article-inline": {
    size: "in-article",
    slotId: "",
    note: "After 2nd paragraph on Cultura/Turismo",
  },
  "noticias-sidebar": {
    size: "rectangle",
    slotId: "",
    note: "Noticias sidebar, desktop",
  },
  "section-between": {
    size: "mobile-banner",
    slotId: "",
    note: "Between intro and body on section pages",
  },
};

export function getAdSize(size) {
  return AD_SIZES[size] || AD_SIZES.rectangle;
}

export function getAdSlot(position) {
  return AD_SLOTS[position] || null;
}

export function getAdsenseClient() {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ADSENSE_CLIENT;
}

export function adsEnabled() {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED === "0") return false;
  return Boolean(getAdsenseClient());
}

export function isConfiguredAdSlot(slotId) {
  const value = String(slotId || "").trim();
  if (!value) return false;
  return !/^0+$/.test(value);
}

let scriptStarted = false;

export function loadAdsenseScript(client) {
  if (typeof document === "undefined" || !client || scriptStarted) return;
  if (
    document.querySelector("script[data-rd-adsense]") ||
    document.querySelector("script[src*='pagead2.googlesyndication.com/pagead/js/adsbygoogle.js']")
  ) {
    scriptStarted = true;
    return;
  }
  scriptStarted = true;
  const script = document.createElement("script");
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
  script.async = true;
  script.crossOrigin = "anonymous";
  script.dataset.rdAdsense = "1";
  document.head.appendChild(script);
}
