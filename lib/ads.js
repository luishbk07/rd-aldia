/**
 * Ad slot catalog for RD Al Día.
 * Replace slotId values with AdSense ad unit IDs when the account is live.
 * Set NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
 */
export const AD_SIZES = {
  leaderboard: {
    key: "leaderboard",
    label: "Leaderboard",
    width: 728,
    height: 90,
    adsenseFormat: "horizontal",
  },
  rectangle: {
    key: "rectangle",
    label: "Rectangle",
    width: 300,
    height: 250,
    adsenseFormat: "rectangle",
  },
  "mobile-banner": {
    key: "mobile-banner",
    label: "Mobile Banner",
    width: 320,
    height: 50,
    adsenseFormat: "horizontal",
  },
};

export const AD_SLOTS = {
  "header-leaderboard": {
    size: "leaderboard",
    slotId: "0000000001",
    note: "Below header, desktop",
  },
  "header-mobile": {
    size: "mobile-banner",
    slotId: "0000000002",
    note: "Below header, mobile",
  },
  "home-after-datos": {
    size: "mobile-banner",
    slotId: "0000000003",
    note: "Homepage, between Datos del día and Para el día",
  },
  "home-after-destacados": {
    size: "mobile-banner",
    slotId: "0000000004",
    note: "Homepage, between destacados and noticias",
  },
  "article-sidebar": {
    size: "rectangle",
    slotId: "0000000005",
    note: "Article sidebar, desktop",
  },
  "article-inline": {
    size: "rectangle",
    slotId: "0000000006",
    note: "After 2nd paragraph, mobile",
  },
  "noticias-sidebar": {
    size: "rectangle",
    slotId: "0000000007",
    note: "Noticias sidebar, desktop",
  },
  "section-between": {
    size: "mobile-banner",
    slotId: "0000000008",
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
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
}

export function adsEnabled() {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED === "0") return false;
  return Boolean(getAdsenseClient());
}

let scriptStarted = false;

export function loadAdsenseScript(client) {
  if (typeof document === "undefined" || !client || scriptStarted) return;
  if (document.querySelector("script[data-rd-adsense]")) {
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
