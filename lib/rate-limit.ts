const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 60;
const SWEEP_INTERVAL = 500;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
let requestsSinceSweep = 0;

function sweepExpired() {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}

export function checkRateLimit(key: string): { allowed: boolean; resetAt: number } {
  requestsSinceSweep += 1;
  if (requestsSinceSweep >= SWEEP_INTERVAL) {
    sweepExpired();
    requestsSinceSweep = 0;
  }

  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    const resetAt = now + WINDOW_MS;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, resetAt };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { allowed: false, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { allowed: true, resetAt: bucket.resetAt };
}
