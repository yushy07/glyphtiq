import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/database/stats";
import { eventSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid event" },
      { status: 400 },
    );
  }

  const { type, styleId, count, appSlug } = parsed.data;
  // Best-effort; silently drop when the database is not configured.
  await recordEvent({ type, styleId: styleId ?? "", count, appSlug });
  return new NextResponse(null, { status: 204 });
}
