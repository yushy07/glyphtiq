import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const shares = pgTable(
  "shares",
  {
    id: varchar("id", { length: 16 }).primaryKey(),
    text: text("text").notNull(),
    styleId: varchar("style_id", { length: 64 }).notNull().default("none"),
    appSlug: varchar("app_slug", { length: 40 }).notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (t) => [
    index("shares_created_at_idx").on(t.createdAt),
    index("shares_expires_at_idx").on(t.expiresAt),
  ],
);

export const events = pgTable(
  "events",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    type: varchar("type", { length: 32 }).notNull(),
    styleId: varchar("style_id", { length: 64 }).notNull().default(""),
    appSlug: varchar("app_slug", { length: 40 }).notNull().default(""),
    day: varchar("day", { length: 10 }).notNull(),
    count: integer("count").notNull().default(1),
  },
  (t) => [
    uniqueIndex("events_type_style_day_idx").on(t.type, t.styleId, t.appSlug, t.day),
    index("events_app_slug_idx").on(t.appSlug),
  ],
);
