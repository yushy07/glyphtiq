import { NextResponse } from "next/server";
import { deleteShare, getShare } from "@/lib/database/shares";
import { shareGetParams } from "@/lib/validation";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const parsed = shareGetParams.safeParse({ id });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid share id" }, { status: 400 });
  }
  const share = await getShare(id);
  if (!share) {
    return NextResponse.json(
      { error: "Share not found or expired" },
      { status: 410 },
    );
  }
  return NextResponse.json({
    id: share.id,
    text: share.text,
    styleId: share.styleId,
    createdAt: share.createdAt.toISOString(),
  });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const parsed = shareGetParams.safeParse({ id });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid share id" }, { status: 400 });
  }
  const deleted = await deleteShare(id);
  if (deleted === 0) {
    return NextResponse.json({ error: "Share not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
