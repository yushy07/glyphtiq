import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db, isDbReady } from "@/lib/database";
import { getRedis } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  let database: string;
  if (!isDbReady() || !db) {
    database = "not-configured";
  } else {
    try {
      await db.execute(sql`select 1`);
      database = "ok";
    } catch {
      database = "unreachable";
    }
  }

  const redis = getRedis() !== null ? "ok" : "not-configured";

  return NextResponse.json({
    ok: true,
    status: "ok",
    timestamp: new Date().toISOString(),
    database,
    redis,
  });
}
