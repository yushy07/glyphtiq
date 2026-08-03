import { NextResponse } from "next/server";
import { adminStats, topTrending } from "@/lib/database/stats";

export const dynamic = "force-dynamic";

const FALLBACK_TRENDING = [
  "bold",
  "script",
  "zalgo",
  "circled",
  "strike",
  "kawaiiHearts",
  "glitch",
  "fraktur",
];

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Optional admin-protected breakdown.
  if (url.searchParams.get("admin") === "1") {
    const expected = process.env.ADMIN_STATS_TOKEN;
    const token = request.headers.get("authorization");
    if (!expected || token !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const stats = await adminStats();
    if (!stats) {
      return NextResponse.json(
        { error: "Statistics unavailable" },
        { status: 503 },
      );
    }
    return NextResponse.json(stats);
  }

  const app = url.searchParams.get("app")?.trim() ?? undefined;
  const trending = await topTrending(7, 12, app);
  if (trending.length === 0) {
    return NextResponse.json(
      FALLBACK_TRENDING.map((styleId, i) => ({ styleId, count: FALLBACK_TRENDING.length - i })),
    );
  }
  return NextResponse.json(trending);
}
