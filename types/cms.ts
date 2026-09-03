export type ArticleCategory =
  | "noticias"
  | "nacionales"
  | "cultura"
  | "turismo"
  | "deportes"
  | "opinion";

export type SportsLeague = "LIDOM" | "MLB";

export type SportsStatus =
  | "scheduled"
  | "live"
  | "final"
  | "postponed"
  | "canceled";

export type BibleTranslation =
  | "RVR1960"
  | "NVI"
  | "DHH"
  | "NTV"
  | "TLA"
  | "other";

export type Article = {
  _type: "article";
  _id?: string;
  title: string;
  slug: string;
  category: ArticleCategory;
  featuredImage: {
    url?: string;
    alt: string;
    caption?: string;
  };
  excerpt: string;
  content: unknown[];
  author: { _ref: string } | { name: string; slug: string };
  publishedAt: string;
};

export type FuelPrice = {
  _type: "fuelPrice";
  _id?: string;
  effectiveFrom: string;
  effectiveTo: string;
  gasolinePremium: number;
  gasolineRegular: number;
  gasoilRegular: number;
  gasoilOptimo: number;
  glp: number;
  source: "manual" | "scrape";
  sourceUrl?: string | null;
  updatedAt?: string | null;
};

export type ExchangeRate = {
  _type: "exchangeRate";
  _id?: string;
  date: string;
  usdBuy: number;
  usdSell: number;
  euroBuy: number;
  euroSell: number;
  goldPrice: number;
};

export type SportsResult = {
  _type: "sportsResult";
  _id?: string;
  league: SportsLeague;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  status: SportsStatus;
};

export type DailyVerse = {
  _type: "dailyVerse";
  _id?: string;
  bibleVerse: string;
  translation: BibleTranslation;
  explanation: string;
  date: string;
};
