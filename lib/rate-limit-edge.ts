/**
 * Edge-safe rate limiting using Upstash's HTTP REST API directly.
 * No Node-only dependencies — safe for Next.js middleware.
 */

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisCommand(args: Array<string | number>): Promise<number> {
  const res = await fetch(REST_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error("upstash request failed");
  const data = (await res.json()) as { result?: number } | number;
  if (typeof data === "object" && data !== null) return Number(data.result);
  return Number(data);
}

/** Hashes an IP so raw addresses are never stored or logged. */
export async function hashKey(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

export async function edgeRateLimit(
  key: string,
  limit = 60,
  windowSeconds = 60,
): Promise<{ success: boolean; remaining: number }> {
  if (!REST_URL || !REST_TOKEN) return { success: true, remaining: limit };
  try {
    const fullKey = `glyphy:rl:${key}`;
    const current = await redisCommand(["INCR", fullKey]);
    if (current === 1) {
      await redisCommand(["EXPIRE", fullKey, windowSeconds]).catch(() => {});
    }
    return { success: current <= limit, remaining: Math.max(0, limit - current) };
  } catch {
    // Fail open: never block the site because rate limiting broke.
    return { success: true, remaining: limit };
  }
}
