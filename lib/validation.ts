import { z } from "zod";

export const eventSchema = z.object({
  type: z.string().min(1).max(50),
  styleId: z.string().min(1).max(64).optional(),
  count: z.number().int().min(1).max(100).optional(),
  appSlug: z.string().min(1).max(64).optional(),
});

export const shareCreateSchema = z.object({
  text: z.string().min(1).max(2000),
  styleId: z.string().min(1).max(64).optional(),
  appSlug: z.string().min(1).max(64).nullable().optional(),
  expiresInDays: z.number().int().min(1).max(30).optional(),
});

export const shareGetParams = z.object({
  id: z
    .string()
    .min(1)
    .max(16)
    .regex(/^[A-Za-z0-9]+$/, "Invalid share id"),
});

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
