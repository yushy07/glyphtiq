import { NextResponse } from "next/server";
import { createShare } from "@/lib/database/shares";
import { hashKey, rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";
import { getStyleById } from "@/lib/text-engine/styles";
import { shareCreateSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
  const hashed = await hashKey(`share:${ip}`);
  const limited = await rateLimit(`share:${hashed}`, 10, 60);
  if (!limited.success) {
    return NextResponse.json(
      { error: "You're sharing too fast. Take a breath." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = shareCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid share" },
      { status: 400 },
    );
  }

  const { text, styleId, appSlug, expiresInDays } = parsed.data;
  const clean = sanitizeText(text);
  if (!clean) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }
  if (styleId && !getStyleById(styleId)) {
    return NextResponse.json({ error: "Unknown style" }, { status: 400 });
  }

  const share = await createShare({
    text: clean,
    styleId: styleId ?? "none",
    appSlug,
    expiresInDays,
  });
  if (!share) {
    return NextResponse.json(
      { error: "Sharing is temporarily unavailable" },
      { status: 503 },
    );
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  return NextResponse.json(
    { id: share.id, url: `${base}/s/${share.id}` },
    { status: 201 },
  );
}
