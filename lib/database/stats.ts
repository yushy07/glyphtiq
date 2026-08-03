import { desc, sql } from "drizzle-orm";
import { db } from "./index";
import { events } from "./schema";

const DAY_MS = 24 * 60 * 60 * 1000;

export function dayString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function recordEvent(input: {
  type: string;
  styleId?: string;
  count?: number;
  appSlug?: string | null;
}): Promise<boolean> {
  if (!db) return false;
  try {
    const day = dayString(new Date());
    const count = Math.min(Math.max(input.count ?? 1, 1), 100);
    const styleId = input.styleId ?? "";
    const appSlug = input.appSlug ?? "";
    await db
      .insert(events)
      .values({ type: input.type, styleId, appSlug, day, count })
      .onConflictDoUpdate({
        target: [events.type, events.styleId, events.appSlug, events.day],
        set: { count: sql`${events.count} + ${count}` },
      });
    return true;
  } catch {
    return false;
  }
}

/** Top styles by copy events over the last N days, optionally scoped to an app. */
export async function topTrending(
  days = 7,
  limit = 12,
  appSlug?: string,
): Promise<Array<{ styleId: string; count: number }>> {
  if (!db) return [];
  try {
    const cutoff = dayString(new Date(Date.now() - days * DAY_MS));
    const app = appSlug ? sql`AND ${events.appSlug} = ${appSlug}` : sql``;
    const rows = await db
      .select({
        styleId: events.styleId,
        count: sql<number>`sum(${events.count})`,
      })
      .from(events)
      .where(
        sql`${events.type} = 'copy' AND ${events.day} >= ${cutoff} AND ${events.styleId} <> '' ${app}`,
      )
      .groupBy(events.styleId)
      .orderBy(desc(sql`sum(${events.count})`))
      .limit(limit);
    return rows.map((r) => ({ styleId: r.styleId, count: Number(r.count) }));
  } catch {
    return [];
  }
}

/** Detailed stats used by the optional admin endpoint. */
export async function adminStats() {
  if (!db) return null;
  try {
    const byType = await db
      .select({
        type: events.type,
        total: sql<number>`sum(${events.count})`,
      })
      .from(events)
      .groupBy(events.type)
      .orderBy(desc(sql`sum(${events.count})`));
    const byStyle = await db
      .select({
        styleId: events.styleId,
        total: sql<number>`sum(${events.count})`,
      })
      .from(events)
      .where(sql`${events.styleId} <> ''`)
      .groupBy(events.styleId)
      .orderBy(desc(sql`sum(${events.count})`))
      .limit(25);
    const total = byType.reduce((acc, r) => acc + Number(r.total), 0);
    return { byType, byStyle, total };
  } catch {
    return null;
  }
}
