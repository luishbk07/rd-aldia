const TTL_MS = 60 * 60 * 1000;

let memory = {
  at: 0,
  quote: null,
};

export function getMemoryQuote() {
  if (memory.quote && Date.now() - memory.at < TTL_MS) {
    return memory.quote;
  }
  return null;
}

export function setMemoryQuote(quote) {
  memory = { at: Date.now(), quote };
}

export function isFresh(createdAt, ttlMs = TTL_MS) {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < ttlMs;
}
