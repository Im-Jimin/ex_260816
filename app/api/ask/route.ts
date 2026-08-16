import { NextRequest, NextResponse } from "next/server";
import { askAI } from "@/lib/ask";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const query = typeof body?.query === "string" ? body.query : "";

  if (!query.trim()) {
    return NextResponse.json({ item: null }, { status: 400 });
  }

  const item = await askAI(query);
  return NextResponse.json({ item });
}
