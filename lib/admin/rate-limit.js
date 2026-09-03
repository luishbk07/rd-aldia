const buckets = new Map();

export function rateLimit(key, { limit = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  current.count += 1;
  buckets.set(key, current);

  if (current.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  return { ok: true, remaining: limit - current.count };
}
