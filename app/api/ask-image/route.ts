import { NextRequest, NextResponse } from "next/server";
import { askAIFromImage } from "@/lib/ask-image";
import { uploadAskPhoto } from "@/lib/photo-storage";
import { logPhotoAsk } from "@/lib/analytics";
import { getServerSessionId } from "@/lib/server-session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const base64Data = typeof body?.data === "string" ? body.data : "";
  const mediaType = typeof body?.mediaType === "string" ? body.mediaType : "";

  if (!base64Data || !mediaType) {
    return NextResponse.json({ item: null }, { status: 400 });
  }

  const [item, sessionId] = await Promise.all([
    askAIFromImage(base64Data, mediaType),
    getServerSessionId(),
  ]);

  const storagePath = await uploadAskPhoto(sessionId, base64Data, mediaType);
  await logPhotoAsk(sessionId, item !== null, item?.id ?? null, item?.name ?? null, item?.categoryId, storagePath);

  return NextResponse.json({ item });
}
