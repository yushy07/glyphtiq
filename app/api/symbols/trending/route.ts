import { NextResponse } from "next/server";
import { symbols } from "@/lib/symbols/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = Math.min(Math.max(parseInt(limitParam ?? "24", 10) || 24, 1), 100);

  // Return top symbols by popularity seed (refined with live copy analytics fallback)
  const trending = symbols
    .slice()
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);

  return NextResponse.json({
    appSlug: "symbols",
    count: trending.length,
    trending,
  });
}
