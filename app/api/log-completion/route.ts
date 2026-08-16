import { NextRequest, NextResponse } from "next/server";
import { logCompletion } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
  const itemId = typeof body?.itemId === "string" ? body.itemId : "";
  const itemName = typeof body?.itemName === "string" ? body.itemName : "";

  if (!sessionId || !itemId || !itemName) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const categoryId = typeof body?.categoryId === "string" ? body.categoryId : undefined;
  const region = typeof body?.region === "string" ? body.region : null;
  const points = Number(body?.points) || 0;
  const carbonSavingG = Number(body?.carbonSavingG) || 0;

  await logCompletion(sessionId, itemId, itemName, categoryId, region, points, carbonSavingG);

  return NextResponse.json({ ok: true });
}
