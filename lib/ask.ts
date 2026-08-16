import Anthropic from "@anthropic-ai/sdk";
import type { Item } from "./data";
import { RESPONSE_SCHEMA, PRINCIPLES, toItem, checkAccess, type RawAskResult } from "./ask-shared";
import { getCached, setCached } from "./ask-cache";

const MAX_QUERY_LENGTH = 100;

const SYSTEM_PROMPT = `당신은 분리배출 가이드 서비스의 AI 도우미입니다. 사용자가 입력한 쓰레기 품목에 대해 실제로 실행할 수 있는 배출 가이드를 만듭니다.

${PRINCIPLES}`;

export async function askAI(query: string): Promise<Item | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const trimmed = query.trim();
  if (!trimmed || trimmed.length > MAX_QUERY_LENGTH) return null;

  const cached = getCached(trimmed);
  if (cached) return cached;

  if (!(await checkAccess())) return null;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2048,
      output_config: {
        format: { type: "json_schema", schema: RESPONSE_SCHEMA },
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: trimmed }],
    });

    if (response.stop_reason !== "end_turn") return null;

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") return null;

    const raw = JSON.parse(textBlock.text) as RawAskResult;
    const item = toItem(raw);
    if (item) setCached(trimmed, item);
    return item;
  } catch {
    return null;
  }
}
