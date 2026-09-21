type Bucket = { count: number; resetAt: number };

const windows = new Map<string, Bucket>();
const MAX_KEYS = 2_000;

function prune(now: number) {
  for (const [key, bucket] of windows) {
    if (bucket.resetAt <= now) windows.delete(key);
  }
  if (windows.size <= MAX_KEYS) return;
  const extras = [...windows.keys()].slice(0, windows.size - MAX_KEYS);
  for (const key of extras) windows.delete(key);
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  prune(now);
  const current = windows.get(key);

  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { ok: false, remaining: 0, retryAt: current.resetAt };
  }

  current.count += 1;
  return { ok: true, remaining: limit - current.count };
}
