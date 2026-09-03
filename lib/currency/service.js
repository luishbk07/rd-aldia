import { getMemoryQuote, setMemoryQuote } from "./cache";
import { fetchLiveQuote } from "./providers";
import { fetchWithFallback } from "../fetchWithFallback";
import {
  getLatestQuote,
  getPreviousQuote,
  getQuoteHistory,
  saveQuote,
  variation,
} from "./store";

const CURRENCY_TTL_MS = 60 * 60 * 1000;

export function currencyLiveFallbackOptions({ persist = true } = {}) {
  return {
    cacheKey: "currency-live",
    ttlMs: CURRENCY_TTL_MS,
    fallbackFile: "data/fallbacks/currency.json",
    isValid: (data) => Number(data?.quote?.usdRate) > 0,
    async store() {
      const memory = getMemoryQuote();
      if (memory) return { quote: memory, updatedAt: memory.createdAt };
      const quote = await getLatestQuote();
      if (!quote) return null;
      return { quote, updatedAt: quote.createdAt };
    },
    async primary() {
      const quote = await fetchLiveQuote();
      setMemoryQuote(quote);
      if (persist) {
        try {
          await saveQuote(quote);
        } catch {
          /* live quote still usable */
        }
      }
      return { quote, updatedAt: quote.createdAt };
    },
  };
}

export async function getLiveQuote(options = {}) {
  return fetchWithFallback(currencyLiveFallbackOptions(options));
}

export async function getStoredBundle() {
  const quote = await getLatestQuote();
  const history = await getQuoteHistory(30);
  const previous = quote ? await getPreviousQuote(quote.date) : null;
  return { quote, history, previous };
}

export async function getCombinedQuote() {
  const live = await getLiveQuote({ persist: true });
  let history = [];
  let previous = null;
  try {
    history = await getQuoteHistory(30);
    previous = await getPreviousQuote(live.quote.date);
  } catch {
    /* chart is optional when storage is down */
  }

  return {
    ok: true,
    source: live.source,
    fallback: live.fallback,
    cached: live.cached,
    updatedAt: live.updatedAt || live.quote?.createdAt,
    quote: live.quote,
    history,
    change: {
      usd: variation(live.quote, previous, "usdRate"),
      euro: variation(live.quote, previous, "euroRate"),
      gold: variation(live.quote, previous, "goldRd"),
    },
  };
}
