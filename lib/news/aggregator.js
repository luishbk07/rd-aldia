import http from "node:http";
import https from "node:https";
import Parser from "rss-parser";
import { fetchWithFallback } from "../fetchWithFallback";
import { NEWS_SOURCES } from "./sources";

const TTL_MS = 10 * 60 * 1000;
const FETCH_MS = 12_000;
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
const PER_SOURCE = 12;
const USER_AGENT =
  "Mozilla/5.0 (compatible; RDAlDia/1.0; news aggregator; +https://rdaldia.com)";

const parser = new Parser({
  timeout: FETCH_MS,
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

function looksLikeFeed(xml) {
  return /<rss[\s>]|<feed[\s>]/i.test(xml);
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanTitle(title, sourceName) {
  let text = stripHtml(title);
  const suffixes = [
    sourceName,
    "Listín Diario",
    "Listin Diario",
    "El Caribe",
    "elCaribe",
    "elcaribe.com.do",
    "Diario Libre",
    "El Nacional",
    "Google Noticias",
    "Google News",
  ];
  for (const suffix of suffixes) {
    text = text.replace(
      new RegExp(`\\s*[-–—|]\\s*${escapeRe(suffix)}\\s*$`, "i"),
      "",
    );
  }
  return text;
}

function mediaUrl(node) {
  if (!node) return null;
  if (typeof node === "string") return node;
  return node.$?.url || node.url || node.$?.href || null;
}

function itemImage(item) {
  const enclosure = item.enclosure;
  if (enclosure?.url && (!enclosure.type || enclosure.type.startsWith("image/"))) {
    return enclosure.url;
  }

  const media = item.mediaContent;
  if (Array.isArray(media)) {
    for (const node of media) {
      const url = mediaUrl(node);
      if (url) return url;
    }
  } else {
    const url = mediaUrl(media);
    if (url) return url;
  }

  const thumb = mediaUrl(item.mediaThumbnail);
  if (thumb) return thumb;

  const html = item.contentEncoded || item.content || "";
  const match = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || null;
}

function canonLink(link) {
  try {
    const url = new URL(link);
    url.hash = "";
    if (url.hostname.includes("news.google.com")) return url.href.split("?")[0];
    url.search = "";
    return `${url.origin}${url.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return String(link || "").toLowerCase();
  }
}

function isJunkTitle(title) {
  if (title.length < 18) return true;
  return /^(portada|inicio|homepage|últimas noticias|ultimas noticias)$/i.test(
    title,
  );
}

function toIso(value) {
  if (!value) return null;
  const time = Date.parse(value);
  if (!Number.isFinite(time)) return null;
  return new Date(time).toISOString();
}

function mapItem(item, source) {
  const title = cleanTitle(item.title, source.name);
  const link = String(item.link || "").trim();
  if (!title || !link || isJunkTitle(title)) return null;

  const publishedAt = toIso(item.isoDate) || toIso(item.pubDate);

  if (publishedAt && Date.now() - Date.parse(publishedAt) > MAX_AGE_MS) {
    return null;
  }

  return {
    id: `${source.id}:${canonLink(link)}`,
    title,
    link,
    source: source.name,
    sourceId: source.id,
    publishedAt,
    image: itemImage(item),
  };
}

function fetchXml(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("http:") ? http : https;
    const req = client.get(
      url,
      {
        family: 4,
        timeout: FETCH_MS,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/rss+xml, application/xml, text/xml, */*",
        },
      },
      (res) => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          if (redirects >= 5) {
            reject(new Error("Demasiadas redirecciones."));
            return;
          }
          const next = new URL(res.headers.location, url).href;
          fetchXml(next, redirects + 1).then(resolve, reject);
          return;
        }

        if (status !== 200) {
          res.resume();
          reject(new Error(`HTTP ${status}`));
          return;
        }

        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        res.on("error", reject);
      },
    );

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Tiempo de espera agotado."));
    });
    req.on("error", reject);
  });
}

async function parseFeed(url) {
  const xml = await fetchXml(url);
  if (!looksLikeFeed(xml)) {
    throw new Error("La URL no devolvió RSS.");
  }
  return parser.parseString(xml);
}

async function fetchSource(source) {
  let lastError = "Sin respuesta.";

  for (const url of source.feedUrls) {
    try {
      const feed = await parseFeed(url);
      const articles = (feed.items || [])
        .map((item) => {
          try {
            return mapItem(item, source);
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .slice(0, PER_SOURCE);

      if (articles.length === 0) {
        lastError = "Feed vacío.";
        continue;
      }

      return {
        id: source.id,
        name: source.name,
        ok: true,
        via: url.includes("news.google.com") ? "google-news" : "rss",
        articles,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Error de red.";
    }
  }

  return {
    id: source.id,
    name: source.name,
    ok: false,
    via: null,
    error: lastError,
    articles: [],
  };
}

function mergeArticles(articles) {
  const seenLinks = new Set();
  const seenTitles = new Set();
  const unique = [];

  for (const article of articles) {
    const linkKey = canonLink(article.link);
    const titleKey = article.title.toLowerCase();
    if (seenLinks.has(linkKey) || seenTitles.has(titleKey)) continue;
    seenLinks.add(linkKey);
    seenTitles.add(titleKey);
    unique.push(article);
  }

  unique.sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });

  return unique;
}

export async function getNewsBundle() {
  return fetchWithFallback({
    cacheKey: "rd-news",
    ttlMs: TTL_MS,
    fallbackFile: "data/fallbacks/news.json",
    isValid: (data) => Array.isArray(data?.articles) && data.articles.length > 0,
    primary: async () => {
      const feeds = await Promise.all(
        NEWS_SOURCES.map((source) => fetchSource(source)),
      );
      const articles = mergeArticles(feeds.flatMap((feed) => feed.articles));

      if (articles.length === 0) {
        throw new Error("Ningún medio devolvió titulares.");
      }

      return {
        articles,
        feeds: feeds.map((feed) => ({
          id: feed.id,
          name: feed.name,
          ok: feed.ok,
          count: feed.articles.length,
          via: feed.via,
          error: feed.ok ? undefined : feed.error,
        })),
        updatedAt: new Date().toISOString(),
      };
    },
  });
}
