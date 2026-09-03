import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { basename, dirname, join } from "path";

const memory = new Map();

function cachePath(cacheKey) {
  const safe = String(cacheKey).replace(/[^a-zA-Z0-9._-]+/g, "_");
  return join(process.cwd(), ".data", "cache", `${safe}.json`);
}

export function readFallbackFile(relativePath) {
  const full = join(process.cwd(), "data", "fallbacks", basename(relativePath));
  if (!existsSync(full)) return null;
  return JSON.parse(readFileSync(full, "utf8"));
}

function readLastGood(cacheKey) {
  const file = cachePath(cacheKey);
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function writeLastGood(cacheKey, payload) {
  try {
    const file = cachePath(cacheKey);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(payload), "utf8");
  } catch {
    /* read-only FS */
  }
}

function forcedFailure(cacheKey) {
  const force = process.env.RD_FORCE_FALLBACK || "";
  if (!force) return false;
  if (force === "1" || force === "*") return true;
  return force.split(",").map((item) => item.trim()).includes(cacheKey);
}

function withLive(data) {
  return {
    ...data,
    source: "live",
    cached: false,
    fallback: false,
  };
}

function withCached(data, reason) {
  return {
    ...data,
    source: "cached",
    cached: true,
    fallback: true,
    fallbackReason: reason,
  };
}

/**
 * Try a live fetch, then memory, last-good disk cache, optional store (Supabase/.data),
 * then a committed JSON snapshot under data/fallbacks/.
 *
 * @param {object} options
 * @param {string} options.cacheKey
 * @param {() => Promise<object>} options.primary
 * @param {() => Promise<object|null}=} options.store
 * @param {string=} options.fallbackFile path relative to process.cwd()
 * @param {number=} options.ttlMs fresh live memory window
 * @param {(data: object) => boolean=} options.isValid
 */
export async function fetchWithFallback({
  cacheKey,
  primary,
  store,
  fallbackFile,
  ttlMs = 8 * 60 * 1000,
  isValid = (data) => Boolean(data) && typeof data === "object",
}) {
  const now = Date.now();
  const hit = memory.get(cacheKey);
  const forced = forcedFailure(cacheKey);

  if (!forced && hit?.kind === "live" && now - hit.at < ttlMs && isValid(hit.payload)) {
    return withLive(hit.payload);
  }

  if (!forced) {
    try {
      const data = await primary();
      if (!isValid(data)) throw new Error("Respuesta vacía.");
      const payload = {
        ...data,
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
      memory.set(cacheKey, { at: now, kind: "live", payload });
      writeLastGood(cacheKey, payload);
      return withLive(payload);
    } catch {
      /* continue to fallbacks */
    }
  }

  if (hit?.payload && isValid(hit.payload)) {
    return withCached(hit.payload, "memory");
  }

  const lastGood = readLastGood(cacheKey);
  if (isValid(lastGood)) {
    return withCached(lastGood, "disk");
  }

  if (typeof store === "function") {
    try {
      const stored = await store();
      if (isValid(stored)) {
        return withCached(stored, "store");
      }
    } catch {
      /* next */
    }
  }

  if (fallbackFile) {
    const file = readFallbackFile(fallbackFile);
    if (isValid(file)) {
      return withCached(file, "json");
    }
  }

  throw new Error("No hay datos en vivo ni de respaldo.");
}
