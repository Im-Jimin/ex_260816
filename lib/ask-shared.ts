import { headers } from "next/headers";
import { categories, type Item } from "./data";
import { checkRateLimit } from "./rate-limit";

export const CATEGORY_IDS = categories.map((c) => c.id);

export const PRINCIPLES = `환경부·자원순환보증금관리센터 등 대한민국 공식 분리배출 지침에 부합하는 내용으로 답하세요. 지자체마다 세부 규정이 다를 수 있다는 점을 감안해 일반적으로 통용되는 기준을 따르세요.

반드시 지켜야 할 3가지 원칙:
1. 행동 언어 — 규정을 나열하지 말고 동사 명령형으로 지시하세요. ("비우세요", "헹구세요", "떼어내세요")
2. 정직한 AI — 재질이나 배출 방법이 확실하지 않으면 단정하지 말고 ambiguity 필드로 되물으세요.
3. 순환 경제 연결 — carbonSavingG에 이 품목을 올바르게 배출했을 때 절감되는 탄소량(그램 단위 추정치)을 담으세요.

categoryId는 반드시 다음 중 하나여야 합니다: ${CATEGORY_IDS.join(", ")}

ambiguity를 채울 경우, options 각각의 resultItemId는 반드시 "self"로 고정하세요 (다른 품목을 새로 만들지 마세요 — 사용자가 어떤 선택지를 고르든 같은 가이드의 체크리스트가 열립니다).

steps는 최소 2개 이상, 각 단계는 명령형 문장(action)과 필요하면 부가 설명(detail, 없으면 빈 문자열)으로 구성하세요.`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    categoryId: { type: "string", enum: CATEGORY_IDS },
    aliases: { type: "array", items: { type: "string" } },
    parts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          material: { type: "string" },
          disposal: { type: "string" },
        },
        required: ["name", "material", "disposal"],
        additionalProperties: false,
      },
    },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          action: { type: "string" },
          detail: { type: "string" },
        },
        required: ["action", "detail"],
        additionalProperties: false,
      },
    },
    ambiguity: {
      anyOf: [
        { type: "null" },
        {
          type: "object",
          properties: {
            question: { type: "string" },
            options: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: { type: "string" },
                  resultItemId: { type: "string", const: "self" },
                },
                required: ["label", "resultItemId"],
                additionalProperties: false,
              },
            },
          },
          required: ["question", "options"],
          additionalProperties: false,
        },
      ],
    },
    carbonSavingG: { type: "number" },
  },
  required: ["name", "categoryId", "aliases", "parts", "steps", "ambiguity", "carbonSavingG"],
  additionalProperties: false,
} as const;

export type RawAskResult = {
  name: string;
  categoryId: string;
  aliases: string[];
  parts: { name: string; material: string; disposal: string }[];
  steps: { action: string; detail: string }[];
  ambiguity: { question: string; options: { label: string; resultItemId: string }[] } | null;
  carbonSavingG: number;
};

export function toItem(raw: RawAskResult): Item | null {
  const name = raw.name?.trim();
  if (!name) return null;

  const steps = raw.steps.filter((s) => s.action?.trim());
  if (steps.length === 0) return null;

  const categoryId = CATEGORY_IDS.includes(raw.categoryId) ? raw.categoryId : CATEGORY_IDS[0];
  const id = "ai-generated";

  return {
    id,
    name,
    categoryId,
    aliases: Array.isArray(raw.aliases) ? raw.aliases.filter(Boolean) : [],
    parts: Array.isArray(raw.parts)
      ? raw.parts.filter((p) => p.name?.trim() && p.material?.trim() && p.disposal?.trim())
      : [],
    steps: steps.map((s) => ({ action: s.action.trim(), detail: s.detail?.trim() ?? "" })),
    ambiguity: raw.ambiguity
      ? {
          question: raw.ambiguity.question,
          options: raw.ambiguity.options.map((o) => ({ label: o.label, resultItemId: id })),
        }
      : undefined,
    carbonSavingG: typeof raw.carbonSavingG === "number" ? raw.carbonSavingG : 0,
    point: 10,
  };
}

export async function checkAccess(): Promise<boolean> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  const clientId = forwardedFor?.split(",")[0]?.trim() || "local";
  const { allowed } = checkRateLimit(clientId);
  return allowed;
}
