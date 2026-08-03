import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { shares } from "./schema";

/** URL-safe-ish alphabet without confusing characters. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
const ALPHABET_LENGTH = ALPHABET.length;
const MAX_UNBIASED_BYTE = Math.floor(256 / ALPHABET_LENGTH) * ALPHABET_LENGTH;

export function generateShareId(length = 8): string {
  let id = "";
  while (id.length < length) {
    const bytes = randomBytes(length - id.length);
    for (let i = 0; i < bytes.length && id.length < length; i++) {
      const byte = bytes[i];
      if (byte >= MAX_UNBIASED_BYTE) continue;
      id += ALPHABET[byte % ALPHABET_LENGTH];
    }
  }
  return id;
}

export interface ShareRecord {
  id: string;
  text: string;
  styleId: string;
  appSlug: string;
  createdAt: Date;
  expiresAt: Date | null;
}

export async function createShare(input: {
  text: string;
  styleId: string;
  appSlug?: string | null;
  expiresInDays?: number;
}): Promise<ShareRecord | null> {
  if (!db) return null;
  const id = generateShareId();
  const expiresAt = input.expiresInDays
    ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
    : null;
  const appSlug = input.appSlug ?? "";
  try {
    await db.insert(shares).values({
      id,
      text: input.text,
      styleId: input.styleId,
      appSlug,
      expiresAt,
    });
    return { id, text: input.text, styleId: input.styleId, appSlug, createdAt: new Date(), expiresAt };
  } catch {
    return null;
  }
}

export async function getShare(id: string): Promise<ShareRecord | null> {
  if (!db) return null;
  try {
    const rows = await db.select().from(shares).where(eq(shares.id, id)).limit(1);
    const row = rows[0];
    if (!row) return null;
    if (row.expiresAt && row.expiresAt.getTime() <= Date.now()) {
      await db.delete(shares).where(eq(shares.id, id)).catch(() => {});
      return null;
    }
    return row;
  } catch {
    return null;
  }
}

export async function deleteShare(id: string): Promise<number> {
  if (!db) return 0;
  try {
    const result = await db.delete(shares).where(eq(shares.id, id));
    return result.rowCount ?? 0;
  } catch {
    return 0;
  }
}
