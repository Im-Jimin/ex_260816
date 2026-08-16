import { getSupabase } from "./supabase";

const BUCKET = "photo-asks";

function extFromMediaType(mediaType: string): string {
  switch (mediaType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}

export async function uploadAskPhoto(
  sessionId: string,
  base64Data: string,
  mediaType: string
): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const path = `${sessionId}/${Date.now()}.${extFromMediaType(mediaType)}`;
    const buffer = Buffer.from(base64Data, "base64");
    const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType: mediaType,
      upsert: false,
    });
    if (error) return null;
    return path;
  } catch {
    return null;
  }
}
