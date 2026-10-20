interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up stale memory records periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    memoryStore.forEach((record, key) => {
      if (now > record.resetAt) {
        memoryStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  intervalMs: number; // e.g. 60_000 (1 minute)
  maxRequests: number; // e.g. 5 requests
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { intervalMs: 60000, maxRequests: 20 }
): { success: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const existing = memoryStore.get(identifier);

  if (!existing || now > existing.resetAt) {
    memoryStore.set(identifier, {
      count: 1,
      resetAt: now + options.intervalMs,
    });
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetInSec: Math.ceil(options.intervalMs / 1000),
    };
  }

  if (existing.count >= options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetInSec: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: options.maxRequests - existing.count,
    resetInSec: Math.ceil((existing.resetAt - now) / 1000),
  };
}
