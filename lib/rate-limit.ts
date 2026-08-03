import { Redis } from "@upstash/redis";
import { hashKey } from "./rate-limit-edge";

export { hashKey };

let redis: Redis | null | undefined;

export function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    redis = Redis.fromEnv();
  } else {
    redis = null;
  }
  return redis;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
}

/** Simple INCR + EXPIRE rate limiter for Node route handlers. */
export async function rateLimit(
  key: string,
  limit = 30,
  windowSeconds = 60,
): Promise<RateLimitResult> {
  const client = getRedis();
  if (!client) return { success: true, remaining: limit };
  const fullKey = `glyphy:rl:${key}`;
  try {
    const current = await client.incr(fullKey);
    if (current === 1) {
      await client.expire(fullKey, windowSeconds);
    }
    return {
      success: current <= limit,
      remaining: Math.max(0, limit - current),
    };
  } catch {
    // Fail open: never block the site because rate limiting broke.
    return { success: true, remaining: limit };
  }
}
