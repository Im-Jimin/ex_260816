import { NextRequest, NextResponse } from "next/server";
import { askAIFromImage } from "@/lib/ask-image";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const base64Data = typeof body?.data === "string" ? body.data : "";
  const mediaType = typeof body?.mediaType === "string" ? body.mediaType : "";

  if (!base64Data || !mediaType) {
    return NextResponse.json({ item: null }, { status: 400 });
  }

  const item = await askAIFromImage(base64Data, mediaType);
  return NextResponse.json({ item });
}
