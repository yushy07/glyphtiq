import { NextResponse, type NextRequest } from "next/server";
import { edgeRateLimit, hashKey } from "@/lib/rate-limit-edge";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const forwarded =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "";
    const ip = forwarded.split(",")[0]?.trim() || "unknown";
    const hashed = await hashKey(`ip:${ip}`);
    const result = await edgeRateLimit(`mid:${pathname}:${hashed}`, 60, 60);
    if (!result.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down and try again." },
        {
          status: 429,
          headers: { "Retry-After": "60" },
        },
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
