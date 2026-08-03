import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/** Lazily create the database connection; returns null when not configured. */
export function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const sql = neon(url);
    return drizzle(sql, { schema });
  } catch {
    return null;
  }
}

export const db = createDb();

export function isDbReady(): boolean {
  return db !== null;
}

export { schema };
