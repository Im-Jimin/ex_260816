import Anthropic from "@anthropic-ai/sdk";
import type { Item } from "./data";
import { RESPONSE_SCHEMA, PRINCIPLES, toItem, checkAccess, type RawAskResult } from "./ask-shared";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";
const ALLOWED_MEDIA_TYPES = new Set<string>(["image/jpeg", "image/png", "image/gif", "image/webp"]);

const SYSTEM_PROMPT = `당신은 분리배출 가이드 서비스의 AI 도우미입니다. 사용자가 올린 사진 속 쓰레기 품목이 무엇인지 파악해서 실제로 실행할 수 있는 배출 가이드를 만듭니다. 사진에 여러 물건이 보이면 가장 중심에 있거나 가장 큰 물건을 기준으로 답하세요. 사진만으로 재질이나 오염 여부를 확신할 수 없다면 단정하지 말고 ambiguity로 되물으세요.

${PRINCIPLES}`;

export async function askAIFromImage(base64Data: string, mediaType: string): Promise<Item | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!ALLOWED_MEDIA_TYPES.has(mediaType)) return null;

  const approxBytes = (base64Data.length * 3) / 4;
  if (!base64Data || approxBytes > MAX_IMAGE_BYTES) return null;

  if (!(await checkAccess())) return null;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2048,
      output_config: {
        format: { type: "json_schema", schema: RESPONSE_SCHEMA },
      },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType as ImageMediaType, data: base64Data },
            },
            { type: "text", text: "이 사진 속 물건을 어떻게 분리배출해야 하는지 알려주세요." },
          ],
        },
      ],
    });

    if (response.stop_reason !== "end_turn") return null;

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") return null;

    const raw = JSON.parse(textBlock.text) as RawAskResult;
    return toItem(raw);
  } catch {
    return null;
  }
}
